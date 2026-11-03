# 变更记录

## 0.4.1 — 2026-11-03

记录已采纳的实现决策：表格长标题完整换行并允许行高增加；字体继续使用 Google Fonts 在线加载与系统回退，暂不内嵌；深色主题、表格增强及更细的 Pencil 组件资产按需求规划；保留三视口截图并优先无损压缩。

## 0.4.0 — 2026-11-03

**从「一个样板页」变成「可复用设计系统」**，视觉本身未改动（样板页截图与 0.3.0 逐像素一致）。

- 目录重排：`src/tokens`（变量）、`src/theme`（基础样式 + 入口）、`src/ui`（通用组件 + 交互）、`src/app`（样板页业务）、`examples/`（组件展示）、`docs/`（接入/迁移/截图）、`design/`（.pen 与导出）、`skills/`（Agent 规则）。
- 全部样式类加 `ds-` 前缀；变量从 `:root` 收进 `.ds-theme`，焦点环与 reduced-motion 限定在主题作用域内，避免接入其他项目时污染全局。
- 新增 `src/ui/ui.js`：`DS.toast()`、`DS.drawer()`（遮罩、Esc、Tab 焦点锁、回焦）。
- 新增 `src/ui/icons.js`：18 个图标 symbol 从页面内联抽成可注入精灵。
- 新增 `examples/components.html`：色板、排版、按钮全状态、表单、标签/进度/分段、卡片/指标/详情、表格、横幅/Toast/空态/骨架、抽屉演示。
- 新增 `tools/verify.mjs`（49 项自检）与 `tools/screenshot.mjs`（三视口 × 三状态截图）。
- 新增 `docs/integration.md`、`docs/migration.md`、`skills/design-system/SKILL.md`、`design/README.md`。
- 新增层级 token：`--z-scrim` / `--z-drawer` / `--z-toast`；补齐被遗漏的 `.ds-card-head` 前缀。
- 修复：类名批量加前缀时，CSS 中 `.is-open` / `.is-invalid` 未被同步重命名，导致抽屉打开后透明不可见；`.segmented`、模板字符串里的旧类名也一并修正。
- 迁移：外部项目若直接引用过 `styles/tokens.css`、`styles/app.css`，改为 `src/tokens/tokens.css`、`src/theme/index.css`，并在容器上加 `class="ds-theme"`。

## 0.3.0 — 2026-11-03

按第三版 Pencil 设计稿还原：22px 单层点阵底纹 + 整屏柔光，卡片取消描边回到 8/16 双向浮起，导航当前项/分段选中/徽标/头像改为浮起，状态标签改为 1px 描边芯片，搜索框内凹统一 4/8。背景逐像素对齐设计稿（点中心 RGB 191/204/222）。

## 0.2.0 — 2026-11-03

按第二版 Pencil 设计稿调整表面色（`#f7fafc` 系）与圆角体系（6/8/10/12/16），输入框改为非对称内凹（`3/6 + -6/12`，聚焦 `1/2`），表格长标题完整换行，字体改用 Noto Sans SC / JetBrains Mono。

## 0.1.0 — 2026-11-03

初版：Neumorphism / Soft UI 浅色主题，工作台样板页（侧栏、指标、表格、抽屉、Toast、空态、骨架），双光源阴影 token，设计规范 `DESIGN.md`。
