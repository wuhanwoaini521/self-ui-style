# 能力清单与设计对应

组件统一使用 `.ds-` 命名；方寸浅色基准、纯白和黑金暗色主题分别来自 `src/tokens/tokens.css`、`src/theme/white.css` 与 `src/theme/dark.css`。React API 目前整体为**实验中**，框架无关 CSS/DOM API 独立可用。

| 类别 | 组件 / 入口 | 当前能力 | 设计稿与 Demo 对应 |
|---|---|---|---|
| 主题 | 浅色、纯白、黑金暗色、点阵背景、密度 | `.ds-theme` 局部变量；React Provider 可切换 `light/white/dark`；白色与暗色 CSS 可独立导入 | `design/design.pen`：浅色工作台与完整暗色工作台、组件规范与状态；React Demo 可切换三种主题 |
| 按钮与内容 | Button、IconButton、ButtonGroup、Link、Heading、Icon、Divider | 变体、尺寸、loading/disabled、ref 和原生属性；IconButton 要求 accessible name | Demo：默认、禁用、加载及操作示例 |
| 表单 | Form、useForm、Input、NumberInput、SearchInput、Textarea、FormField、Fieldset、Checkbox、Radio、Switch、Select、Combobox | 原生 constraints；受控值；跨字段同步/异步校验；字段错误、提交状态、失败与重置；Combobox 支持搜索、禁用项与键盘导航 | 设计稿：默认/聚焦/错误/只读/提交状态；Demo：表单编排、字段校验与异步提交 |
| 日期与文件 | DateRangePicker、FileUpload | 受控日期范围和顺序错误；多文件选择、拖放、大小/数量限制、受控列表、上传进度/取消/重试 | Demo：模拟上传进度和取消、日期范围、文件限制 |
| 数值与树 | Slider、Tree | 原生 range 键盘语义；Tree 受控选中/展开、禁用项、方向键、Home/End | Demo：阈值滑块、键盘可操作项目目录 |
| DataTable | Table primitives、DataTable | 可访问排序、逐列筛选、行选择、全选/半选、分页、列显隐、批量操作区、start/end 固定列、固定行高虚拟滚动、sticky header、loading/error/empty | 设计稿：表格工具栏、筛选行与状态；Demo：搜索、排序、逐列筛选、固定列、240 行虚拟滚动、选择、分页、列显隐、CSV 导出和刷新 |
| 导航布局 | SidebarLayout、NavigationGroup、NavigationItem、Breadcrumbs、Tabs、Accordion、Stack、Grid 等 | 无路由依赖；`aria-current`；小视口下侧栏退化为顶部布局 | 设计稿：工作台导航；Demo：页面分类导航与面包屑 |
| 反馈 | Alert、Badge、Spinner、Skeleton、Progress、EmptyState、ErrorState、ToastProvider/useToast | 语义提示，错误动作交由调用方；Toast 可更新、关闭、设置持续时间 | 设计稿：状态与反馈；Demo：多类型 Toast、加载、空状态 |
| 浮层 | Dialog、ConfirmDialog、Drawer、Tooltip、Popover、DropdownMenu、ContextMenu、Select | Radix 键盘导航、焦点管理、Escape 和语义状态；主题作用域 Portal | 设计稿：抽屉与确认反馈、右键菜单；Demo：对话框、下拉与右键菜单 |
| 命令 | CommandPalette | 受控/非受控开合、关键词过滤、方向键/Home/End/Enter、Escape 和焦点管理 | Demo：执行页面跳转和主题切换命令 |
| 异步状态 | `useAsyncAction` | idle/pending/success/error、Promise 结果、错误与重置、忽略过期请求结果 | 设计稿：异步提交状态；Demo：模拟成功、失败与重置 |

## API / 运行边界

- React 18+ / TypeScript：从 `@self/ui-style/react` 导入，样式显式导入 `@self/ui-style/react/style.css`。纯白变量也包含在该 React 样式入口中。
- 非 React：`@self/ui-style/theme.css` + `.ds-*` 类；纯白主题额外导入 `@self/ui-style/theme-white.css`；Toast/Drawer DOM 行为可选用 `src/ui/ui.js` 的 `DS.toast` / `DS.drawer`。
- 组件透传可用原生属性、`className`、`style` 和 ref；表格列类型、受控 props 和服务端数据接口见 [`react-components.md`](react-components.md)。
- SSR 不访问 `window/document`；浮层依赖 Radix，消费项目需提供客户端交互边界。

## 尚未覆盖

- DataTable 动态行高虚拟滚动、多条件/操作符筛选与服务端请求适配。
- 自定义日历网格、范围快捷项和时区日期控件；上传传输、服务端进度和断点续传；Tree 懒加载、多选勾选和虚拟化。
- CommandPalette 分组/快捷键配置和全局快捷键注册。
- Schema 库适配器、自动化服务端错误协议映射、字段 touched/dirty 策略及分步表单。
- React 暗色主题可通过独立 `theme-dark.css` 使用；交互 Demo 与设计稿本次重点展示方寸浅色和纯白变体。
