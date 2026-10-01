import { SLEEP_OPTIONS } from "../lib/constants";

export default function Stats({ data, elapsedDays }) {
  const total = Object.values(data.checks).filter((v) => v === true).length;
  const possible = elapsedDays * data.habits.length;
  const pct = possible ? Math.round((total / possible) * 100) : 0;

  const nights = Object.values(data.sleep);
  const avg = nights.length
    ? (nights.reduce((sum, i) => sum + SLEEP_OPTIONS[i].hours, 0) / nights.length).toFixed(1)
    : "–";

  let streak = 0;
  for (let d = elapsedDays; d >= 1; d--) {
    if (data.habits.some((_, h) => data.checks[`${h}-${d}`] === true)) streak++;
    else break;
  }

  return (
    <div className="stats" aria-live="polite">
      <span><b>{pct}%</b>habits done so far</span>
      <span><b>{total}</b>ticks this month</span>
      <span><b>{streak}</b>day streak</span>
      <span><b>{avg}</b>avg hours of sleep</span>
    </div>
  );
}
