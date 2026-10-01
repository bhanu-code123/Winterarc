import DayBars from "./DayBars";
import { SLEEP_OPTIONS } from "../lib/constants";

const SLEEP_GOAL = 8;

export default function Progress({ data, days, today, isFuture, elapsedDays }) {
  const n = data.habits.length;
  const doneOn = (h, d) => data.checks[`${h}-${d}`] === true;

  // Habits: % of habits done each day (future days left empty)
  const dailyPct = days.map((d) => {
    if (isFuture(d)) return null;
    const done = data.habits.filter((_, h) => doneOn(h, d)).length;
    return n ? Math.round((done / n) * 100) : 0;
  });

  // Habits: done rate per habit over the days so far
  const perHabit = data.habits.map((name, h) => {
    const done = days.filter((d) => doneOn(h, d)).length;
    return { name: name || `Habit ${h + 1}`, done, pct: elapsedDays ? Math.round((done / elapsedDays) * 100) : 0 };
  });

  // Sleep: hours per night
  const hours = days.map((d) => (data.sleep[d] != null ? SLEEP_OPTIONS[data.sleep[d]].hours : null));
  const logged = hours.filter((h) => h != null);
  const avg = logged.length ? (logged.reduce((a, b) => a + b, 0) / logged.length).toFixed(1) : "–";
  const onGoal = logged.filter((h) => h >= SLEEP_GOAL).length;
  const debt = logged.reduce((sum, h) => sum + Math.max(0, SLEEP_GOAL - h), 0);
  const byDuration = SLEEP_OPTIONS.map((opt, s) => {
    const count = Object.values(data.sleep).filter((v) => v === s).length;
    return { label: opt.label, count, pct: logged.length ? Math.round((count / logged.length) * 100) : 0 };
  });
  // Last 7 logged nights vs the month as a whole
  const recent = logged.slice(-7);
  const recentAvg = recent.length ? (recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(1) : "–";
  const bestDay = Math.max(0, ...dailyPct.filter((v) => v != null));

  return (
    <div className="grid2">
      <section className="panel">
        <div className="panel-head">
          <h2>Habit progress</h2>
          <span className="hint">Share of habits done each day</span>
        </div>
        <div className="kpis">
          <span><b>{bestDay}%</b>best day</span>
          <span><b>{perHabit.reduce((a, p) => a + p.done, 0)}</b>habits done</span>
        </div>
        <DayBars days={days} values={dailyPct} max={100} ticks={[0, 50, 100]} today={today}
          color="var(--done)" label="Bar chart of the percentage of habits done each day this month"
          tip={(d, v) => v == null ? `Day ${d} · upcoming` : `Day ${d} · ${Math.round((v / 100) * n)}/${n} habits (${v}%)`} />

        <h3 className="sub">Each habit so far</h3>
        <ul className="hbars">
          {perHabit.map((p, i) => (
            <li key={i} title={`${p.name}: ${p.done} of ${elapsedDays} days`}>
              <span className="hname">{p.name}</span>
              <span className="track"><span className="fill" style={{ width: `${p.pct}%` }} /></span>
              <span className="hval">{p.pct}%</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Sleep progress</h2>
          <span className="hint">Hours slept each night</span>
        </div>
        <div className="kpis">
          <span><b>{avg}</b>avg hours</span>
          <span><b>{onGoal}/{logged.length}</b>nights at {SLEEP_GOAL}h+</span>
          <span><b>{debt}h</b>sleep debt</span>
          <span><b>{recentAvg}</b>last 7 nights avg</span>
        </div>
        <DayBars days={days} values={hours} max={10} ticks={[0, 5, 10]} goal={SLEEP_GOAL} today={today}
          color="var(--sleep-chart)" label="Bar chart of hours slept each night this month"
          tip={(d, v) => v == null ? `Day ${d} · not logged` : `Day ${d} · ${v === 10 ? "10+" : v} hrs`} />

        <h3 className="sub">Nights by duration</h3>
        <ul className="hbars">
          {byDuration.map((b) => (
            <li key={b.label} title={`${b.label}: ${b.count} of ${logged.length} nights`}>
              <span className="hname">{b.label}</span>
              <span className="track"><span className="fill sleep" style={{ width: `${b.pct}%` }} /></span>
              <span className="hval">{b.count}</span>
            </li>
          ))}
        </ul>
        <p className="note">Sleep debt = hours below the {SLEEP_GOAL}h goal, added up over the nights you logged.</p>
      </section>
    </div>
  );
}
