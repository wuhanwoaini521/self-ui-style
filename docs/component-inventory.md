# 能力清单与设计对应

状态只使用：稳定、实验中、未实现、已弃用。当前 React API 整体为**实验中**；框架无关 CSS/DOM API 继续独立发布。达到稳定标准前，不在此清单标稳定。

| 能力 | 当前情况 | Token / 实现 | 主要缺口 |
|---|---|---|---|
| 可选工作台表面 / 共享 compact 密度 | 实验中 | `data-surface="workbench"`、Provider `surface`；[说明](workbench.md) | 不含业务布局 / DataTable；长时间真人使用与跨浏览器待验证 |
| Tokens、浅色局部主题、点阵背景 | 实验中 | `src/tokens/tokens.css`、`src/theme/{base,background}.css` | 暗色与高对比主题未实现 |
| Button、IconButton、ButtonGroup、Link、Text、Heading、Code、Kbd、Icon | 实验中 | `src/react/index.tsx`、`src/react/index.css` | React 故事与键盘状态覆盖不全；仅 IconButton 已强制 aria-label |
| Input、Textarea、SearchInput、NumberInput、FormField、Fieldset、Label | 实验中 | 同上 | NumberInput 缺 min/max/step 的组件级校验；异步校验、提交生命周期、错误聚焦未实现 |
| Checkbox、RadioGroup、Switch、Select、Combobox | 实验中 | Radix 包装；Combobox 本地过滤与键盘选择 | 异步/多选搜索未实现；完整受控示例不足 |
| Badge、Avatar、Divider、Spinner、Skeleton、Progress | 实验中 | 主题 tokens + React 包装 | 头像图片失败策略、骨架组合示例待补 |
| Alert、EmptyState、ErrorState | 实验中 | React 包装 | 文案与恢复动作由消费方提供，无业务请求逻辑 |
| Dialog、ConfirmDialog、Drawer | 实验中 | Radix Dialog + AlertDialog | ConfirmDialog 使用 alertdialog 原语与取消/确认动作；Drawer 暂复用 Dialog 行为 |
| Tooltip、Popover、DropdownMenu、Tabs、Accordion | 实验中 | Radix | 复杂嵌套层级与组合样例还需浏览器验证 |
| Toast | 实验中 | React ToastProvider/useToast 与原生 `DS.toast` | 更新/重试生命周期契约待扩充；Action 不自动关闭 |
| Pagination | 实验中 | 受控页码和回调 | 消费方负责数据切片/服务端请求 |
| Stack、Inline、Grid、Container、Card、Section、Toolbar、DescriptionList | 实验中 | React 基础布局原语 + CSS | AppShell、Sidebar、PageHeader、Breadcrumb 未实现 |
| 原生 Table | 实验中 | React 语义 table + 横向滚动容器 | 不含排序、筛选、选择、分页、固定表头；DataTable 未实现 |
| 筛选摘要、批量操作、表单动作、异步反馈、未保存提醒、可复制/截断展开 | 未实现 | `docs/templates.md` 提供组合建议 | 缺正式组件与测试 |
| 日期/时间、文件上传、Slider、Tree、Command Palette、ContextMenu | 未实现 | — | 按需排期 |

## 公开 API 和支持边界

- React 支持范围：React 18+ / TypeScript；导入 `@self/ui-style/react`，样式从 `@self/ui-style/react/style.css` 引入。框架无关入口为 package exports 中的 `theme.css`、`tokens.css`、`ui.css` 和 `ui.js`。
- 组件需保持 HTML 语义，透传可用的原生属性、`className`、`style` 和 ref；浮层依赖 Radix，消费方可传 Provider 主题内的 portal 容器。
- SSR：模块导入不读 `window/document`；交互组件只在客户端挂载后工作。Next.js 等环境由消费项目划分 client boundary。
- 模板不绑定路由、接口、认证、权限或状态管理，数据均为演示值。

完整 React 导出与当前用法见 [`react-components.md`](react-components.md)。修改后更新本文件、组件文档与对应示例。