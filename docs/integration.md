# 接入指南

设计 Tokens、CSS 与原生 JS 工具不依赖框架；仓库另提供 **React 18+ + TypeScript 组件层（实验中）**。React 层使用 Radix Primitives 作为交互基础，其他框架当前通过原生 CSS 类使用，不提供 Vue/Svelte 封装。React 安装与状态清单见 [`react-components.md`](react-components.md)。

## 1. 安装

### 1.1 从本地或私有仓库固定版本（推荐）

```bash
# 同一台机器 / monorepo 里
npm install file:../self-ui-style#v0.8.1
# 或私有 Git 仓库（走 SSH，能固定 tag 或 commit）
npm install git+ssh://git@github.com/<you>/self-ui-style.git#v0.8.1
```

安装后在 `package.json` 里会留下固定版本：

```json
{ "dependencies": { "@self/ui-style": "file:../self-ui-style" } }
```

升级时改版本号后 `npm install`，不要直接改 `node_modules`。也可以 `git submodule` 或把 `src/` 作为 workspace 包引入，规则相同：**只固定一处副本，别在多个项目里各复制一份再分别改。**

### 1.2 不装包，直接引用文件

临时试用可以把整个仓库放到项目外，用相对路径引用 `src/theme/index.css` 与 `src/ui/*.js`。这种方式不会自动拿到升级，长期使用请回到 1.1。

## 2. 引入样式

### 构建工具（Vite / webpack / Next / Nuxt）

```js
// 入口文件，例如 src/main.js
import '@self/ui-style/theme.css';          // 变量 + 基础 + 组件，一次到位
import { DS } from '@self/ui-style';        // 图标精灵 + toast/drawer 工具
```

等价于按层引入（需要更细的顺序控制时）：

```js
import '@self/ui-style/tokens.css';
import '@self/ui-style/base.css';
import '@self/ui-style/ui.css';
```

### 纯 HTML

```html
<link rel="stylesheet" href="./node_modules/@self/ui-style/src/theme/index.css">
<script src="./node_modules/@self/ui-style/src/ui/icons.js"></script>
<script src="./node_modules/@self/ui-style/src/ui/ui.js"></script>
```

字体维持 Google Fonts 在线加载（见各页 `<head>`），并配置系统字体回退；当前不内嵌字体文件。离线或字体服务不可用时会使用系统字体，字宽可能略有差异。若项目要求离线运行或跨设备截图一致，再评估字体许可并加入 WOFF2 子集：

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## 3. 打开主题作用域

所有变量都定义在 `.ds-theme` 下，绝不会写到 `:root`。**必须**在一个容器上挂这个类：

```html
<body class="ds-theme"> … </body>
<!-- 或只让某个区域使用这套视觉 -->
<main class="ds-theme"> … </main>
```

这样接入已有项目时不会污染对方的 `body`、全局字体或按钮样式。去掉这个类，所有 `.ds-` 组件都会失去配色与阴影。

## 4. 用组件

### 按钮

```html
<button class="ds-btn ds-btn-primary ds-btn-lg" type="button">
  <span class="ds-dot-mark" aria-hidden="true"></span>新建巡检
</button>
<button class="ds-btn" type="button">导出</button>
<button class="ds-btn ds-btn-ghost ds-btn-sm" type="button">取消</button>
<button class="ds-btn ds-btn-icon" type="button" aria-label="刷新">
  <svg class="ds-ico" width="15" height="15"><use href="#i-refresh"/></svg>
</button>
```

尺寸：`ds-btn-sm`（28px）/ 默认（36px）/ `ds-btn-lg`（40px）。禁用用原生 `disabled`，加载时把文字换成三点点阵 `<span class="ds-spinner"><i></i><i></i><i></i></span>`。

### 表单

```html
<div class="ds-field">
  <label class="ds-field-label" for="name">任务名称 <span class="ds-req">*</span></label>
  <input class="ds-input" id="name" name="name" required>
  <span class="ds-field-hint">最多 60 字。</span>
  <span class="ds-field-error">请填写任务名称。</span>
</div>
```

错误态由容器类切换：`field.classList.add('ds-is-invalid')`；说明与错误文字放在 `.ds-field-hint` / `.ds-field-error` 里。

### 标签与状态

```html
<span class="ds-tag ds-tag--success"><svg class="ds-ico" width="12" height="12"><use href="#i-check"/></svg>已通过</span>
```

`ds-tag--neutral | info | success | warn | danger`。**状态必须同时有图标和文字**，不能只靠颜色。

### 卡片、表格、导航

