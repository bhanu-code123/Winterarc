export default function MonthlyGoals({ goals, update }) {
  return (
    <section className="panel">
      <div className="panel-head"><h2>Monthly goals</h2></div>
      {goals.map((g, i) => (
        <div className="goal" key={i}>
          <span>{i + 1}.</span>
          <input type="text" value={g} aria-label={`Goal ${i + 1}`}
            placeholder={i === 0 ? "e.g. Run 5 km without stopping" : ""}
            onChange={(e) => { const v = e.target.value; update((x) => { x.goals[i] = v; return x; }); }} />
        </div>
      ))}
    </section>
  );
}
