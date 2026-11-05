# React 组件 API

方寸提供 React 18+ 与 TypeScript 组件入口，视觉和交互沿用 `.ds-` 类与方寸 tokens。组件层仍标记为**实验中**：API 已覆盖常见中后台基础场景；数据请求与缓存、自定义日期日历、上传传输进度仍由业务层组合。React API 不绑定路由、请求客户端或全局状态库。

## 安装与主题

```sh
npm install @self/ui-style react react-dom
```

```tsx
import { Button, DesignSystemProvider, FormField, Input } from '@self/ui-style/react';
import '@self/ui-style/react/style.css';

export function Example() {
  return <DesignSystemProvider dotted>
    <FormField label="邮箱" htmlFor="email" required hint="用于接收通知">
      <Input id="email" type="email" autoComplete="email" />
    </FormField>
    <Button variant="primary">保存</Button>
  </DesignSystemProvider>;
}
```

`DesignSystemProvider` 提供局部 tokens、Portal 容器和主题作用域：

```tsx
<DesignSystemProvider theme="white" density="compact" dotted locale="zh-CN">
  <App />
</DesignSystemProvider>
```

`theme` 可选 `light`（方寸浅色，默认）、`white`（高明度纯白）或 `dark`（黑金暗色）。`light/white` 随 React 样式入口提供；切换至暗色前需额外导入 `@self/ui-style/theme-dark.css`。框架无关项目先导入 `@self/ui-style/theme.css`，再按需导入 `theme-white.css` 或 `theme-dark.css`。按 `className` 或 `style` 覆盖局部 CSS 变量，例如 `style={{ '--c-accent': '#4f5f91' } as React.CSSProperties}`。Provider 内的 Dialog、Toast、Select、Popover、Tooltip 和菜单 Portal 会继承主题作用域；`container` 可指定另一个挂载节点。

## 组件目录

| 分类 | 公开导出 | API 说明 |
|---|---|---|
| 按钮与内容 | `Button`, `IconButton`, `ButtonGroup`, `Link`, `Text`, `Heading`, `Code`, `Kbd`, `Icon`, `Divider` | 原生属性、`className`、`style` 和 ref 透传；Button 支持 `variant`、`size`、`loading`、`loadingLabel` |
| 表单 | `Form`, `FormField`, `useForm`, `Input`, `NumberInput`, `SearchInput`, `Textarea`, `Label`, `Fieldset`, `Checkbox`, `RadioGroup`, `RadioGroupItem`, `Switch`, `Select*`, `Combobox`, `DateRangePicker`, `FileUpload`, `Slider` | useForm 管理字段值、同步/异步跨字段校验、字段错误、提交状态、失败和重置；原生控件保留浏览器约束 |
| 表格 | `Table*`, `DataTable` | 原生语义表格；DataTable 支持排序、逐列筛选、行选择、批量操作区、分页、列显隐、固定列、固定行高虚拟滚动、加载、错误、空状态和 sticky header |
| 导航与布局 | `SidebarLayout`, `NavigationGroup`, `NavigationItem`, `Breadcrumbs`, `Tabs*`, `SegmentedControl`, `Accordion*`, `Pagination`, `Stack`, `Inline`, `Grid`, `Container`, `Card`, `Section`, `Toolbar`, `DescriptionList` | 语义布局积木，不绑定路由；链接与选中状态由调用方提供 |
| 树与命令 | `Tree`, `CommandPalette` | Tree 支持受控选中/展开和方向键导航；CommandPalette 支持受控开合、过滤和键盘选择 |
| 状态与反馈 | `Badge`, `Avatar`, `Spinner`, `Skeleton`, `Progress`, `Alert`, `EmptyState`, `ErrorState`, `ToastProvider`, `useToast` | 状态色由方寸 tokens 提供；错误恢复动作和业务请求由调用方实现 |
| 浮层 | `Dialog*`, `ConfirmDialog*`, `Drawer*`, `Tooltip*`, `Popover*`, `DropdownMenu*`, `ContextMenu*` | 基于 Radix 管理焦点、Escape、键盘导航和 ARIA 状态；Drawer 复用 Dialog 行为 |
| 主题与状态工具 | `DesignSystemProvider`, `OverlayProvider`, `useControllableState`, `useAsyncAction` | 局部主题、Overlay portal 容器、受控/非受控状态与异步动作生命周期 |

API 按组件组合导出，调用方可以直接使用 HTML/React props、自定义子节点和 `.ds-*` 类，不需要扩展组件内部实现。没有公开导出的内部文件不属于稳定入口。

## DataTable

列定义由调用方提供 cell renderer 和可选排序值；行 ID 必须稳定且唯一。

