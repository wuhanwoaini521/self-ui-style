# 工作台表面（未发布增量）

适合长期使用、信息密集的桌面页面。它是**可选视觉变体**，不是新的 AppShell 或 DataTable，不注入布局、请求、排序或业务状态。

## 接入

原有 CSS 导入和默认外观继续可用，无需换入口。更新到包含此变更的本地包后：

```html
<!-- 仍使用 @self/ui-style/theme.css；点阵按原方式显式开启 -->
<div class="ds-theme ds-theme--dotted" data-surface="workbench" data-density="compact">
  <!-- 现有 ds-* 组件 -->
</div>
```

```tsx
import { DesignSystemProvider, Tabs, TabsList, TabsTrigger, TabsContent } from '@self/ui-style/react';
import '@self/ui-style/react/style.css';

<DesignSystemProvider surface="workbench" density="compact" dotted>
  <Tabs defaultValue="all">
    <TabsList className="ds-tabs" aria-label="内容视图">
      <TabsTrigger value="all">全部</TabsTrigger>
      <TabsTrigger value="recent">最近更新</TabsTrigger>
    </TabsList>
    <TabsContent value="all">列表内容</TabsContent>
    <TabsContent value="recent">最近更新内容</TabsContent>
  </Tabs>
</DesignSystemProvider>
```

- `surface` 默认仍为 `default`；`density` 默认仍为 `default`；`dotted` 默认仍为 `false`。三个开关独立，可只改变表面，不压缩尺寸。
- `compact` 是已有能力，现在原生 CSS 与 React 入口都支持，不重复增加密度 API。
- 点阵的颜色、半径、间距和柔光均未改变。工作台不隐藏、不降低它的透明度。
- Provider 内默认挂载的浮层继承工作台选择器。若传入外部 `container`（包括浮层自己的 container），该容器必须位于带 `data-surface="workbench"` 的主题祖先内；否则使用该目标作用域的外观。建议把 Portal 目标留在 Provider 内。

## 表面和组件职责

| 层级 | Token | 用途 / 默认效果 |
|---|---|---|
| 页面 | `--surface-page` | 冷浅底，点阵是独立背景层 |
| 内容面板 | `--surface-panel` / `--shadow-panel` | Card、指标、表格面板；1px 分隔与贴地阴影，不逐层凸起 |
| 控件 | `--surface-control` / `--shadow-control` / `--shadow-input` | 次要按钮微凸；输入框 1px 内凹与细边界 |
| 关键操作 | `--shadow-primary` | 紫色主按钮保留轻凸起，hover/active 有底色变化 |
| 浮层 | `--surface-overlay` / `--shadow-overlay` | 抽屉、Toast、菜单、提示、下拉列表；高于内容面板 |

旧 `--sh-*` 值不变，默认组件保留原视觉。上述语义 token 可在自己的主题样式中覆盖，不必重写全部阴影。

- **表格**：14px 正文、13px 表头、12px 辅助信息；单元格不添加阴影，hover 和 focus-within 使用浅冷底；容器可以横向滚动。
- **状态**：Badge / `.ds-tag` 为平面浅底文字，保留状态文字和颜色，不添加手形或按钮浮起效果。
- **操作**：`primary` 为主要操作，默认 Button 为有边界的次要操作，`ghost` 和 IconButton 为平面操作；展开按钮用 `ghost`，并维护 `aria-expanded` / `aria-controls`。
- **导航**：`aria-current="page"` 使用紫色侧标和浅底。TabsList 显式加 `.ds-tabs` 使用下划线；不加时保留分段控件语义外观，已有调用不变。
- **状态反馈**：hover 改底色/边界，active 改底色，focus-visible 为 2px 紫色外环；disabled 降低不透明度且取消阴影。`aria-disabled` 只声明语义，不自动拦截业务回调，按钮应优先使用原生 `disabled`。

## 文字层级

主题正文默认为 14px（继承字号，不强制覆盖宿主的局部排版）；`.ds-heading` 为 20px/600，页面标题可局部用 `--fs-26`；`.ds-text-muted` 为 13px，`.ds-text-small` 为 12px。`.ds-link` 保留链接下划线；`.ds-number` 使用正文系统字体的等宽数字，`.ds-mono` 用于编号或代码而非所有中文正文。

正文行高 1.55，单元格标题/说明 1.5。字体优先保留可用的 Noto Sans SC，随后 system-ui、Apple/Segoe UI、苹方、微软雅黑和通用 sans-serif；数字字体保留现有 JetBrains Mono 与系统 monospace 回退。无需在线字体请求。平台字形仍有差异，不要求像素一致。

## 通用组合示例

打开 [`examples/workbench.html`](../examples/workbench.html)：页面标题 + 四个紧凑指标 + Tabs + 筛选栏 + 原生数据表格。12 条通用条目可按名称/编号、负责人、状态视图过滤，支持键盘切换 Tabs、行展开、无结果状态和摘要弹层。

示例独有布局放在 `examples/workbench.css`：窄导航、紧凑上区、限定高度的表格滚动区与吸顶表头。**不随主题强制施加到消费页面**；指标是工作区统计，不随列表筛选变化。示例没有后端或真实批量操作。

## 验证与截图

```sh
npm run verify
bash tools/package-consumer.sh
node tools/screenshot.mjs --workbench
```

截图目录 `docs/screenshots/`，三个尺寸 `1280x800`、`1440x900`、`1920x1080`：

- `workbench-{尺寸}.png`：默认、禁用按钮、平面状态及信息层级。
- `workbench-focus-expanded-{尺寸}.png`：焦点与行展开。
- `workbench-overlay-{尺寸}.png`：浮层与焦点。

`--workbench` 不覆盖既有参考截图。验证包含默认外观回归、三尺寸溢出、字号、点阵、表面、对比度、hover/active/disabled、输入焦点、Tabs 键盘、筛选/空态/重置、展开与弹层 Escape 回焦。

本次本机 Chromium 实测：类型/构建通过，React 11 个测试通过，浏览器 70/70 通过；消费端由本地 tarball 安装后的类型/生产构建通过，打包 React 的 Dialog/Toast 表面、阴影、Escape 回焦及运行时无错误另经浏览器核查。三个尺寸的默认页/弹层 axe 检查无违规，9 张截图已逐张目视检查。工作台正文/标题对比度 14.23、辅助文字 5.69、状态文字 5.34–6.44、主按钮白字 4.54。打包消费脚本显式重装本地 tarball，避免同版本快照被旧 lockfile 缓存。

自动化不能替代屏幕阅读器、长时间真人使用和跨平台字体检查。未验证 Safari / Firefox、Windows 字体和真实大数据性能；没有执行提交、推送或发布。
