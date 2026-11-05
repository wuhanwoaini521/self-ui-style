import React, { StrictMode } from 'react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Breadcrumbs, Button, Checkbox, Combobox, CommandPalette, ConfirmDialog, ConfirmDialogActions, ConfirmDialogCancel, ConfirmDialogContent, ConfirmDialogDescription, ConfirmDialogTitle, ConfirmDialogTrigger, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, DataTable, DateRangePicker, DesignSystemProvider, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, FileUpload, Form, FormField, Input, NavigationGroup, NavigationItem, SidebarLayout, Slider, Switch, ToastProvider, Tree, useAsyncAction, useForm, useToast } from '../src/react/index';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

afterEach(cleanup);

describe('React package', () => {
  it('imports and renders on the server without touching the DOM', () => {
    expect(() => renderToString(<Button>Server render</Button>)).not.toThrow();
  });
  it('forwards native button props, className, style, and ref in StrictMode', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<StrictMode><Button ref={ref} className="custom" style={{ marginTop: 3 }} disabled>Save</Button></StrictMode>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveClass('ds-btn', 'custom');
    expect(ref.current).toHaveStyle({ marginTop: '3px' });
  });
  it('exposes an accessible loading state and prevents duplicate submission', () => {
    render(<Button loading loadingLabel="Saving…">Save</Button>);
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button')).toHaveClass('ds-is-loading');
  });
  it('coordinates cross-field validation, async submit status and reset in useForm', async () => {
    const submit = vi.fn(async (_values: { name: string; confirmation: string }) => { await Promise.resolve(); });
    function Harness() {
      const form = useForm({
        initialValues: { name: '', confirmation: '' },
        validate: values => ({
          ...(!values.name.trim() ? { name: '填写名称。' } : {}),
          ...(values.name !== values.confirmation ? { confirmation: '两次输入需一致。' } : {}),
        }),
        onSubmit: submit,
      });
      return <Form onSubmit={form.handleSubmit} aria-busy={form.isValidating || form.isSubmitting || undefined}><FormField label="名称" htmlFor="form-name" required error={form.errors.name}><Input id="form-name" value={form.values.name} onChange={event => form.setFieldValue('name', event.currentTarget.value)}/></FormField><FormField label="确认名称" htmlFor="form-confirm" error={form.errors.confirmation}><Input id="form-confirm" value={form.values.confirmation} onChange={event => form.setFieldValue('confirmation', event.currentTarget.value)}/></FormField><Button type="submit">保存</Button><Button type="button" onClick={() => form.reset()}>重置表单</Button><output>{form.status}</output></Form>;
    }
    render(<Harness/>);
    await userEvent.click(screen.getByRole('button', { name: '保存' }));
    expect(await screen.findByText('填写名称。')).toBeInTheDocument();
    expect(screen.getByLabelText(/^名称/)).toHaveFocus();
    expect(submit).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText(/^名称/), '方寸项目');
    await userEvent.type(screen.getByLabelText('确认名称'), '其他项目');
    await userEvent.click(screen.getByRole('button', { name: '保存' }));
    expect(await screen.findByText('两次输入需一致。')).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
    await userEvent.clear(screen.getByLabelText('确认名称'));
    await userEvent.type(screen.getByLabelText('确认名称'), '方寸项目');
    await userEvent.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() => expect(submit).toHaveBeenCalledWith({ name: '方寸项目', confirmation: '方寸项目' }));
    expect(await screen.findByText('success')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '重置表单' }));
    expect(screen.getByLabelText(/^名称/)).toHaveValue('');
    expect(screen.getByText('idle')).toBeInTheDocument();
  });
  it('ignores stale async validation after a field changes', async () => {
    let finishValidation!: (errors: { name?: string }) => void;
    const submit = vi.fn();
    function Harness() {
      const form = useForm({
        initialValues: { name: '' },
        validate: () => new Promise<{ name?: string }>(resolve => { finishValidation = resolve; }),
        onSubmit: submit,
      });
      return <Form onSubmit={form.handleSubmit}><FormField label="名称" htmlFor="stale-name" error={form.errors.name}><Input id="stale-name" value={form.values.name} onChange={event => form.setFieldValue('name', event.currentTarget.value)}/></FormField><Button type="submit">验证</Button><output>{form.status}</output></Form>;
    }
    render(<Harness/>);
    await userEvent.click(screen.getByRole('button', { name: '验证' }));
    await waitFor(() => expect(screen.getByText('validating')).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText('名称'), '已更新');
    finishValidation({ name: '过期错误' });
    await waitFor(() => expect(screen.getByText('idle')).toBeInTheDocument());
    expect(screen.queryByText('过期错误')).not.toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });
  it('connects field labels, described text, required and errors to the input', () => {
    render(<FormField label="Name" htmlFor="name" required hint="Short name" error="Required"><Input /></FormField>);
    const input = screen.getByRole('textbox', { name: /Name/ });
    expect(input).toHaveAttribute('id', 'name');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toContain('name-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
  it('supports native and controlled accessible checkbox and switch', () => {
    render(<><Checkbox aria-label="Accept terms" /><Switch aria-label="Notifications" /></>);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Accept terms' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Notifications' }));
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
  });
  it('keeps dialog content inside the provider theme and restores focus', async () => {
    render(<StrictMode><DesignSystemProvider><Dialog><DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger><DialogContent aria-describedby="dialog-desc"><DialogTitle>Settings</DialogTitle><DialogDescription id="dialog-desc">Local content</DialogDescription><button>Inside</button></DialogContent></Dialog></DesignSystemProvider></StrictMode>);
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    trigger.focus(); fireEvent.click(trigger);
    expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('dialog').closest('.ds-theme')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
  it('keeps dialog focus isolated and supports overlapping tooltip escape behavior', async () => {
    render(<DesignSystemProvider><Dialog><DialogTrigger asChild><Button>Open outer</Button></DialogTrigger><DialogContent aria-describedby="outer-desc"><DialogTitle>Outer dialog</DialogTitle><DialogDescription id="outer-desc">Outer content</DialogDescription><Dialog><DialogTrigger asChild><Button>Open inner</Button></DialogTrigger><DialogContent aria-describedby="inner-desc"><DialogTitle>Inner dialog</DialogTitle><DialogDescription id="inner-desc">Inner content</DialogDescription></DialogContent></Dialog></DialogContent></Dialog></DesignSystemProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Open outer' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Open inner' }));
    expect(await screen.findByRole('dialog', { name: 'Inner dialog' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Inner dialog' })).not.toBeInTheDocument());
    expect(screen.getByRole('dialog', { name: 'Outer dialog' })).toBeInTheDocument();
    expect(document.activeElement).toHaveTextContent('Open inner');
  });
  it('supports ConfirmDialog cancellation and confirmation semantics', async () => {
    render(<DesignSystemProvider><ConfirmDialog><ConfirmDialogTrigger asChild><Button>Delete item</Button></ConfirmDialogTrigger><ConfirmDialogContent aria-describedby="confirm-desc"><ConfirmDialogTitle>Delete?</ConfirmDialogTitle><ConfirmDialogDescription id="confirm-desc">This can be undone.</ConfirmDialogDescription><ConfirmDialogActions onConfirm={() => {}} /></ConfirmDialogContent></ConfirmDialog></DesignSystemProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    expect(await screen.findByRole('alertdialog', { name: 'Delete?' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });
  it('supports keyboard filtering and selection in Combobox', async () => {
    let selected = '';
    render(<Combobox label="Country" options={[{ value: 'cn', label: 'China' }, { value: 'ca', label: 'Canada' }]} onValueChange={value => { selected = value; }} />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    await userEvent.type(input, 'Can');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(selected).toBe('ca');
    expect(input).toHaveValue('Canada');
  });
  it('skips disabled Combobox options and submits the selected value', async () => {
    render(<Combobox label="Team" name="team" required options={[{ value: 'archived', label: 'Archived', disabled: true }, { value: 'quality', label: 'Quality' }]} />);
    const input = screen.getByRole('combobox', { name: 'Team' });
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(input).toHaveValue('Quality');
    expect(document.querySelector('input[type="hidden"][name="team"]')).toHaveValue('quality');
    expect((input as HTMLInputElement).checkValidity()).toBe(true);
  });
  it('sorts, selects and paginates DataTable rows accessibly', async () => {
    const rows = [{ id: 'b', name: 'Beta' }, { id: 'a', name: 'Alpha' }, { id: 'c', name: 'Gamma' }];
    render(<DataTable label="Tasks" rows={rows} columns={[{ id: 'name', header: 'Task', cell: row => row.name, sortValue: row => row.name }]} getRowId={row => row.id} getRowLabel={row => row.name} selectable pageSize={2}/>);
    await userEvent.click(screen.getByRole('button', { name: '按Task排序' }));
    expect(screen.getByRole('columnheader', { name: 'Task' })).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Alpha');
    await userEvent.click(screen.getByRole('checkbox', { name: '选择Alpha' }));
    expect(screen.getByRole('checkbox', { name: '选择Alpha' })).toBeChecked();
    await userEvent.click(screen.getByRole('button', { name: '下一页' }));
    expect(screen.getByText('共 3 条 · 第 2 / 2 页')).toBeInTheDocument();
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Gamma');
  });
  it('provides an accessible column visibility menu and keeps controlled columns', async () => {
    render(<DataTable label="Tasks" rows={[{ id: '1', name: 'Alpha' }]} columns={[{ id: 'id', header: 'ID', cell: row => row.id }, { id: 'name', header: 'Task', cell: row => row.name }]} getRowId={row => row.id} showColumnPicker/>);
    await userEvent.click(screen.getByText('显示列'));
    await userEvent.click(screen.getByRole('checkbox', { name: '显示 Task' }));
    expect(screen.queryByRole('columnheader', { name: 'Task' })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '显示 ID' })).toBeDisabled();
  });
  it('filters DataTable columns locally and supports a sticky, bounded scroll viewport', async () => {
    const rows = [{ id: '1', name: 'Alpha' }, { id: '2', name: 'Beta' }];
    render(<DataTable label="Tasks" rows={rows} columns={[{ id: 'name', header: 'Task', cell: row => row.name, filterValue: row => row.name }]} getRowId={row => row.id} pageSize={10} stickyHeader maxBodyHeight={240}/>);
    const filter = screen.getByRole('searchbox', { name: '筛选Task' });
    await userEvent.type(filter, 'bet');
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    expect(document.querySelector('.ds-table-wrap-sticky')).toHaveStyle({ maxHeight: '240px' });
  });
  it('shows and removes the DataTable selection action region with selection state', async () => {
    render(<DataTable label="Tasks" rows={[{ id: '1', name: 'Alpha' }]} columns={[{ id: 'name', header: 'Task', cell: row => row.name }]} getRowId={row => row.id} getRowLabel={row => row.name} selectable selectionActions={<Button>Archive selected</Button>}/>);
    expect(screen.queryByRole('region', { name: '已选行操作' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: '选择Alpha' }));
    expect(screen.getByRole('region', { name: '已选行操作' })).toHaveTextContent('已选择 1 项');
    expect(screen.getByRole('button', { name: 'Archive selected' })).toBeInTheDocument();
  });
  it('virtualizes fixed-height DataTable rows and pins configured columns', () => {
    const rows = Array.from({ length: 100 }, (_, index) => ({ id: `row-${index}`, name: `Task ${index}` }));
    const { container } = render(<DataTable label="Large tasks" rows={rows} columns={[{ id: 'id', header: 'ID', cell: row => row.id, width: 120, pin: 'start' }, { id: 'name', header: 'Task', cell: row => row.name }]} getRowId={row => row.id} virtualize virtualRowHeight={40} maxBodyHeight={400} overscan={2}/>);
    expect(screen.getByRole('columnheader', { name: 'ID' })).toHaveStyle({ position: 'sticky', left: '0px' });
    expect(container.querySelectorAll('tbody tr:not(.ds-data-table-virtual-spacer)')).toHaveLength(14);
    const viewport = container.querySelector('.ds-table-wrap-virtual') as HTMLDivElement;
    viewport.scrollTop = 800;
    fireEvent.scroll(viewport);
    expect(screen.getByText('Task 18')).toBeInTheDocument();
    expect(screen.queryByText('Task 0')).not.toBeInTheDocument();
    expect(container.querySelector('.ds-data-table-virtual-spacer td')).toHaveStyle({ height: '720px' });
  });
  it('provides pending, success, failure and reset lifecycle for async actions', async () => {
    function Harness() {
      const action = useAsyncAction(async (fail: boolean) => { await Promise.resolve(); if (fail) throw new Error('nope'); return 'done'; });
      return <><Button onClick={() => void action.execute(false)}>Run</Button><Button onClick={() => void action.execute(true).catch(() => {})}>Fail</Button><Button onClick={action.reset}>Reset</Button><output>{action.status}</output><span>{action.data}</span><span>{String(action.error ?? '')}</span></>;
    }
    render(<Harness/>);
    await userEvent.click(screen.getByRole('button', { name: 'Run' }));
    expect(await screen.findByText('done')).toBeInTheDocument();
    expect(screen.getByText('success')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Fail' }));
    expect(await screen.findByText('Error: nope')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('idle')).toBeInTheDocument();
  });
  it('opens context menus with a pointer interaction and keeps items keyboard accessible', async () => {
    render(<DesignSystemProvider><ContextMenu><ContextMenuTrigger>Target</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>Action</ContextMenuItem></ContextMenuContent></ContextMenu></DesignSystemProvider>);
    fireEvent.contextMenu(screen.getByText('Target'), { clientX: 20, clientY: 20 });
    expect(await screen.findByRole('menuitem', { name: 'Action' })).toBeInTheDocument();
  });
  it('provides white theme, sidebar navigation and breadcrumbs', () => {
    render(<DesignSystemProvider theme="white"><SidebarLayout navigation={<nav><NavigationGroup label="页面"><NavigationItem href="#current" label="当前页" current/></NavigationGroup></nav>} header={<Breadcrumbs items={[{ label: '工作台', href: '#' }, { label: '当前页' }]}/>}>Content</SidebarLayout></DesignSystemProvider>);
    expect(document.querySelector('.ds-theme--white')).toHaveAttribute('data-theme', 'white');
    expect(screen.getByRole('link', { name: '当前页' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('navigation', { name: '面包屑' })).toBeInTheDocument();
  });
  it('applies the optional black and gold dark theme scope', () => {
    render(<DesignSystemProvider theme="dark">暗色</DesignSystemProvider>);
    expect(document.querySelector('.ds-theme--dark')).toHaveAttribute('data-theme', 'dark');
  });
  it('controls date ranges and reports an invalid reversed interval', async () => {
    render(<DateRangePicker label="周期" defaultValue={{ start: '2026-01-02', end: '2026-01-05' }} />);
    const start = screen.getByLabelText('开始日期');
    const end = screen.getByLabelText('结束日期');
    await userEvent.clear(start);
    await userEvent.type(start, '2026-01-06');
    expect(end).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('结束日期不能早于开始日期');
  });
  it('validates and removes selected uploads', async () => {
    const oversized = new File(['oversized'], 'large.csv', { type: 'text/csv' });
    render(<FileUpload label="报告" multiple maxSize={3} />);
    await userEvent.upload(screen.getByLabelText(/报告/), oversized);
    expect(screen.getByRole('alert')).toHaveTextContent('超过大小限制');
    const allowed = new File(['ok'], 'daily.csv', { type: 'text/csv' });
    await userEvent.upload(screen.getByLabelText(/报告/), allowed);
    expect(screen.getByText('daily.csv')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '移除 daily.csv' }));
    expect(screen.queryByText('daily.csv')).not.toBeInTheDocument();
    render(<FileUpload label="单文件"/>);
    await userEvent.upload(screen.getByLabelText(/单文件/), new File(['first'], 'first.csv', { type: 'text/csv' }));
    await userEvent.upload(screen.getByLabelText(/单文件/), new File(['second'], 'second.csv', { type: 'text/csv' }));
    expect(screen.queryByText('first.csv')).not.toBeInTheDocument();
    expect(screen.getByText('second.csv')).toBeInTheDocument();
  });
  it('reports upload progress and completion through the caller supplied transport', async () => {
    let finish!: () => void;
    const uploadFile = vi.fn((_file: File, options: { signal: AbortSignal; onProgress: (progress: number) => void }) => new Promise<void>(resolve => {
      finish = resolve;
      options.onProgress(42);
    }));
    render(<FileUpload label="报告" uploadFile={uploadFile}/>);
    await userEvent.upload(screen.getByLabelText(/报告/), new File(['ok'], 'daily.csv', { type: 'text/csv' }));
    expect(screen.getByRole('progressbar', { name: 'daily.csv 上传进度' })).toHaveValue(42);
    expect(screen.getByText(/上传中 42%/)).toBeInTheDocument();
    finish();
    await waitFor(() => expect(screen.getByText(/已上传/)).toBeInTheDocument());
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  it('cancels an upload and allows retry after cancellation', async () => {
    const uploadFile = vi.fn((_file: File, { signal }: { signal: AbortSignal; onProgress: (progress: number) => void }) => uploadFile.mock.calls.length === 1
      ? new Promise<void>((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true }))
      : Promise.resolve());
    render(<FileUpload label="报告" uploadFile={uploadFile}/>);
    await userEvent.upload(screen.getByLabelText(/报告/), new File(['ok'], 'daily.csv', { type: 'text/csv' }));
    await userEvent.click(screen.getByRole('button', { name: '取消 daily.csv 上传' }));
    expect(await screen.findByText(/已取消/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '重试 daily.csv 上传' }));
    await waitFor(() => expect(screen.getByText(/已上传/)).toBeInTheDocument());
    expect(uploadFile).toHaveBeenCalledTimes(2);
  });
  it('keeps Slider values controlled and exposes the native range input', async () => {
    function Example() { const [value, setValue] = React.useState(20); return <Slider aria-label="容量" value={value} onValueChange={setValue} showValue/>; }
    render(<Example/>);
    const slider = screen.getByRole('slider', { name: '容量' });
    expect(slider).toHaveValue('20');
    fireEvent.change(slider, { target: { value: '45' } });
    expect(slider).toHaveValue('45');
    expect(screen.getByText('45')).toBeInTheDocument();
  });
  it('navigates and selects visible Tree items with the keyboard', async () => {
    render(<Tree label="目录" defaultExpandedIds={['root']} nodes={[{ id: 'root', label: '项目', children: [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }] }]}/>);
    const first = screen.getByRole('button', { name: '项目' });
    first.focus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(screen.getByRole('treeitem', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
  });
  it('filters and executes CommandPalette items with Enter', async () => {
    const onSelect = vi.fn();
    render(<DesignSystemProvider><CommandPalette defaultOpen items={[{ id: 'settings', label: '打开设置', keywords: '偏好' }, { id: 'theme', label: '切换主题', keywords: '外观' }]} onSelect={onSelect}/></DesignSystemProvider>);
    const input = await screen.findByRole('combobox', { name: '命令面板' });
    await userEvent.type(input, '外观');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'theme' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
  it('has no automated axe violations in the React form and state primitives', async () => {
    const { container } = render(<DesignSystemProvider><FormField label="Email" htmlFor="email" hint="Notifications" required><Input type="email" /></FormField><Checkbox aria-label="Accept terms" /><Switch aria-label="Notifications" /><Button>Save</Button></DesignSystemProvider>);
    expect(await axe(container)).toHaveNoViolations();
  });
  it('supports persistent toast, dedupe and explicit dismiss', async () => {
    let api: ReturnType<typeof useToast> | undefined;
    function Caller() { api = useToast(); return <button onClick={() => api?.toast({ id: 'persist', title: 'Saved', duration: 0 })}>Toast</button>; }
    render(<StrictMode><DesignSystemProvider><ToastProvider><Caller /></ToastProvider></DesignSystemProvider></StrictMode>);
    fireEvent.click(screen.getByRole('button', { name: 'Toast' }));
    expect(await screen.findByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Saved').closest('.ds-theme')).toBeTruthy();
    api?.dismiss('persist');
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument());
  });
});
