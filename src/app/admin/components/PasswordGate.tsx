"use client";

import { useState } from "react";

interface Props {
  onAuth: () => void;
}

export default function PasswordGate({ onAuth }: Props) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });

      if (res.ok) {
        onAuth();
      } else {
        setErr(true);
      }
    } catch {
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-night-deep px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-night-panel p-8"
      >
        <h1 className="text-center text-xl font-bold text-ink">Admin Login</h1>
        <input
          type="password"
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setErr(false); }}
          placeholder="Password"
          className="w-full rounded-lg border border-white/10 bg-night-deep/70 px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:border-glow/60 focus:outline-none focus:ring-1 focus:ring-glow/40"
          autoFocus
          disabled={loading}
        />
        {err && <p className="text-sm text-red-400">Wrong password</p>}
        <button
          type="submit"
          disabled={loading}
          className="hex-clip w-full bg-glow/15 py-3 text-sm font-semibold text-glow-strong ring-1 ring-glow/70 hover:bg-glow/25 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
