/* 方寸设计系统 · 通用交互（无框架、无业务依赖）
   提供两件事：DS.toast() 提示、DS.drawer() 抽屉/弹窗行为。
   依赖：src/ui/icons.js 提供的图标精灵（#i-check / #i-x / #i-info）。 */
(function (global) {
  'use strict';

  var DS = global.DS || (global.DS = {});

  /* ---------- 提示 ---------- */
  DS.toast = function (options) {
    var opts = options || {};
    var type = opts.type || 'info';
    var icon = { success: 'i-check', danger: 'i-x', info: 'i-info' }[type] || 'i-info';

    var container = opts.container || document.body;
    var stack = container.querySelector('.ds-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'ds-toast-stack';
      stack.setAttribute('aria-live', 'polite');
      container.appendChild(stack);
    }

    var el = document.createElement('div');
    el.className = 'ds-toast ds-toast--' + type;
    el.setAttribute('role', type === 'danger' ? 'alert' : 'status');
    el.innerHTML =
      '<svg class="ds-ico" width="16" height="16"><use href="#' + icon + '"/></svg>' +
      '<div class="ds-toast-body"><div class="ds-toast-title"></div><div class="ds-toast-desc"></div></div>';
    el.querySelector('.ds-toast-title').textContent = opts.title || '';
    var descEl = el.querySelector('.ds-toast-desc');
    if (opts.desc) descEl.textContent = opts.desc; else descEl.remove();

    var timer;
    var close = function () { clearTimeout(timer); el.remove(); if (!stack.children.length) stack.remove(); };

    if (opts.action) {
      var actionBtn = document.createElement('button');
      actionBtn.className = 'ds-btn ds-btn-ghost';
      actionBtn.type = 'button';
      actionBtn.textContent = opts.action.label;
      actionBtn.addEventListener('click', function () {
        close();
        if (opts.action.onClick) opts.action.onClick();
      });
      el.appendChild(actionBtn);
    }

    var closeBtn = document.createElement('button');
    closeBtn.className = 'ds-btn ds-btn-ghost ds-btn-icon';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', '关闭提示');
    closeBtn.innerHTML = '<svg class="ds-ico" width="13" height="13"><use href="#i-x"/></svg>';
    closeBtn.addEventListener('click', close);
    el.appendChild(closeBtn);

    stack.appendChild(el);
    if (opts.timeout !== 0) timer = setTimeout(close, opts.timeout == null ? 6000 : opts.timeout);
    return el;
  };

  /* ---------- 抽屉 / 弹窗 ----------
     只负责行为：遮罩、Esc、点击遮罩关闭、Tab 焦点锁、关闭后焦点回位。
     开关状态用 .ds-is-open；内容、表单校验、数据由调用方处理。 */
  DS.drawer = function (config) {
    var panel = config.panel;
    var scrim = config.scrim;
    var restoreTo = null;
    var originalOverflow = null;
    var disposed = false;
    var keyHandler = function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    };

    function focusables() {
      return Array.prototype.slice
        .call(panel.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    }

    function isOpen() {
      return panel.classList.contains('ds-is-open');
    }

    function open(opts) {
      var o = opts || {};
      restoreTo = o.restoreFocus || document.activeElement;
      if (scrim) scrim.classList.add('ds-is-open');
      panel.classList.add('ds-is-open');
      panel.setAttribute('aria-hidden', 'false');
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      var target = o.focus || panel.querySelector('input, select, textarea, button');
      if (target) {
        target.focus();
        if (target.select) target.select();
      }
    }

    function close() {
      if (!isOpen()) return;
      if (scrim) scrim.classList.remove('ds-is-open');
      panel.classList.remove('ds-is-open');
      panel.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = originalOverflow || '';
      originalOverflow = null;
      if (restoreTo && restoreTo.focus && restoreTo.isConnected) restoreTo.focus();
      if (config.onClose) config.onClose();
    }

    var closeButtons = Array.from(panel.querySelectorAll('[data-ds-close]'));
    if (scrim) scrim.addEventListener('click', close);
    closeButtons.forEach(function (btn) { btn.addEventListener('click', close); });
    document.addEventListener('keydown', keyHandler);

    function dispose() {
      if (disposed) return;
      disposed = true;
      close();
      document.removeEventListener('keydown', keyHandler);
      if (scrim) scrim.removeEventListener('click', close);
      closeButtons.forEach(function (btn) { btn.removeEventListener('click', close); });
    }
    return { open: open, close: close, isOpen: isOpen, destroy: dispose, dispose: dispose };
  };
})(globalThis);
