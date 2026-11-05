# 变更记录

## 0.9.0 — 2026-11-05

- 新增受控/非受控 React DataTable：排序、行选择、本地/服务端分页、加载、错误与空状态。
- 新增 SidebarLayout、NavigationGroup、NavigationItem 与 Breadcrumbs 页面骨架；补充移动端侧栏布局。
- Button 增加 loading/禁用防重入状态；Combobox 增加受控开合、Home/End、禁用项跳过、原生表单值和必选校验。
- 新增纯白主题 `theme-white.css`，React Provider 可通过 `theme="white"` 切换；同步调整局部主题 tokens 与 reduced-motion。
- 重做 React 消费 Demo，覆盖表格、表单、导航、反馈、浮层、复制示例和浅色/纯白切换；同步 API、能力清单与接入文档。
- 扩充 React 自动化用例，覆盖加载、Combobox 表单提交、DataTable 排序/选择/分页、白色主题与导航语义。
- 新增 DateRangePicker、FileUpload、Slider、Tree 与 CommandPalette，覆盖日期范围校验、拖放文件限制、原生滑块、树键盘导航和命令过滤。
- React 消费 Demo 增加日期/上传/数值/树/命令示例；统一 SVG 图标尺寸，修复消费页图标放大问题。
- DataTable 增加受控/非受控列显隐菜单；Demo 导出按钮改为生成真实 UTF-8 CSV 文件。
- DataTable 增加可控逐列筛选、批量操作插槽、sticky header 和滚动视口；服务端过滤模式可由调用方提供。
- 新增主题 Portal 支持的 Radix ContextMenu，以及带过期请求保护的 `useAsyncAction` 异步生命周期 hook。
- Demo 展示逐列筛选、右键菜单和保存成功/失败/重置状态；同步 React API 与能力清单。
- 补充 DataTable 筛选、异步动作、ContextMenu 的交互测试。
- DataTable 增加起始/末端固定列与固定行高虚拟滚动；消费 Demo 新增 240 行可切换长表示例。
- 将表面悬浮、行 hover、粘性列阴影、强调光晕与遮罩纳入主题变量，并为纯白主题调整对应值。
- 同步更新 DataTable 虚拟滚动边界、设计主题对照、接入说明与组件能力清单。
- 新增 Form 与 useForm 表单编排 API，支持同步/异步跨字段验证、服务端字段错误映射、提交生命周期和可取消重置；Demo 增加真实表单示例。
- 同步更新表单 API、组件能力清单、接入文档、设计稿与自动化覆盖。
- FileUpload 新增可插拔 `uploadFile` 传输适配，统一管理进度、成功/失败、取消与重试；Demo 提供可中止的模拟上传。
- 修正异步表单校验后的首个错误字段聚焦时机；覆盖上传进度和完成状态的自动化用例。
- 表单字段编辑时使过期的异步校验/提交响应失效；FileUpload 支持单文件重复选择时替换旧文件。
- DesignSystemProvider 与 React Demo 增加暗色主题切换；设计稿新增与亮色工作台对应的完整黑金暗色工作台画板。

## 未发布

- 新增可选黑金暗色主题：导入 `@self/ui-style/theme-dark.css` 并为主题容器添加 `ds-theme--dark`。
- 重置按钮、表单控件、分段按钮和 React checkbox/switch/radio 的默认最小高度，避免宿主全局控件规则撑开固定尺寸组件。

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
