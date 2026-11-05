import React, { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../ui/icons.js';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg'; loading?: boolean; loadingLabel?: ReactNode };
export const Button = forwardRef<HTMLButtonElement, NativeButtonProps>(function Button({ variant, size, loading = false, loadingLabel, disabled, children, className = '', ...props }, ref) {
  return <button {...props} ref={ref} className={['ds-btn', variant === 'primary' && 'ds-btn-primary', variant === 'ghost' && 'ds-btn-ghost', size === 'sm' && 'ds-btn-sm', size === 'lg' && 'ds-btn-lg', loading && 'ds-is-loading', className].filter(Boolean).join(' ')} disabled={disabled || loading} aria-busy={loading || undefined}>{loading && <span className="ds-spinner ds-btn-loading-mark" aria-hidden="true"><i/><i/><i/></span>}{loading && loadingLabel ? loadingLabel : children}</button>;
});
export const IconButton = forwardRef<HTMLButtonElement, NativeButtonProps & { 'aria-label': string }>(function IconButton({ className = '', ...props }, ref) { return <Button ref={ref} className={`ds-btn-icon ${className}`} {...props} />; });
export const Link = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(function Link({ className = '', ...props }, ref) { return <a ref={ref} className={`ds-link ${className}`} {...props} />; });
export const Text = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function Text({ className = '', ...props }, ref) { return <span ref={ref} className={`ds-text ${className}`} {...props} />; });
export const Heading = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function Heading({ className = '', ...props }, ref) { return <h2 ref={ref} className={`ds-heading ${className}`} {...props} />; });
export const Code = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Code({ className = '', ...props }, ref) { return <code ref={ref} className={`ds-code ${className}`} {...props} />; });
export const Kbd = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Kbd({ className = '', ...props }, ref) { return <kbd ref={ref} className={`ds-kbd ${className}`} {...props} />; });
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className = '', ...props }, ref) { return <input ref={ref} className={`ds-input ${className}`} {...props} />; });
export const NumberInput = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>>(function NumberInput(props, ref) { return <Input ref={ref} type="number" {...props} />; });
export const SearchInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function SearchInput({ className = '', ...props }, ref) { return <div className="ds-search"><input ref={ref} type="search" className={`ds-input ${className}`} {...props} /></div>; });
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className = '', ...props }, ref) { return <textarea ref={ref} className={`ds-textarea ${className}`} {...props} />; });
export const FormField = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { label: ReactNode; htmlFor: string; hint?: ReactNode; error?: ReactNode; required?: boolean }>(function FormField({ label, htmlFor, hint, error, required, children, className = '', ...props }, ref) {
 const child = React.isValidElement(children) ? children as React.ReactElement<{ id?: string; required?: boolean; 'aria-invalid'?: boolean | 'true' | 'false'; 'aria-describedby'?: string }> : null;
 const childProps = child?.props ?? {};
 const describedBy = [childProps['aria-describedby'], hint && `${htmlFor}-hint`, error && `${htmlFor}-error`].filter(Boolean).join(' ') || undefined;
 const control = child ? React.cloneElement(child, { id: htmlFor, required: required ?? childProps.required, 'aria-invalid': error ? true : childProps['aria-invalid'], 'aria-describedby': describedBy }) : children;
 return <div ref={ref} className={`ds-field${error ? ' ds-is-invalid' : ''} ${className}`} {...props}><label className="ds-field-label" htmlFor={htmlFor}>{label}{required && <span className="ds-req" aria-hidden="true"> *</span>}</label>{control}{hint && <span className="ds-field-hint" id={`${htmlFor}-hint`}>{hint}</span>}{error && <span className="ds-field-error" id={`${htmlFor}-error`} role="alert">{error}</span>}</div>;
});
export const Form = forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(function Form({ className = '', onSubmit, ...props }, ref) {
 const { noValidate = true, ...rest } = props;
 return <form ref={ref} className={`ds-form ${className}`} noValidate={noValidate} onSubmit={onSubmit} {...rest}/>;
});
export const Fieldset = forwardRef<HTMLFieldSetElement, React.FieldsetHTMLAttributes<HTMLFieldSetElement>>(function Fieldset({ className = '', ...props }, ref) { return <fieldset ref={ref} className={`ds-fieldset ${className}`} {...props} />; });
export const Checkbox = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(function Checkbox({ className = '', ...props }, ref) { return <CheckboxPrimitive.Root ref={ref} className={`ds-checkbox ${className}`} {...props}><CheckboxPrimitive.Indicator aria-hidden="true">✓</CheckboxPrimitive.Indicator></CheckboxPrimitive.Root>; });
export const Switch = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>(function Switch({ className = '', ...props }, ref) { return <SwitchPrimitive.Root ref={ref} className={`ds-switch ${className}`} {...props}><SwitchPrimitive.Thumb className="ds-switch-thumb" /></SwitchPrimitive.Root>; });
export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(function Label({ className = '', ...props }, ref) { return <label ref={ref} className={`ds-field-label ${className}`} {...props} />; });
export const Divider = forwardRef<HTMLHRElement, HTMLAttributes<HTMLHRElement>>(function Divider({ className = '', ...props }, ref) { return <hr ref={ref} className={`ds-divider ${className}`} {...props} />; });
export function Spinner({ label = '加载中', className = '' }: { label?: string; className?: string }) { return <span role="status" aria-label={label} className={`ds-spinner ${className}`}><i/><i/><i/></span>; }
export function Skeleton({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) { return <div aria-hidden="true" className={`ds-skeleton ${className}`} {...props}/>; }
export function Badge({ children, tone = 'neutral', className = '', ...props }: { children: ReactNode; tone?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'; className?: string } & HTMLAttributes<HTMLSpanElement>) { return <span className={`ds-tag ds-tag--${tone} ${className}`} {...props}>{children}</span>; }
export const Avatar = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function Avatar({ className = '', ...props }, ref) { return <span ref={ref} className={`ds-avatar ${className}`} {...props} />; });
export const Icon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement> & { name: string; title?: string }>(function Icon({ name, title, className = '', ...props }, ref) { return <svg ref={ref} className={`ds-ico ${className}`} aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} {...props}>{title && <title>{title}</title>}<use href={`#i-${name}`}/></svg>; });
export function Alert({ children, className = '', role = 'status', ...props }: HTMLAttributes<HTMLDivElement>) { return <div role={role} className={`ds-alert ${className}`} {...props}>{children}</div>; }
export function ConfirmDialogActions({ cancelLabel = '取消', confirmLabel = '确认', onCancel, onConfirm, destructive = false }: { cancelLabel?: string; confirmLabel?: string; onCancel?: () => void; onConfirm?: () => void; destructive?: boolean }) { return <div className="ds-dialog-actions"><ConfirmDialogCancel asChild><Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button></ConfirmDialogCancel><ConfirmDialogAction asChild><Button variant="primary" data-destructive={destructive || undefined} onClick={onConfirm}>{confirmLabel}</Button></ConfirmDialogAction></div>; }
export function EmptyState({ title, description, action, className = '' }: { title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) { return <div className={`ds-empty ${className}`}><div className="ds-empty-mark" aria-hidden="true">□</div><h3>{title}</h3>{description && <p>{description}</p>}{action}</div>; }
export function ErrorState({ title, description, onRetry, className = '' }: { title: ReactNode; description?: ReactNode; onRetry?: () => void; className?: string }) { return <div className={`ds-empty ds-error-state ${className}`} role="alert"><div className="ds-empty-mark" aria-hidden="true">!</div><h3>{title}</h3>{description && <p>{description}</p>}{onRetry && <Button onClick={onRetry}>重试</Button>}</div>; }
export function ButtonGroup({ children, label, className = '' }: { children: ReactNode; label?: string; className?: string }) { return <div role={label ? 'group' : undefined} aria-label={label} className={`ds-button-group ${className}`}>{children}</div>; }
export function TextareaField(props: React.ComponentProps<typeof Textarea>) { return <Textarea {...props}/>; }
export function Pagination({ page, pageCount, onPageChange, className = '' }: { page: number; pageCount: number; onPageChange: (page: number) => void; className?: string }) {
 const safeCount = Math.max(1, Math.floor(pageCount)); const current = Math.min(safeCount, Math.max(1, Math.floor(page)));
 return <nav aria-label="分页" className={`ds-pagination ${className}`}><Button size="sm" disabled={current <= 1} onClick={() => onPageChange(current - 1)}>上一页</Button><span aria-live="polite">第 {current} / {safeCount} 页</span><Button size="sm" disabled={current >= safeCount} onClick={() => onPageChange(current + 1)}>下一页</Button></nav>;
}
export function Progress({ value, max = 100, label, className = '' }: { value: number; max?: number; label: string; className?: string }) { const safeMax = Number.isFinite(max) && max > 0 ? max : 100; const clamped = Number.isFinite(value) ? Math.min(safeMax, Math.max(0, value)) : 0; return <progress className={`ds-progress ${className}`} value={clamped} max={safeMax} aria-label={label}/>; }
type AsProps<E extends React.ElementType> = { as?: E; className?: string } & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'className'>;
export function Stack<E extends React.ElementType = 'div'>({ as, gap = 3, className = '', ...props }: AsProps<E> & { gap?: 1|2|3|4|5|6 }) { const Component = as ?? 'div'; return <Component className={`ds-stack ds-stack--${gap} ${className}`} {...props}/>; }
export function Inline<E extends React.ElementType = 'div'>({ as, gap = 2, className = '', ...props }: AsProps<E> & { gap?: 1|2|3|4|5|6 }) { const Component = as ?? 'div'; return <Component className={`ds-inline ds-inline--${gap} ${className}`} {...props}/>; }
export function Card<E extends React.ElementType = 'section'>({ as, className = '', ...props }: AsProps<E>) { const Component = as ?? 'section'; return <Component className={`ds-card ${className}`} {...props}/>; }
export const Section = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Section({ className = '', ...props }, ref) { return <section ref={ref} className={`ds-section ${className}`} {...props}/>; });
export function Toolbar({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) { return <div role="toolbar" className={`ds-toolbar ${className}`} {...props}>{children}</div>; }
export function Grid<E extends React.ElementType = 'div'>({ as, columns = 2, className = '', style, ...props }: AsProps<E> & { columns?: number }) { const Component = as ?? 'div'; return <Component className={`ds-grid ${className}`} style={{ '--ds-grid-columns': columns, ...style } as React.CSSProperties} {...props}/>; }
export function Container<E extends React.ElementType = 'div'>({ as, className = '', ...props }: AsProps<E>) { const Component = as ?? 'div'; return <Component className={`ds-container ${className}`} {...props}/>; }
export function DescriptionList({ items, className = '' }: { items: Array<{ term: ReactNode; description: ReactNode }>; className?: string }) { return <dl className={`ds-description-list ${className}`}>{items.map((item, index) => <div className="ds-description-item" key={index}><dt>{item.term}</dt><dd>{item.description ?? '—'}</dd></div>)}</dl>; }
export const Table = forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(function Table({ className = '', ...props }, ref) { return <div className="ds-table-wrap"><table ref={ref} className={`ds-table ${className}`} {...props}/></div>; });
export const TableHead = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableHead(props, ref) { return <thead ref={ref} {...props}/>; });
export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableBody(props, ref) { return <tbody ref={ref} {...props}/>; });
export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(function TableRow(props, ref) { return <tr ref={ref} {...props}/>; });
export const TableHeader = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(function TableHeader({ className = '', ...props }, ref) { return <th ref={ref} className={`ds-table-head ${className}`} {...props}/>; });
export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(function TableCell({ className = '', ...props }, ref) { return <td ref={ref} className={`ds-table-cell ${className}`} {...props}/>; }
);

