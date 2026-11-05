# 通用页面组合模板

本目录提供组合骨架，不绑定路由、认证、请求客户端、权限或状态管理。React API 目前实验中；将以下结构作为信息架构与原生语义参考。数据和按钮回调需由消费项目提供。

## 列表 / 管理页

- `PageHeader` 语义区（当前由 `Heading` + 辅助 `Text` 组合）：标题、说明、一个主操作。
- 筛选区使用 `SearchInput`、`Select`、`ButtonGroup`；活跃筛选摘要以 `Badge` 展示，并提供清除动作。
- 批量操作仅在有选择项时出现；当前仓库没有 DataTable/行选择组件，列表用语义 HTML table 并由业务层维护排序、分页和键盘策略。
- 内容区域覆盖 loading / empty / error / populated 四态，重试函数由消费方注入 `ErrorState`。

## 新建 / 编辑

- 用 `FormField` 绑定 label、hint、error；相关控件必须有稳定 id。
- 分组用 `Fieldset` + `legend`；提交中状态通过 `Button disabled` 与文案表达。
- 表单异步校验、提交锁、错误聚焦和未保存离开提醒由项目表单层实现，基础库不假装提供。
- 页面或 Drawer 底部放取消/保存操作；长表单主体内部滚动，标题与操作区保持可达。

## 详情页

- 标题和状态组合 `Heading`、`Badge` 与 `ButtonGroup`。
- 描述字段用 `dl/dt/dd` 原生语义；长 ID 使用 `Code`，可复制按钮由业务实现。
- 空值显示明确占位（如“未填写”），不能留下空标签。

## 设置页

- 相关设置按 `Section` 分组，使用 `Switch` 或 `Checkbox` 并配说明文字。
- 即时保存和显式提交由产品决定，明确反馈成功、失败、处理中；不要仅以颜色表达状态。

## 概览页

- 使用 `Grid`（当前可用 CSS grid 自行组合）+ `Card`，每卡只放一个关键数值和清晰时间范围。
- 图表库不属于本包；数据趋势需给文本摘要和空/错误状态。

## 搜索结果

- `SearchInput` 有可见 label 或 `aria-label`；结果数使用文本播报。
- 分组、无结果、加载与请求失败分开表达；分页由 `Pagination` 或业务路由处理。

## 登录 / 找回密码表单

仅作为表单布局示例，不提供真实认证或密码策略：

```tsx
<FormField label="邮箱" htmlFor="email" required>
  <Input id="email" type="email" autoComplete="email" required />
</FormField>
<FormField label="密码" htmlFor="password" required>
  <Input id="password" type="password" autoComplete="current-password" required />
</FormField>
<Button type="submit" variant="primary">登录</Button>
```

## 中性示例和模板清单

可运行消费示例见 [`../examples/react-consumer/`](../examples/react-consumer/)；它演示组件包导入、局部主题、表单、Dialog 和 Toast，不含真实服务端请求。更完整的列表/工作台组合样例见仓库根 `index.html`，其巡检数据是业务演示，不是通用模板。正式模板页仍未实现；不要将示例伪装成已发布模板。