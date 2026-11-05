import React, { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@self/ui-style/react/style.css';
import '@self/ui-style/theme-dark.css';
import './demo.css';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Alert, Badge, Breadcrumbs, Button, Card, Combobox, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger,
  CommandPalette, DataTable, DateRangePicker, DesignSystemProvider, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, EmptyState, FileUpload, Form, FormField, Icon, Input,
  NavigationGroup, NavigationItem, Skeleton, Tabs, TabsContent, TabsList, TabsTrigger,
  Textarea, ToastProvider, Tree, Slider, useAsyncAction, useForm, useToast,
} from '@self/ui-style/react';

type Task = { id: string; name: string; owner: string; status: '进行中' | '已完成' | '待处理'; updated: string };
const tasks: Task[] = [
  { id: 'QA-1042', name: '登录与权限回归', owner: '林清', status: '进行中', updated: '2026-11-05 09:18' },
  { id: 'QA-1039', name: '订单结算全链路', owner: '周宁', status: '待处理', updated: '2026-11-04 16:42' },
  { id: 'QA-1024', name: '搜索相关性抽样评估', owner: '陈简', status: '已完成', updated: '2026-11-04 11:06' },
  { id: 'QA-1018', name: '跨端导航一致性检查', owner: '林清', status: '进行中', updated: '2026-11-03 17:28' },
  { id: 'QA-1007', name: '数据导出权限验证', owner: '许安', status: '待处理', updated: '2026-11-03 10:12' },
  { id: 'QA-0996', name: '审计日志检索体验', owner: '周宁', status: '已完成', updated: '2026-11-02 14:21' },
];
const columns = [
  { id: 'id', header: '编号', width: 110, pin: 'start' as const, cell: (row: Task) => <span className="ds-mono">{row.id}</span>, sortValue: (row: Task) => row.id, filterValue: (row: Task) => row.id },
  { id: 'name', header: '巡检任务', cell: (row: Task) => row.name, sortValue: (row: Task) => row.name, filterValue: (row: Task) => row.name },
  { id: 'owner', header: '负责人', cell: (row: Task) => row.owner, sortValue: (row: Task) => row.owner, filterValue: (row: Task) => row.owner },
  { id: 'status', header: '状态', cell: (row: Task) => <Badge tone={row.status === '已完成' ? 'success' : row.status === '待处理' ? 'warn' : 'info'}>{row.status}</Badge>, sortValue: (row: Task) => row.status, filterValue: (row: Task) => row.status },
  { id: 'updated', header: '最近更新', cell: (row: Task) => <time dateTime={row.updated.replace(' ', 'T')}>{row.updated}</time>, sortValue: (row: Task) => row.updated },
];
const longTasks: Task[] = Array.from({ length: 240 }, (_, index) => { const task = tasks[index % tasks.length]; return { ...task, id: `QA-${String(1200 - index).padStart(4, '0')}`, name: `${task.name} · 扩展示例 ${index + 1}` }; });
const dataTableSnippet = `<DataTable\n  label="巡检任务"\n  rows={tasks}\n  columns={columns}\n  getRowId={(row) => row.id}\n  selectable\n  stickyHeader\n  maxBodyHeight={480}\n  showColumnPicker\n  pageSize={5}\n/>`;
async function simulateUpload(_file: File, { signal, onProgress }: { signal: AbortSignal; onProgress: (progress: number) => void }) {
  for (const progress of [20, 40, 60, 80, 100]) {
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => { signal.removeEventListener('abort', cancel); resolve(); }, 110);
      const cancel = () => { window.clearTimeout(timer); reject(new DOMException('上传已取消', 'AbortError')); };
      signal.addEventListener('abort', cancel, { once: true });
      if (signal.aborted) cancel();
    });
    if (signal.aborted) throw new DOMException('上传已取消', 'AbortError');
    onProgress(progress);
  }
}

