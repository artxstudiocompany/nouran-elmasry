"use client";

import { useState } from "react";
import { useSiteData } from "@/store/DataContext";
import ImageUploader from "./ImageUploader";
import SavedIndicator, { useSaveIndicator, serverErrorMessage } from "./SavedIndicator";

export default function AboutEditor() {
  const data = useSiteData();
  const { saved, show } = useSaveIndicator();

  const [aboutBackground, setAboutBg] = useState(data.aboutBackground);
  const [en, setEn] = useState({ ...data.translations.en.about });
  const [ar, setAr] = useState({ ...data.translations.ar.about });
  const [saving, setSaving] = useState(false);

  const input =
    "w-full rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-glow/60 focus:outline-none focus:ring-1 focus:ring-glow/40";

  const textarea =
    "w-full rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-glow/60 focus:outline-none focus:ring-1 focus:ring-glow/40 min-h-[100px] resize-y";

  const handleSave = async () => {
    setSaving(true);
    try {
      const nextEn = { ...data.translations.en, about: en };
      const nextAr = { ...data.translations.ar, about: ar };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroLogoUrl: data.heroLogo,
          heroBgUrl: data.heroBackground,
          aboutBgUrl: aboutBackground,
          cvFileUrl: data.cvFile,
          translationsEn: JSON.stringify(nextEn),
          translationsAr: JSON.stringify(nextAr),
        }),
      });

      if (res.ok) {
        show(true, "About section saved!");
        await data.refresh();
      } else {
        const msg = await serverErrorMessage(res, "Failed to save");
        show(false, msg);
      }
    } catch {
      show(false, "Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Background Image</h2>
        <ImageUploader label="About Background" value={aboutBackground} onChange={setAboutBg} folder="images/about-bg" />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">English</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Title</label>
            <input className={input} value={en.title} onChange={(e) => setEn({ ...en, title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Bio (1st paragraph)</label>
            <textarea className={textarea} value={en.bio} onChange={(e) => setEn({ ...en, bio: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Bio Extra (2nd paragraph)</label>
            <textarea className={textarea} value={en.bioExtra} onChange={(e) => setEn({ ...en, bioExtra: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Bio Final (3rd paragraph, highlighted)</label>
            <textarea className={textarea} value={en.bioFinal} onChange={(e) => setEn({ ...en, bioFinal: e.target.value })} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">English Stats</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Experience Label</label>
            <input className={input} value={en.stats.experience} onChange={(e) => setEn({ ...en, stats: { ...en.stats, experience: e.target.value } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Experience Value</label>
            <input className={`${input} font-latin`} dir="ltr" value={en.stats.values.experience} onChange={(e) => setEn({ ...en, stats: { ...en.stats, values: { ...en.stats.values, experience: e.target.value } } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Projects Label</label>
            <input className={input} value={en.stats.projects} onChange={(e) => setEn({ ...en, stats: { ...en.stats, projects: e.target.value } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Projects Value</label>
            <input className={`${input} font-latin`} dir="ltr" value={en.stats.values.projects} onChange={(e) => setEn({ ...en, stats: { ...en.stats, values: { ...en.stats.values, projects: e.target.value } } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Clients Label</label>
            <input className={input} value={en.stats.clients} onChange={(e) => setEn({ ...en, stats: { ...en.stats, clients: e.target.value } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Clients Value</label>
            <input className={`${input} font-latin`} dir="ltr" value={en.stats.values.clients} onChange={(e) => setEn({ ...en, stats: { ...en.stats, values: { ...en.stats.values, clients: e.target.value } } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Commitment Label</label>
            <input className={input} value={en.stats.commitment} onChange={(e) => setEn({ ...en, stats: { ...en.stats, commitment: e.target.value } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Commitment Value</label>
            <input className={`${input} font-latin`} dir="ltr" value={en.stats.values.commitment} onChange={(e) => setEn({ ...en, stats: { ...en.stats, values: { ...en.stats.values, commitment: e.target.value } } })} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Arabic</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-ink-muted">العنوان</label>
            <input className={`${input} text-right`} dir="rtl" value={ar.title} onChange={(e) => setAr({ ...ar, title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">السيرة (الفقرة الأولى)</label>
            <textarea className={`${textarea} text-right`} dir="rtl" value={ar.bio} onChange={(e) => setAr({ ...ar, bio: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">السيرة (الفقرة الثانية)</label>
            <textarea className={`${textarea} text-right`} dir="rtl" value={ar.bioExtra} onChange={(e) => setAr({ ...ar, bioExtra: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">السيرة (الفقرة الثالثة - مميزة)</label>
            <textarea className={`${textarea} text-right`} dir="rtl" value={ar.bioFinal} onChange={(e) => setAr({ ...ar, bioFinal: e.target.value })} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Arabic Stats</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Label - الخبرة</label>
            <input className={`${input} text-right`} dir="rtl" value={ar.stats.experience} onChange={(e) => setAr({ ...ar, stats: { ...ar.stats, experience: e.target.value } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Value</label>
            <input className={`${input} font-latin`} dir="ltr" value={ar.stats.values.experience} onChange={(e) => setAr({ ...ar, stats: { ...ar.stats, values: { ...ar.stats.values, experience: e.target.value } } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Label - المشاريع</label>
            <input className={`${input} text-right`} dir="rtl" value={ar.stats.projects} onChange={(e) => setAr({ ...ar, stats: { ...ar.stats, projects: e.target.value } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Value</label>
            <input className={`${input} font-latin`} dir="ltr" value={ar.stats.values.projects} onChange={(e) => setAr({ ...ar, stats: { ...ar.stats, values: { ...ar.stats.values, projects: e.target.value } } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Label - العملاء</label>
            <input className={`${input} text-right`} dir="rtl" value={ar.stats.clients} onChange={(e) => setAr({ ...ar, stats: { ...ar.stats, clients: e.target.value } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Value</label>
            <input className={`${input} font-latin`} dir="ltr" value={ar.stats.values.clients} onChange={(e) => setAr({ ...ar, stats: { ...ar.stats, values: { ...ar.stats.values, clients: e.target.value } } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Label - الالتزام</label>
            <input className={`${input} text-right`} dir="rtl" value={ar.stats.commitment} onChange={(e) => setAr({ ...ar, stats: { ...ar.stats, commitment: e.target.value } })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Value</label>
            <input className={`${input} font-latin`} dir="ltr" value={ar.stats.values.commitment} onChange={(e) => setAr({ ...ar, stats: { ...ar.stats, values: { ...ar.stats.values, commitment: e.target.value } } })} />
          </div>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-glow/15 px-8 py-2.5 text-sm font-semibold text-glow ring-1 ring-glow/50 hover:bg-glow/25 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save About"}
      </button>

      <SavedIndicator saved={saved} />
    </div>
  );
}
