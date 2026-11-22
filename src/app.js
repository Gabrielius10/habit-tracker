(function () {
  const KEY = 'habit-tracker:v1';
  const S = window.Streaks;
  let habits = load();
  let chart = null;

  const $ = (id) => document.getElementById(id);

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(habits)); } catch { /* storage unavailable */ }
  }

  function toggleToday(id) {
    const h = habits.find((x) => x.id === id);
    const t = S.todayStr();
    h.dates = h.dates.includes(t) ? h.dates.filter((d) => d !== t) : [...h.dates, t];
    save(); render();
  }
  function rename(id) {
    const h = habits.find((x) => x.id === id);
    const name = prompt('Rename habit:', h.name);
    if (name && name.trim()) { h.name = name.trim(); save(); render(); }
  }
  function remove(id) {
    if (!confirm('Delete this habit and its history?')) return;
    habits = habits.filter((x) => x.id !== id);
    save(); render();
  }

  function button(label, cls, onClick) {
    const b = document.createElement('button');
    b.textContent = label; b.className = cls; b.onclick = onClick;
    return b;
  }

  function render() {
    const today = S.todayStr();
    const list = $('habits');
    list.replaceChildren();
    $('empty').hidden = habits.length > 0;

    habits.forEach((h) => {
      const done = h.dates.includes(today);
      const li = document.createElement('li');
      li.className = 'habit' + (done ? ' done' : '');

      const info = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = h.name; // textContent avoids XSS
      const stats = document.createElement('small');
      stats.textContent = `🔥 ${S.currentStreak(h.dates, today)} day streak · best ${S.longestStreak(h.dates)}`;
      info.append(name, document.createElement('br'), stats);

      const actions = document.createElement('div');
      actions.className = 'actions';
      actions.append(
        button(done ? '✓ Done' : 'Mark done', 'primary', () => toggleToday(h.id)),
        button('Edit', '', () => rename(h.id)),
        button('Delete', 'danger', () => remove(h.id))
      );
      li.append(info, actions);
      list.append(li);
    });
    renderChart(today);
  }

  function renderChart(today) {
    if (typeof Chart === 'undefined') return; // CDN unavailable
    const data = S.completionsPerDay(habits, 7, today);
    const labels = data.map((d) => d.day.slice(5));
    const values = data.map((d) => d.count);
    if (chart) { chart.data.labels = labels; chart.data.datasets[0].data = values; chart.update(); return; }
    chart = new Chart($('chart'), {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Habits completed', data: values, backgroundColor: '#6366f1' }] },
      options: { scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { display: false } } },
    });
  }

  $('add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('new-habit');
    const name = input.value.trim();
    if (!name) return;
    habits.push({ id: Date.now().toString(36), name, dates: [] });
    input.value = '';
    save(); render();
  });

  render();
})();
