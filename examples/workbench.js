const records = [
  ['组件规范 / Component guide', 'active', '林晓', 128, '11-04 16:40'],
  ['资源目录', 'active', '陈予', 64, '11-04 15:12'],
  ['协作说明', 'pending', 'Alex', 8, '11-04 14:05'],
  ['界面图标 / Interface icons', 'active', '林晓', 256, '11-04 13:30'],
  ['排版参考', 'archived', '陈予', 32, '11-03 17:20'],
  ['快捷键清单', 'active', 'Alex', 24, '11-03 16:08'],
  ['入门指南', 'active', '陈予', 16, '11-03 11:45'],
  ['历史版本说明', 'archived', '林晓', 48, '11-02 18:10'],
  ['本地化词汇表', 'active', 'Alex', 1024, '11-02 14:25'],
  ['共享素材', 'pending', '林晓', 96, '11-02 10:10'],
  ['布局参考', 'active', '陈予', 12, '11-01 16:50'],
  ['归档索引', 'archived', 'Alex', 320, '11-01 09:30'],
];
const states = { active: ['进行中', 'info'], archived: ['已归档', 'neutral'], pending: ['待整理', 'warn'] };
const rows = document.querySelector('#record-rows');
const search = document.querySelector('#record-search');
const owner = document.querySelector('#owner-filter');
const tabs = [...document.querySelectorAll('[data-view]')];
let view = 'all';
function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const visible = records.map((record, index) => ({ record, id: `ITEM-${String(index + 1).padStart(3, '0')}` }))
    .filter(({ record: [name, state, person], id }) => (view === 'all' || state === view) && (owner.value === 'all' || person === owner.value) && `${name} ${id}`.toLocaleLowerCase().includes(query));
  // 仅插入固定示例数据；搜索输入只用于匹配，不进入 HTML。
  rows.innerHTML = visible.map(({ record: [name, state, person, count, time], id }) => `<tr>
    <td><span class="ds-cell-title">${name}</span><span class="ds-cell-meta ds-mono">${id}</span></td>
    <td><span class="ds-tag ds-tag--${states[state][1]}">${states[state][0]}</span></td>
    <td>${person}</td><td class="wb-numeric">${count.toLocaleString('en-US')}</td>
    <td class="ds-number">2026-${time}</td>
    <td class="ds-cell-actions"><button class="ds-btn ds-btn-ghost ds-btn-sm" aria-label="展开 ${id}" aria-expanded="false" aria-controls="detail-${id}" data-detail="${id}">展开</button></td>
    </tr><tr class="wb-detail" id="detail-${id}" hidden><td colspan="6"><strong>${id}</strong> · ${name} · 由 ${person} 维护。此处展示与当前条目相关的补充说明。</td></tr>`).join('') || '<tr><td colspan="6"><div class="ds-empty"><strong>没有匹配的条目</strong><p>请调整关键词、负责人或视图。</p></div></td></tr>';
  document.querySelector('#record-count').textContent = `显示 ${visible.length} / ${records.length} 个条目`;
}
function selectTab(tab) {
  view = tab.dataset.view;
  for (const item of tabs) { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; }
  document.querySelector('#record-panel').setAttribute('aria-labelledby', tab.id);
  render();
}
for (const tab of tabs) {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let index = tabs.indexOf(tab);
    if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') index = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = tabs.length - 1;
    else return;
    event.preventDefault(); tabs[index].focus(); selectTab(tabs[index]);
  });
}
search.addEventListener('input', render);
owner.addEventListener('change', render);
document.querySelector('.wb-filters').addEventListener('submit', event => event.preventDefault());
document.querySelector('.wb-filters').addEventListener('reset', () => { search.value = ''; owner.value = 'all'; render(); });
rows.addEventListener('click', event => {
  const button = event.target.closest('[data-detail]');
  if (!button) return;
  const expanded = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(expanded));
  button.setAttribute('aria-label', `${expanded ? '收起' : '展开'} ${button.dataset.detail}`);
  button.textContent = expanded ? '收起' : '展开';
  document.querySelector(`#detail-${button.dataset.detail}`).hidden = !expanded;
});
document.querySelector('#summary-open').addEventListener('click', () => document.querySelector('#summary').showModal());
render();
