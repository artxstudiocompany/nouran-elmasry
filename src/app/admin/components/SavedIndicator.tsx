"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface SavedState {
  key: number;
  ok: boolean;
  message: string;
}

export async function serverErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

export function useSaveIndicator() {
  const [saved, setSaved] = useState<SavedState | null>(null);

  const show = useCallback((ok: boolean, message?: string) => {
    setSaved({
      key: Date.now(),
      ok,
      message: message ?? (ok ? "Saved!" : "Failed to save"),
    });
  }, []);

  return { saved, show };
}

export default function SavedIndicator({ saved }: { saved: SavedState | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!saved) { setVisible(false); return; }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  if (!visible || !saved) return null;

  return (
    <div
      key={saved.key}
      className={`fixed bottom-6 end-6 z-[200] flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg backdrop-blur transition-all duration-300 ${
        saved.ok
          ? "border border-glow/30 bg-glow/15 text-glow-strong"
          : "border border-red-500/30 bg-red-500/15 text-red-300"
      }`}
    >
      {saved.ok ? (
        <CheckCircle className="h-4 w-4 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0" />
      )}
      {saved.message}
    </div>
  );
}
