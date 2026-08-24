"use client";

import { useState } from "react";
import { useSiteData } from "@/store/DataContext";
import SavedIndicator, { useSaveIndicator, serverErrorMessage } from "./SavedIndicator";
import enMessages from "@/messages/en.json";

type Section = "nav" | "hero" | "expertise" | "projects" | "visualization" | "experience" | "skills" | "contact" | "footer" | "cv";

const SECTIONS: Section[] = ["nav", "hero", "expertise", "projects", "visualization", "experience", "skills", "contact", "footer", "cv"];

function flatten(obj: Record<string, any>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      Object.assign(result, flatten(val, path));
    } else {
      result[path] = String(val);
    }
  }
  return result;
}

function setNested(obj: Record<string, any>, path: string, value: string) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in cur) || typeof cur[parts[i]] !== "object") cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

export default function TranslationsEditor() {
  const { translations, heroLogo, heroBackground, aboutBackground, cvFile, refresh } = useSiteData();
  const { saved, show } = useSaveIndicator();
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [section, setSection] = useState<Section>("hero");
  const [saving, setSaving] = useState(false);

  const [draftEn, setDraftEn] = useState(translations.en);
  const [draftAr, setDraftAr] = useState(translations.ar);

  const current = lang === "en" ? draftEn : draftAr;
  const setDraft = lang === "en" ? setDraftEn : setDraftAr;

  const flat = flatten(current);
  const sectionPrefix = section + ".";
  const sectionKeys = Object.keys(flat).filter((k) => k.startsWith(sectionPrefix));

  const handleChange = (key: string, value: string) => {
    const updated = JSON.parse(JSON.stringify(current)) as typeof enMessages;
    setNested(updated, key, value);
    setDraft(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroLogoUrl: heroLogo,
          heroBgUrl: heroBackground,
          aboutBgUrl: aboutBackground,
          cvFileUrl: cvFile,
          translationsEn: JSON.stringify(draftEn),
          translationsAr: JSON.stringify(draftAr),
        }),
      });
      if (res.ok) {
        show(true, "Translations saved!");
        await refresh();
      } else {
        show(false, await serverErrorMessage(res, "Failed to save translations"));
      }
    } catch {
      show(false, "Network error");
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-glow/60 focus:outline-none focus:ring-1 focus:ring-glow/40";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-ink">Translations</h2>

      <div className="flex gap-4">
        <div className="flex gap-2">
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${lang === l ? "bg-glow/15 text-glow ring-1 ring-glow/50" : "text-ink-muted hover:text-ink"}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <select
          value={section}
          onChange={(e) => setSection(e.target.value as Section)}
          className="rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2 text-sm text-ink focus:border-glow/60 focus:outline-none"
        >
          {SECTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {sectionKeys.map((key) => (
          <div key={key}>
            <label className="mb-1 block text-xs text-ink-muted/70 font-latin">{key}</label>
            <input
              value={flat[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className={input}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-glow/15 px-8 py-2.5 text-sm font-semibold text-glow ring-1 ring-glow/50 hover:bg-glow/25 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Translations"}
      </button>

      <SavedIndicator saved={saved} />
    </div>
  );
}
