"use client";

import { useState } from "react";
import { useSiteData } from "@/store/DataContext";
import SavedIndicator, { useSaveIndicator } from "./SavedIndicator";
import type { Experience } from "@/types";

function emptyExp(): Experience {
  return {
    id: "",
    company: "", companyAr: "",
    position: "", positionAr: "",
    description: "", descriptionAr: "",
    year: "",
  };
}

export default function ExperienceEditor() {
  const { experience, refresh } = useSiteData();
  const { saved, show } = useSaveIndicator();
  const [editing, setEditing] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);

  const add = async () => {
    const e = emptyExp();
    try {
      const res = await fetch("/api/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        await refresh();
        setEditing({ ...e, id: data.id });
      } else {
        show(false, data?.error || `Server error (${res.status})`);
      }
    } catch (err) {
      show(false, `Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        show(true, "Entry deleted!");
        await refresh();
      } else {
        show(false, data?.error || `Server error (${res.status})`);
      }
    } catch (err) {
      show(false, `Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    try {
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const data = {
        company: fd.get("company") as string,
        companyAr: fd.get("companyAr") as string,
        position: fd.get("position") as string,
        positionAr: fd.get("positionAr") as string,
        description: fd.get("description") as string,
        descriptionAr: fd.get("descriptionAr") as string,
        year: fd.get("year") as string,
      };

      let res;
      if (editing.id) {
        res = await fetch(`/api/experience/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        res = await fetch("/api/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      const resData = await res.json().catch(() => null);
      show(res.ok, res.ok ? "Experience saved!" : (resData?.error || `Server error (${res.status})`));
      if (res.ok) {
        setEditing(null);
        await refresh();
      }
    } catch (err) {
      show(false, `Save failed: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-glow/60 focus:outline-none focus:ring-1 focus:ring-glow/40";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Experience ({experience.length})</h2>
        <button onClick={add} className="rounded-lg bg-glow/15 px-4 py-2 text-sm text-glow ring-1 ring-glow/50 hover:bg-glow/25">
          + Add Entry
        </button>
      </div>

      {editing && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/10 bg-night-panel p-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-ink">Edit Entry</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-sm text-ink-muted hover:text-ink">
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Year</label>
              <input name="year" defaultValue={editing.year} className={`${input} font-latin`} dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Company (EN)</label>
              <input name="company" defaultValue={editing.company} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Company (AR)</label>
              <input name="companyAr" defaultValue={editing.companyAr} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Position (EN)</label>
              <input name="position" defaultValue={editing.position} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Position (AR)</label>
              <input name="positionAr" defaultValue={editing.positionAr} className={input} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-ink-muted">Description (EN)</label>
            <textarea name="description" defaultValue={editing.description} rows={3} className={`${input} resize-none`} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Description (AR)</label>
            <textarea name="descriptionAr" defaultValue={editing.descriptionAr} rows={3} className={`${input} resize-none`} />
          </div>

          <button type="submit" disabled={saving} className="rounded-lg bg-glow/15 px-6 py-2.5 text-sm font-semibold text-glow ring-1 ring-glow/50 hover:bg-glow/25 disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {experience.map((x) => (
          <div key={x.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-night-panel/60 p-4">
            <div>
              <p className="font-semibold text-ink">{x.position || x.positionAr}</p>
              <p className="text-sm text-ink-muted">{x.company || x.companyAr} · {x.year}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditing(x)} className="text-sm text-glow hover:text-glow-strong">Edit</button>
              <button onClick={() => del(x.id)} className="text-sm text-red-400 hover:text-red-300">Del</button>
            </div>
          </div>
        ))}
      </div>

      <SavedIndicator saved={saved} />
    </div>
  );
}