```tsx
import { DataTable, Badge, Button } from '@self/ui-style/react';

type Task = { id: string; name: string; owner: string; status: string };
const columns = [
  { id: 'name', header: '任务', cell: (row: Task) => row.name, sortValue: (row: Task) => row.name, filterValue: (row: Task) => row.name },
  { id: 'owner', header: '负责人', cell: (row: Task) => row.owner, sortValue: (row: Task) => row.owner, filterValue: (row: Task) => row.owner },
  { id: 'status', header: '状态', cell: (row: Task) => <Badge>{row.status}</Badge> },
];
const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

<DataTable
  label="巡检任务"
  rows={tasks}
  columns={columns}
  getRowId={(row) => row.id}
  getRowLabel={(row) => row.name}
  selectable
  selectedRowIds={selectedRowIds}
  onSelectionChange={setSelectedRowIds}
  selectionActions={selectedRowIds.length ? <Button onClick={archiveSelected}>批量归档</Button> : null}
  stickyHeader
  maxBodyHeight={480}
  pageSize={20}
  loading={loading}
  error={error}
  emptyState={<p>没有匹配结果。</p>}
/>
```

- 排序：传入 `sort` + `onSortChange` 进入受控模式，或用 `defaultSort`。只有定义 `sortValue` 的列可排序；默认在当前 `rows` 上排序。`manualSorting` 表示数据已由服务端排序。
- 分页：`page` + `onPageChange` 受控，`defaultPage` 非受控；`pageSize` 启用分页。默认在本地切片；服务端模式传入 `totalCount`、`manualPagination`，并在 `onPageChange` 中请求对应页。
- 选择：`selectable` 显示本页全选和逐行勾选。`selectedRowIds` + `onSelectionChange` 受控，或使用 `defaultSelectedRowIds`。
- 列显隐：`showColumnPicker` 显示原生 details/checkbox 列菜单并保证至少保留一列；受控模式传 `columnVisibility` + `onColumnVisibilityChange`，非受控模式传 `defaultColumnVisibility`。单列可设 `hideable: false`。
- 筛选：列定义可提供 `filterValue(row)` 显示逐列搜索框；`filters` + `onFiltersChange` 受控，或 `defaultFilters` 非受控。本地默认包含匹配；`manualFiltering` 留给服务端筛选。筛选会回到第一页。
- 长表：`stickyHeader` 固定表头，`maxBodyHeight` 设置滚动视口高度；不传高度时表格自然撑开。`selectionActions` 在至少选中一行时显示批量操作区。
- 固定列：列定义可设置 `pin: 'start' | 'end'`；固定列建议显式设置 `width`，并将 start/end 列分别放在相应边缘。选择列在横向滚动时自动固定在最左侧。
- 虚拟行：对大量且行高一致的数据设置 `virtualize`，并通过 `virtualRowHeight`、`overscan` 调整估算和预渲染数量。虚拟模式限定为单行内容，超出高度的 cell 内容会裁切；可变行高数据请使用分页。
- `loading` 保留当前行并提供状态播报；`error` 使用 alert 区域；无行且非加载时显示 `emptyState`。
- 服务端请求、筛选算子和数据缓存仍由业务层提供。

## 日期范围、文件与滑块

```tsx
<DateRangePicker label="巡检周期" value={range} onValueChange={setRange} min="2026-01-01" max="2026-12-31" error={dateError} />
<FileUpload label="测试报告" accept=".pdf,.csv,.xlsx" multiple maxFiles={3} maxSize={10 * 1024 * 1024} files={files} onFilesChange={setFiles} />
<Slider aria-label="覆盖率阈值" value={threshold} onValueChange={setThreshold} min={0} max={100} step={5} showValue />
```

`DateRangePicker` 使用浏览器原生日期控件，值格式为 `YYYY-MM-DD`，并校验结束日期不早于开始日期。`FileUpload` 负责选择、拖放、客户端大小/数量限制和可控文件列表。传入 `uploadFile(file, { signal, onProgress })` 后，会自动上传新文件并显示进度、完成、失败/取消状态；调用方仍负责实现具体请求与服务端进度回调。失败或取消的文件可重试，移除文件或卸载组件会中止请求。`Slider` 继承原生 range 键盘、禁用和约束属性。

```tsx
<FileUpload
  label="测试报告"
  multiple
  maxFiles={3}
  maxSize={10 * 1024 * 1024}
  uploadFile={async (file, { signal, onProgress }) => {
    await uploadToService(file, { signal, onProgress });
  }}
/>
```

## Tree 与 CommandPalette

```tsx
<Tree label="项目目录" nodes={nodes} expandedIds={expanded} onExpandedIdsChange={setExpanded} selectedId={selectedId} onSelectedIdChange={setSelectedId} />
<CommandPalette open={open} onOpenChange={setOpen} items={commands} onSelect={runCommand} />
```

Tree 节点使用稳定唯一的 `id`，左右方向键展开/收起，方向键上下和 Home/End 浏览，Enter/Space 选择。CommandPalette 条目支持 `keywords`、`disabled` 和逐项 `onSelect`；当前不注册全局快捷键，也不管理路由或权限。

## 异步动作与右键菜单

`useAsyncAction(action)` 返回 `status`（`idle | pending | success | error`）、`data`、`error`、`pending`、`execute(...args)` 和 `reset()`。`execute` 会保留 Promise 的返回值并在失败时继续 reject，调用处可用 `catch` 处理；旧请求晚到时不会覆盖较新动作或 reset 后的状态。