export type DataTableSort = { columnId: string; direction: 'ascending' | 'descending' };
export type DataTableColumn<Row> = {
  id: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  sortValue?: (row: Row) => string | number | Date | null | undefined;
  filterValue?: (row: Row) => string | number | null | undefined;
  width?: number | string;
  pin?: 'start' | 'end';
  align?: 'start' | 'center' | 'end';
  hideable?: boolean;
};
export type DataTableProps<Row> = {
  rows: Row[];
  columns: DataTableColumn<Row>[];
  getRowId: (row: Row) => string;
  getRowLabel?: (row: Row) => string;
  label: string;
  loading?: boolean;
  error?: ReactNode;
  emptyState?: ReactNode;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  filters?: Record<string, string>;
  defaultFilters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  manualFiltering?: boolean;
  stickyHeader?: boolean;
  maxBodyHeight?: number | string;
  virtualize?: boolean;
  virtualRowHeight?: number;
  overscan?: number;
  selectionActions?: ReactNode;
  page?: number;
  defaultPage?: number;
  pageSize?: number;
  totalCount?: number;
  manualSorting?: boolean;
  manualPagination?: boolean;
  onPageChange?: (page: number) => void;
  selectable?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  columnVisibility?: Record<string, boolean>;
  defaultColumnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
  showColumnPicker?: boolean;
  className?: string;
};

