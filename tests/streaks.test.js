const test = require('node:test');
const assert = require('node:assert');
const S = require('../src/streaks.js');

test('current streak counts back from today', () => {
  assert.strictEqual(S.currentStreak(['2026-03-01', '2026-03-02', '2026-03-03'], '2026-03-03'), 3);
});
test('streak survives if today is not yet done', () => {
  assert.strictEqual(S.currentStreak(['2026-03-01', '2026-03-02'], '2026-03-03'), 2);
});
test('streak resets after a missed day', () => {
  assert.strictEqual(S.currentStreak(['2026-03-01'], '2026-03-03'), 0);
});
test('longest streak finds the best run', () => {
  const d = ['2026-01-01', '2026-01-02', '2026-01-05', '2026-01-06', '2026-01-07'];
  assert.strictEqual(S.longestStreak(d), 3);
});
test('longest streak ignores duplicates and handles empty', () => {
  assert.strictEqual(S.longestStreak(['2026-01-01', '2026-01-01']), 1);
  assert.strictEqual(S.longestStreak([]), 0);
});
test('streaks work across month and year boundaries', () => {
  assert.strictEqual(S.longestStreak(['2025-12-31', '2026-01-01']), 2);
});
test('lastNDays returns oldest-first window', () => {
  assert.deepStrictEqual(S.lastNDays(3, '2026-03-01'), ['2026-02-27', '2026-02-28', '2026-03-01']);
});
test('completionsPerDay counts habits per day', () => {
  const habits = [{ dates: ['2026-03-01'] }, { dates: ['2026-03-01', '2026-02-28'] }];
  const r = S.completionsPerDay(habits, 2, '2026-03-01');
  assert.deepStrictEqual(r.map((x) => x.count), [1, 2]);
});
