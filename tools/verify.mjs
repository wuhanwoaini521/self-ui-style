#!/usr/bin/env node
/* 设计系统自检：布局、对比度、组件样式、键盘与交互。
   用法：node tools/verify.mjs [--headful]
   需要本机 Chrome/Chromium；可用 CHROME_BIN 指定路径。 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
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

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9500 + Math.floor(Math.random() * 300);

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=/tmp/ds-verify-${PORT}`, 'about:blank',
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
let consoleErrors = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
    return;
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
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

const goto = async (file, w, h) => {
  consoleErrors = [];
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file://' + path.join(ROOT, file) });
  await sleep(700);
  await evaluate('document.fonts.ready.then(() => true)');
  await send('Page.bringToFront');
};

const pressTab = async (shift = false) => {
  for (const type of ['keyDown', 'keyUp']) {
    await send('Input.dispatchKeyEvent', {
      type, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9,
      modifiers: shift ? 8 : 0,
    });
  }
  await sleep(120);
};

await send('Page.enable');
await send('Runtime.enable');

/* ---------- 1. 布局与溢出 ---------- */
for (const vp of VIEWPORTS) {
  for (const page of ['index.html', 'examples/components.html']) {
    await goto(page, vp.w, vp.h);
    const m = await evaluate(`(() => {
      const de = document.documentElement;
      const btn = document.querySelector('#btn-create, .g-head .ds-btn');
      const r = btn.getBoundingClientRect();
      return {
        overflowX: de.scrollWidth - de.clientWidth,
        btnVisible: r.width > 0 && r.right <= innerWidth + 1,
        theme: document.body.classList.contains('ds-theme'),
        rootToken: getComputedStyle(de).getPropertyValue('--c-bg').trim(),
        contentBottom: Math.round(de.scrollHeight),
      };
    })()`);
    check(`${page} ${vp.w}×${vp.h} 无横向溢出`, m.overflowX <= 0, `overflowX=${m.overflowX}`);
    check(`${page} ${vp.w}×${vp.h} 主操作可见`, m.btnVisible);
    check(`${page} ${vp.w}×${vp.h} 无 console 错误`, consoleErrors.length === 0, consoleErrors.join(' | '));
    if (page === 'index.html') {
      check(`${vp.w}×${vp.h} 变量只在 .ds-theme 作用域`, m.theme && m.rootToken === '', `root=「${m.rootToken}」`);
    }
  }
}

/* ---------- 2. 对比度 ---------- */
await goto('index.html', 1440, 900);
const contrast = await evaluate(`(() => {
  const lum = (c) => {
    const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = (s) => s.match(/[\\d.]+/g).slice(0, 3).map(Number);
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const b = getComputedStyle(n).backgroundColor;
      if (b && !b.includes('rgba(0, 0, 0, 0)') && b !== 'transparent') return parse(b);
      n = n.parentElement;
    }
    return [247, 250, 252];
  };
  const ratio = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const fg = parse(getComputedStyle(el).color);
    const bg = bgOf(el);
    const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
    return +(((a + 0.05) / (b + 0.05)).toFixed(2));
  };
  return {
    '正文': ratio('.ds-cell-meta, .ds-table td'),
    '标题': ratio('.ds-page-title h1'),
    '次要文字': ratio('.ds-page-title p'),
    '辅助文字': ratio('.ds-table-foot'),
    '主按钮白字': ratio('.ds-btn-primary'),
    '强调文字': ratio('.ds-nav-item[aria-current="page"]'),
    '状态-成功': ratio('.ds-tag--success'),
    '状态-警告': ratio('.ds-tag--warn'),
    '状态-失败': ratio('.ds-tag--danger'),
  };
})()`);
for (const [name, value] of Object.entries(contrast)) {
  check(`对比度 ${name} ≥ 4.5`, value >= 4.5, `${value}:1`);
}