function DemoContent({ theme, onThemeChange }: { theme: 'light' | 'white' | 'dark'; onThemeChange: (theme: 'light' | 'white' | 'dark') => void }) {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [virtualDemo, setVirtualDemo] = useState(false);
  const [team, setTeam] = useState('quality');
  const [loading, setLoading] = useState(false);
  const [commandsOpen, setCommandsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [installTab, setInstallTab] = useState<'npm' | 'pnpm' | 'yarn'>('npm');
  const saveAction = useAsyncAction(async (shouldFail = false) => { await new Promise(resolve => window.setTimeout(resolve, 800)); if (shouldFail) throw new Error('保存失败，请检查必填字段。'); return '任务已保存'; });
  const projectForm = useForm({
    initialValues: { name: '风控看板', owner: '' },
    validate: values => ({ ...(values.name.trim() ? {} : { name: '请填写项目名称。' }), ...(values.owner.trim() ? {} : { owner: '请填写负责人。' }) }),
    onSubmit: async values => { await new Promise(resolve => window.setTimeout(resolve, 500)); toast({ title: '项目已创建', description: `${values.name} · ${values.owner}`, tone: 'success' }); },
  });
  const tableRows = virtualDemo ? longTasks : tasks;
  const filteredTasks = useMemo(() => tableRows.filter(row => `${row.id} ${row.name} ${row.owner} ${row.status}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [query, tableRows]);
  const copyDataTable = async () => {
    try { await navigator.clipboard.writeText(dataTableSnippet); toast({ title: '示例已复制', description: 'DataTable 用法已复制到剪贴板。', tone: 'success' }); }
    catch { toast({ title: '无法访问剪贴板', description: '请在安全来源中打开此 Demo 后重试。', tone: 'danger' }); }
  };
  const installCommands = { npm: 'npm install @self/ui-style', pnpm: 'pnpm add @self/ui-style', yarn: 'yarn add @self/ui-style' };
  const copyInstall = async () => {
    try { await navigator.clipboard.writeText(installCommands[installTab]); toast({ title: '安装命令已复制', description: installCommands[installTab], tone: 'success' }); }
    catch { toast({ title: '无法访问剪贴板', description: '请在安全来源中打开此 Demo 后重试。', tone: 'danger' }); }
  };
  const exportFiltered = () => {
    const csv = [['编号', '巡检任务', '负责人', '状态', '最近更新'], ...filteredTasks.map(row => [row.id, row.name, row.owner, row.status, row.updated])]
      .map(line => line.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = '方寸巡检任务.csv'; anchor.click(); URL.revokeObjectURL(url);
    toast({ title: '筛选结果已导出', description: `共 ${filteredTasks.length} 条任务。`, tone: 'success' });
  };
  const startLoading = () => { setLoading(true); window.setTimeout(() => setLoading(false), 1100); };

  const themeLabel = theme === 'dark' ? '深色' : theme === 'white' ? '纯白' : '浅色';
  const componentCategories = [
    ['all', '全部', '#components'], ['basic', '基础组件', '#basic'], ['form', '表单输入', '#form'],
    ['data', '数据展示', '#data'], ['feedback', '反馈提示', '#feedback'], ['navigation', '导航结构', '#navigation'], ['layout', '布局容器', '#layout'],
  ];

  return <div className="consumer-app">
    <header className="consumer-site-header">
      <a className="consumer-brand" href="#top" aria-label="方寸组件库首页" onClick={() => setActiveCategory('all')}><span className="consumer-mark">方</span><span><strong>方寸</strong><small>前端 UI 组件库</small></span></a>
      <nav className="consumer-primary-nav" aria-label="主导航"><a href="#components" aria-current="page">组件</a><a href="#quickstart">指南</a><a href="#themes">主题</a><a href="#feedback">工具</a><a href="#changelog">更新日志</a></nav>
      <form className="consumer-header-search" role="search" onSubmit={event => { event.preventDefault(); setCommandsOpen(true); }}><Icon name="search"/><Input aria-label="搜索组件和 API" placeholder="搜索组件、API、指南…" value={query} onChange={event => setQuery(event.currentTarget.value)} onKeyDown={event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setCommandsOpen(true); } }}/><kbd>⌘ K</kbd></form>
      <div className="consumer-header-theme" role="group" aria-label="选择主题">{(['light','white','dark'] as const).map(value => <Button key={value} size="sm" variant={theme === value ? 'secondary' : 'ghost'} aria-pressed={theme === value} aria-label={`切换${value === 'light' ? '浅色' : value === 'white' ? '纯白' : '暗色'}主题`} onClick={() => onThemeChange(value)}>{value === 'light' ? '浅色' : value === 'white' ? '纯白' : '暗色'}</Button>)}</div>
      <Button variant="primary" onClick={() => document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' })}>快速开始 <span aria-hidden="true">→</span></Button>
    </header>
    <nav className="consumer-category-nav" aria-label="组件分类">{componentCategories.map(([id, label, href]) => <a key={id} href={href} className={activeCategory === id ? 'is-active' : ''} aria-current={activeCategory === id ? 'location' : undefined} onClick={() => setActiveCategory(id)}>{label}</a>)}</nav>

    <main id="top" className="consumer-main">
      <section className="consumer-hero" aria-labelledby="page-title">
        <div className="consumer-hero-main"><p className="consumer-kicker">FANGCUN · UI SYSTEM</p><h1 id="page-title">方寸 · 前端 UI 组件库</h1><p className="consumer-hero-lead">面向中国产品与研发团队的高品质前端组件库，提供稳定、易用、可扩展的界面组件与实践。</p><div className="consumer-proof-points"><span><Icon name="activity"/>开箱即用</span><i/><span><Icon name="layers"/>一致体验</span><i/><span><Icon name="users"/>工程友好</span></div></div>
        <div className="consumer-hero-aside"><p>基于现代前端技术构建，覆盖常用业务场景，帮助团队高效搭建清晰、稳定、可维护的产品界面。</p><div className="consumer-control-state"><Button variant="primary" onClick={() => document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' })}>快速开始 <span aria-hidden="true">→</span></Button><Button onClick={() => setCommandsOpen(true)}>⌘ 命令面板</Button></div><span className="consumer-theme-caption">当前主题：{themeLabel}</span></div>
      </section>

      <section className="consumer-showcase-grid" id="components" aria-label="组件样例">
        <div className="consumer-showcase-column" id="basic">
          <section className="consumer-sample-section" aria-labelledby="button-title"><div className="consumer-sample-heading"><h2 id="button-title">按钮 <span>Button</span></h2><code>.ds-button</code></div><p>用于触发操作的核心控件，支持多种类型与状态。</p><div className="consumer-sample-row"><Button variant="primary">主要按钮</Button><Button>次要按钮</Button><Button variant="ghost">文字按钮</Button></div><div className="consumer-sample-row"><Button variant="primary" disabled>禁用状态</Button><Button loading loadingLabel="正在保存…">加载状态</Button><Button onClick={() => toast({ title: '操作成功', description: '按钮反馈已展示。', tone: 'success' })}>触发反馈</Button></div><div className="consumer-sample-row consumer-size-row"><Button size="lg" variant="secondary">大尺寸</Button><Button>中等尺寸</Button><Button size="sm">小尺寸</Button></div></section>
          <section className="consumer-sample-section" aria-labelledby="badge-title"><div className="consumer-sample-heading"><h2 id="badge-title">标签 <span>Badge</span></h2><code>.ds-tag</code></div><p>用于标记、分类与状态展示。</p><div className="consumer-sample-row consumer-badge-row"><Badge>默认</Badge><Badge tone="info">主要</Badge><Badge tone="success">成功</Badge><Badge tone="warn">警告</Badge><Badge tone="danger">危险</Badge></div><div className="consumer-sample-row"><Badge tone="info">进行中</Badge><Badge tone="success">已完成</Badge><Badge tone="danger">已失败</Badge></div></section>
          <section className="consumer-sample-section" aria-labelledby="input-title"><div className="consumer-sample-heading"><h2 id="input-title">输入框 <span>Input</span></h2><code>.ds-input</code></div><p>用于接收用户的文本输入，支持多种常见用法。</p><div className="consumer-input-grid"><FormField label="默认输入" htmlFor="sample-input"><Input id="sample-input" placeholder="请输入内容"/></FormField><FormField label="搜索输入" htmlFor="sample-search"><Input id="sample-search" type="search" placeholder="搜索组件…"/></FormField><FormField label="聚焦状态" htmlFor="sample-focus"><Input id="sample-focus" defaultValue="方寸 UI" className="consumer-force-focus"/></FormField><FormField label="禁用状态" htmlFor="sample-disabled"><Input id="sample-disabled" defaultValue="暂不可编辑" disabled/></FormField></div></section>
        </div>

        <div className="consumer-showcase-column" id="form">
          <section className="consumer-sample-section" aria-labelledby="select-title"><div className="consumer-sample-heading"><h2 id="select-title">选择器 <span>Combobox</span></h2><code>.ds-select</code></div><p>从下拉列表中选择单个选项，支持搜索和键盘操作。</p><FormField label="所属团队" htmlFor="team-select"><Combobox id="team-select" label="所属团队" options={[{ value: 'quality', label: '质量平台组' }, { value: 'design', label: '体验设计组' }, { value: 'disabled', label: '归档团队（不可选）', disabled: true }]} value={team} onValueChange={setTeam} name="team"/></FormField><div className="consumer-input-grid"><FormField label="搜索选项" htmlFor="team-search"><Combobox id="team-search" label="搜索团队" options={[{ value: 'quality', label: '质量平台组' }, { value: 'design', label: '体验设计组' }, { value: 'engineering', label: '前端工程组' }]} placeholder="搜索选项…"/></FormField><FormField label="禁用选项" htmlFor="disabled-combo"><Combobox id="disabled-combo" label="禁用选择器" options={[]} disabled placeholder="不可选"/></FormField></div></section>
          <section className="consumer-sample-section" id="navigation" aria-labelledby="tabs-title"><div className="consumer-sample-heading"><h2 id="tabs-title">标签页 <span>Tabs</span></h2><code>.ds-tabs</code></div><p>用于在同一页面内组织与切换内容。</p><Tabs defaultValue="overview"><TabsList aria-label="组件详情"><TabsTrigger value="overview">概览</TabsTrigger><TabsTrigger value="api">API</TabsTrigger><TabsTrigger value="example">示例</TabsTrigger><TabsTrigger value="history">更新记录</TabsTrigger></TabsList><TabsContent value="overview"><p>可访问的选项卡支持方向键切换与受控值。</p></TabsContent><TabsContent value="api"><p>通过 `value` 和 `onValueChange` 管理标签页状态。</p></TabsContent><TabsContent value="example"><p>组合内容、表单和表格作为分区。</p></TabsContent><TabsContent value="history"><p>方寸组件持续完善中。</p></TabsContent></Tabs></section>
          <section className="consumer-sample-section" id="feedback" aria-labelledby="toast-title"><div className="consumer-sample-heading"><h2 id="toast-title">消息提示 <span>Toast</span></h2><code>.ds-toast</code></div><p>用于轻量的全局反馈，不打断用户流程。</p><div className="consumer-toast-list"><Alert className="consumer-alert-success">操作成功：设置已保存</Alert><Alert className="consumer-alert-info">信息提示：草稿已保存</Alert><Alert className="consumer-alert-warn">存在未保存的修改</Alert><Alert className="consumer-alert-danger">操作失败，请稍后重试</Alert></div><Button size="sm" onClick={() => toast({ title: '操作成功', description: '这是一个轻量的全局反馈。', tone: 'success' })}>试试 Toast</Button></section>
        </div>

        <div className="consumer-showcase-column consumer-showcase-column-wide" id="data">
          <section className="consumer-sample-section consumer-table-sample" aria-labelledby="table-title"><div className="consumer-sample-heading"><h2 id="table-title">数据表格 <span>DataTable</span></h2><code>.ds-table</code></div><p>用于展示结构化数据，支持排序、选择、操作等。</p><div className="consumer-table-wrap"><DataTable label="团队任务示例" rows={filteredTasks} columns={[
            { id: 'name', header: '巡检任务', cell: (row: Task) => row.name, sortValue: (row: Task) => row.name },
            { id: 'owner', header: '负责人', cell: (row: Task) => row.owner, sortValue: (row: Task) => row.owner },
            { id: 'status', header: '状态', cell: (row: Task) => <Badge tone={row.status === '已完成' ? 'success' : row.status === '待处理' ? 'warn' : 'info'}>{row.status}</Badge>, sortValue: (row: Task) => row.status },
          ]} getRowId={row => row.id} getRowLabel={row => row.name} selectable selectedRowIds={selectedTaskIds} onSelectionChange={setSelectedTaskIds} pageSize={3}/></div><Button variant="ghost" size="sm" onClick={() => document.getElementById('full-table')?.scrollIntoView({ behavior: 'smooth' })}>查看完整表格示例 ↓</Button></section>
          <section className="consumer-sample-section" id="themes" aria-labelledby="theme-title"><div className="consumer-sample-heading"><h2 id="theme-title">主题对比</h2><span>浅色、纯白与黑金暗色</span></div><div className="consumer-theme-preview-grid">{(['light','white','dark'] as const).map(value => <div className={`consumer-theme-preview ds-theme${value === 'white' ? ' ds-theme--white' : value === 'dark' ? ' ds-theme--dark' : ''}`} key={value}><div className="consumer-theme-preview-dots"><i/><i/><i/></div><div className="consumer-theme-preview-bars"><b/><span/><span/></div><strong>{value === 'light' ? '浅色（Light）' : value === 'white' ? '纯白（White）' : '深色（Dark）'}</strong><Button size="sm" variant={theme === value ? 'primary' : 'secondary'} aria-pressed={theme === value} onClick={() => onThemeChange(value)}>{theme === value ? '当前主题' : '预览主题'}</Button></div>)}</div></section>
          <section className="consumer-sample-section consumer-install" id="quickstart" aria-labelledby="quickstart-title"><div className="consumer-sample-heading"><h2 id="quickstart-title">快速开始</h2><span>通过包管理器安装方寸，并引入样式即可使用。</span></div><div className="consumer-install-box"><div className="consumer-install-tabs" role="tablist" aria-label="包管理器">{(['npm','pnpm','yarn'] as const).map(value => <Button key={value} role="tab" aria-selected={installTab === value} size="sm" variant={installTab === value ? 'primary' : 'ghost'} onClick={() => setInstallTab(value)}>{value}</Button>)}</div><div className="consumer-install-code"><code>{installCommands[installTab]}</code><Button size="sm" onClick={() => void copyInstall()} aria-label="复制安装命令">复制</Button></div><p>在应用入口导入 `@self/ui-style/react/style.css`，开始组合 `.ds-` 组件。</p></div></section>
        </div>
      </section>

      <section className="consumer-deep-section" aria-label="更多组件示例">
        <div className="consumer-section-intro"><p className="consumer-kicker">COMPOSE REAL INTERFACES</p><h2>从单个控件，到完整工作流</h2><p>组件保留可控状态和原生语义，可以直接组成业务表单、数据页与反馈流程。</p></div>
        <div className="consumer-deep-grid">
          <section className="consumer-deep-panel" aria-labelledby="form-workflow-title"><div className="consumer-sample-heading"><h3 id="form-workflow-title">表单编排</h3><code>useForm</code></div><p>跨字段规则、错误提示和异步提交统一管理。</p><Form className="consumer-use-form" onSubmit={projectForm.handleSubmit} aria-busy={projectForm.isValidating || projectForm.isSubmitting || undefined}><FormField label="项目名称" htmlFor="project-name" required error={projectForm.errors.name}><Input id="project-name" value={projectForm.values.name} onChange={event => projectForm.setFieldValue('name', event.currentTarget.value)}/></FormField><FormField label="负责人" htmlFor="project-owner" required error={projectForm.errors.owner}><Input id="project-owner" value={projectForm.values.owner} onChange={event => projectForm.setFieldValue('owner', event.currentTarget.value)} placeholder="姓名或团队"/></FormField><div className="consumer-control-state"><Button type="submit" variant="primary" loading={projectForm.isValidating || projectForm.isSubmitting} loadingLabel={projectForm.isValidating ? '校验中…' : '正在创建…'}>创建项目</Button><Button type="button" variant="ghost" onClick={() => projectForm.reset()}>重置</Button></div><p role={projectForm.status === 'error' ? 'alert' : 'status'}>{projectForm.submitError ? String(projectForm.submitError) : `状态：${projectForm.status}`}</p></Form></section>
          <section className="consumer-deep-panel" id="full-table" aria-labelledby="full-table-title"><div className="consumer-sample-heading"><h3 id="full-table-title">完整 DataTable</h3><div className="consumer-control-state"><Button size="sm" onClick={() => setVirtualDemo(value => !value)}>{virtualDemo ? '返回分页' : '240 行虚拟滚动'}</Button><Button size="sm" onClick={startLoading}>模拟刷新</Button></div></div><div className="consumer-table-toolbar"><FormField label="筛选任务" htmlFor="task-search"><Input id="task-search" type="search" value={query} onChange={event => setQuery(event.currentTarget.value)} placeholder="编号、任务或负责人"/></FormField><Button size="sm" disabled={filteredTasks.length === 0} onClick={exportFiltered}>导出 CSV</Button></div><DataTable label="巡检任务" rows={filteredTasks} columns={columns} getRowId={row => row.id} getRowLabel={row => row.name} selectable selectedRowIds={selectedTaskIds} onSelectionChange={setSelectedTaskIds} selectionActions={<div className="consumer-control-state"><Button size="sm" onClick={() => toast({ title: `已归档 ${selectedTaskIds.length} 项`, tone: 'success' })}>批量归档</Button><Button size="sm" variant="ghost" onClick={() => setSelectedTaskIds([])}>清除选择</Button></div>} showColumnPicker pageSize={virtualDemo ? undefined : 4} stickyHeader maxBodyHeight={320} virtualize={virtualDemo} virtualRowHeight={48} loading={loading} emptyState={<EmptyState title="没有匹配的任务" description="换个关键词再试试。"/>}/><div className="consumer-code"><Button size="sm" variant="ghost" onClick={() => void copyDataTable()}>复制 DataTable 用法</Button><pre><code>{dataTableSnippet}</code></pre></div></section>
          <section className="consumer-deep-panel" aria-labelledby="extended-title"><div className="consumer-sample-heading"><h3 id="extended-title">日期、上传与树形选择</h3><code>DateRangePicker · FileUpload · Tree</code></div><p>原生日期约束、上传进度与键盘树导航可直接组合进表单。</p><DateRangePicker label="巡检时间范围" defaultValue={{ start: '2026-11-01', end: '2026-11-05' }}/><FormField label="覆盖率阈值" htmlFor="coverage-slider" hint="通过方向键调整数值。"><Slider id="coverage-slider" aria-label="覆盖率阈值" defaultValue={75} min={0} max={100} step={5} showValue/></FormField><FileUpload label="上传测试报告" accept=".pdf,.csv,.xlsx" multiple maxFiles={3} maxSize={10 * 1024 * 1024} uploadFile={simulateUpload}/><Tree label="项目目录" defaultExpandedIds={['workspace','design-system']} defaultSelectedId="tokens" nodes={[{ id: 'workspace', label: '质量工作台', children: [{ id: 'design-system', label: '设计系统', children: [{ id: 'tokens', label: 'Tokens' }, { id: 'components', label: '组件库' }] }, { id: 'reports', label: '测试报告' }] }, { id: 'archive', label: '历史归档', disabled: true }]}/></section>
          <section className="consumer-deep-panel" aria-labelledby="feedback-tools-title"><div className="consumer-sample-heading"><h3 id="feedback-tools-title">反馈与浮层</h3><code>Dialog · Menu · Accordion</code></div><div className="consumer-control-state"><Button onClick={() => toast({ title: '设置已保存', description: '工作区偏好已更新。', tone: 'success' })}>成功通知</Button><Button onClick={() => toast({ title: '同步暂不可用', description: '检查网络后重试。', tone: 'danger', duration: 0, action: { label: '重试', onClick: () => toast({ title: '已重新提交', tone: 'info' }) } })}>失败通知</Button><Dialog><DialogTrigger asChild><Button variant="primary">打开对话框</Button></DialogTrigger><DialogContent aria-describedby="dialog-copy"><DialogTitle>确认保存更改？</DialogTitle><DialogDescription id="dialog-copy">对话框支持焦点循环、Esc 关闭和回焦。</DialogDescription><div className="ds-dialog-actions"><Button variant="ghost">继续编辑</Button><Button variant="primary" onClick={() => toast({ title: '已确认保存', tone: 'success' })}>确认保存</Button></div></DialogContent></Dialog></div><DropdownMenu><DropdownMenuTrigger asChild><Button>更多组件操作</Button></DropdownMenuTrigger><DropdownMenuContent align="start"><DropdownMenuItem onSelect={() => toast({ title: '菜单操作已执行', tone: 'success' })}>查看操作</DropdownMenuItem><DropdownMenuItem onSelect={() => document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' })}>前往快速开始</DropdownMenuItem></DropdownMenuContent></DropdownMenu><Accordion type="single" collapsible defaultValue="api"><AccordionItem value="api"><AccordionTrigger>组件组合说明<span aria-hidden="true">⌄</span></AccordionTrigger><AccordionContent>为 Dialog、Select、Popover 和 Tooltip 使用 DesignSystemProvider，Portal 会沿用局部主题作用域。</AccordionContent></AccordionItem></Accordion><ContextMenu><ContextMenuTrigger asChild><div className="consumer-context-target" tabIndex={0}>右键或聚焦后打开上下文菜单</div></ContextMenuTrigger><ContextMenuContent><ContextMenuItem onSelect={() => toast({ title: '上下文操作', tone: 'success' })}>查看上下文操作</ContextMenuItem></ContextMenuContent></ContextMenu></section>
          <section className="consumer-deep-panel" id="layout" aria-labelledby="layout-title"><div className="consumer-sample-heading"><h3 id="layout-title">导航与布局</h3><code>NavigationGroup · Breadcrumbs</code></div><Breadcrumbs items={[{ label: '组件库', href: '#components' }, { label: '工作区', href: '#layout' }, { label: '概览' }]}/><div className="consumer-layout-preview"><aside><NavigationGroup label="工作区"><NavigationItem href="#layout" label="概览" icon={<Icon name="grid"/>} current/><NavigationItem href="#data" label="巡检任务" icon={<Icon name="activity"/>}/></NavigationGroup></aside><div><p>页面摘要和导航保持一致的间距与层级。</p><Skeleton style={{ height: 42 }}/><Skeleton style={{ height: 16, width: '72%' }}/></div></div><Button size="sm" variant="ghost" onClick={() => toast({ title: '页面骨架', description: '可将 SidebarLayout 与路由状态组合使用。', tone: 'info' })}>查看布局说明</Button></section>
        </div>
      </section>
      <footer className="consumer-footer" id="changelog"><span>方寸 · 前端 UI 组件库</span><span>React 18+ · TypeScript · `.ds-`</span><Button variant="ghost" size="sm" onClick={() => setCommandsOpen(true)}>打开命令面板</Button></footer>
    </main>
    <CommandPalette open={commandsOpen} onOpenChange={setCommandsOpen} items={[{ id: 'basic', label: '浏览基础组件', keywords: 'button 按钮 input badge', onSelect: () => document.getElementById('basic')?.scrollIntoView({ behavior: 'smooth' }) }, { id: 'data', label: '查看 DataTable', keywords: '表格 数据', onSelect: () => document.getElementById('data')?.scrollIntoView({ behavior: 'smooth' }) }, { id: 'form', label: '打开表单示例', keywords: '输入 form', onSelect: () => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }) }, { id: 'quickstart', label: '前往快速开始', keywords: '安装 npm', onSelect: () => document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' }) }, { id: 'theme', label: '切换下一个主题', keywords: '外观 暗色 纯白', onSelect: () => onThemeChange(theme === 'light' ? 'white' : theme === 'white' ? 'dark' : 'light') }]}/>
  </div>;
}

function App() {
  const [theme, setTheme] = useState<'light' | 'white' | 'dark'>('light');
  return <DesignSystemProvider theme={theme} dotted className="consumer"><ToastProvider><DemoContent theme={theme} onThemeChange={setTheme}/></ToastProvider></DesignSystemProvider>;
}

class DemoErrorBoundary extends React.Component<React.PropsWithChildren, { message?: string }> {
  state: { message?: string } = {};
  static getDerivedStateFromError(error: unknown) { return { message: error instanceof Error ? error.message : String(error) }; }
  componentDidCatch(error: Error) { console.error('Demo render failed', error); }
  render() { return this.state.message ? <main className="consumer-runtime-error" role="alert"><strong>组件演示遇到错误</strong><code>{this.state.message}</code><Button onClick={() => window.location.reload()}>重新加载</Button></main> : this.props.children; }
}

createRoot(document.getElementById('root')!).render(<StrictMode><DemoErrorBoundary><App/></DemoErrorBoundary></StrictMode>);
