#!/usr/bin/env node
/* 生成 README 与文档使用的截图（1x，稳定示例数据）。
   用法：node tools/screenshot.mjs
   需要本机 Chrome/Chromium；可用 CHROME_BIN 指定路径。 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'docs/screenshots');
const CHROME = process.env.CHROME_BIN || [
  '/home/hans/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
].find((p) => existsSync(p));

if (!CHROME) {
  console.error('找不到 Chrome/Chromium，请设置 CHROME_BIN 环境变量。');
  process.exit(2);
}

const VIEWPORTS = [
  { w: 1280, h: 800 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9600 + Math.floor(Math.random() * 300);

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=/tmp/ds-shot-${PORT}`, 'about:blank',
], { stdio: 'ignore' });

let wsUrl;
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
  } catch {}
  await sleep(200);
}
if (!wsUrl) { console.error('无法连接 Chrome'); process.exit(2); }

const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r));

let msgId = 0;
const pending = new Map();
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
  }
});
const send = (method, params = {}) => new Promise((res, rej) => {
  const id = ++msgId;
  pending.set(id, { res, rej });
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'evaluate failed');
  return r.result.value;
};

mkdirSync(OUT, { recursive: true });

const capture = async (file, fullPage) => {
  const metrics = await send('Page.getLayoutMetrics');
  const height = Math.ceil(metrics.cssContentSize.height);
  const r = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: fullPage,
    ...(fullPage ? { clip: { x: 0, y: 0, width: metrics.cssLayoutViewport.clientWidth, height, scale: 1 } } : {}),
  });
  writeFileSync(path.join(OUT, file), Buffer.from(r.data, 'base64'));
  console.log('✓', path.relative(ROOT, path.join(OUT, file)));
};

await send('Page.enable');
await send('Runtime.enable');

for (const vp of VIEWPORTS) {
  const size = `${vp.w}x${vp.h}`;

  // --workbench 只生成新增截图，避免覆盖消费端已有的参考截图。
  await send('Emulation.setDeviceMetricsOverride', { width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file://' + path.join(ROOT, 'examples/workbench.html') });
  await sleep(900);
  await evaluate('document.fonts.ready.then(() => true)');
  await send('Page.bringToFront');
  await capture(`workbench-${size}.png`, false);
  await evaluate(`document.querySelector('[data-detail]').focus(); document.querySelector('[data-detail]').click()`);
  await sleep(350);
  await capture(`workbench-focus-expanded-${size}.png`, false);
  await evaluate(`document.querySelector('#summary-open').click()`);
  await sleep(350);
  await capture(`workbench-overlay-${size}.png`, false);
  if (process.argv.includes('--workbench')) continue;

  // 工作台：默认视图
  await send('Emulation.setDeviceMetricsOverride', { width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file://' + path.join(ROOT, 'index.html') });
  await sleep(900);
  await evaluate('document.fonts.ready.then(() => true)');
  await send('Page.bringToFront');
  await sleep(300);
  await capture(`workspace-${size}.png`, false);

  // 工作台：抽屉展开
  await evaluate(`document.querySelector('#btn-create').click()`);
  await sleep(900);
  await capture(`workspace-drawer-${size}.png`, false);

  // 组件页：整页
  await send('Page.navigate', { url: 'file://' + path.join(ROOT, 'examples/components.html') });
  await sleep(900);
  await evaluate('document.fonts.ready.then(() => true)');
  await send('Page.bringToFront');
  await sleep(300);
  await capture(`components-${size}.png`, true);
}

ws.close();
chrome.kill();
console.log('\n截图输出目录：docs/screenshots');
