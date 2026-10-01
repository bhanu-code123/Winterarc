import DayHeader from "./DayHeader";
import { SLEEP_OPTIONS } from "../lib/constants";

export default function SleepTracker({ data, update, days, today, isFuture }) {
  const pick = (s, d) =>
    update((x) => {
      if (x.sleep[d] === s) delete x.sleep[d];
      else x.sleep[d] = s;
      return x;
    });

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Sleep tracker</h2>
        <span className="hint">Only today can be marked. Pick one per night.</span>
      </div>
      <div className="scroll">
        <table>
          <DayHeader label="Sleep duration" days={days} today={today} endLabel="Nights" />
          <tbody>
            {SLEEP_OPTIONS.map((opt, s) => (
              <tr key={s}>
                <td className="name">{opt.label}</td>
                {days.map((d) => {
                  const on = data.sleep[d] === s;
                  return (
                    <td key={d}>
                      <button className={`cell ${on ? "on" : ""} ${isFuture(d) ? "future" : ""}`}
                        disabled={d !== today} aria-pressed={on} aria-label={`${opt.label} on day ${d}`} onClick={() => pick(s, d)}>
                        <span className="dot" />
                      </button>
                    </td>
                  );
                })}
                <td className="count">{Object.values(data.sleep).filter((v) => v === s).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
