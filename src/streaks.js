// Pure date/streak logic. Dates are 'YYYY-MM-DD' strings. Works in browser and Node.
(function (root) {
  const DAY = 86400000;
  const toDay = (s) => Date.parse(s + 'T00:00:00Z') / DAY;
  const fmt = (d) => new Date(d * DAY).toISOString().slice(0, 10);

  function todayStr(now = new Date()) {
    return fmt(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY);
  }

  // Consecutive days ending today (or yesterday, if today isn't done yet).
  function currentStreak(dates, today) {
    const set = new Set(dates);
    let d = toDay(today);
    if (!set.has(fmt(d))) d -= 1;
    let n = 0;
    while (set.has(fmt(d))) { n++; d--; }
    return n;
  }

  function longestStreak(dates) {
    const days = [...new Set(dates)].map(toDay).sort((a, b) => a - b);
    let best = 0, run = 0;
    days.forEach((d, i) => {
      run = i > 0 && d - days[i - 1] === 1 ? run + 1 : 1;
      best = Math.max(best, run);
    });
    return best;
  }

  // The last n dates ending at `today`, oldest first.
  function lastNDays(n, today) {
    const end = toDay(today);
    return Array.from({ length: n }, (_, i) => fmt(end - (n - 1 - i)));
  }

  // For each of the last n days, how many habits were completed.
  function completionsPerDay(habits, n, today) {
    return lastNDays(n, today).map((day) => ({
      day,
      count: habits.filter((h) => h.dates.includes(day)).length,
    }));
  }

  const api = { todayStr, currentStreak, longestStreak, lastNDays, completionsPerDay };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Streaks = api;
})(typeof self !== 'undefined' ? self : this);
