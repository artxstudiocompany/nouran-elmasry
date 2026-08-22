"use client";

import { useState } from "react";
import { useSiteData } from "@/store/DataContext";
import SavedIndicator, { useSaveIndicator, serverErrorMessage } from "./SavedIndicator";

export default function SkillsEditor() {
  const { skills, refresh } = useSiteData();
  const { saved, show } = useSaveIndicator();
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!newSkill.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSkill.trim() }),
      });
      if (res.ok) {
        show(true, "Skill added!");
        setNewSkill("");
        await refresh();
      } else {
        show(false, await serverErrorMessage(res, "Failed to add skill"));
      }
    } catch {
      show(false, "Network error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        show(true, "Skill removed!");
        await refresh();
      } else {
        show(false, await serverErrorMessage(res, "Failed to remove skill"));
      }
    } catch {
      show(false, "Network error");
    }
  };

  const input =
    "w-full rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-glow/60 focus:outline-none focus:ring-1 focus:ring-glow/40";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-ink">Skills ({skills.length})</h2>

      <div className="flex gap-3">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="New skill name"
          className={input}
        />
        <button onClick={add} disabled={saving} className="shrink-0 rounded-lg bg-glow/15 px-5 py-2.5 text-sm text-glow ring-1 ring-glow/50 hover:bg-glow/25 disabled:opacity-50">
          {saving ? "..." : "Add"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s.id || s.name}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-night-panel/60 px-4 py-1.5 text-sm text-ink-muted"
          >
            {s.name}
            <button onClick={() => remove(s.id)} className="text-red-400 hover:text-red-300 text-xs">
              ×
            </button>
          </span>
        ))}
      </div>

      <SavedIndicator saved={saved} />
    </div>
  );
}
