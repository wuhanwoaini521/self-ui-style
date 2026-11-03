# 设计资产（design/）

| 文件 | 用途 |
| --- | --- |
| `design.pen` | Pencil 设计源文件（version 2.21），四个画板即为视觉基准 |
| `design-previews/01-workspace.png` | 工作台 1440×900 |
| `design-previews/02-drawer.png` | 新建巡检抽屉 |
| `design-previews/03-components.png` | 组件规范（按钮 / 输入 / 标签 / 色板 / 阴影层级） |
| `design-previews/04-states.png` | 状态与反馈（空态 / 骨架 / Toast / 横幅） |
| `design-assets/bg-dot.png` | 画板背景（22px 点阵 + 整屏柔光），仅设计稿引用 |

## 打开方式

用 [Pencil](https://pencil.dev) 打开 `design.pen`。文件内部的背景图路径是相对路径 `design-assets/bg-dot.png`，移动文件时请连目录一起移动，否则点阵底图会丢失。

## 与实现的对应

| 画板 | 实现位置 |
| --- | --- |
| 巡检任务 · 质量工作台 | `index.html` + `src/app/workspace.css` |
| 新建巡检 · 抽屉 | `index.html` 的 `#drawer`，行为在 `src/ui/ui.js` 的 `DS.drawer` |
| 组件规范 | `src/ui/ui.css` + `examples/components.html` |
| 状态与反馈 | `DS.toast`、`.ds-banner`、`.ds-empty`、`.ds-skeleton` |

数值以 `src/tokens/tokens.css` 为准；页面不再引用 `design-assets/bg-dot.png`，底纹由 `src/theme/base.css` 的 CSS 点阵复刻（逐像素比对过点中心颜色与直径）。

## 两处有意差异

1. **长标题行高**：设计稿任务行固定 55px，第六行两行长标题在稿内会溢出；实现允许该行自动增高到约 72px。
2. **字体**：设计稿标注 Noto Sans SC / JetBrains Mono，页面通过 Google Fonts 加载，离线时回退系统字体，字宽略有差异。

修改设计稿后，请同步 `src/tokens/tokens.css` 与 `DESIGN.md`，并跑 `npm run verify`、`npm run screenshot` 更新截图。