export function DataTable<Row>({ rows, columns, getRowId, getRowLabel, label, loading = false, error, emptyState = <EmptyState title="没有数据" description="调整筛选条件后再试。"/>, sort: sortProp, defaultSort = null, onSortChange, filters: filtersProp, defaultFilters = {}, onFiltersChange, manualFiltering = false, stickyHeader = false, maxBodyHeight, virtualize = false, virtualRowHeight = 44, overscan = 5, selectionActions, page: pageProp, defaultPage = 1, pageSize, totalCount, manualSorting = false, manualPagination = false, onPageChange, selectable = false, selectedRowIds: selectedProp, defaultSelectedRowIds = [], onSelectionChange, columnVisibility: visibilityProp, defaultColumnVisibility = {}, onColumnVisibilityChange, showColumnPicker = false, className = '' }: DataTableProps<Row>) {
  const [sort, setSort] = useControllableState({ value: sortProp, defaultValue: defaultSort, onChange: onSortChange });
  const [filters, setFilters] = useControllableState({ value: filtersProp, defaultValue: defaultFilters, onChange: onFiltersChange });
  const [pageState, setPageState] = useControllableState({ value: pageProp, defaultValue: defaultPage, onChange: onPageChange });
  const [selected, setSelected] = useControllableState({ value: selectedProp, defaultValue: defaultSelectedRowIds, onChange: onSelectionChange });
  const [visibility, setVisibility] = useControllableState({ value: visibilityProp, defaultValue: defaultColumnVisibility, onChange: onColumnVisibilityChange });
  const visibleColumns = columns.filter(column => visibility[column.id] !== false);
  const sortColumn = columns.find(column => column.id === sort?.columnId && column.sortValue);
  const sortedRows = useMemo(() => {
    if (!sort || !sortColumn || manualSorting) return rows;
    const direction = sort.direction === 'ascending' ? 1 : -1;
    return rows.map((row, index) => ({ row, index, value: sortColumn.sortValue?.(row) })).sort((a, b) => {
      const left = a.value instanceof Date ? a.value.getTime() : a.value;
      const right = b.value instanceof Date ? b.value.getTime() : b.value;
      const compare = left == null ? (right == null ? 0 : -1) : right == null ? 1 : typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
      return compare === 0 ? a.index - b.index : compare * direction;
    }).map(entry => entry.row);
  }, [rows, sort, sortColumn, manualSorting]);
  const filteredRows = useMemo(() => {
    if (manualFiltering) return sortedRows;
    return sortedRows.filter(row => columns.every(column => {
      const query = filters[column.id]?.trim().toLocaleLowerCase();
      if (!query || !column.filterValue) return true;
      return String(column.filterValue(row) ?? '').toLocaleLowerCase().includes(query);
    }));
  }, [sortedRows, columns, filters, manualFiltering]);
  const size = Number.isFinite(pageSize) && (pageSize ?? 0) > 0 ? Math.floor(pageSize!) : 0;
  const count = totalCount ?? filteredRows.length;
  const pageCount = size ? Math.max(1, Math.ceil(count / size)) : 1;
  const page = Math.min(pageCount, Math.max(1, Math.floor(pageState || 1)));
  const pageRows = size && !manualPagination ? filteredRows.slice((page - 1) * size, page * size) : filteredRows;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(440);
  const [headerHeight, setHeaderHeight] = useState(0);
  const rowHeight = Number.isFinite(virtualRowHeight) && virtualRowHeight > 0 ? virtualRowHeight : 44;
  const overscanCount = Number.isFinite(overscan) && overscan >= 0 ? Math.floor(overscan) : 5;
  const virtualViewportHeight = viewportHeight || Number.parseFloat(String(maxBodyHeight ?? 440)) || 440;
  const virtualStart = virtualize ? Math.max(0, Math.floor(Math.max(0, scrollTop - headerHeight) / rowHeight) - overscanCount) : 0;
  const virtualEnd = virtualize ? Math.min(pageRows.length, virtualStart + Math.ceil(virtualViewportHeight / rowHeight) + overscanCount * 2) : pageRows.length;
  const visibleRows = virtualize ? pageRows.slice(virtualStart, virtualEnd) : pageRows;
  useEffect(() => { if (!virtualize || !scrollRef.current) return; const element = scrollRef.current; const configuredHeight = Number.parseFloat(String(maxBodyHeight ?? 440)) || 440; const measure = () => { setViewportHeight(element.clientHeight || configuredHeight); setHeaderHeight(element.querySelector('thead')?.getBoundingClientRect().height ?? 0); }; measure(); const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure); observer?.observe(element); window.addEventListener('resize', measure); return () => { observer?.disconnect(); window.removeEventListener('resize', measure); }; }, [virtualize, visibleColumns.length, maxBodyHeight]);
  useEffect(() => { if (scrollRef.current && scrollRef.current.scrollTop > 0) scrollRef.current.scrollTop = 0; setScrollTop(0); }, [page, sort, filters, visibility]);
  const visibleIds = pageRows.map(getRowId);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selected.includes(id));
  const someVisibleSelected = visibleIds.some(id => selected.includes(id)) && !allVisibleSelected;
  const selectAllRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => { if (selectAllRef.current) selectAllRef.current.indeterminate = someVisibleSelected; }, [someVisibleSelected]);
  const changePage = (next: number) => setPageState(Math.max(1, Math.min(pageCount, next)));
  const toggleRow = (id: string, checked: boolean) => setSelected(current => checked ? Array.from(new Set([...current, id])) : current.filter(item => item !== id));
  const togglePage = (checked: boolean) => setSelected(current => checked ? Array.from(new Set([...current, ...visibleIds])) : current.filter(id => !visibleIds.includes(id)));
  const nextSort = (column: DataTableColumn<Row>) => {
    if (!column.sortValue) return;
    setSort(sort?.columnId === column.id ? sort.direction === 'ascending' ? { columnId: column.id, direction: 'descending' } : null : { columnId: column.id, direction: 'ascending' });
  };
  const pinnedOffsets = new Map<string, number>();
  let startOffset = selectable ? 40 : 0;
  for (const column of visibleColumns) if (column.pin === 'start') { pinnedOffsets.set(column.id, startOffset); startOffset += typeof column.width === 'number' ? column.width : Number.parseFloat(String(column.width ?? 160)) || 160; }
  let endOffset = 0;
  for (const column of [...visibleColumns].reverse()) if (column.pin === 'end') { pinnedOffsets.set(column.id, endOffset); endOffset += typeof column.width === 'number' ? column.width : Number.parseFloat(String(column.width ?? 160)) || 160; }
  const columnStyle = (column: DataTableColumn<Row>, header = false): React.CSSProperties => {
    const width = column.width === undefined ? column.pin ? 160 : undefined : typeof column.width === 'number' ? `${column.width}px` : column.width;
    return { width, minWidth: column.pin ? width ?? '160px' : undefined, position: column.pin ? 'sticky' : undefined, left: column.pin === 'start' ? `${pinnedOffsets.get(column.id) ?? 0}px` : undefined, right: column.pin === 'end' ? `${pinnedOffsets.get(column.id) ?? 0}px` : undefined, zIndex: column.pin ? header ? 4 : 1 : undefined, background: column.pin ? header ? 'var(--c-bg-soft)' : 'var(--c-bg)' : undefined, boxShadow: column.pin === 'start' ? 'var(--c-sticky-shadow-start)' : column.pin === 'end' ? 'var(--c-sticky-shadow-end)' : undefined };
  };
  const spacerColSpan = visibleColumns.length + (selectable ? 1 : 0);
  const wrapStyle = { ...(maxBodyHeight || virtualize ? { maxHeight: typeof (maxBodyHeight ?? 440) === 'number' ? `${maxBodyHeight ?? 440}px` : maxBodyHeight ?? '440px' } : {}), ...(virtualize ? { '--ds-virtual-row-height': `${rowHeight}px` } : {}) } as React.CSSProperties;
  return <div className={`ds-data-table ${className}`} aria-busy={loading || undefined}>
    {error ? <div className="ds-data-table-error" role="alert">{error}</div> : null}
    {loading ? <div className="ds-data-table-status" role="status"><span className="ds-spinner" aria-hidden="true"><i/><i/><i/></span>正在加载…</div> : null}
    {showColumnPicker && columns.some(column => column.hideable !== false) ? <details className="ds-data-table-columns"><summary>显示列</summary><fieldset><legend className="ds-visually-hidden">选择显示的列，至少保留一列</legend>{columns.filter(column => column.hideable !== false).map(column => { const name = typeof column.header === 'string' ? column.header : column.id; const isVisible = visibility[column.id] !== false; return <label key={column.id}><input type="checkbox" aria-label={`显示 ${name}`} checked={isVisible} disabled={isVisible && visibleColumns.length === 1} onChange={event => setVisibility(current => ({ ...current, [column.id]: event.currentTarget.checked }))}/>{name}</label>; })}</fieldset></details> : null}
    {selectionActions && selected.length > 0 ? <div className="ds-data-table-selection-actions" role="region" aria-label="已选行操作"><span aria-live="polite">已选择 {selected.length} 项</span>{selectionActions}</div> : null}
    <div ref={scrollRef} className={`ds-table-wrap${stickyHeader || virtualize ? ' ds-table-wrap-sticky' : ''}${virtualize ? ' ds-table-wrap-virtual' : ''}`} style={wrapStyle} onScroll={event => virtualize && setScrollTop(event.currentTarget.scrollTop)}><table className="ds-table" aria-label={label} aria-rowcount={count + 1 + (visibleColumns.some(column => column.filterValue) ? 1 : 0)}>
      <thead><tr>{selectable && <th scope="col" className="ds-data-table-select" style={selectable ? { position: 'sticky', left: 0, zIndex: 5, background: 'var(--c-bg-soft)' } : undefined}><input ref={selectAllRef} type="checkbox" aria-label="选择本页全部行" checked={allVisibleSelected} onChange={event => togglePage(event.currentTarget.checked)}/></th>}{visibleColumns.map(column => <th key={column.id} scope="col" aria-sort={column.sortValue ? sort?.columnId === column.id ? sort.direction : 'none' : undefined} className={column.align ? `ds-data-table-align-${column.align}` : undefined} style={columnStyle(column, true)}>{column.sortValue ? <button type="button" className="ds-table-sort" onClick={() => nextSort(column)} aria-label={`按${typeof column.header === 'string' ? column.header : column.id}排序`}>{column.header}<span aria-hidden="true">{sort?.columnId === column.id ? sort.direction === 'ascending' ? '↑' : '↓' : '↕'}</span></button> : column.header}</th>)}</tr>
      {visibleColumns.some(column => column.filterValue) ? <tr className="ds-data-table-filters">{selectable && <th aria-hidden="true" style={selectable ? { position: 'sticky', left: 0, zIndex: 5, background: 'var(--c-bg)' } : undefined}/>}{visibleColumns.map(column => <th key={column.id} scope="col" style={columnStyle(column, true)}>{column.filterValue ? <input className="ds-input" type="search" aria-label={`筛选${typeof column.header === 'string' ? column.header : column.id}`} placeholder="筛选…" value={filters[column.id] ?? ''} onChange={event => { setFilters(current => ({ ...current, [column.id]: event.currentTarget.value })); setPageState(1); if (scrollRef.current) { scrollRef.current.scrollTop = 0; setScrollTop(0); } }}/> : null}</th>)}</tr> : null}</thead>
      <tbody>{virtualize && virtualStart > 0 ? <tr className="ds-data-table-virtual-spacer" aria-hidden="true"><td colSpan={spacerColSpan} style={{ height: virtualStart * rowHeight }}/></tr> : null}{visibleRows.length ? visibleRows.map((row, rowIndex) => { const id = getRowId(row); return <tr key={id} aria-rowindex={1 + 1 + (visibleColumns.some(column => column.filterValue) ? 1 : 0) + virtualStart + rowIndex} style={virtualize ? { height: rowHeight } : undefined}>{selectable && <td className="ds-data-table-select" style={selectable ? { position: 'sticky', left: 0, zIndex: 2, background: 'var(--c-bg)' } : undefined}><input type="checkbox" aria-label={`选择${getRowLabel?.(row) ?? `第 ${virtualStart + rowIndex + 1} 行`}`} checked={selected.includes(id)} onChange={event => toggleRow(id, event.currentTarget.checked)}/></td>}{visibleColumns.map(column => <td key={column.id} className={column.align ? `ds-data-table-align-${column.align}` : undefined} style={columnStyle(column)}>{column.cell(row)}</td>)}</tr>; }) : !loading && <tr><td className="ds-data-table-empty" colSpan={spacerColSpan}>{emptyState}</td></tr>}{virtualize && virtualEnd < pageRows.length ? <tr className="ds-data-table-virtual-spacer" aria-hidden="true"><td colSpan={spacerColSpan} style={{ height: (pageRows.length - virtualEnd) * rowHeight }}/></tr> : null}</tbody>
    </table></div>
    {size ? <nav className="ds-data-table-pagination" aria-label={`${label}分页`}><span aria-live="polite">共 {count} 条 · 第 {page} / {pageCount} 页</span><div><Button size="sm" disabled={page <= 1} onClick={() => changePage(page - 1)}>上一页</Button><Button size="sm" disabled={page >= pageCount} onClick={() => changePage(page + 1)}>下一页</Button></div></nav> : null}
  </div>;
}

