/* 组件展示页交互：只演示组件行为，不含业务逻辑 */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 分段控件：单选切换 */
  var seg = $('#g-seg');
  if (seg) {
    seg.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      $$('button', seg).forEach(function (b) { b.setAttribute('aria-selected', String(b === btn)); });
    });
  }

  /* Toast 演示 */
  var messages = {
    success: { type: 'success', title: '导出任务已创建', desc: '完成后可在通知中心下载 CSV 文件。' },
    danger: { type: 'danger', title: '导出失败', desc: '服务返回 502，请稍后重试。', action: { label: '重试' } },
    info: { type: 'info', title: '已提交重跑', desc: '「登录与权限回归」已排队，预计 3 分钟内开始。' },
  };
  $$('[data-toast]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var conf = messages[btn.getAttribute('data-toast')];
      DS.toast(conf.type === 'danger' ? Object.assign({}, conf, { action: { label: '重试', onClick: function () { DS.toast(messages.success); } } }) : conf);
    });
  });

  /* 抽屉演示 */
  var drawer = $('#g-drawer');
  var form = $('#g-form');
  var drawerUI = DS.drawer({ panel: drawer, scrim: $('#g-scrim') });

  $('#g-open').addEventListener('click', function () {
    drawerUI.open({ focus: $('#g-d-name') });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#g-d-name');
    if (!name.value.trim()) {
      name.closest('.ds-field').classList.add('ds-is-invalid');
      name.focus();
      return;
    }
    name.closest('.ds-field').classList.remove('ds-is-invalid');
    drawerUI.close();
    DS.toast({ type: 'success', title: '巡检已创建', desc: '「' + name.value.trim() + '」已加入列表，状态为草稿。' });
    form.reset();
  });
})();
