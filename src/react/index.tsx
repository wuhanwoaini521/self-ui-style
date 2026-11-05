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
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg' };
export const Button = forwardRef<HTMLButtonElement, NativeButtonProps>(function Button({ variant, size, className = '', ...props }, ref) {
  return <button ref={ref} className={['ds-btn', variant === 'primary' && 'ds-btn-primary', variant === 'ghost' && 'ds-btn-ghost', size === 'sm' && 'ds-btn-sm', size === 'lg' && 'ds-btn-lg', className].filter(Boolean).join(' ')} {...props} />;
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
 const describedBy = [hint && `${htmlFor}-hint`, error && `${htmlFor}-error`].filter(Boolean).join(' ') || undefined;
 const control = React.isValidElement(children) ? React.cloneElement(children as React.ReactElement<{ id?: string; required?: boolean; 'aria-invalid'?: boolean; 'aria-describedby'?: string }>, { id: htmlFor, required, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy }) : children;
 return <div ref={ref} className={`ds-field${error ? ' ds-is-invalid' : ''} ${className}`} {...props}><label className="ds-field-label" htmlFor={htmlFor}>{label}{required && <span className="ds-req" aria-hidden="true"> *</span>}</label>{control}{hint && <span className="ds-field-hint" id={`${htmlFor}-hint`}>{hint}</span>}{error && <span className="ds-field-error" id={`${htmlFor}-error`} role="alert">{error}</span>}</div>;
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
export type ComboboxOption = { value: string; label: string; disabled?: boolean };
export function Combobox({ options, value, defaultValue = '', onValueChange, label, placeholder = '请选择或搜索', emptyText = '没有匹配项', className = '', disabled, id, name, required }: { options: ComboboxOption[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; label: string; placeholder?: string; emptyText?: string; className?: string; disabled?: boolean; id?: string; name?: string; required?: boolean }) {
 const [selected, setSelected] = useControllableState({ value, defaultValue, onChange: onValueChange }); const [query, setQuery] = useState(''); const [open, setOpen] = useState(false); const [active, setActive] = useState(0); const generatedId = React.useId(); const listId = `${id ?? generatedId}-list`; const optionId = (index: number) => `${id ?? generatedId}-${index}`; const filtered = options.filter(option => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())); const current = filtered[active];
 return <div className={`ds-combobox ${className}`} onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); setActive(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) % Math.max(filtered.length, 1)); } else if (event.key === 'Enter' && open && current && !current.disabled) { event.preventDefault(); setSelected(current.value); setQuery(''); setOpen(false); } else if (event.key === 'Escape') setOpen(false); }}>
  <input className="ds-input" id={id} name={name} required={required} disabled={disabled} role="combobox" aria-label={label} aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={open && current ? optionId(active) : undefined} value={open ? query : options.find(option => option.value === selected)?.label ?? ''} placeholder={placeholder} onFocus={() => !disabled && setOpen(true)} onChange={event => { setQuery(event.target.value); setActive(0); setOpen(true); }}/>
  {open && <ul className="ds-combobox-list" id={listId} role="listbox" aria-label={label}>{filtered.length ? filtered.map((option, index) => <li key={option.value} id={optionId(index)} role="option" aria-selected={option.value === selected} aria-disabled={option.disabled || undefined} className={index === active ? 'ds-is-active' : ''} onMouseDown={event => event.preventDefault()} onMouseEnter={() => setActive(index)} onClick={() => { if (!option.disabled) { setSelected(option.value); setQuery(''); setOpen(false); } }}>{option.label}</li>) : <li className="ds-combobox-empty" role="presentation">{emptyText}</li>}</ul>}
 </div>;
}

const OverlayContext = createContext<HTMLElement | null>(null);
export function DesignSystemProvider({ children, container, className = '', dotted = false, density = 'default', locale = 'zh-CN', style }: { children: ReactNode; container?: HTMLElement | null; className?: string; dotted?: boolean; density?: 'default' | 'compact'; locale?: string; style?: React.CSSProperties }) {
 const [local, setLocal] = useState<HTMLElement | null>(null);
 const target = container ?? local;
 return <OverlayContext.Provider value={target}><div ref={container ? undefined : setLocal} className={`ds-theme ds-overlay-provider${dotted ? ' ds-theme--dotted' : ''} ${className}`} data-density={density} lang={locale} style={style}>{children}</div></OverlayContext.Provider>;
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
export function useControllableState<T>({ value, defaultValue, onChange }: { value?: T; defaultValue: T; onChange?: (value: T) => void }) { const [state, setState] = useState(defaultValue); const controlled = value !== undefined; const current = controlled ? value : state; const set = useCallback((next: T) => { if (!controlled) setState(next); onChange?.(next); }, [controlled, onChange]); return [current, set] as const; }
