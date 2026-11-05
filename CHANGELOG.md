# 变更记录

## 未发布

- 新增可选 `data-surface="workbench"` / React Provider `surface="workbench"`：语义表面与阴影、贴地面板、平面状态/行操作、轻内凹输入和独立弹层层级；不修改旧阴影值与点阵。
- 共享文字层级、系统字体回退、等宽数字工具类；已有 compact 密度支持原生 CSS 入口；新增可选 `.ds-tabs` 下划线内容导航。
- 新增不绑定业务的 `examples/workbench.html`、三尺寸默认/焦点展开/浮层截图及回归检查。详见 `docs/workbench.md` 与迁移指南。
- 兼容：原导出、导入路径、Provider 默认值和现有组件调用不变；React 层继续实验中，版本暂维持 0.8.1，未发布。工作台需显式启用。

## 0.8.1 — 2026-11-03

- 修正 Combobox 的原生表单属性透传及 ConfirmDialog 局部 Portal 容器。

## 0.8.0 — 2026-11-03

- 新增 React Combobox（本地筛选与键盘选择）、基于 AlertDialog 的 ConfirmDialog、原生语义表格外壳及布局/描述列表原语。
- 为 ConfirmDialog、Combobox 的键盘选择与正式 tarball 消费补充自动化验证。
- 能力清单与通用模板文档同步标注已完成范围和未实现边界。

## 0.7.0 — 2026-11-03

- 新增 React 18+ / TypeScript 组件入口 `@self/ui-style/react`，当前整体标记实验中；使用 Radix Primitives 提供浮层、键盘与焦点行为。
- 新增中性 React 消费示例和 `npm run package:consumer`，从构建 tarball 安装后做 TS 与生产构建检查。
- 修正 React portal 主题作用域、搜索输入外观、进度标签必需性及 NumberInput 类型约束。
- 明确数据表、异步表单生命周期等尚未实现；不把原生 table 样式称为 DataTable。

## 0.6.0 — 2026-11-03

- 新增实验中的 React + TypeScript 入口 `@self/ui-style/react`，基于 React 18+ 与 Radix 原语。
- 提供按钮、文本、表单基础、复选/单选/开关、标签、状态反馈、Dialog/Drawer、Toast、Tabs、Select、菜单、Tooltip/Popover、布局原语及分页等初版组件。
- 新增 DesignSystemProvider 局部主题/浮层挂载配置、默认与紧凑密度、显式点阵背景选项。
- 补充 SSR 安全导入、StrictMode、表单关联、Dialog 焦点、Toast 常驻行为的自动化测试。
- React 组件整体标记为实验中；DataTable、Combobox、异步表单生命周期等尚未实现。

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
