# React 组件（实验中）

React 层目前标记为**实验中**：导出与 API 正在扩充，尚未满足全部稳定组件验收标准。底层基于 React 18+ 与 Radix Primitives；框架无关 tokens、CSS 和原生 JS 入口继续独立可用。不要把实验中标记理解为所有组件均已稳定。

## 快速开始

```sh
npm install @self/ui-style react react-dom
```

```tsx
import { Button, DesignSystemProvider, FormField, Input } from '@self/ui-style/react';
import '@self/ui-style/react/style.css';

export function Example() {
  return <DesignSystemProvider>
    <FormField label="邮箱" htmlFor="email" required hint="用于接收通知">
      <Input id="email" type="email" autoComplete="email" />
    </FormField>
    <Button variant="primary">保存</Button>
  </DesignSystemProvider>;
}
```

`DesignSystemProvider` 建立局部 tokens 作用域，可设置 `className`、`style`、`density="compact"`、`locale` 与 `dotted`。Radix 浮层 portal 保留 Provider tokens；显式 `container` 可覆盖挂载位置，且应位于主题作用域内以继承定制变量。定制令牌时，在 Provider 的 `style` 上覆盖 CSS 自定义属性，例如 `style={{ '--c-accent': '#4f5f91' } as React.CSSProperties}`。

## 工作台变体

新增可选 `surface="workbench"`（默认 `default`），与已有 `density="compact"`、`dotted` 独立组合。`TabsList className="ds-tabs"` 区分内容导航与分段操作；其余组件 API 不变。`Badge` 为平面状态，行展开请用 `Button variant="ghost"` 并维护展开语义。原生表格仍不负责排序、虚拟化或数据请求。接入代码、Portal 作用域、文字工具类与组件效果见 [工作台说明](workbench.md)。

## 导出与状态

| 能力 | 导出 | 当前状态 | 备注 |
|---|---|---|---|
| 按钮与语义文本 | `Button`, `IconButton`, `ButtonGroup`, `Link`, `Text`, `Heading`, `Code`, `Kbd`, `Icon` | 实验中 | 原生属性、className、style、ref 透传 |
| 表单基础 | `Input`, `Textarea`, `NumberInput`, `SearchInput`, `Label`, `FormField`, `Fieldset` | 实验中 | FormField 将 required、错误与说明关联到单个直接子控件 |
| 选择与开关 | `Checkbox`, `RadioGroup`, `RadioGroupItem`, `Switch`, `Select*` | 实验中 | Radix 键盘交互；RadioGroup 需包在语义 Fieldset/legend 中 |
| 状态展示 | `Badge`, `Avatar`, `Spinner`, `Skeleton`, `Alert`, `EmptyState`, `ErrorState`, `Progress` | 实验中 | 静态展示组件无虚构受控状态 |
| 浮层 | `Dialog*`, `ConfirmDialog*`, `Drawer*`, `Tooltip*`, `Popover*`, `DropdownMenu*` | 实验中 | ConfirmDialog 用 Radix AlertDialog；其他基于 Dialog/Tooltip/Popover/DropdownMenu；使用 Provider 保持主题 |
| 组合框 | `Combobox` | 实验中 | 本地过滤、键盘上下/Enter/Escape、受控/非受控选值；异步与多选未实现 |
| 导航与布局 | `Tabs*`, `SegmentedControl`, `Accordion*`, `Pagination`, `Stack`, `Inline`, `Grid`, `Container`, `Card`, `Section`, `Toolbar`, `DescriptionList` | 实验中 | 基础组合，不绑定路由、数据请求或权限 |
| Toast | `ToastProvider`, `useToast` | 实验中 | `duration: 0` 表示常驻；`dismiss(id)` 显式关闭；action 点击不自动关闭 |
| 原生表格 | `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell` | 实验中 | 语义与横向滚动容器；排序、选择、分页、虚拟化未实现 |
| P0 缺口 | NumberInput 约束 API、异步表单生命周期/错误聚焦、Switch/Checkbox 全状态示例 | 未实现 | 尚无完整行为契约与可运行指南 |
| P1/P2 能力 | AppShell、Sidebar、Breadcrumb、DataTable、上传/日期/树等 | 未实现 | 不包含在 React 层首批组件中 |

Radix 原语公开的组件 API 详见其上游文档。此处只导出包入口明确列出的 API；不从 `src/` 内部路径导入。

## 浮层与 Toast

```tsx
<DesignSystemProvider>
  <ToastProvider>
    <Dialog>
      <DialogTrigger asChild><Button>打开</Button></DialogTrigger>
      <DialogContent aria-describedby="confirm-copy">
        <DialogTitle>确认操作</DialogTitle>
        <DialogDescription id="confirm-copy">操作可撤销。</DialogDescription>
        <ConfirmDialogActions onConfirm={save} />
      </DialogContent>
    </Dialog>
    <ToastExample />
  </ToastProvider>
</DesignSystemProvider>
```

```tsx
function ToastExample() {
  const { toast, dismiss } = useToast();
  function save() {
    const id = toast({ title: '正在保存', duration: 0, action: { label: '重试', onClick: retry } });
    // 完成/失败时由调用方更新或关闭提示
    dismiss(id);
  }
  return <Button onClick={save}>保存</Button>;
}
```

Dialog 的 Escape、焦点循环、背景隔离和恢复由 Radix 提供。多个 Dialog 的栈管理也由该原语处理。手写框架无关 `DS.drawer()` 保留给非 React 页面，支持 `destroy()` 清理监听。不要在同一浮层同时混用两套控制器。

## 缺口与兼容范围

稳定性状态仅使用：稳定、实验中、未实现、已弃用。当前 React 组件集整体为实验中。以下能力仍未实现：完整受控 Select 包装、DataTable、服务端排序/跨页选择、表单异步验证与提交生命周期、日期/时间/上传/树/命令面板、NumberInput 约束策略。虚拟表格与固定列未实现。支持 React 18+；Next.js 等 SSR 项目可导入组件模块，但需在客户端交互边界使用 Radix 交互组件。样式通过 CSS 入口显式加载，不自动注入。