```html
<section class="ds-card ds-table-panel">
  <div class="ds-table-toolbar">
    <div class="ds-table-search"><svg class="ds-ico" width="13" height="13"><use href="#i-search"/></svg><input id="q" placeholder="筛选"></div>
    <span class="ds-spacer"></span>
    <button class="ds-btn ds-btn-sm" type="button">导出</button>
  </div>
  <div class="ds-table-scroll">
    <table class="ds-table">
      <colgroup><col style="width:40%"><col style="width:20%"><col style="width:40%"></colgroup>
      <thead><tr><th>任务</th><th>环境</th><th>状态</th></tr></thead>
      <tbody><tr><td><div class="ds-cell-title">登录与权限回归</div><div class="ds-cell-meta ds-mono">QA-I-1042</div></td><td>预发布</td><td><span class="ds-tag ds-tag--info">进行中</span></td></tr></tbody>
    </table>
  </div>
</section>
```

导航：`.ds-nav` > `.ds-nav-group` > `.ds-nav-item`，当前项用 `aria-current="page"`（样式由属性选择器驱动，不用额外类）。

### 抽屉行为

结构（`.ds-scrim` + `.ds-drawer` + 头部/主体/底部）见 `examples/components.html`，行为交给 `DS.drawer`：

```js
const drawer = DS.drawer({ panel: document.querySelector('#drawer'), scrim: document.querySelector('#scrim') });
drawer.open({ focus: document.querySelector('#name'), restoreFocus: trigger });
drawer.close();
```

它负责：遮罩点击关闭、`[data-ds-close]` 按钮、`Esc`、`Tab` 焦点锁、页面滚动锁定、关闭后焦点回位。

### Toast

```js
DS.toast({ type: 'success', title: '巡检已创建', desc: '「登录与权限回归」已加入列表。' });
DS.toast({ type: 'danger', title: '导出失败', desc: '服务返回 502，请稍后重试。', action: { label: '重试', onClick: retry } });
```

`type` 取 `success | info | danger`。默认 6 秒自动消失，失败类建议常驻并带重试动作。

## 5. 图标

`src/ui/icons.js` 会向页面注入一个 18 个 symbol 的 SVG 精灵（`#i-search`、`#i-check`…），使用时：

```html
<svg class="ds-ico" width="16" height="16"><use href="#i-check"/></svg>
```

需要新图标时，在 `icons.js` 里追加 `<symbol id="i-yourname">`，保持 16/24 网格、1.6px 描边、圆头线帽。品牌标识用 `.ds-dot-mark`（10px 白色点阵）。

## 6. 不同技术栈

| 技术栈 | 做法 |
| --- | --- |
| React 18+ | 使用 `@self/ui-style/react` 实验中组件层，需显式导入 `@self/ui-style/react/style.css` 并包在 `DesignSystemProvider` 中 |
| Vue / Svelte / 原生 HTML | 使用框架无关 `ds-` CSS 类与可选 `DS.toast/drawer`，自行管理框架生命周期；没有官方框架包装层 |
| 服务端渲染 | 输出同样的类名即可；`icons.js` 可以在构建期把 sprite 内联进 HTML，避免运行时注入 |
| 小程序 / 桌面壳 | 复用 `tokens.css` 的颜色与尺寸变量，组件规格对照 `DESIGN.md` 重写，不要硬套包含 DOM 结构的 CSS |
| 原生 / 低代码 | 只用 CSS 层，`ui.js` 可选 |

## 7. 版本与升级

- 语义化版本：`0.x` 阶段新增组件为 minor，纯样式修正为 patch；破坏性类名调整会提升 minor 并在 `CHANGELOG.md` 注明迁移方式。
- 项目侧固定 `file:` / Git tag 版本；升级时先在一个代表性页面替换并截图对比，再推广。
- 改了本仓库的 tokens 或组件，请在 `CHANGELOG.md` 记录，并重新跑 `npm run verify`、`npm run screenshot`。

## 8. 已知限制与按需扩展

- 当前只有浅色主题；需要深色时，应重新校准双光源方向与阴影颜色。
- 新拟物对比度天然偏低，本系统把正文对比度守在 12:1、最小文字 4.5:1；对低视力用户建议额外提供高对比模式。
- 通用表格不含行选择、批量操作或表头吸顶；按业务需求在业务层扩展。
- 更细的 Pencil 组件资产拆分不属于运行时依赖，可在设计稿需要跨项目维护时再补充。
- 抽屉与 Toast 是 DOM 工具，不带虚拟列表、动画编排或焦点管理之外的无障碍树计算。