export function SidebarLayout({ navigation, header, children, label = '主导航', className = '' }: { navigation: ReactNode; header?: ReactNode; children: ReactNode; label?: string; className?: string }) {
  return <div className={`ds-sidebar-layout ${className}`}><aside className="ds-sidebar" aria-label={label}>{navigation}</aside><div className="ds-sidebar-main">{header ? <header className="ds-sidebar-header">{header}</header> : null}<main className="ds-sidebar-content">{children}</main></div></div>;
}

export type BreadcrumbItem = { label: ReactNode; href?: string };
export function Breadcrumbs({ items, label = '面包屑', className = '' }: { items: BreadcrumbItem[]; label?: string; className?: string }) {
  return <nav aria-label={label} className={`ds-breadcrumbs ${className}`}><ol>{items.map((item, index) => <li key={index}>{index < items.length - 1 && item.href ? <a href={item.href}>{item.label}</a> : <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>}{index < items.length - 1 ? <span className="ds-breadcrumb-separator" aria-hidden="true">/</span> : null}</li>)}</ol></nav>;
}

export function NavigationGroup({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return <section className={`ds-nav-group ${className}`}><h2>{label}</h2><ul>{children}</ul></section>;
}
export function NavigationItem({ href, label, icon, badge, current = false, disabled = false, className = '' }: { href: string; label: ReactNode; icon?: ReactNode; badge?: ReactNode; current?: boolean; disabled?: boolean; className?: string }) {
  return <li className="ds-nav-list-item">{disabled ? <span className={`ds-nav-item ds-is-disabled ${className}`} aria-disabled="true">{icon}{label}{badge}</span> : <a className={`ds-nav-item ${className}`} href={href} aria-current={current ? 'page' : undefined}>{icon}{label}{badge}</a>}</li>;
}

export type DateRange = { start: string; end: string };
export function DateRangePicker({ label = '日期范围', value, defaultValue = { start: '', end: '' }, onValueChange, min, max, disabled = false, required = false, error, className = '' }: { label?: string; value?: DateRange; defaultValue?: DateRange; onValueChange?: (range: DateRange) => void; min?: string; max?: string; disabled?: boolean; required?: boolean; error?: ReactNode; className?: string }) {
 const [range, setRange] = useControllableState({ value, defaultValue, onChange: onValueChange });
 const invalidOrder = Boolean(range.start && range.end && range.start > range.end);
 const errorId = React.useId();
 return <fieldset className={`ds-date-range ${className}`} disabled={disabled} aria-describedby={error || invalidOrder ? errorId : undefined}>
  <legend>{label}{required && <span className="ds-req" aria-hidden="true"> *</span>}</legend>
  <label>开始日期<input className="ds-input" type="date" value={range.start} min={min} max={range.end || max} required={required} aria-invalid={Boolean(error || invalidOrder) || undefined} onChange={event => setRange({ ...range, start: event.currentTarget.value })}/></label>
  <span className="ds-date-range-separator" aria-hidden="true">至</span>
  <label>结束日期<input className="ds-input" type="date" value={range.end} min={range.start || min} max={max} required={required} aria-invalid={Boolean(error || invalidOrder) || undefined} onChange={event => setRange({ ...range, end: event.currentTarget.value })}/></label>
  {(error || invalidOrder) && <span id={errorId} role="alert" className="ds-field-error">{error || '结束日期不能早于开始日期。'}</span>}
 </fieldset>;
}

export type FileUploadStatus = 'uploading' | 'success' | 'error' | 'cancelled';
export type FileUploadProps = { label?: string; accept?: string; multiple?: boolean; maxFiles?: number; maxSize?: number; files?: File[]; defaultFiles?: File[]; onFilesChange?: (files: File[]) => void; onValidationError?: (message: string) => void; uploadFile?: (file: File, options: { signal: AbortSignal; onProgress: (progress: number) => void }) => Promise<void>; disabled?: boolean; className?: string };
export function FileUpload({ label = '上传文件', accept, multiple = false, maxFiles = multiple ? Infinity : 1, maxSize, files: filesProp, defaultFiles = [], onFilesChange, onValidationError, uploadFile, disabled = false, className = '' }: FileUploadProps) {
 const [localFiles, setLocalFiles] = useState(defaultFiles);
 const files = filesProp ?? localFiles;
 const controlled = filesProp !== undefined;
 const [error, setError] = useState('');
 const [uploadStates, setUploadStates] = useState<Record<string, { status: FileUploadStatus; progress: number; message?: string }>>({});
 const controllers = React.useRef(new Map<string, AbortController>());
 const fileIds = React.useRef(new WeakMap<File, string>());
 const nextFileId = React.useRef(0);
 const inputId = React.useId();
 const fileKey = (file: File) => {
  let key = fileIds.current.get(file);
  if (!key) { key = `file-${++nextFileId.current}`; fileIds.current.set(file, key); }
  return key;
 };
 useEffect(() => () => { controllers.current.forEach(controller => controller.abort()); controllers.current.clear(); }, []);
 const upload = async (file: File) => {
  if (!uploadFile || disabled) return;
  const key = fileKey(file);
  controllers.current.get(key)?.abort();
  const controller = new AbortController();
  controllers.current.set(key, controller);
  setUploadStates(current => ({ ...current, [key]: { status: 'uploading', progress: 0 } }));
  try {
   await uploadFile(file, { signal: controller.signal, onProgress: progress => {
    if (!controller.signal.aborted) setUploadStates(current => ({ ...current, [key]: { status: 'uploading', progress: Math.max(0, Math.min(100, progress)) } }));
   } });
   if (!controller.signal.aborted) setUploadStates(current => ({ ...current, [key]: { status: 'success', progress: 100 } }));
  } catch (reason) {
   setUploadStates(current => ({ ...current, [key]: { status: controller.signal.aborted ? 'cancelled' : 'error', progress: current[key]?.progress ?? 0, message: reason instanceof Error ? reason.message : '上传失败' } }));
  } finally {
   if (controllers.current.get(key) === controller) controllers.current.delete(key);
  }
 };
 const removeFile = (file: File) => {
  const key = fileKey(file);
  controllers.current.get(key)?.abort();
  controllers.current.delete(key);
  setUploadStates(current => { const next = { ...current }; delete next[key]; return next; });
  updateFiles(files.filter(candidate => candidate !== file));
 };
 const updateFiles = (next: File[]) => { if (!controlled) setLocalFiles(next); onFilesChange?.(next); };
 const ingest = (incoming: File[]) => {
  setError('');
  const accepted: File[] = [];
  for (const file of incoming) {
   if (maxSize !== undefined && file.size > maxSize) { const message = `${file.name} 超过大小限制。`; setError(message); onValidationError?.(message); continue; }
   const existingCount = multiple ? files.length : 0;
   if (existingCount + accepted.length >= maxFiles) { const message = `最多可选择 ${maxFiles} 个文件。`; setError(message); onValidationError?.(message); break; }
   accepted.push(file);
  }
  if (accepted.length) {
   const next = multiple ? [...files, ...accepted] : accepted;
   if (!multiple) files.forEach(file => controllers.current.get(fileKey(file))?.abort());
   updateFiles(next);
   accepted.forEach(file => { void upload(file); });
  }
 };
 return <div className={`ds-file-upload ${disabled ? 'ds-is-disabled' : ''} ${className}`} aria-disabled={disabled || undefined}>
  <input id={inputId} className="ds-file-input" type="file" accept={accept} multiple={multiple} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={error ? `${inputId}-error` : undefined} onChange={event => { ingest(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ''; }}/>
  <label className="ds-file-dropzone" htmlFor={inputId} onDragOver={event => { if (!disabled) event.preventDefault(); }} onDrop={event => { if (!disabled) { event.preventDefault(); ingest(Array.from(event.dataTransfer.files)); } }}>
   <span className="ds-file-drop-mark" aria-hidden="true">↑</span><span><strong>{label}</strong><small>选择文件，或拖放到此处{maxSize ? ` · 单个文件不超过 ${Math.ceil(maxSize / 1024 / 1024)} MB` : ''}</small></span>
  </label>
  {error && <p id={`${inputId}-error`} className="ds-file-error" role="alert">{error}</p>}
  {files.length > 0 && <ul className="ds-file-list" aria-label="已选择文件" aria-live="polite">{files.map((file, index) => {
   const key = fileKey(file);
   const state = uploadStates[key];
   return <li key={`${key}-${index}`}><span className="ds-file-name">{file.name}<small>{(file.size / 1024).toFixed(file.size < 1024 * 1024 ? 0 : 1)} KB{state ? ` · ${state.status === 'uploading' ? `上传中 ${Math.round(state.progress)}%` : state.status === 'success' ? '已上传' : state.status === 'cancelled' ? '已取消' : '上传失败'}` : ''}</small>{state?.status === 'uploading' && <progress className="ds-file-progress" max="100" value={state.progress} aria-label={`${file.name} 上传进度`}/ >}{state?.status === 'error' && <small className="ds-file-error">{state.message}</small>}</span>{state?.status === 'uploading' && <Button type="button" size="sm" variant="ghost" disabled={disabled} aria-label={`取消 ${file.name} 上传`} onClick={() => { controllers.current.get(key)?.abort(); }}>取消</Button>}{(state?.status === 'error' || state?.status === 'cancelled') && uploadFile && <Button type="button" size="sm" variant="ghost" disabled={disabled} aria-label={`重试 ${file.name} 上传`} onClick={() => { void upload(file); }}>重试</Button>}<Button type="button" size="sm" variant="ghost" disabled={disabled} aria-label={`移除 ${file.name}`} onClick={() => removeFile(file)}>移除</Button></li>;
  })}</ul>}
 </div>;
}

type RangeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> & { value?: number; defaultValue?: number; onValueChange?: (value: number) => void; onChange?: React.ChangeEventHandler<HTMLInputElement>; showValue?: boolean };
export const Slider = forwardRef<HTMLInputElement, RangeInputProps>(function Slider({ value, defaultValue = 0, onValueChange, onChange, min = 0, max = 100, step = 1, showValue = false, className = '', ...props }, ref) {
 const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
 return <span className={`ds-slider ${className}`}><input {...props} ref={ref} className="ds-slider-input" type="range" min={min} max={max} step={step} value={current} onChange={event => { onChange?.(event); setCurrent(Number(event.currentTarget.value)); }}/>{showValue && <output className="ds-slider-value">{current}</output>}</span>;
});

export type TreeNode = { id: string; label: ReactNode; children?: TreeNode[]; disabled?: boolean };
export type TreeProps = { nodes: TreeNode[]; selectedId?: string | null; defaultSelectedId?: string | null; onSelectedIdChange?: (id: string | null) => void; expandedIds?: string[]; defaultExpandedIds?: string[]; onExpandedIdsChange?: (ids: string[]) => void; label?: string; className?: string };
export function Tree({ nodes, selectedId, defaultSelectedId = null, onSelectedIdChange, expandedIds: expandedProp, defaultExpandedIds = [], onExpandedIdsChange, label = '树形导航', className = '' }: TreeProps) {
 const [selected, setSelected] = useControllableState({ value: selectedId, defaultValue: defaultSelectedId, onChange: onSelectedIdChange });
 const [expanded, setExpanded] = useControllableState({ value: expandedProp, defaultValue: defaultExpandedIds, onChange: onExpandedIdsChange });
 const [active, setActive] = useState<string | null>(null);
 const treeId = React.useId();
 const flat: Array<{ node: TreeNode; parent?: string; depth: number }> = [];
 const walk = (items: TreeNode[], depth = 0, parent?: string) => items.forEach(node => { flat.push({ node, parent, depth }); if (node.children?.length && expanded.includes(node.id)) walk(node.children, depth + 1, node.id); });
 walk(nodes);
 const activeId = active && flat.some(item => item.node.id === active) ? active : flat[0]?.node.id;
 const idFor = (id: string) => `ds-tree-${treeId}-${encodeURIComponent(id)}`;
 const toggleExpanded = (id: string) => setExpanded(expanded.includes(id) ? expanded.filter(item => item !== id) : [...expanded, id]);
 const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
  const index = flat.findIndex(item => item.node.id === activeId);
  const current = flat[index];
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
   event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? flat.length - 1 : Math.max(0, Math.min(flat.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))); if (flat[next]) setActive(flat[next].node.id);
  } else if (event.key === 'ArrowRight' && current?.node.children?.length) { event.preventDefault(); if (!expanded.includes(current.node.id)) toggleExpanded(current.node.id); else setActive(current.node.children[0].id); }
  else if (event.key === 'ArrowLeft' && current) { event.preventDefault(); if (expanded.includes(current.node.id)) toggleExpanded(current.node.id); else if (current.parent) setActive(current.parent); }
  else if ((event.key === 'Enter' || event.key === ' ') && current && !current.node.disabled) { event.preventDefault(); setSelected(current.node.id); }
 };
 const renderNodes = (items: TreeNode[]) => <ul role="group">{items.map(node => <li key={node.id} id={idFor(node.id)} role="treeitem" aria-selected={selected === node.id} aria-expanded={node.children?.length ? expanded.includes(node.id) : undefined} aria-disabled={node.disabled || undefined} className={`ds-tree-item${activeId === node.id ? ' ds-is-active' : ''}`}><div className="ds-tree-row" style={{ '--ds-tree-depth': flat.find(item => item.node.id === node.id)?.depth ?? 0 } as React.CSSProperties}><button type="button" tabIndex={-1} className="ds-tree-select" disabled={node.disabled} onFocus={() => setActive(node.id)} onClick={() => { setActive(node.id); setSelected(node.id); }} onKeyDown={handleKeyDown}>{node.children?.length ? <span aria-hidden="true" className="ds-tree-chevron">{expanded.includes(node.id) ? '⌄' : '›'}</span> : <span aria-hidden="true" className="ds-tree-spacer"/>}{node.label}</button>{node.children?.length ? <button type="button" tabIndex={-1} className="ds-tree-expand" aria-label={`${expanded.includes(node.id) ? '收起' : '展开'} ${typeof node.label === 'string' ? node.label : '分组'}`} aria-expanded={expanded.includes(node.id)} onClick={() => toggleExpanded(node.id)}>{expanded.includes(node.id) ? '收起' : '展开'}</button> : null}</div>{node.children?.length && expanded.includes(node.id) ? renderNodes(node.children) : null}</li>)}</ul>;
 return <div className={`ds-tree ${className}`}><ul className="ds-tree-root" role="tree" aria-label={label} tabIndex={0} aria-activedescendant={activeId ? idFor(activeId) : undefined} onKeyDown={handleKeyDown}>{renderNodes(nodes)}</ul></div>;
}

