import { useState } from "react";

// One bar per day of the month, drawn as plain SVG with a hover tooltip.
// values[i] is the value for day i + 1, or null when there is nothing to show.
const W = 640, H = 200;
const PAD = { top: 12, right: 8, bottom: 22, left: 34 };

export default function DayBars({ days, values, max, ticks, color, label, tip, goal, today }) {
  const [hover, setHover] = useState(null);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / days.length;
  const barW = Math.max(slot - 2, 2); // 2px gap between bars
  const y = (v) => PAD.top + plotH - (v / max) * plotH;
  const showDay = (d) => d === 1 || d % 5 === 0 || d === today;

  return (
    <div className="chart" onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
            <text className="axis" x={PAD.left - 6} y={y(t) + 4} textAnchor="end">{t}{max === 100 ? "%" : ""}</text>
          </g>
        ))}

        {goal != null && (
          <g>
            <line className="goal" x1={PAD.left} x2={W - PAD.right} y1={y(goal)} y2={y(goal)} />
            <text className="axis" x={W - PAD.right} y={y(goal) - 4} textAnchor="end">{goal}h goal</text>
          </g>
        )}

        {days.map((d, i) => {
          const v = values[i];
          const x = PAD.left + i * slot + (slot - barW) / 2;
          const h = v ? (v / max) * plotH : 0;
          return (
            <g key={d}>
              {h > 0 && (
                <path fill={color} opacity={hover === null || hover === i ? 1 : 0.45}
                  d={roundTop(x, PAD.top + plotH - h, barW, h, Math.min(4, barW / 2))} />
              )}
              {showDay(d) && (
                <text className={`axis ${d === today ? "today" : ""}`} x={x + barW / 2} y={H - 6} textAnchor="middle">{d}</text>
              )}
              {/* Invisible full-height hit target, larger than the bar */}
              <rect x={PAD.left + i * slot} y={PAD.top} width={slot} height={plotH}
                fill="transparent" onMouseEnter={() => setHover(i)} onClick={() => setHover(i)} />
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <div className="tip" style={{
          left: `${((PAD.left + (hover + 0.5) * slot) / W) * 100}%`,
          top: `${(y(Math.max(values[hover] || 0, max * 0.15)) / H) * 100}%`,
        }}>
          {tip(days[hover], values[hover])}
        </div>
      )}
    </div>
  );
}

// Bar with rounded top corners, square at the baseline
function roundTop(x, y, w, h, r) {
  r = Math.min(r, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}
