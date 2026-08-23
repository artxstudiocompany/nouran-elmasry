"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { ProfileData, Project, Experience, Skill, Specialty } from "@/types";
import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";
import { profile as defaultProfile } from "@/data/profile";
import { projects as defaultProjects } from "@/data/projects";
import { experience as defaultExperience } from "@/data/experience";
import { skills as defaultSkills } from "@/data/skills";
import { specialties as defaultSpecialties } from "@/data/portfolio";

interface SiteDataState {
  heroLogo: string;
  heroBackground: string;
  aboutBackground: string;
  cvFile: string;
  profile: ProfileData;
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  specialties: Specialty[];
  translations: { en: typeof enMessages; ar: typeof arMessages };
}

interface SiteDataContextValue extends SiteDataState {
  loading: boolean;
  updateHeroLogo: (v: string) => Promise<boolean>;
  updateHeroBackground: (v: string) => Promise<boolean>;
  updateAboutBackground: (v: string) => Promise<boolean>;
  updateCvFile: (v: string) => Promise<boolean>;
  updateProfile: (v: ProfileData) => Promise<boolean>;
  updateTranslations: (lang: "en" | "ar", v: typeof enMessages) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const defaultState: SiteDataState = {
  heroLogo: "/images/logo.png",
  heroBackground: "/images/hero-plate.jpg",
  aboutBackground: "/images/about-plate.jpg",
  cvFile: "",
  profile: defaultProfile,
  projects: defaultProjects,
  experience: defaultExperience,
  skills: defaultSkills,
  specialties: defaultSpecialties,
  translations: { en: enMessages, ar: arMessages },
};

function parseJsonArray<T>(raw: string | null | undefined, fallback: T[]): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function putJSON<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SiteDataState>(defaultState);
  const [loading, setLoading] = useState(true);
  const stateRef = useRef(state);
  stateRef.current = state;

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, profileRes, projectsRes, experienceRes, skillsRes, specialtiesRes] =
        await Promise.all([
          fetchJSON<any>("/api/settings"),
          fetchJSON<any>("/api/profile"),
          fetchJSON<any[]>("/api/projects"),
          fetchJSON<any[]>("/api/experience"),
          fetchJSON<any[]>("/api/skills"),
          fetchJSON<any[]>("/api/specialties"),
        ]);

      if (settingsRes && !settingsRes.error) {
        const tEn = parseJsonObject(settingsRes.translationsEn, enMessages);
        const tAr = parseJsonObject(settingsRes.translationsAr, arMessages);

        setState((prev) => ({
          ...prev,
          heroLogo: settingsRes.heroLogoUrl || prev.heroLogo,
          heroBackground: settingsRes.heroBgUrl || prev.heroBackground,
          aboutBackground: settingsRes.aboutBgUrl || prev.aboutBackground,
          cvFile: settingsRes.cvFileUrl || prev.cvFile,
          translations: { en: tEn, ar: tAr },
        }));
      }

      if (profileRes && !profileRes.error) {
        setState((prev) => ({
          ...prev,
          profile: {
            name: profileRes.name || prev.profile.name,
            nameAr: profileRes.nameAr || prev.profile.nameAr,
            title: profileRes.title || prev.profile.title,
            titleAr: profileRes.titleAr || prev.profile.titleAr,
            tagline: profileRes.tagline || prev.profile.tagline,
            taglineAr: profileRes.taglineAr || prev.profile.taglineAr,
            bio: profileRes.bio || prev.profile.bio,
            bioAr: profileRes.bioAr || prev.profile.bioAr,
            email: profileRes.email || prev.profile.email,
            phone: profileRes.phone || prev.profile.phone,
            socialLinks: {
              linkedin: profileRes.linkedin || prev.profile.socialLinks.linkedin,
              whatsapp: profileRes.whatsapp || prev.profile.socialLinks.whatsapp,
            },
          },
        }));
      }

      if (Array.isArray(projectsRes)) {
        setState((prev) => ({
          ...prev,
          projects: projectsRes.map((p: any) => ({
            id: p.id,
            type: p.type || "",
            typeAr: p.typeAr || "",
            category: p.category || "",
            categoryAr: p.categoryAr || "",
            scope: p.scope || "",
            scopeAr: p.scopeAr || "",
            systems: parseJsonArray(p.systems, []),
            systemsAr: parseJsonArray(p.systemsAr, []),
            imageUrl: p.imageUrl || "",
            pdfUrl: p.pdfUrl || "",
            year: p.year || "",
            area: p.area || "",
          })),
        }));
      }

      if (Array.isArray(experienceRes)) {
        setState((prev) => ({
          ...prev,
          experience: experienceRes.map((e: any) => ({
            id: e.id,
            year: e.year || "",
            position: e.position || "",
            positionAr: e.positionAr || "",
            company: e.company || "",
            companyAr: e.companyAr || "",
            description: e.description || "",
            descriptionAr: e.descriptionAr || "",
          })),
        }));
      }

      if (Array.isArray(skillsRes)) {
        setState((prev) => ({
          ...prev,
          skills: skillsRes.map((s: any) => ({
            id: s.id,
            name: s.name || "",
            category: s.category || "",
            categoryAr: s.categoryAr || "",
          })),
        }));
      }

      if (Array.isArray(specialtiesRes)) {
        setState((prev) => ({
          ...prev,
          specialties: specialtiesRes.map((s: any) => ({
            id: s.id,
            title: s.title || "",
            titleAr: s.titleAr || "",
            description: s.description || "",
            descriptionAr: s.descriptionAr || "",
            icon: s.icon || "wind",
          })),
        }));
      }
    } catch (err) {
      console.error("Failed to load site data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const update = useCallback(async (patch: Partial<SiteDataState>): Promise<boolean> => {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;
    setState(next);

    try {
      const results = await Promise.all([
        patch.heroLogo !== undefined || patch.heroBackground !== undefined || patch.aboutBackground !== undefined || patch.cvFile !== undefined || patch.translations !== undefined
          ? putJSON("/api/settings", {
              heroLogoUrl: next.heroLogo,
              heroBgUrl: next.heroBackground,
              aboutBgUrl: next.aboutBackground,
              cvFileUrl: next.cvFile,
              ...(patch.translations !== undefined
                ? {
                    translationsEn: JSON.stringify(next.translations.en),
                    translationsAr: JSON.stringify(next.translations.ar),
                  }
                : {}),
            })
          : null,
        patch.profile !== undefined
          ? putJSON("/api/profile", {
              ...next.profile,
              linkedin: next.profile.socialLinks.linkedin,
              whatsapp: next.profile.socialLinks.whatsapp,
            })
          : null,
      ]);

      return results.every((r) => r !== null);
    } catch {
      return false;
    }
  }, []);

  const ctx: SiteDataContextValue = {
    ...state,
    loading,
    updateHeroLogo: async (v) => update({ heroLogo: v }),
    updateHeroBackground: async (v) => update({ heroBackground: v }),
    updateAboutBackground: async (v) => update({ aboutBackground: v }),
    updateCvFile: async (v) => update({ cvFile: v }),
    updateProfile: async (v) => update({ profile: v }),
    updateTranslations: async (lang, v) => {
      const next = { ...stateRef.current.translations, [lang]: v };
      return update({ translations: next });
    },
    refresh: loadAll,
  };

  return (
    <SiteDataContext.Provider value={ctx}>
      {loading ? <div className="min-h-screen bg-night-deep" /> : children}
    </SiteDataContext.Provider>
  );
}

function parseJsonObject<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      if (Object.keys(parsed).length === 0) return fallback;
      return parsed;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used within DataProvider");
  return ctx;
}
