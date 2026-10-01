import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { MONTH_NAMES } from "../lib/constants";

export default function Header({ user, year, month, onShift }) {
  const [name, setName] = useState("");
  const timer = useRef(null);

  useEffect(() => {
    supabase.from("profiles").select("name").eq("id", user.id).maybeSingle()
      .then(({ data }) => setName(data?.name || ""));
  }, [user.id]);

  function changeName(v) {
    setName(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      supabase.from("profiles").upsert({ id: user.id, name: v, updated_at: new Date().toISOString() });
    }, 700);
  }

  return (
    <header className="top">
      <div>
        <h1>WINTER ARC</h1>
        <p className="sub">Plan, track, improve. Same you, but stronger.</p>
      </div>
      <div className="meta">
        <label htmlFor="nm">Name</label>
        <input id="nm" type="text" value={name} placeholder="Your name" onChange={(e) => changeName(e.target.value)} />
        <label>Month</label>
        <div className="month">
          <button className="nav" aria-label="Previous month" onClick={() => onShift(-1)}>‹</button>
          <strong>{MONTH_NAMES[month]} {year}</strong>
          <button className="nav" aria-label="Next month" onClick={() => onShift(1)}>›</button>
        </div>
        <span />
        <button className="link signout" onClick={() => supabase.auth.signOut()}>
          Sign out ({user.email})
        </button>
      </div>
    </header>
  );
}
