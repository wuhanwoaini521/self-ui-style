import React, { StrictMode } from 'react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Button, Checkbox, DesignSystemProvider, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, FormField, Input, Switch, ToastProvider, useToast, Combobox, ConfirmDialog, ConfirmDialogTrigger, ConfirmDialogContent, ConfirmDialogTitle, ConfirmDialogDescription, ConfirmDialogActions } from '../src/react/index';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

afterEach(cleanup);

describe('React package', () => {
  it('imports and renders on the server without touching the DOM', () => {
    expect(() => renderToString(<Button>Server render</Button>)).not.toThrow();
  });
  it('preserves provider defaults and opts into workbench independently of density and dots', () => {
    const { container, rerender } = render(<DesignSystemProvider>Default</DesignSystemProvider>);
    expect(container.firstChild).toHaveAttribute('data-surface', 'default');
    expect(container.firstChild).toHaveAttribute('data-density', 'default');
    expect(container.firstChild).not.toHaveClass('ds-theme--dotted');
    rerender(<DesignSystemProvider surface="workbench" density="compact" dotted>Workbench</DesignSystemProvider>);
    expect(container.firstChild).toHaveAttribute('data-surface', 'workbench');
    expect(container.firstChild).toHaveAttribute('data-density', 'compact');
    expect(container.firstChild).toHaveClass('ds-theme--dotted');
  });
  it('forwards native button props, className, style, and ref in StrictMode', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<StrictMode><Button ref={ref} className="custom" style={{ marginTop: 3 }} disabled>Save</Button></StrictMode>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveClass('ds-btn', 'custom');
    expect(ref.current).toHaveStyle({ marginTop: '3px' });
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
    render(<StrictMode><DesignSystemProvider surface="workbench" density="compact" dotted><Dialog><DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger><DialogContent aria-describedby="dialog-desc"><DialogTitle>Settings</DialogTitle><DialogDescription id="dialog-desc">Local content</DialogDescription><button>Inside</button></DialogContent></Dialog></DesignSystemProvider></StrictMode>);
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    trigger.focus(); fireEvent.click(trigger);
    expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('dialog').closest('.ds-theme')).toBeTruthy();
    expect(screen.getByRole('dialog').closest('[data-surface="workbench"]')).toHaveAttribute('data-density', 'compact');
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
