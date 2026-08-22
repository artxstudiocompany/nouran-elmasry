import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "proj-001",
    image: "/images/projects/project1.jpg",
    type: "Commercial Tower",
    typeAr: "برج تجاري",
    scope: "Full MEP Design & Coordination",
    scopeAr: "تصميم وتنسيق MEP كامل",
    description:
      "A 35-story commercial tower in New Cairo featuring integrated MEP systems with energy-efficient HVAC, smart lighting, and advanced fire protection.",
    descriptionAr:
      "برج تجاري يبلغ 35 طابقًا في القاهرة الجديدة يتضمن أنظمة MEP متكاملة مع تكييف موفر للطاقة وإضاءة ذكية وحماية متقدمة ضد الحريق.",
    systems: ["HVAC", "Electrical", "Plumbing", "Fire Fighting", "BIM"],
    systemsAr: ["تكييف", "كهرباء", "سباكة", "حريق", "BIM"],
    tools: ["Revit", "AutoCAD", "Navisworks", "HAP", "DIALux"],
    toolsAr: ["Revit", "AutoCAD", "Navisworks", "HAP", "DIALux"],
    gallery: [
      "/images/projects/project1.jpg",
      "/images/projects/project1-g2.jpg",
    ],
    category: "سكني فاخر",
    categoryAr: "سكني فاخر",
    area: "42,000 m²",
    year: "2025",
  },
  {
    id: "proj-002",
    image: "/images/projects/project2.jpg",
    type: "Medical Complex",
    typeAr: "مجمع طبي",
    scope: "MEP Design for Hospital Wings",
    scopeAr: "تصميم MEP لأجنحة المستشفى",
    description:
      "Complete MEP design for a 200-bed medical complex including specialized ventilation for operating rooms, medical gas systems, and emergency power.",
    descriptionAr:
      "تصميم MEP كامل لمجمع طبي يضم 200 سرير يشمل تهوية متخصصة لغرف العمليات وأنظمة غاز طبي وطاقة طوارئ.",
    systems: ["HVAC", "Electrical", "Medical Gas", "Fire Fighting"],
    systemsAr: ["تكييف", "كهرباء", "غاز طبي", "حريق"],
    tools: ["Revit", "AutoCAD", "ETAP", "HAP"],
    toolsAr: ["Revit", "AutoCAD", "ETAP", "HAP"],
    gallery: [
      "/images/projects/project2.jpg",
      "/images/projects/project2-g2.jpg",
    ],
    category: "رعاية صحية",
    categoryAr: "رعاية صحية",
    area: "18,500 m²",
    year: "2024",
  },
  {
    id: "proj-003",
    image: "/images/projects/project3.jpg",
    type: "Residential Compound",
    typeAr: "مجمع سكني",
    scope: "Infrastructure & MEP Coordination",
    scopeAr: "تنسيق البنية التحتية وMEP",
    description:
      "Large-scale residential compound with 150 units, featuring centralized HVAC, district cooling, and integrated BIM coordination across all disciplines.",
    descriptionAr:
      "مجمع سكني واسع النطاق يضم 150 وحدة يتضمن تكييفًا مركزيًا وتبريدًا مركزيًا وتنسيق BIM متكامل عبر جميع التخصصات.",
    systems: ["HVAC", "Plumbing", "Electrical", "Fire Fighting", "BIM"],
    systemsAr: ["تكييف", "سباكة", "كهرباء", "حريق", "BIM"],
    tools: ["Revit", "Navisworks", "AutoCAD", "Excel"],
    toolsAr: ["Revit", "Navisworks", "AutoCAD", "Excel"],
    gallery: [
      "/images/projects/project3.jpg",
      "/images/projects/project3-g2.jpg",
    ],
    category: "سكني",
    categoryAr: "سكني",
    area: "26,000 m²",
    year: "2024",
  },
  {
    id: "proj-004",
    image: "/images/projects/project4.jpg",
    type: "Industrial Facility",
    typeAr: "منشأة صناعية",
    scope: "MEP Design & Safety Systems",
    scopeAr: "تصميم MEP وأنظمة السلامة",
    description:
      "Industrial warehouse complex with specialized ventilation, explosion-proof electrical systems, and comprehensive fire suppression infrastructure.",
    descriptionAr:
      "مجمع مستودعات صناعية مع تهوية متخصصة وأنظمة كهربائية مقاومة للانفجار وبنية تحتية شاملة لإطفاء الحريق.",
    systems: ["HVAC", "Electrical", "Fire Fighting", "Plumbing"],
    systemsAr: ["تكييف", "كهرباء", "حريق", "سباكة"],
    tools: ["AutoCAD", "Revit", "ETAP", "DIALux"],
    toolsAr: ["AutoCAD", "Revit", "ETAP", "DIALux"],
    gallery: [
      "/images/projects/project4.jpg",
      "/images/projects/project4-g2.jpg",
    ],
    category: "صناعي",
    categoryAr: "صناعي",
    area: "9,800 m²",
    year: "2023",
  },
  {
    id: "proj-005",
    image: "/images/projects/project5.jpg",
    type: "Educational Campus",
    typeAr: "حرم تعليمي",
    scope: "MEP Master Planning",
    scopeAr: "التخطيط الرئيسي لـ MEP",
    description:
      "University campus expansion with sustainable MEP design including solar integration, rainwater harvesting, and smart building management systems.",
    descriptionAr:
      "توسع حرم جامعي بتصميم MEP مستدام يشمل التكامل الشمسي واستمطار مياه الأمطر وأنظمة إدارة المباني الذكية.",
    systems: ["HVAC", "Electrical", "Plumbing", "Fire Fighting", "BIM"],
    systemsAr: ["تكييف", "كهرباء", "سباكة", "حريق", "BIM"],
    tools: ["Revit", "Navisworks", "HAP", "DIALux", "AutoCAD"],
    toolsAr: ["Revit", "Navisworks", "HAP", "DIALux", "AutoCAD"],
    gallery: [
      "/images/projects/project5.jpg",
      "/images/projects/project5-g2.jpg",
    ],
    category: "تعليمي",
    categoryAr: "تعليمي",
    area: "35,000 m²",
    year: "2023",
  },
];