```tsx
const save = useAsyncAction(saveTask);
<Button loading={save.pending} onClick={() => void save.execute(task).catch(() => {})}>保存</Button>
{save.status === 'error' && <Alert role="alert">{String(save.error)}</Alert>}
```

`ContextMenu` / `ContextMenuTrigger` / `ContextMenuContent` / `ContextMenuItem` 提供鼠标右键和键盘菜单键打开、方向键选择、Escape 关闭及焦点返回；菜单操作仍由调用方提供。

## 表单与可控状态

```tsx
<FormField label="团队" htmlFor="team" required hint="可搜索团队名" error={error}>
  <Combobox
    id="team"
    name="team"
    label="团队"
    options={teams}
    value={team}
    onValueChange={setTeam}
    onOpenChange={setOpen}
  />
</FormField>
```

`FormField` 将 label、required、error 和 hint 关联到单个直接子控件，并保留子控件已有的 `aria-describedby` / `aria-invalid`。`Combobox` 支持 `value` / `defaultValue`、`onValueChange`、`open` / `defaultOpen`、`onOpenChange`、禁用项、无结果文案和原生 name 表单值；键盘包括上下移动、Home/End、Enter、Escape 和 Tab。`NumberInput` 透传 `min`、`max`、`step` 等浏览器约束。

`Form` 默认启用 `noValidate`，由 `useForm` 的同步/异步校验统一控制提交；传入 `noValidate={false}` 可恢复浏览器原生约束校验。`useForm` 提供表单级值、校验、提交和重置生命周期；校验函数可同步或异步返回字段错误，并适合表达跨字段规则。提交时先校验，再进入 `submitting`；成功为 `success`，校验或请求异常为 `error`。校验失败后会聚焦第一个带 `aria-invalid="true"` 的字段。字段编辑和 `reset()` 会让未完成的校验/提交结果失效；`setFieldError` / `setErrors` 可用于映射服务端字段错误。组件不强制绑定具体 schema 库，也不自动将某种服务端错误协议映射到字段。

```tsx
const form = useForm({
  initialValues: { password: '', confirmation: '' },
  validate: values => values.password === values.confirmation
    ? {}
    : { confirmation: '两次输入需一致。' },
  onSubmit: async values => savePassword(values),
});

<Form onSubmit={form.handleSubmit} aria-busy={form.isValidating || form.isSubmitting || undefined}>
  <FormField label="确认密码" htmlFor="confirmation" error={form.errors.confirmation}>
    <Input id="confirmation" value={form.values.confirmation}
      onChange={event => form.setFieldValue('confirmation', event.currentTarget.value)} />
  </FormField>
  <Button type="submit" loading={form.isValidating || form.isSubmitting}>保存</Button>
</Form>
```

```tsx
<Button variant="primary" loading={saving} loadingLabel="正在保存…" onClick={save}>
  保存
</Button>
```

加载时 Button 设置 `aria-busy` 并禁用重复触发。其他禁用/错误状态沿用原生 `disabled`、`aria-invalid` 和 FormField 的 `error` 属性。

## 导航、反馈与浮层

```tsx
<SidebarLayout
  navigation={<nav aria-label="工作区">
    <NavigationGroup label="管理">
      <NavigationItem href="/tasks" label="巡检任务" current />
    </NavigationGroup>
  </nav>}
  header={<Breadcrumbs items={[{ label: '工作区', href: '/' }, { label: '巡检任务' }]} />}
>
  <DataTable {...tableProps} />
</SidebarLayout>
```

`NavigationItem` 只处理当前链接语义，不做路由跳转或权限裁决。`SidebarLayout` 负责侧栏、页头和主要内容的响应式骨架。

```tsx
<DesignSystemProvider>
  <ToastProvider>
    <Feature />
  </ToastProvider>
</DesignSystemProvider>

function Feature() {
  const { toast, dismiss, update } = useToast();
  const id = toast({ title: '正在保存', duration: 0 });
  // 请求完成后：update(id, { title: '已保存', tone: 'success', duration: 6000 })
  // 或 dismiss(id)
  return null;
}
```

Toast 的 `tone` 为 `info | success | danger`；`duration: 0` 表示常驻。Dialog 的 Escape、焦点循环、背景隔离与关闭回焦由 Radix 提供。`ConfirmDialog` 使用 alertdialog 语义；不要在同一浮层同时混用 React Radix 与 `DS.drawer()`。

## 主题适配与服务端渲染

- React 支持 React 18+ / TypeScript。SSR 可导入静态组件；交互组件应在客户端边界中挂载。
- CSS 必须显式加载。框架无关 `.ds-*` 类同样要位于 `.ds-theme` 容器内。
- 根级 token 不写入 `:root`；多品牌页面可在各自 Provider 上传入不同 CSS 变量。
- 深色样式通过独立的 `theme-dark.css` 文件接入；交互 Demo 重点展示方寸浅色和纯白，暗色仍需补齐并验证全组件对比度。

更多框架无关示例见 [`integration.md`](integration.md)，组件设计映射见 [`component-inventory.md`](component-inventory.md)，可操作 React Demo 在 [`examples/react-consumer`](../examples/react-consumer/)。
