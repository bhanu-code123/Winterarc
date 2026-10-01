const QUESTIONS = [
  ["well", "What went well?"],
  ["hard", "What was challenging?"],
  ["next", "What will I improve next month?"],
];

export default function MonthlyReview({ review, update }) {
  return (
    <section className="panel">
      <div className="panel-head"><h2>Monthly review</h2></div>
      {QUESTIONS.map(([key, q]) => (
        <div key={key}>
          <div className="q">{q}</div>
          <textarea rows="2" value={review[key]} aria-label={q}
            onChange={(e) => { const v = e.target.value; update((x) => { x.review[key] = v; return x; }); }} />
        </div>
      ))}
    </section>
  );
}
