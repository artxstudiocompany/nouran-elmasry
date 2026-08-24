"use client";

import { useState, type ReactNode } from "react";

type Tab = "profile" | "about" | "projects" | "experience" | "skills" | "cv" | "translations";

const TABS: { key: Tab; label: string }[] = [
  { key: "profile", label: "Profile & Images" },
  { key: "about", label: "About" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills" },
  { key: "cv", label: "CV / Professional File" },
  { key: "translations", label: "Translations" },
];

interface Props {
  children: (tab: Tab) => ReactNode;
  onLogout: () => void;
}

export default function AdminLayout({ children, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className="min-h-screen bg-night-deep">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-night-panel/90 px-6 py-3 backdrop-blur">
        <h1 className="text-lg font-bold text-ink">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm text-ink-muted hover:text-glow">
            View Site
          </a>
          <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300">
            Logout
          </button>
        </div>
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b border-white/5 bg-night-panel/50 px-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-b-2 border-glow text-glow"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-8">{children(tab)}</main>
    </div>
  );
}