/* ---------- 3. 组件样式抽查 ---------- */
const styles = await evaluate(`(() => {
  const cs = (sel) => getComputedStyle(document.querySelector(sel));
  const btn = cs('#btn-create');
  const input = cs('.ds-search input, .ds-input');
  const tag = cs('.ds-tag');
  const card = cs('.ds-metric');
  const theme = cs('body');
  return {
    btnShadow: btn.boxShadow,
    btnRadius: btn.borderRadius,
    inputShadow: input.boxShadow,
    tagShadow: tag.boxShadow,
    tagBorder: tag.boxShadow.includes('inset') || tag.borderTopWidth !== '0px',
    cardShadow: card.boxShadow,
    dotBg: theme.backgroundImage.includes('radial-gradient'),
    transition: btn.transitionDuration,
  };
})()`);
check('按钮圆角为 8px', styles.btnRadius === '8px', styles.btnRadius);
check('按钮默认浮起（外阴影）', /rgb/.test(styles.btnShadow) && !styles.btnShadow.includes('inset'));
check('输入框默认内凹', styles.inputShadow.includes('inset'));
check('标签为描边浮起芯片', styles.tagBorder && /rgb/.test(styles.tagShadow));
check('卡片浮起阴影', /rgb/.test(styles.cardShadow) && !styles.cardShadow.includes('inset'));
check('页面点阵背景来自 CSS', styles.dotBg);
check('交互过渡 0.3s', styles.transition.split(',')[0].trim() === '0.3s', styles.transition);

/* ---------- 4. 键盘聚焦 ---------- */
await evaluate(`document.querySelector('#btn-create').focus()`);
await pressTab();
await pressTab(true);
const focusRing = await evaluate(`(() => {
  const el = document.activeElement;
  const s = getComputedStyle(el);
  return { tag: el.tagName, outline: s.outlineWidth + ' ' + s.outlineStyle + ' ' + s.outlineColor, visible: el.matches(':focus-visible') };
})()`);
check('键盘聚焦有可见焦点环', focusRing.outline.startsWith('2px') && focusRing.visible, `${focusRing.tag} ${focusRing.outline}`);

/* ---------- 5. 工作台交互 ---------- */
await goto('index.html', 1440, 900);

await evaluate(`document.querySelector('#btn-create').click()`);
await sleep(500);
const opened = await evaluate(`(() => ({
  open: document.querySelector('#drawer').classList.contains('ds-is-open'),
  focus: document.activeElement.id,
  hidden: document.querySelector('#drawer').getAttribute('aria-hidden'),
}))()`);
check('抽屉可打开并把焦点移入首个字段', opened.open && opened.focus === 'f-name' && opened.hidden === 'false', JSON.stringify(opened));

await evaluate(`document.querySelector('#btn-save').click()`);
await sleep(300);
const invalid = await evaluate(`(() => ({
  invalid: document.querySelector('#field-name').classList.contains('ds-is-invalid'),
  msg: document.querySelector('#f-name-error').textContent.trim(),
}))()`);
check('空名称提交被拦截并显示错误', invalid.invalid && invalid.msg.length > 0);

await evaluate(`(() => {
  const el = document.querySelector('#f-name');
  el.value = '结算链路回归';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  document.querySelector('#btn-save').click();
})()`);
await sleep(1400);
const saved = await evaluate(`(() => ({
  closed: !document.querySelector('#drawer').classList.contains('ds-is-open'),
  firstRow: document.querySelector('.ds-table tbody tr .ds-cell-title')?.textContent.trim(),
  toast: document.querySelector('.ds-toast-stack .ds-toast')?.textContent.trim() || '',
}))()`);
check('保存后关闭抽屉、插入首行并提示成功',
  saved.closed && saved.firstRow === '结算链路回归' && saved.toast.includes('巡检已创建'), JSON.stringify(saved));

