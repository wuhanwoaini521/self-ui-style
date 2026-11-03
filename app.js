/* 样板页交互：筛选、加载、空态、抽屉表单、提示。仅用原生 API，无依赖。 */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const tbody = $('#rows');
  const segButtons = Array.from(document.querySelectorAll('.segmented [data-status]'));
  const tableFilter = $('#table-filter');
  const rowCount = $('#row-count');
  const toasts = $('#toasts');

  let rows = Array.from(tbody.querySelectorAll('tr'));
  let activeStatus = 'all';
  let query = '';

  /* ---------- 提示 ---------- */
  function toast({ type = 'info', title, desc, action }) {
    const icon = { success: 'i-check', danger: 'i-x', info: 'i-info' }[type] || 'i-info';
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.setAttribute('role', type === 'danger' ? 'alert' : 'status');
    el.innerHTML =
      `<svg class="ico" width="16" height="16"><use href="#${icon}"/></svg>
       <div class="toast-body"><div class="toast-title"></div><div class="toast-desc"></div></div>`;
    $('.toast-title', el).textContent = title;
    const descEl = $('.toast-desc', el);
    if (desc) descEl.textContent = desc; else descEl.remove();

    let timer;
    const close = () => { clearTimeout(timer); el.remove(); };

    if (action) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-ghost';
      btn.type = 'button';
      btn.textContent = action.label;
      btn.addEventListener('click', () => { close(); action.onClick && action.onClick(); });
      el.appendChild(btn);
    }
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-ghost btn-icon';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', '关闭提示');
    closeBtn.innerHTML = '<svg class="ico" width="13" height="13"><use href="#i-x"/></svg>';
    closeBtn.addEventListener('click', close);
    el.appendChild(closeBtn);

    toasts.appendChild(el);
    timer = setTimeout(close, 6000);
    return el;
  }

  /* ---------- 列表筛选 ---------- */
  function applyFilter() {
    const empty = $('#empty-row');
    if (empty) empty.remove();

    let visible = 0;
    rows.forEach((tr) => {
      const okStatus = activeStatus === 'all' || tr.dataset.status === activeStatus;
      const okQuery = !query || tr.textContent.toLowerCase().includes(query);
      const show = okStatus && okQuery;
      tr.hidden = !show;
      if (show) visible += 1;
    });

    if (!visible && rows.length) {
      const tr = document.createElement('tr');
      tr.id = 'empty-row';
      tr.innerHTML =
        `<td colspan="7"><div class="empty">
           <span class="empty-mark"><svg class="ico" width="18" height="18"><use href="#i-inbox"/></svg></span>
           <h3>没有匹配的巡检任务</h3>
           <p>换个关键词，或清除状态筛选后再试。也可以直接新建一个巡检。</p>
           <button class="btn" type="button" id="empty-reset">清除筛选</button>
         </div></td>`;
      tbody.appendChild(tr);
      $('#empty-reset').addEventListener('click', () => {
        activeStatus = 'all';
        query = '';
        tableFilter.value = '';
        segButtons.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.status === 'all')));
        applyFilter();
        tableFilter.focus();
      });
    }
    rowCount.textContent = `共 ${visible} 条`;
    updateCounts();
  }

  function updateCounts() {
    const counts = rows.reduce((acc, tr) => {
      acc[tr.dataset.status] = (acc[tr.dataset.status] || 0) + 1;
      return acc;
    }, {});
    segButtons.forEach((b) => {
      const n = b.dataset.status === 'all' ? rows.length : counts[b.dataset.status] || 0;
      const el = b.querySelector('.count');
      if (el) el.textContent = n;
      b.disabled = n === 0; // 无数据的状态不可选，避免陷入空列表
    });
  }

  segButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeStatus = btn.dataset.status;
      segButtons.forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
      applyFilter();
    });
  });

  tableFilter.addEventListener('input', () => {
    query = tableFilter.value.trim().toLowerCase();
    applyFilter();
  });

  /* ---------- 刷新（加载态） ---------- */
  const btnRefresh = $('#btn-refresh');
  btnRefresh.addEventListener('click', () => {
    if (btnRefresh.disabled) return;
    btnRefresh.disabled = true;
    $('.ico', btnRefresh).style.animation = 'spin .8s linear infinite';

    const skeleton = document.createElement('tbody');
    skeleton.id = 'skeleton';
    skeleton.innerHTML = Array.from({ length: 5 }).map((_, i) =>
      `<tr class="skeleton-row">
         <td><span class="skeleton" style="width:${i % 2 ? 56 : 66}%"></span></td>
         <td><span class="skeleton" style="width:52%"></span></td>
         <td><span class="skeleton" style="width:60%"></span></td>
         <td><span class="skeleton" style="width:46%"></span></td>
         <td colspan="3"></td>
       </tr>`).join('');
    tbody.hidden = true;
    tbody.after(skeleton);

    setTimeout(() => {
      skeleton.remove();
      tbody.hidden = false;
      btnRefresh.disabled = false;
      $('.ico', btnRefresh).style.animation = '';
      toast({ type: 'success', title: '列表已更新', desc: `最近同步于刚刚，共 ${rows.length} 条巡检任务。` });
    }, 900);
  });

  /* ---------- 导出（失败态 + 重试） ---------- */
  const btnExport = $('#btn-export');
  btnExport.addEventListener('click', () => {
    if (btnExport.disabled) return;
    const label = btnExport.innerHTML;
    btnExport.disabled = true;
    btnExport.innerHTML = '<span class="spinner"><i></i><i></i><i></i></span>导出中';
    setTimeout(() => {
      btnExport.disabled = false;
      btnExport.innerHTML = label;
      toast({
        type: 'danger',
        title: '导出失败',
        desc: '服务暂时不可用（502），本次导出未生成文件。',
        action: { label: '重试', onClick: () => btnExport.click() },
      });
    }, 1000);
  });

  /* ---------- 内联提示：同步重试 ---------- */
  $('#btn-retry-sync').addEventListener('click', () => {
    const banner = $('#sync-banner');
    const btn = $('#btn-retry-sync');
    btn.disabled = true;
    btn.textContent = '同步中…';
    setTimeout(() => {
      banner.remove();
      toast({ type: 'success', title: '同步完成', desc: '3 个任务的结果已更新到最新状态。' });
    }, 1100);
  });
  document.querySelectorAll('[data-dismiss]').forEach((btn) => {
    btn.addEventListener('click', () => document.getElementById(btn.dataset.dismiss)?.remove());
  });

  /* ---------- 抽屉 ---------- */
  const drawer = $('#drawer');
  const scrim = $('#scrim');
  const form = $('#task-form');
  const nameInput = $('#f-name');
  const nameField = $('#field-name');
  const saveBtn = $('#btn-save');
  const drawerTitle = $('#drawer-title');
  const drawerDesc = $('#drawer-desc');
  const modeNote = $('#drawer-mode-note');
  let editingRow = null;

  function setMode(row) {
    editingRow = row || null;
    drawerTitle.textContent = row ? '编辑巡检' : '新建巡检';
    drawerDesc.textContent = row
      ? `任务编号 ${row.querySelector('.cell-meta').textContent} · 修改后将在下次执行时生效。`
      : '创建后将在下一次计划时间开始执行，可随时手动重跑。';
    saveBtn.textContent = row ? '保存修改' : '创建巡检';
    modeNote.textContent = row ? '保存后记录一条变更日志。' : '将保存为草稿，可在列表中继续编辑。';

    nameInput.value = row ? row.dataset.name : '';
    $('#f-env').value = row ? row.dataset.env : '预发布';
    $('#f-owner').value = row ? row.dataset.owner : '林清';
    $('#f-note').value = '';
    nameField.classList.remove('is-invalid');
    updateNameCount();
  }

  function openDrawer(row) {
    setMode(row);
    scrim.classList.add('is-open');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    nameInput.focus();
    nameInput.select();
  }

  function closeDrawer() {
    scrim.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (editingRow) $('[data-action="view"]', editingRow)?.focus();
    else $('#btn-create').focus();
  }

  $('#btn-create').addEventListener('click', () => openDrawer(null));
  document.querySelectorAll('[data-close-drawer]').forEach((b) => b.addEventListener('click', closeDrawer));
  scrim.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (!drawer.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
    if (e.key !== 'Tab') return;
    // 焦点限制在抽屉内
    const items = Array.from(drawer.querySelectorAll('button, input, select, textarea'))
      .filter((el) => !el.disabled && el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  function updateNameCount() {
    $('#f-name-count').textContent = `${nameInput.value.length}/60`;
  }
  nameInput.addEventListener('input', () => {
    updateNameCount();
    if (nameField.classList.contains('is-invalid') && nameInput.value.trim()) {
      nameField.classList.remove('is-invalid');
    }
  });

  /* ---------- 保存（校验 + 提交中） ---------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) {
      nameField.classList.add('is-invalid');
      nameInput.focus();
      return;
    }

    const payload = {
      name,
      env: $('#f-env').value,
      owner: $('#f-owner').value,
    };

    saveBtn.disabled = true;
    const label = saveBtn.textContent;
    saveBtn.innerHTML = '<span class="spinner"><i></i><i></i><i></i></span>保存中';
    setTimeout(() => {
      saveBtn.disabled = false;
      saveBtn.textContent = label;
      if (editingRow) {
        updateRow(editingRow, payload);
        toast({ type: 'success', title: '修改已保存', desc: `「${name}」将在下次执行时使用新配置。` });
      } else {
        const row = buildRow(payload);
        rows.unshift(row);
        tbody.prepend(row);
        activeStatus = 'all';
        query = '';
        tableFilter.value = '';
        segButtons.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.status === 'all')));
        applyFilter();
        toast({ type: 'success', title: '巡检已创建', desc: `「${name}」已加入列表，状态为草稿。` });
        tbody.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      closeDrawer();
    }, 900);
  });

  function updateRow(tr, data) {
    tr.dataset.name = data.name;
    tr.dataset.env = data.env;
    tr.dataset.owner = data.owner;
    const title = $('.cell-title', tr);
    title.textContent = data.name;
    title.title = data.name;
    tr.children[1].textContent = data.env;
    const owner = $('.cell-owner', tr);
    owner.textContent = '';
    const av = document.createElement('span');
    av.className = 'avatar';
    av.textContent = data.owner.slice(0, 1);
    owner.append(av, data.owner);
  }

  function buildRow(data) {
    const tr = document.createElement('tr');
    tr.dataset.status = 'draft';
    tr.dataset.name = data.name;
    tr.dataset.env = data.env;
    tr.dataset.owner = data.owner;
    tr.innerHTML =
      `<td>
         <span class="cell-title"></span>
         <span class="cell-meta mono">QA-I-${1043 + Math.floor(Math.random() * 60)}</span>
       </td>
       <td></td>
       <td><span class="cell-owner"><span class="avatar"></span><span class="owner-name"></span></span></td>
       <td><span class="tag tag--neutral"><svg class="ico" width="12" height="12"><use href="#i-dot"/></svg>草稿</span></td>
       <td><span class="progress-cell"><span class="progress"><span style="width:0%"></span></span><span class="progress-num mono">0%</span></span></td>
       <td class="cell-meta">刚刚</td>
       <td class="cell-actions">
         <button class="btn btn-ghost" type="button" data-action="view">查看</button>
         <button class="btn btn-ghost" type="button" data-action="rerun">重跑</button>
       </td>`;
    $('.cell-title', tr).textContent = data.name;
    $('.cell-title', tr).title = data.name;
    tr.children[1].textContent = data.env;
    $('.avatar', tr).textContent = data.owner.slice(0, 1);
    $('.owner-name', tr).textContent = data.owner;
    return tr;
  }

  /* ---------- 行内操作 ---------- */
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const tr = btn.closest('tr');
    if (btn.dataset.action === 'view') { openDrawer(tr); return; }

    const name = tr.dataset.name;
    const el = btn;
    el.disabled = true;
    el.textContent = '提交中';
    setTimeout(() => {
      el.disabled = false;
      el.textContent = '重跑';
      toast({ type: 'info', title: '已提交重跑', desc: `「${name}」已排队，预计 3 分钟内开始。` });
    }, 700);
  });

  /* ---------- 顶栏搜索 ⌘K ---------- */
  const globalSearch = $('#global-search');
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      globalSearch.focus();
      globalSearch.select();
    }
  });
  globalSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && globalSearch.value.trim()) {
      tableFilter.value = globalSearch.value.trim();
      query = tableFilter.value.toLowerCase();
      applyFilter();
      toast({ type: 'info', title: '已在列表中筛选', desc: `关键词：${globalSearch.value.trim()}` });
    }
  });

  applyFilter();

  /* ---------- 背景点阵视差：两层以不同速度位移，滚动时产生起伏纵深 ---------- */
  const root = document.documentElement;
  const scrollArea = $('.main-scroll');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;

  function shiftBackground() {
    if (reduceMotion.matches) return;
    const y = scrollArea ? scrollArea.scrollTop : window.scrollY;
    // 细点阵跟随较快、大颗粒较慢，速度差形成「表面在流动」的错觉
    root.style.setProperty('--bg-shift-fine', `${(-y * 0.32).toFixed(2)}px`);
    root.style.setProperty('--bg-shift-bump', `${(y * 0.12).toFixed(2)}px`);
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(shiftBackground);
  }

  if (scrollArea) scrollArea.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  shiftBackground();
})();
