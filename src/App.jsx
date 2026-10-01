import { useEffect, useState } from "react";
import { supabase, isConfigured } from "./lib/supabase";
import Auth from "./components/Auth";
import Tracker from "./components/Tracker";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = checking

  useEffect(() => {
    if (!isConfigured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!isConfigured) {
    return (
      <div className="wrap">
        <div className="banner">
          Database not connected. Copy <code>.env.example</code> to <code>.env</code>, add your
          Supabase URL and anon key, then restart <code>npm run dev</code>.
        </div>
      </div>
    );
  }

  if (session === undefined) return <div className="wrap"><p className="hint">Loading…</p></div>;
  if (!session) return <Auth />;
  return <Tracker user={session.user} />;
}