export type CommandItem = { id: string; label: string; keywords?: string; disabled?: boolean; onSelect?: () => void };
export function CommandPalette({ items, open, defaultOpen = false, onOpenChange, onSelect, placeholder = '搜索命令…', label = '命令面板' }: { items: CommandItem[]; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; onSelect?: (item: CommandItem) => void; placeholder?: string; label?: string }) {
 const [isOpen, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
 const [query, setQuery] = useState(''); const [active, setActive] = useState(0);
 const descriptionId = React.useId();
 const paletteId = React.useId();
 const listId = `ds-command-list-${paletteId}`;
 const filtered = items.filter(item => !item.disabled && `${item.label} ${item.keywords ?? ''}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 const choose = (item: CommandItem) => { item.onSelect?.(); onSelect?.(item); setOpen(false); setQuery(''); setActive(0); };
 const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setActive(index => filtered.length ? (index + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) % filtered.length : 0); }
  else if (event.key === 'Home' && filtered.length) { event.preventDefault(); setActive(0); }
  else if (event.key === 'End' && filtered.length) { event.preventDefault(); setActive(filtered.length - 1); }
  else if (event.key === 'Enter' && filtered[active]) { event.preventDefault(); choose(filtered[active]); }
 };
 return <Dialog open={isOpen} onOpenChange={next => { setOpen(next); if (!next) { setQuery(''); setActive(0); } }}><DialogContent className="ds-command-dialog" aria-describedby={descriptionId}><div className="ds-command-heading"><DialogTitle>{label}</DialogTitle><DialogDescription id={descriptionId}>输入关键词筛选命令，使用方向键浏览并按 Enter 执行。</DialogDescription></div><Input autoFocus role="combobox" aria-label={label} aria-expanded="true" aria-controls={listId} aria-activedescendant={filtered[active] ? `${listId}-${encodeURIComponent(filtered[active].id)}` : undefined} placeholder={placeholder} value={query} onChange={event => { setQuery(event.currentTarget.value); setActive(0); }} onKeyDown={handleKeyDown}/><ul id={listId} className="ds-command-list" role="listbox" aria-label="命令">{filtered.length ? filtered.map((item, index) => <li key={item.id} id={`${listId}-${encodeURIComponent(item.id)}`} role="option" aria-selected={index === active} className={index === active ? 'ds-is-active' : ''} onMouseEnter={() => setActive(index)}><button type="button" onClick={() => choose(item)}>{item.label}{item.keywords && <small>{item.keywords}</small>}</button></li>) : <li className="ds-command-empty" role="presentation">没有匹配的命令</li>}</ul></DialogContent></Dialog>;
}

export type ComboboxOption = { value: string; label: string; disabled?: boolean };
export type ComboboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> & { options: ComboboxOption[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; onChange?: React.ChangeEventHandler<HTMLInputElement>; label: string; placeholder?: string; emptyText?: string; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void };
export function Combobox({ options, value, defaultValue = '', onValueChange, label, placeholder = '请选择或搜索', emptyText = '没有匹配项', className = '', disabled, id, name, required, open: openProp, defaultOpen = false, onOpenChange, onFocus, onBlur, onKeyDown, onChange, ...inputProps }: ComboboxProps) {
 const [selected, setSelected] = useControllableState({ value, defaultValue, onChange: onValueChange });
 const [query, setQuery] = useState('');
 const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
 const [active, setActive] = useState(-1);
 const generatedId = React.useId();
 const controlId = id ?? generatedId;
 const listId = `${controlId}-list`;
 const optionId = (index: number) => `${controlId}-${index}`;
 const inputRef = React.useRef<HTMLInputElement>(null);
 const selectedOption = options.find(option => option.value === selected);
 const filtered = options.filter(option => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 const firstEnabled = filtered.findIndex(option => !option.disabled);
 const current = filtered[active] && !filtered[active].disabled ? filtered[active] : undefined;
 const moveActive = (from: number, direction: 1 | -1) => {
   if (!filtered.length || !filtered.some(option => !option.disabled)) { setActive(-1); return; }
   let next = from;
   for (let i = 0; i < filtered.length; i++) { next = (next + direction + filtered.length) % filtered.length; if (!filtered[next].disabled) { setActive(next); return; } }
 };
 useEffect(() => { inputRef.current?.setCustomValidity(required && !selectedOption ? '请选择一个有效选项。' : ''); }, [required, selectedOption]);
 const choose = (option: ComboboxOption) => { if (option.disabled) return; setSelected(option.value); setQuery(''); setOpen(false); setActive(-1); };
 return <div className={`ds-combobox ${className}`}>
  {name ? <input type="hidden" name={name} value={selected}/> : null}
  <input {...inputProps} ref={inputRef} className={`ds-input ${className}`} id={controlId} required={required} disabled={disabled} role="combobox" aria-label={label} aria-required={required || undefined} aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={open && current ? optionId(filtered.indexOf(current)) : undefined} value={open ? query : selectedOption?.label ?? ''} placeholder={placeholder} onFocus={event => { onFocus?.(event); if (!disabled) { setQuery(''); setOpen(true); setActive(selectedOption ? filtered.findIndex(option => option.value === selectedOption.value && !option.disabled) : -1); } }} onBlur={event => { onBlur?.(event); setOpen(false); setQuery(''); setActive(-1); }} onChange={event => { onChange?.(event); setQuery(event.currentTarget.value); setActive(filtered.findIndex(option => !option.disabled)); setOpen(true); }} onKeyDown={event => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); if (!open) { setOpen(true); setActive(firstEnabled); } else moveActive(active, event.key === 'ArrowDown' ? 1 : -1); }
    else if (event.key === 'Home' && open) { event.preventDefault(); setActive(firstEnabled); }
    else if (event.key === 'End' && open) { event.preventDefault(); setActive(filtered.map(option => !option.disabled).lastIndexOf(true)); }
    else if (event.key === 'Enter' && open && current) { event.preventDefault(); choose(current); }
    else if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); setQuery(''); setActive(-1); }
    else if (event.key === 'Tab') { setOpen(false); setQuery(''); setActive(-1); }
  }}/>
  {open && <ul className="ds-combobox-list" id={listId} role="listbox" aria-label={label}>{filtered.length ? filtered.map((option, index) => <li key={option.value} id={optionId(index)} role="option" aria-selected={option.value === selected} aria-disabled={option.disabled || undefined} className={index === active ? 'ds-is-active' : ''} onMouseDown={event => event.preventDefault()} onMouseEnter={() => !option.disabled && setActive(index)} onClick={() => choose(option)}>{option.label}</li>) : <li className="ds-combobox-empty" role="presentation">{emptyText}</li>}</ul>}
 </div>;
}

const OverlayContext = createContext<HTMLElement | null>(null);
export function DesignSystemProvider({ children, container, className = '', dotted = false, density = 'default', locale = 'zh-CN', theme = 'light', style }: { children: ReactNode; container?: HTMLElement | null; className?: string; dotted?: boolean; density?: 'default' | 'compact'; locale?: string; theme?: 'light' | 'white' | 'dark'; style?: React.CSSProperties }) {
 const [local, setLocal] = useState<HTMLElement | null>(null);
 const target = container ?? local;
 return <OverlayContext.Provider value={target}><div ref={container ? undefined : setLocal} className={`ds-theme ds-overlay-provider${dotted ? ' ds-theme--dotted' : ''}${theme === 'white' ? ' ds-theme--white' : ''}${theme === 'dark' ? ' ds-theme--dark' : ''}${density === 'compact' ? ' ds-density--compact' : ''} ${className}`} data-density={density} data-theme={theme} lang={locale} style={style}>{children}</div></OverlayContext.Provider>;
}
export const OverlayProvider = DesignSystemProvider;
function portalContainer(explicit: HTMLElement | null | undefined, context: HTMLElement | null) { return explicit ?? context ?? (typeof document !== 'undefined' ? document.body : undefined); }

export const Dialog = DialogPrimitive.Root;
export const ConfirmDialog = AlertDialogPrimitive.Root;
export const ConfirmDialogTrigger = AlertDialogPrimitive.Trigger;
export function ConfirmDialogPortal({ children, container }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal> & { container?: HTMLElement | null }) { const context = useContext(OverlayContext); return <AlertDialogPrimitive.Portal container={portalContainer(container, context)}><div className="ds-theme ds-overlay-root">{children}</div></AlertDialogPrimitive.Portal>; }
export const ConfirmDialogOverlay = forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>>(function ConfirmDialogOverlay({ className = '', ...props }, ref) { return <AlertDialogPrimitive.Overlay ref={ref} className={`ds-scrim ds-is-open ${className}`} {...props}/>; });
export const ConfirmDialogContent = forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & { container?: HTMLElement | null }>(function ConfirmDialogContent({ className = '', container, ...props }, ref) { const context = useContext(OverlayContext); return <AlertDialogPrimitive.Portal container={portalContainer(container, context)}><div className="ds-theme ds-overlay-root"><AlertDialogPrimitive.Overlay className="ds-scrim ds-is-open"/><AlertDialogPrimitive.Content ref={ref} className={`ds-drawer ds-is-open ${className}`} {...props}/></div></AlertDialogPrimitive.Portal>; });
export const ConfirmDialogTitle = AlertDialogPrimitive.Title;
export const ConfirmDialogDescription = AlertDialogPrimitive.Description;
export const ConfirmDialogAction = AlertDialogPrimitive.Action;
export const ConfirmDialogCancel = AlertDialogPrimitive.Cancel;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogContent = forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { container?: HTMLElement | null }>(function DialogContent({ children, container, className = '', ...props }, ref) {
 const context = useContext(OverlayContext); const target = portalContainer(container, context);
 return <DialogPrimitive.Portal container={target}><div className="ds-theme ds-overlay-root"><DialogPrimitive.Overlay className="ds-scrim ds-is-open"/><DialogPrimitive.Content ref={ref} className={`ds-drawer ds-is-open ${className}`} {...props}>{children}</DialogPrimitive.Content></div></DialogPrimitive.Portal>;
});
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export function Drawer(props: React.ComponentProps<typeof DialogPrimitive.Root>) { return <DialogPrimitive.Root {...props} />; }
export const DrawerContent = DialogContent;
export const DrawerTitle = DialogTitle;
export const DrawerDescription = DialogDescription;
export function TooltipProvider({ children, delayDuration = 400 }: { children: ReactNode; delayDuration?: number }) { return <TooltipPrimitive.Provider delayDuration={delayDuration}>{children}</TooltipPrimitive.Provider>; }
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export function TooltipContent({ children, container, className = '', ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { container?: HTMLElement | null }) { const context = useContext(OverlayContext); return <TooltipPrimitive.Portal container={portalContainer(container, context)}><div className="ds-theme ds-portal-theme"><TooltipPrimitive.Content className={`ds-tooltip ${className}`} {...props}>{children}<TooltipPrimitive.Arrow className="ds-tooltip-arrow"/></TooltipPrimitive.Content></div></TooltipPrimitive.Portal>; }
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export function PopoverContent({ children, container, className = '', ...props }: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { container?: HTMLElement | null }) { const context = useContext(OverlayContext); return <PopoverPrimitive.Portal container={portalContainer(container, context)}><div className="ds-theme ds-portal-theme"><PopoverPrimitive.Content className={`ds-popover ${className}`} {...props}>{children}</PopoverPrimitive.Content></div></PopoverPrimitive.Portal>; }
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export function DropdownMenuContent({ children, container, className = '', ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & { container?: HTMLElement | null }) { const context = useContext(OverlayContext); return <DropdownMenuPrimitive.Portal container={portalContainer(container, context)}><div className="ds-theme ds-portal-theme"><DropdownMenuPrimitive.Content className={`ds-menu ${className}`} {...props}>{children}</DropdownMenuPrimitive.Content></div></DropdownMenuPrimitive.Portal>; }
export const DropdownMenuItem = DropdownMenuPrimitive.Item;
export const DropdownMenuCheckboxItem = DropdownMenuPrimitive.CheckboxItem;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = DropdownMenuPrimitive.RadioItem;
export const DropdownMenuLabel = DropdownMenuPrimitive.Label;
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export function ContextMenuContent({ children, container, className = '', ...props }: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> & { container?: HTMLElement | null }) { const context = useContext(OverlayContext); return <ContextMenuPrimitive.Portal container={portalContainer(container, context)}><div className="ds-theme ds-portal-theme"><ContextMenuPrimitive.Content className={`ds-menu ${className}`} {...props}>{children}</ContextMenuPrimitive.Content></div></ContextMenuPrimitive.Portal>; }
export const ContextMenuItem = ContextMenuPrimitive.Item;
export const ContextMenuCheckboxItem = ContextMenuPrimitive.CheckboxItem;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
export const ContextMenuRadioItem = ContextMenuPrimitive.RadioItem;
export const ContextMenuLabel = ContextMenuPrimitive.Label;
export const ContextMenuSeparator = ContextMenuPrimitive.Separator;
export const Tabs = TabsPrimitive.Root;
export const TabsList = forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(function TabsList({ className = '', ...props }, ref) { return <TabsPrimitive.List ref={ref} className={`ds-segmented ${className}`} {...props}/>; });
export const TabsTrigger = TabsPrimitive.Trigger;
export const SegmentedControl = TabsPrimitive.Root;
export const SegmentedControlList = TabsList;
export const SegmentedControlItem = TabsTrigger;
export const TabsContent = TabsPrimitive.Content;
export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(function AccordionItem({ className = '', ...props }, ref) { return <AccordionPrimitive.Item ref={ref} className={`ds-accordion-item ${className}`} {...props}/>; });
export const AccordionTrigger = forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(function AccordionTrigger({ className = '', ...props }, ref) { return <AccordionPrimitive.Header><AccordionPrimitive.Trigger ref={ref} className={`ds-accordion-trigger ${className}`} {...props}/></AccordionPrimitive.Header>; });
export const AccordionContent = forwardRef<React.ElementRef<typeof AccordionPrimitive.Content>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(function AccordionContent({ className = '', ...props }, ref) { return <AccordionPrimitive.Content ref={ref} className={`ds-accordion-content ${className}`} {...props}/>; });
export const Select = SelectPrimitive.Root;
export const SelectTrigger = forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(function SelectTrigger({ className = '', ...props }, ref) { return <SelectPrimitive.Trigger ref={ref} className={`ds-select ${className}`} {...props}/>; });
export const SelectValue = SelectPrimitive.Value;
export function SelectContent({ children, container, className = '', ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & { container?: HTMLElement | null }) { const context = useContext(OverlayContext); return <SelectPrimitive.Portal container={portalContainer(container, context)}><div className="ds-theme ds-portal-theme"><SelectPrimitive.Content className={`ds-menu ${className}`} {...props}>{children}</SelectPrimitive.Content></div></SelectPrimitive.Portal>; }
export const SelectItem = SelectPrimitive.Item;
export const SelectGroup = SelectPrimitive.Group;
export const SelectLabel = SelectPrimitive.Label;
export const SelectSeparator = SelectPrimitive.Separator;
export const RadioGroup = forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>>(function RadioGroup({ className = '', ...props }, ref) { return <RadioGroupPrimitive.Root ref={ref} className={`ds-radio-group ${className}`} {...props}/>; });
export const RadioGroupItem = forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>>(function RadioGroupItem({ className = '', ...props }, ref) { return <RadioGroupPrimitive.Item ref={ref} className={`ds-radio-item ${className}`} {...props}><RadioGroupPrimitive.Indicator className="ds-radio-indicator"/></RadioGroupPrimitive.Item>; });

export type ToastOptions = { id?: string; title: ReactNode; description?: ReactNode; tone?: 'info' | 'success' | 'danger'; duration?: number; action?: { label: string; onClick: () => void } };
type ToastEntry = ToastOptions & { id: string };
type ToastApi = { toast: (options: ToastOptions) => string; dismiss: (id: string) => void; update: (id: string, options: Partial<ToastOptions>) => void };
const ToastContext = createContext<ToastApi | null>(null);
let toastId = 0;
export function ToastProvider({ children, container, duration = 6000 }: { children: ReactNode; container?: HTMLElement | null; duration?: number }) {
 const context = useContext(OverlayContext); const target = portalContainer(container, context);
 const [items, setItems] = useState<ToastEntry[]>([]); const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>()); const mounted = React.useRef(false);
 useEffect(() => { mounted.current = true; return () => { mounted.current = false; timers.current.forEach(clearTimeout); timers.current.clear(); }; }, []);
 const dismiss = useCallback((id: string) => { const timer = timers.current.get(id); if (timer) clearTimeout(timer); timers.current.delete(id); setItems(list => list.filter(item => item.id !== id)); }, []);
 const toast = useCallback((options: ToastOptions) => { const id = options.id ?? `ds-toast-${++toastId}`; setItems(list => [...list.filter(item => item.id !== id), { ...options, id }]); const prior = timers.current.get(id); if (prior) clearTimeout(prior); const time = options.duration ?? duration; if (time > 0) timers.current.set(id, setTimeout(() => dismiss(id), time)); return id; }, [dismiss, duration]);
 const update = useCallback((id: string, options: Partial<ToastOptions>) => { setItems(list => list.map(item => item.id === id ? { ...item, ...options, id } : item)); if (options.duration !== undefined) { const timer = timers.current.get(id); if (timer) clearTimeout(timer); timers.current.delete(id); if (options.duration > 0) timers.current.set(id, setTimeout(() => dismiss(id), options.duration)); } }, [dismiss]);
 const api = useMemo(() => ({ toast, dismiss, update }), [toast, dismiss, update]);
 return <ToastContext.Provider value={api}>{children}{target && items.length > 0 ? <div className="ds-theme ds-overlay-root"><div className="ds-toast-stack" aria-live="polite" aria-relevant="additions">{items.map(item => <div key={item.id} className={`ds-toast ds-toast--${item.tone ?? 'info'}`} role={item.tone === 'danger' ? 'alert' : 'status'}><div className="ds-toast-body"><div className="ds-toast-title">{item.title}</div>{item.description && <div className="ds-toast-desc">{item.description}</div>}</div>{item.action && <Button variant="ghost" size="sm" onClick={() => item.action?.onClick()}>{item.action.label}</Button>}<IconButton aria-label="关闭提示" onClick={() => dismiss(item.id)}>×</IconButton></div>)}</div></div> : null}</ToastContext.Provider>;
}
export function useToast() { const value = useContext(ToastContext); if (!value) throw new Error('useToast must be used within ToastProvider'); return value; }
export function useControllableState<T>({ value, defaultValue, onChange }: { value?: T; defaultValue: T; onChange?: (value: T) => void }) {
 const [state, setState] = useState(defaultValue);
 const controlled = value !== undefined;
 const current = controlled ? value : state;
 const set = useCallback((next: React.SetStateAction<T>) => {
   const resolved = typeof next === 'function' ? (next as (previous: T) => T)(current) : next;
   if (!controlled) setState(resolved);
   onChange?.(resolved);
 }, [controlled, current, onChange]);
 return [current, set] as const;
}

export type FormValues = Record<string, unknown>;
export type FormErrors<T extends FormValues> = Partial<Record<keyof T, string>>;
export type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';
export type UseFormOptions<T extends FormValues> = {
 initialValues: T;
 validate?: (values: T) => FormErrors<T> | Promise<FormErrors<T>>;
 onSubmit: (values: T) => void | Promise<void>;
};
export function useForm<T extends FormValues>({ initialValues, validate: validateValues, onSubmit }: UseFormOptions<T>) {
 const [values, setValues] = useState<T>(initialValues);
 const [errors, setErrorsState] = useState<FormErrors<T>>({});
 const [status, setStatus] = useState<FormStatus>('idle');
 const [submitError, setSubmitError] = useState<unknown>();
 const submitting = React.useRef(false);
 const sequence = React.useRef(0);
 const mounted = React.useRef(false);
 const focusTarget = React.useRef<HTMLFormElement | null>(null);
 useEffect(() => { mounted.current = true; return () => { mounted.current = false; sequence.current++; }; }, []);
 useEffect(() => {
  if (status !== 'error' || !Object.keys(errors).length || !focusTarget.current) return;
  focusTarget.current.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  focusTarget.current = null;
 }, [errors, status]);
 const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
  sequence.current++;
  submitting.current = false;
  setValues(current => ({ ...current, [field]: value }));
  setErrorsState(current => { if (!(field in current)) return current; const next = { ...current }; delete next[field]; return next; });
  setSubmitError(undefined);
  setStatus('idle');
 }, []);
 const setFieldError = useCallback(<K extends keyof T>(field: K, message?: string) => {
  setErrorsState(current => { const next = { ...current }; if (message) next[field] = message; else delete next[field]; return next; });
 }, []);
 const setErrors = useCallback((next: FormErrors<T>) => setErrorsState(next), []);
 const reset = useCallback((nextValues: T = initialValues) => {
  sequence.current++;
  submitting.current = false;
  setValues(nextValues);
  setErrorsState({});
  setSubmitError(undefined);
  setStatus('idle');
 }, [initialValues]);
 const validate = useCallback(async (valuesToCheck: T = values) => {
  const request = ++sequence.current;
  setStatus('validating');
  setSubmitError(undefined);
  try {
   const nextErrors = await validateValues?.(valuesToCheck) ?? {};
   if (mounted.current && sequence.current === request) {
    setErrorsState(nextErrors);
    setStatus(Object.keys(nextErrors).length ? 'error' : 'idle');
   }
   return nextErrors;
  } catch (error) {
   if (mounted.current && sequence.current === request) { setSubmitError(error); setStatus('error'); }
   throw error;
  }
 }, [validateValues, values]);
 const submit = useCallback(async () => {
  if (submitting.current) return false;
  submitting.current = true;
  const request = ++sequence.current;
  setStatus('validating');
  setSubmitError(undefined);
  try {
   const nextErrors = await validateValues?.(values) ?? {};
   if (!mounted.current || sequence.current !== request) return false;
   setErrorsState(nextErrors);
   if (Object.keys(nextErrors).length) { setStatus('error'); return false; }
   setStatus('submitting');
   await onSubmit(values);
   if (mounted.current && sequence.current === request) setStatus('success');
   return true;
  } catch (error) {
   if (mounted.current && sequence.current === request) { setSubmitError(error); setStatus('error'); }
   return false;
  } finally {
   if (sequence.current === request) submitting.current = false;
  }
 }, [onSubmit, validateValues, values]);
 const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  focusTarget.current = event.currentTarget;
  void submit();
 }, [submit]);
 return { values, errors, status, submitError, isValidating: status === 'validating', isSubmitting: status === 'submitting', isSuccess: status === 'success', setFieldValue, setFieldError, setErrors, validate, submit, handleSubmit, reset } as const;
}

export type AsyncActionStatus = 'idle' | 'pending' | 'success' | 'error';
export function useAsyncAction<Args extends unknown[], Result>(action: (...args: Args) => Promise<Result>) {
 const [status, setStatus] = useState<AsyncActionStatus>('idle');
 const [data, setData] = useState<Result | undefined>();
 const [error, setError] = useState<unknown>();
 const sequence = React.useRef(0);
 const reset = useCallback(() => { sequence.current++; setStatus('idle'); setData(undefined); setError(undefined); }, []);
 const execute = useCallback(async (...args: Args): Promise<Result> => {
  const id = ++sequence.current; setStatus('pending'); setError(undefined);
  try { const result = await action(...args); if (sequence.current === id) { setData(result); setStatus('success'); } return result; }
  catch (reason) { if (sequence.current === id) { setError(reason); setStatus('error'); } throw reason; }
 }, [action]);
 return { status, data, error, pending: status === 'pending', execute, reset } as const;
}
