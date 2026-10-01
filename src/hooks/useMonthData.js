import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { emptyMonth, monthKey } from "../lib/constants";

const SAVE_DELAY_MS = 700;

// Loads and auto-saves one month of tracker data for the signed-in user.
export function useMonthData(userId, year, month) {
  const [data, setData] = useState(emptyMonth());
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const key = monthKey(year, month);
  const latest = useRef({ data, key });
  latest.current = { data, key };
  const dirty = useRef(false);
  const timer = useRef(null);
  const queue = useRef(Promise.resolve());

  const flash = useCallback((msg) => {
    setStatus(msg);
    clearTimeout(flash.t);
    flash.t = setTimeout(() => setStatus(""), 1800);
  }, []);

  const flush = useCallback(() => {
    if (!dirty.current || !userId) return queue.current;
    clearTimeout(timer.current);
    dirty.current = false;
    const { data: d, key: k } = latest.current;
    queue.current = queue.current.then(async () => {
      const { error } = await supabase.from("months").upsert({
        user_id: userId,
        month: k,
        data: d,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        dirty.current = true;
        flash("Not saved. Changes will retry on your next edit.");
      } else {
        flash("Saved");
      }
    });
    return queue.current;
  }, [userId, flash]);

  // Load when user or month changes
  useEffect(() => {
    if (!userId) return;
    let alive = true;
    setLoading(true);

    (async () => {
      await flush(); // save pending edits from the previous month first

      const { data: row, error } = await supabase
        .from("months")
        .select("data")
        .eq("user_id", userId)
        .eq("month", key)
        .maybeSingle();

      if (!alive) return;
      if (error) {
        flash("Couldn't load this month. Check your connection and reload.");
      } else if (row) {
        setData({ ...emptyMonth(), ...row.data });
      } else {
        // New month: carry habit names over from the previous month
        const prev = new Date(year, month - 1, 1);
        const { data: prevRow } = await supabase
          .from("months")
          .select("data")
          .eq("user_id", userId)
          .eq("month", monthKey(prev.getFullYear(), prev.getMonth()))
          .maybeSingle();
        if (alive) setData(emptyMonth(prevRow?.data?.habits));
      }
      if (alive) setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [userId, key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save before the tab closes
  useEffect(() => {
    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [flush]);

  // Apply an edit: fn receives a copy of the data and returns the new data
  const update = useCallback((fn) => {
    setData((d) => fn(structuredClone(d)));
    dirty.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, SAVE_DELAY_MS);
  }, [flush]);

  return { data, update, loading, status };
}
