import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@self/ui-style/react/style.css';
import { Button, Card, DesignSystemProvider, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, FormField, Input, ToastProvider, useToast, ConfirmDialog, ConfirmDialogTrigger, ConfirmDialogContent, ConfirmDialogTitle, ConfirmDialogDescription, ConfirmDialogActions, Combobox, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@self/ui-style/react';

function Demo() {
  const { toast } = useToast();
  return <Card>
      <h1>团队成员</h1><p>中性消费页面：通过已打包的公开 exports 加载组件。</p>
      <FormField label="成员名称" htmlFor="member" hint="支持较长的中文姓名" required><Input placeholder="输入成员名称" /></FormField>
      <FormField label="团队" htmlFor="team"><Combobox id="team" name="team" required label="团队搜索" options={[{ value: 'core', label: '核心团队' }, { value: 'design', label: '设计团队' }]} /></FormField>
      <Table aria-label="成员"><TableHead><TableRow><TableHeader scope="col">姓名</TableHeader><TableHeader scope="col">团队</TableHeader></TableRow></TableHead><TableBody><TableRow><TableCell>林清</TableCell><TableCell>核心团队</TableCell></TableRow></TableBody></Table>
      <Button variant="primary" onClick={() => toast({ title: '已保存', description: '设置已更新。' })}>保存设置</Button>
      <ConfirmDialog><ConfirmDialogTrigger asChild><Button>取消邀请</Button></ConfirmDialogTrigger><ConfirmDialogContent aria-describedby="confirm-copy"><ConfirmDialogTitle>确认取消邀请？</ConfirmDialogTitle><ConfirmDialogDescription id="confirm-copy">此演示不连接服务端。</ConfirmDialogDescription><ConfirmDialogActions /></ConfirmDialogContent></ConfirmDialog>
      <Dialog>
        <DialogTrigger asChild><Button>查看说明</Button></DialogTrigger>
        <DialogContent aria-describedby="desc"><DialogTitle>组件运行正常</DialogTitle><DialogDescription id="desc">主题、局部浮层和键盘 Escape 均由消费包提供。</DialogDescription></DialogContent>
      </Dialog>
    </Card>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><DesignSystemProvider dotted surface="workbench" density="compact" className="consumer" style={{ maxWidth: 900, margin: '24px auto', padding: 24 }}><ToastProvider><Demo /></ToastProvider></DesignSystemProvider></StrictMode>);
