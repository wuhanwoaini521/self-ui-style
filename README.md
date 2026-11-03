# 方寸 UI 视觉系统（v0.2 · Neumorphism）

桌面端工具软件的新拟物（Soft UI）视觉系统 + 可运行样板页「巡检任务工作台」。

- 直接打开 `index.html` 预览，或 `python3 -m http.server 8000`。
- 设计变量：`styles/tokens.css`（唯一换肤入口：颜色、双光源阴影、圆角、间距、动效）
- 组件样式：`styles/app.css`（按钮 / 输入 / 选择器 / 标签 / 卡片 / 表格 / 导航 / 抽屉 / 提示）
- 规范、自检清单与三视口验收数据：[`DESIGN.md`](./DESIGN.md)

交互可试：新建/编辑抽屉、表单校验、状态筛选、列表搜索、刷新加载态、空数据、导出失败重试、同步横幅重试、⌘K 搜索、Esc 关闭与焦点回位。

## 设计图（Pen）

在 pen.dev 画布上按本规范还原的四张画板，源文件为 [`design.pen`](./design.pen)（用 pen.dev 打开）：

| 画板 | 文件 |
|---|---|
| 巡检任务工作台（主界面） | `design-previews/01-workspace.png` |
| 新建巡检抽屉（表单态） | `design-previews/02-drawer.png` |
| 组件规范（按钮 / 输入 / 标签 / 色板 / 阴影） | `design-previews/03-components.png` |
| 状态与反馈（空态 / 骨架 / Toast） | `design-previews/04-states.png` |

另附主界面的 HTML + Tailwind 导出：`design-previews/01-workspace.html`。
