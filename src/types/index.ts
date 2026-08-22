export type Locale = "ar" | "en";

export interface ProfileData {
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  tagline: string;
  taglineAr: string;
  bio: string;
  bioAr: string;
  email: string;
  phone: string;
  socialLinks: {
    linkedin: string;
    whatsapp: string;
  };
}

export interface Project {
  id: string;
  type: string;
  typeAr: string;
  category: string;
  categoryAr: string;
  scope: string;
  scopeAr: string;
  systems: string[];
  systemsAr: string[];
  imageUrl?: string;
  pdfUrl?: string;
  year: string;
  area: string;
}

export interface Experience {
  id: string;
  year: string;
  position: string;
  positionAr: string;
  company: string;
  companyAr: string;
  description: string;
  descriptionAr: string;
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  categoryAr: string;
}

export interface Specialty {
  id?: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: "wind" | "droplets" | "zap" | "flame" | "boxes" | "gauge";
}

export interface ExpertiseItem {
  id: string;
  number: string;
  title: string;
  titleAr: string;
  color: string;
  icon: string;
}

export interface SiteData {
  heroLogo: string;
  heroBackground: string;
  aboutBackground: string;
  profile: ProfileData;
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  specialties: Specialty[];
  stats: { value: string; labelKey: string }[];
  translations: Record<string, Record<string, string>>;
}
