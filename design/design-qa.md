# 方寸展示页设计复核

- **方向**：概念 3（紧凑双层导航、宽幅介绍区、三列组件目录、主题卡片与快速开始）。
- **参考稿**：`design/design-previews/03-components.png`。
- **实现**：`examples/react-consumer/src/main.tsx` 与 `examples/react-consumer/src/demo.css`。
- **复核环境**：本地 Vite 预览，1280 × 720 CSS 像素；浅色首页和暗色首页均在浏览器中检查。
- **结果**：通过。

## 对照记录

- **字体与文案**：中文标题、英文组件名和短说明形成清晰层级，长介绍不会挤压组件标题；组件名、`.ds-` 类名与实际演示相对应。
- **布局节奏**：顶部主导航与分类导航固定分层；介绍区下面直接进入 Button、Combobox、DataTable 示例，后续依次补足状态、主题、快速开始和组合案例。三列在窄屏下由 CSS 断点收拢。
- **颜色与主题**：浅色使用冷白底和紫色强调，暗色使用近黑背景与柔和金色强调；主题切换同时作用于展示组件和页面控件。纯白主题有独立预览卡片及可切换状态。
- **资产质量**：页面使用项目自带图标、组件与点阵背景，无外部图片依赖；主题预览由 CSS 绘制，缩放时保持清晰。
- **交互与状态**：已验证暗色切换、数据展示分类跳转、npm/yarn 安装标签切换。无障碍树可读出导航名称、主题状态、表格选择控件和分页状态；按钮禁用、加载、输入禁用、表单校验、Toast、Dialog、Menu、Accordion 等状态在展示页有对应样例。

## 验证记录

- `npm run typecheck`：通过。
- `npm run test`：通过，1 个测试文件、30 个测试。
- `npm run build`：通过。
- `npm run verify`：类型检查、测试和构建均通过；最后的自动截图验证因当前环境没有 Chrome/Chromium 而退出，提示可设置 `CHROME_BIN`。本次视觉复核改用 Codex 内置浏览器完成。
- React 消费示例 `npm run typecheck && npm run build`：通过。构建输出有 Radix `use client` 指令提示和约 501 kB 的 JS chunk 警告，不影响生成。
