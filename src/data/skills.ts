import { Skill, ExpertiseItem } from "@/types";

export const skills: Skill[] = [
  { id: "sk-default-1", name: "Revit", category: "BIM", categoryAr: "نمذجة رقمية" },
  { id: "sk-default-2", name: "AutoCAD", category: "Drafting", categoryAr: "رسسم فني" },
  { id: "sk-default-3", name: "Navisworks", category: "BIM", categoryAr: "تنسيق" },
  { id: "sk-default-4", name: "HAP", category: "HVAC", categoryAr: "تكييف" },
  { id: "sk-default-5", name: "DIALux", category: "Lighting", categoryAr: "إضاءة" },
  { id: "sk-default-6", name: "ETAP", category: "Electrical", categoryAr: "كهرباء" },
  { id: "sk-default-7", name: "Excel", category: "Documentation", categoryAr: "وثائق" },
  { id: "sk-default-8", name: "BIM 360", category: "Collaboration", categoryAr: "تعاون" },
];

export const expertise: ExpertiseItem[] = [
  {
    id: "exp-hvac",
    number: "01",
    title: "HVAC",
    titleAr: "\u062a\u0643\u064a\u064a\u0641 \u0648\u062a\u0628\u0631\u064a\u062f",
    color: "#39BFFF",
    icon: "hvac",
  },
  {
    id: "exp-electrical",
    number: "02",
    title: "Electrical",
    titleAr: "\u0643\u0647\u0631\u0628\u0627\u0621",
    color: "#D6B36A",
    icon: "electrical",
  },
  {
    id: "exp-plumbing",
    number: "03",
    title: "Plumbing",
    titleAr: "\u0633\u0628\u0627\u0643\u0629",
    color: "#35E0D0",
    icon: "plumbing",
  },
  {
    id: "exp-fire",
    number: "04",
    title: "Fire Fighting",
    titleAr: "\u0645\u0643\u0627\u0641\u062d\u0629 \u0627\u0644\u062d\u0631\u064a\u0642",
    color: "#FF6B6B",
    icon: "fire",
  },
  {
    id: "exp-bim",
    number: "05",
    title: "BIM & Coordination",
    titleAr: "BIM \u0648\u0627\u0644\u062a\u0646\u0633\u064a\u0642",
    color: "#8067FF",
    icon: "bim",
  },
];
