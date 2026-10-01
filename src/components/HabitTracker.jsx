import DayHeader from "./DayHeader";

export default function HabitTracker({ data, update, days, today, isFuture }) {
  const toggle = (h, d) =>
    update((x) => {
      // Cycle: empty -> done (true) -> missed ("x") -> empty
      const k = `${h}-${d}`;
      if (x.checks[k] === true) x.checks[k] = "x";
      else if (x.checks[k]) delete x.checks[k];
      else x.checks[k] = true;
      return x;
    });

  const rename = (h, value) => update((x) => { x.habits[h] = value; return x; });

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Habit tracker</h2>
        <span className="hint">Only today can be marked: tap once for ✓ done, twice for ✗ missed, three times to clear. Tap a habit name to rename it.</span>
      </div>
      <div className="scroll">
        <table>
          <DayHeader label="Habit" days={days} today={today} endLabel="Done" />
          <tbody>
            {data.habits.map((habit, h) => {
              const done = days.filter((d) => data.checks[`${h}-${d}`] === true).length;
              return (
                <tr key={h}>
                  <td className="name">
                    <input type="text" value={habit} aria-label={`Habit ${h + 1} name`}
                      onChange={(e) => rename(h, e.target.value)} />
                  </td>
                  {days.map((d) => {
                    const v = data.checks[`${h}-${d}`];
                    const on = v === true;
                    const missed = v === "x";
                    const locked = d !== today;
                    return (
                      <td key={d}>
                        <button className={`cell ${on ? "on" : ""} ${missed ? "missed" : ""} ${isFuture(d) ? "future" : ""}`}
                          disabled={locked}
                          aria-label={`${habit}, day ${d}${on ? ", done" : missed ? ", missed" : ""}`}
                          onClick={() => toggle(h, d)}>
                          <span className="box">
                            {on && <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>}
                            {missed && <svg viewBox="0 0 16 16"><path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" /></svg>}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                  <td className="count">{done}/{days.length}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="name">Daily score</td>
              {days.map((d) => {
                const n = data.habits.filter((_, h) => data.checks[`${h}-${d}`] === true).length;
                return <td key={d}>{n || ""}</td>;
              })}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