await evaluate(`document.querySelector('#btn-create').click()`);
await sleep(400);
for (const type of ['keyDown', 'keyUp']) {
  await send('Input.dispatchKeyEvent', { type, key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
}
await sleep(300);
const escClosed = await evaluate(`(() => ({
  closed: !document.querySelector('#drawer').classList.contains('ds-is-open'),
  focusBack: document.activeElement.id,
}))()`);
check('Esc 关闭抽屉并把焦点还原到触发按钮', escClosed.closed && escClosed.focusBack === 'btn-create', JSON.stringify(escClosed));

await evaluate(`(() => {
  const t = document.querySelector('.ds-segmented [data-status="failed"]');
  t && t.click();
})()`);
await sleep(300);
const filtered = await evaluate(`(() => ({
  rows: document.querySelectorAll('.ds-table tbody tr:not([hidden]):not(#empty-row)').length,
  label: document.querySelector('.ds-segmented [aria-selected="true"]')?.textContent.replace(/\\s+/g, ''),
}))()`);
check('状态筛选只剩失败任务', filtered.rows === 1 && filtered.label.includes('失败'), JSON.stringify(filtered));

await evaluate(`(() => {
  const s = document.querySelector('#table-filter');
  s.value = 'zzz-not-found';
  s.dispatchEvent(new Event('input', { bubbles: true }));
})()`);
await sleep(400);
const empty = await evaluate(`(() => ({
  empty: !!document.querySelector('.ds-empty'),
  rows: document.querySelectorAll('.ds-table tbody tr:not([hidden]):not(#empty-row)').length,
}))()`);
check('搜索无结果显示空状态', empty.empty && empty.rows === 0, JSON.stringify(empty));

await evaluate(`(() => {
  const s = document.querySelector('#table-filter');
  s.value = '';
  s.dispatchEvent(new Event('input', { bubbles: true }));
})()`);
await sleep(400);

await evaluate(`document.querySelector('#btn-refresh').click()`);
await sleep(200);
const loading = await evaluate(`!!document.querySelector('.ds-table .ds-skeleton, .ds-skeleton-row')`);
check('刷新时出现骨架加载', loading);
await sleep(1200);

await evaluate(`document.querySelector('#btn-export').click()`);
await sleep(1200);
const failure = await evaluate(`(() => {
  const t = document.querySelector('.ds-toast-stack .ds-toast--danger');
  return { danger: !!t, retry: !!t && t.textContent.includes('重试') };
})()`);
check('导出失败给出可重试的失败提示', failure.danger && failure.retry, JSON.stringify(failure));

/* ---------- 6. 组件页交互 ---------- */
await goto('examples/components.html', 1440, 900);
await evaluate(`document.querySelectorAll('#g-seg button')[2].click()`);
await sleep(200);
const seg = await evaluate(`document.querySelectorAll('#g-seg button')[2].getAttribute('aria-selected')`);
check('组件页分段控件可切换', seg === 'true');

await evaluate(`document.querySelector('[data-toast="success"]').click()`);
await sleep(200);
check('组件页 Toast 可触发', await evaluate(`!!document.querySelector('.ds-toast-stack .ds-toast--success')`));

await evaluate(`document.querySelector('#g-open').click()`);
await sleep(500);
const gDrawer = await evaluate(`(() => ({
  open: document.querySelector('#g-drawer').classList.contains('ds-is-open'),
  focus: document.activeElement.id,
}))()`);
check('组件页抽屉打开并聚焦首字段', gDrawer.open && gDrawer.focus === 'g-d-name', JSON.stringify(gDrawer));

/* ---------- 7. 通用工作台：三个尺寸、表面与真实交互 ---------- */
for (const vp of VIEWPORTS) {
  await goto('examples/workbench.html', vp.w, vp.h);
  const workbench = await evaluate(`(() => {
    const cs = s => getComputedStyle(document.querySelector(s));
    const table = document.querySelector('.ds-table-scroll').getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      tableBottom: table.bottom,
      font: cs('.ds-table').fontSize,
      meta: cs('.ds-cell-meta').fontSize,
      tag: cs('.ds-tag').boxShadow,
      action: cs('[data-detail]').boxShadow,
      input: cs('.ds-input').boxShadow,
      primary: cs('.ds-btn-primary').boxShadow,
      dots: cs('body').getPropertyValue('--dot-gap').trim() === '22px' && cs('body').backgroundImage.includes('2.4px'),
      rows: document.querySelectorAll('[data-detail]').length,
      clipped: [...document.querySelectorAll('.ds-cell-title, .ds-tag, .wb-numeric')].some(el => el.scrollWidth > el.clientWidth + 1),
    };
  })()`);
  check(`工作台 ${vp.w}×${vp.h} 无页面溢出且列表滚动区可见`, !workbench.overflow && !workbench.clipped && workbench.tableBottom < vp.h && workbench.rows === 12, JSON.stringify(workbench));
  check(`工作台 ${vp.w}×${vp.h} 文字/平面状态/轻内凹/主要操作/点阵层级`, workbench.font === '14px' && workbench.meta === '12px' && workbench.tag === 'none' && workbench.action === 'none' && workbench.input.includes('inset') && workbench.primary !== 'none' && workbench.dots);
  check(`工作台 ${vp.w}×${vp.h} 无 console 错误`, consoleErrors.length === 0, consoleErrors.join(' | '));
}
const workbenchContrast = await evaluate(`(() => {
  const luminance = rgb => rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const parse = color => color.match(/[\\d.]+/g).slice(0, 3).map(Number);
  return ['.ds-heading', '.ds-cell-title', '.ds-cell-meta', '.ds-text-muted', '.ds-tag--info', '.ds-tag--warn', '.ds-tag--neutral', '.ds-btn-primary', '.ds-link'].map(selector => {
    const el = document.querySelector(selector);
    let parent = el;
    while (getComputedStyle(parent).backgroundColor === 'rgba(0, 0, 0, 0)') parent = parent.parentElement;
    const fg = luminance(parse(getComputedStyle(el).color));
    const bg = luminance(parse(getComputedStyle(parent).backgroundColor));
    return [selector, (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05)];
  });
})()`);
check('工作台正文/辅助/链接/状态/主按钮对比度 ≥ 4.5', workbenchContrast.every(([, ratio]) => ratio >= 4.5), JSON.stringify(workbenchContrast));
const primaryCenter = await evaluate(`(() => { const r = document.querySelector('#summary-open').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
const defaultPrimary = await evaluate(`getComputedStyle(document.querySelector('#summary-open')).backgroundColor`);
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...primaryCenter });
await sleep(350);
const hoverPrimary = await evaluate(`getComputedStyle(document.querySelector('#summary-open')).backgroundColor`);
await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...primaryCenter });
await sleep(350);
const activePrimary = await evaluate(`getComputedStyle(document.querySelector('#summary-open')).backgroundColor`);
check('工作台主操作 hover/active 不只靠阴影区分', defaultPrimary !== hoverPrimary && hoverPrimary !== activePrimary);
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1, buttons: 1 });
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, x: 1, y: 1 });
check('工作台禁用操作不可聚焦且无浮起', await evaluate(`(() => { const el = document.querySelector('.wb-filters button:disabled'); el.focus(); const cs = getComputedStyle(el); return document.activeElement !== el && cs.cursor === 'not-allowed' && cs.boxShadow === 'none' && Number(cs.opacity) <= .55; })()`));
await evaluate(`document.querySelector('#tab-all').focus()`);
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
check('工作台 Tabs 键盘切换及筛选', await evaluate(`document.activeElement.id === 'tab-active' && document.querySelectorAll('[data-detail]').length === 7 && document.querySelector('#record-panel').getAttribute('aria-labelledby') === 'tab-active'`));
await pressTab();
check('工作台输入框键盘焦点可见', await evaluate(`document.activeElement.id === 'record-search' && getComputedStyle(document.activeElement).outlineStyle === 'solid' && getComputedStyle(document.activeElement).outlineWidth === '2px'`));
await evaluate(`document.querySelector('#tab-all').click(); const input = document.querySelector('#record-search'); input.value = 'ITEM-009'; input.dispatchEvent(new Event('input'));`);
check('工作台名称/编号搜索', await evaluate(`document.querySelectorAll('[data-detail]').length === 1 && document.querySelector('#record-rows').textContent.includes('本地化词汇表')`));
await evaluate(`document.querySelector('[data-detail]').click()`);
check('工作台行展开为平面且状态明确', await evaluate(`document.querySelector('[data-detail]').getAttribute('aria-expanded') === 'true' && !document.querySelector('.wb-detail').hidden && getComputedStyle(document.querySelector('[data-detail]')).boxShadow === 'none'`));
await evaluate(`{ const input = document.querySelector('#record-search'); input.value = '<img src=x onerror=alert(1)>'; input.dispatchEvent(new Event('input')); }`);
check('工作台空状态且搜索文本不注入 HTML', await evaluate(`!!document.querySelector('.ds-empty') && !document.querySelector('#record-rows img')`));
await evaluate(`{ document.querySelector('.wb-filters').reset(); const owner = document.querySelector('#owner-filter'); owner.value = 'Alex'; owner.dispatchEvent(new Event('change')); }`);
check('工作台负责人筛选', await evaluate(`document.querySelectorAll('[data-detail]').length === 4`));
await evaluate(`document.querySelector('.wb-filters').reset()`);
check('工作台重置筛选', await evaluate(`document.querySelectorAll('[data-detail]').length === 12`));
await evaluate(`document.querySelector('#summary-open').focus(); document.querySelector('#summary-open').click()`);
check('工作台弹层聚焦并保留浮层阴影', await evaluate(`document.querySelector('#summary').open && document.querySelector('#summary').contains(document.activeElement) && getComputedStyle(document.querySelector('#summary')).boxShadow !== 'none'`));
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await sleep(100);
check('工作台弹层 Escape 关闭并还原焦点', await evaluate(`!document.querySelector('#summary').open && document.activeElement.id === 'summary-open'`));

/* ---------- 汇总 ---------- */
ws.close();
chrome.kill();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} 项通过`);
if (failed.length) {
  console.error('失败项：\n' + failed.map((f) => `- ${f.name} ${f.detail}`).join('\n'));
  process.exit(1);
}
