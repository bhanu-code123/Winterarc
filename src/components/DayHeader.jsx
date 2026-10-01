export default function DayHeader({ label, days, today, endLabel }) {
  return (
    <thead>
      <tr>
        <th className="name">{label}</th>
        {days.map((d) => (
          <th key={d} className={d === today ? "today" : ""}>{d}</th>
        ))}
        <th className="count">{endLabel}</th>
      </tr>
    </thead>
  );
}
