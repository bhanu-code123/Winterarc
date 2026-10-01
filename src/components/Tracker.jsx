import { useState } from "react";
import { useMonthData } from "../hooks/useMonthData";
import { daysInMonth } from "../lib/constants";
import Header from "./Header";
import Stats from "./Stats";
import HabitTracker from "./HabitTracker";
import SleepTracker from "./SleepTracker";
import Progress from "./Progress";
import MonthlyGoals from "./MonthlyGoals";
import MonthlyReview from "./MonthlyReview";
import Notes from "./Notes";

export default function Tracker({ user }) {
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const { data, update, loading, status } = useMonthData(user.id, ym.y, ym.m);

  const total = daysInMonth(ym.y, ym.m);
  const days = Array.from({ length: total }, (_, i) => i + 1);
  const isCurrent = ym.y === now.getFullYear() && ym.m === now.getMonth();
  const today = isCurrent ? now.getDate() : -1;
  const isFuture = (d) => new Date(ym.y, ym.m, d) > now;
  const elapsed = isCurrent ? today : new Date(ym.y, ym.m, 1) > now ? 0 : total;

  const shift = (delta) =>
    setYm(({ y, m }) => {
      const t = new Date(y, m + delta, 1);
      return { y: t.getFullYear(), m: t.getMonth() };
    });

  const grid = { data, update, days, today, isFuture };

  return (
    <div className="wrap">
      <Header user={user} year={ym.y} month={ym.m} onShift={shift} />
      <Stats data={data} elapsedDays={elapsed} />

      <div style={{ opacity: loading ? 0.5 : 1 }}>
        <HabitTracker {...grid} />
        <SleepTracker {...grid} />
        <Progress {...grid} elapsedDays={elapsed} />
        <div className="grid3">
          <MonthlyGoals goals={data.goals} update={update} />
          <MonthlyReview review={data.review} update={update} />
          <Notes notes={data.notes} update={update} />
        </div>
      </div>

      <footer>
        <span>Discipline builds freedom.</span>
        <span>You are not alone.</span>
      </footer>

      <div className={`status ${status ? "show" : ""}`} role="status">{status}</div>
    </div>
  );
}
