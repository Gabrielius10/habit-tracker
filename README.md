# Habit Tracker

A small, dependency-free web app for tracking daily habits, with streaks and a 7-day completion chart. Data is stored in your browser's `localStorage`.

## Features
- Add, rename, and delete habits
- Mark a habit done for today (toggle it back if you misclick)
- Current streak and longest streak per habit
- 7-day chart of completed habits (Chart.js)
- Automatic dark mode

## Run it
No build step. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Test
Streak logic lives in `src/streaks.js` and is unit tested with Node's built-in test runner (Node 18+):

```bash
npm test
```

## Project structure
```
index.html          page markup
style.css           styles (light/dark)
src/streaks.js      pure streak and date logic (tested)
src/app.js          UI, state, localStorage, chart
tests/              unit tests
```

## Ideas for extending
- Export/import data as CSV or JSON
- Per-habit weekly goals
- Calendar heatmap view
- Backend with accounts (Express + SQLite)

## Live demo
Add your GitHub Pages link here after enabling Pages in repo settings.

## License
MIT
