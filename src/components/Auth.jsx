import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const fn = mode === "signin" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { data, error } = await fn.call(supabase.auth, { email, password });
    setBusy(false);
    if (error) return setMessage(error.message);
    if (mode === "signup" && !data.session) {
      setMessage("Account created. Check your email to confirm it, then sign in.");
      setMode("signin");
    }
  }

  return (
    <div className="auth">
      <h1>WINTER ARC</h1>
      <p className="sub">Plan, track, improve. Same you, but stronger.</p>
      <form onSubmit={submit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="primary" disabled={busy}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        {message && <p className="auth-msg">{message}</p>}
      </form>
      <button className="link" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }}>
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
