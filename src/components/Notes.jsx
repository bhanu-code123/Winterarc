export default function Notes({ notes, update }) {
  return (
    <section className="panel">
      <div className="panel-head"><h2>Notes</h2></div>
      <textarea rows="9" className="notes" value={notes} aria-label="Notes"
        onChange={(e) => { const v = e.target.value; update((x) => { x.notes = v; return x; }); }} />
    </section>
  );
}
