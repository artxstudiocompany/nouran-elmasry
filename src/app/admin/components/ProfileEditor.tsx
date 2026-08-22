"use client";

import { useState } from "react";
import { useSiteData } from "@/store/DataContext";
import ImageUploader from "./ImageUploader";
import SavedIndicator, { useSaveIndicator, serverErrorMessage } from "./SavedIndicator";

export default function ProfileEditor() {
  const data = useSiteData();
  const { saved, show } = useSaveIndicator();

  const [heroLogo, setHeroLogo] = useState(data.heroLogo);
  const [heroBackground, setHeroBg] = useState(data.heroBackground);
  const [aboutBackground, setAboutBg] = useState(data.aboutBackground);
  const [profile, setProfile] = useState(data.profile);
  const [saving, setSaving] = useState(false);

  const input =
    "w-full rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-glow/60 focus:outline-none focus:ring-1 focus:ring-glow/40";

  const handleSave = async () => {
    setSaving(true);
    try {
      const [settingsRes, profileRes] = await Promise.all([
        fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            heroLogoUrl: heroLogo,
            heroBgUrl: heroBackground,
            aboutBgUrl: aboutBackground,
            cvFileUrl: data.cvFile,
            translationsEn: JSON.stringify(data.translations.en),
            translationsAr: JSON.stringify(data.translations.ar),
          }),
        }),
        fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...profile,
            linkedin: profile.socialLinks.linkedin,
            whatsapp: profile.socialLinks.whatsapp,
          }),
        }),
      ]);

      if (settingsRes.ok && profileRes.ok) {
        show(true, "Profile saved!");
        await data.refresh();
      } else {
        const msg = !settingsRes.ok
          ? await serverErrorMessage(settingsRes, "Failed to save settings")
          : await serverErrorMessage(profileRes, "Failed to save profile");
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
        <h2 className="text-lg font-semibold text-ink">Images</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <ImageUploader label="Hero Logo" value={heroLogo} onChange={setHeroLogo} folder="images/hero-logo" />
          <ImageUploader label="Hero Background" value={heroBackground} onChange={setHeroBg} folder="images/hero-bg" />
          <ImageUploader label="About Background" value={aboutBackground} onChange={setAboutBg} folder="images/about-bg" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Contact Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Name</label>
            <input className={input} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Name (Arabic)</label>
            <input className={input} value={profile.nameAr} onChange={(e) => setProfile({ ...profile, nameAr: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Title</label>
            <input className={input} value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Title (Arabic)</label>
            <input className={input} value={profile.titleAr} onChange={(e) => setProfile({ ...profile, titleAr: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Email</label>
            <input className={`${input} font-latin`} dir="ltr" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Phone</label>
            <input className={`${input} font-latin`} dir="ltr" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">LinkedIn URL</label>
            <input className={`${input} font-latin`} dir="ltr" value={profile.socialLinks.linkedin} onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })} />
          </div>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-glow/15 px-8 py-2.5 text-sm font-semibold text-glow ring-1 ring-glow/50 hover:bg-glow/25 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>

      <SavedIndicator saved={saved} />
    </div>
  );
}
