import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

config({ path: path.join(__dirname, "..", ".env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.profile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Nouran El-Masry",
      nameAr: "نوران المصري",
      title: "MEP Engineer",
      titleAr: "مهندسة MEP",
      tagline: "When Engineering Becomes Art.",
      taglineAr: "حين تتحول الهندسة إلى فن.",
      bio: "I design and coordinate building systems with a precise, forward-looking engineering vision — making buildings more efficient and harmonious.",
      bioAr: "أنا Eng/Nouran El-Masry، مهندسة MEP مهتمة بتصميم وتنسيق الأنظمة التي تجعل المباني أكثر كفاءة وتناغمًا.",
      email: "nouran@example.com",
      phone: "+20 100 000 0000",
      linkedin: "https://linkedin.com/in/nouran-elmasry",
      whatsapp: "https://wa.me/201000000000",
    },
  });
  console.log("  ✓ Profile");

  const enPath = path.join(__dirname, "..", "src", "messages", "en.json");
  const arPath = path.join(__dirname, "..", "src", "messages", "ar.json");
  const enTranslations = fs.readFileSync(enPath, "utf-8");
  const arTranslations = fs.readFileSync(arPath, "utf-8");

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      translationsEn: enTranslations,
      translationsAr: arTranslations,
    },
    create: {
      id: "default",
      translationsEn: enTranslations,
      translationsAr: arTranslations,
    },
  });
  console.log("  ✓ SiteSettings (with translations)");

  const projects = [
    {
      id: "proj-001",
      type: "Commercial Tower",
      typeAr: "برج تجاري",
      category: "سكني فاخر",
      categoryAr: "سكني فاخر",
      scope: "Full MEP Design & Coordination",
      scopeAr: "تصميم وتنسيق MEP كامل",
      systems: JSON.stringify(["HVAC", "Electrical", "Plumbing", "Fire Fighting", "BIM"]),
      systemsAr: JSON.stringify(["تكييف", "كهرباء", "سباكة", "حريق", "BIM"]),
      year: "2025",
      area: "42,000 m²",
      order: 0,
    },
    {
      id: "proj-002",
      type: "Medical Complex",
      typeAr: "مجمع طبي",
      category: "رعاية صحية",
      categoryAr: "رعاية صحية",
      scope: "MEP Design for Hospital Wings",
      scopeAr: "تصميم MEP لأجنحة المستشفى",
      systems: JSON.stringify(["HVAC", "Electrical", "Medical Gas", "Fire Fighting"]),
      systemsAr: JSON.stringify(["تكييف", "كهرباء", "غاز طبي", "حريق"]),
      year: "2024",
      area: "18,500 m²",
      order: 1,
    },
    {
      id: "proj-003",
      type: "Residential Compound",
      typeAr: "مجمع سكني",
      category: "سكني",
      categoryAr: "سكني",
      scope: "Infrastructure & MEP Coordination",
      scopeAr: "تنسيق البنية التحتية وMEP",
      systems: JSON.stringify(["HVAC", "Plumbing", "Electrical", "Fire Fighting", "BIM"]),
      systemsAr: JSON.stringify(["تكييف", "سباكة", "كهرباء", "حريق", "BIM"]),
      year: "2024",
      area: "26,000 m²",
      order: 2,
    },
    {
      id: "proj-004",
      type: "Industrial Facility",
      typeAr: "منشأة صناعية",
      category: "صناعي",
      categoryAr: "صناعي",
      scope: "MEP Design & Safety Systems",
      scopeAr: "تصميم MEP وأنظمة السلامة",
      systems: JSON.stringify(["HVAC", "Electrical", "Fire Fighting", "Plumbing"]),
      systemsAr: JSON.stringify(["تكييف", "كهرباء", "حريق", "سباكة"]),
      year: "2023",
      area: "9,800 m²",
      order: 3,
    },
    {
      id: "proj-005",
      type: "Educational Campus",
      typeAr: "حرم تعليمي",
      category: "تعليمي",
      categoryAr: "تعليمي",
      scope: "MEP Master Planning",
      scopeAr: "التخطيط الرئيسي لـ MEP",
      systems: JSON.stringify(["HVAC", "Electrical", "Plumbing", "Fire Fighting", "BIM"]),
      systemsAr: JSON.stringify(["تكييف", "كهرباء", "سباكة", "حريق", "BIM"]),
      year: "2023",
      area: "35,000 m²",
      order: 4,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({ where: { id: p.id }, update: p, create: p });
  }
  console.log(`  ✓ ${projects.length} Projects`);

  const experiences = [
    {
      id: "exp-001",
      year: "2024",
      position: "MEP Design Engineer",
      positionAr: "مهندسة تصميم MEP",
      company: "Engineering Consultants Group",
      companyAr: "مجموعة الاستشارات الهندسية",
      description: "Lead MEP design for commercial and residential projects, coordinating HVAC, electrical, plumbing, and fire fighting systems using BIM workflows.",
      descriptionAr: "قيادة تصميم MEP للمشاريع التجارية والسكنية، وتنسيق أنظمة التكييف والكهرباء والسباكة والحريق باستخدام تدفقات عمل BIM.",
      order: 0,
    },
    {
      id: "exp-002",
      year: "2023",
      position: "Junior MEP Engineer",
      positionAr: "مهندسة MEP مبتدئة",
      company: "Al-Enmaa Engineering",
      companyAr: "هندسة الإنماء",
      description: "Assisted in MEP design and coordination for healthcare and institutional buildings, prepared technical drawings and BOQ documentation.",
      descriptionAr: "المساعدة في تصميم وتنسيق MEP للمباني الصحية والمؤسسية، وإعداد المخططات الفنية ووثائق جدول الكميات.",
      order: 1,
    },
    {
      id: "exp-003",
      year: "2022",
      position: "MEP Intern",
      positionAr: "متدرّبة MEP",
      company: "National Engineering Office",
      companyAr: "المكتب الوطني للهندسة",
      description: "Gained hands-on experience in MEP drafting, site inspections, and technical submittals for large-scale projects.",
      descriptionAr: "اكتسبت خبرة عملية في رسم MEP وتفتيش المواقع والتقديمات الفنية للمشاريع واسعة النطاق.",
      order: 2,
    },
  ];

  for (const e of experiences) {
    await prisma.experience.upsert({ where: { id: e.id }, update: e, create: e });
  }
  console.log(`  ✓ ${experiences.length} Experiences`);

  const skills = [
    { id: "sk-001", name: "Revit", category: "BIM", categoryAr: "نمذجة", order: 0 },
    { id: "sk-002", name: "AutoCAD", category: "Drafting", categoryAr: "رسسم فني", order: 1 },
    { id: "sk-003", name: "Navisworks", category: "BIM", categoryAr: "تنModeling", order: 2 },
    { id: "sk-004", name: "HAP", category: "HVAC", categoryAr: "تكييف", order: 3 },
    { id: "sk-005", name: "DIALux", category: "Lighting", categoryAr: "إضاءة", order: 4 },
    { id: "sk-006", name: "ETAP", category: "Electrical", categoryAr: "كهرباء", order: 5 },
    { id: "sk-007", name: "Excel", category: "Documentation", categoryAr: "وثائق", order: 6 },
    { id: "sk-008", name: "BIM 360", category: "Collaboration", categoryAr: "تعاون", order: 7 },
  ];

  for (const s of skills) {
    await prisma.skill.upsert({ where: { id: s.id }, update: s, create: s });
  }
  console.log(`  ✓ ${skills.length} Skills`);

  const specialties = [
    {
      id: "sp-001",
      title: "HVAC & Ventilation",
      titleAr: "التكييف والتهوية",
      description: "Load calculations, equipment selection, and ductwork design for optimal thermal comfort with minimal energy consumption.",
      descriptionAr: "حساب الأحمال الحرارية، اختيار الوحدات، وتصميم شبكات المجاري بما يحقق راحة حرارية بأقل استهلاك للطاقة.",
      icon: "wind",
      order: 0,
    },
    {
      id: "sp-002",
      title: "Plumbing",
      titleAr: "الأعمال الصحية",
      description: "Supply, drainage, and storm water networks with pressure calculations, pump and tank selection.",
      descriptionAr: "شبكات التغذية والصرف وتصريف الأمطار، مع حسابات الضغوط واختيار المضخات وخزانات المياه.",
      icon: "droplets",
      order: 1,
    },
    {
      id: "sp-003",
      title: "Electrical",
      titleAr: "الأعمال الكهربائية",
      description: "Distribution panels, cable calculations, lighting, and low-current systems for residential and commercial projects.",
      descriptionAr: "لوحات التوزيع، حسابات الكابلات، الإنارة، وأنظمة التيار الخفيف لمشاريع سكنية وتجارية.",
      icon: "zap",
      order: 2,
    },
    {
      id: "sp-004",
      title: "Fire Fighting",
      titleAr: "مكافحة الحريق",
      description: "Sprinkler networks, fire boxes, and alarm systems designed to NFPA codes and civil defense requirements.",
      descriptionAr: "تصميم شبكات المرشات والصناديق وأنظمة الإنذار وفق كودات NFPA والدفاع المدني.",
      icon: "flame",
      order: 3,
    },
    {
      id: "sp-005",
      title: "BIM Modeling",
      titleAr: "نمذجة BIM",
      description: "Integrated 3D models on Revit with clash detection and construction drawing output.",
      descriptionAr: "موديل ثلاثي الأبعاد متكامل على Revit مع تنسيق التصادمات وإخراج اللوحات التنفيذية.",
      icon: "boxes",
      order: 4,
    },
    {
      id: "sp-006",
      title: "Energy Efficiency",
      titleAr: "كفاءة الطاقة",
      description: "Performance simulation, sustainability studies, and operational cost reduction aligned with LEED requirements.",
      descriptionAr: "محاكاة الأداء، دراسات الاستدامة، وخفض تكلفة التشغيل بما يوافق متطلبات LEED.",
      icon: "gauge",
      order: 5,
    },
  ];

  for (const s of specialties) {
    await prisma.specialty.upsert({ where: { id: s.id }, update: s, create: s });
  }
  console.log(`  ✓ ${specialties.length} Specialties`);

  console.log("Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
