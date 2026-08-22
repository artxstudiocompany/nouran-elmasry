import { Specialty } from "@/types";

export const specialties: Specialty[] = [
  {
    title: "HVAC & Ventilation",
    titleAr: "التكييف والتهوية",
    description: "Load calculations, equipment selection, and ductwork design for optimal thermal comfort with minimal energy consumption.",
    descriptionAr: "حساب الأحمال الحرارية، اختيار الوحدات، وتصميم شبكات المجاري بما يحقق راحة حرارية بأقل استهلاك للطاقة.",
    icon: "wind",
  },
  {
    title: "Plumbing",
    titleAr: "الأعمال الصحية",
    description: "Supply, drainage, and storm water networks with pressure calculations, pump and tank selection.",
    descriptionAr: "شبكات التغذية والصرف وتصريف الأمطار، مع حسابات الضغوط واختيار المضخات وخزانات المياه.",
    icon: "droplets",
  },
  {
    title: "Electrical",
    titleAr: "الأعمال الكهربائية",
    description: "Distribution panels, cable calculations, lighting, and low-current systems for residential and commercial projects.",
    descriptionAr: "لوحات التوزيع، حسابات الكابلات، الإنارة، وأنظمة التيار الخفيف لمشاريع سكنية وتجارية.",
    icon: "zap",
  },
  {
    title: "Fire Fighting",
    titleAr: "مكافحة الحريق",
    description: "Sprinkler networks, fire boxes, and alarm systems designed to NFPA codes and civil defense requirements.",
    descriptionAr: "تصميم شبكات المرشات والصناديق وأنظمة الإنذار وفق كودات NFPA والدفاع المدني.",
    icon: "flame",
  },
  {
    title: "BIM Modeling",
    titleAr: "نمذجة BIM",
    description: "Integrated 3D models on Revit with clash detection and construction drawing output.",
    descriptionAr: "موديل ثلاثي الأبعاد متكامل على Revit مع تنسيق التصادمات وإخراج اللوحات التنفيذية.",
    icon: "boxes",
  },
  {
    title: "Energy Efficiency",
    titleAr: "كفاءة الطاقة",
    description: "Performance simulation, sustainability studies, and operational cost reduction aligned with LEED requirements.",
    descriptionAr: "محاكاة الأداء، دراسات الاستدامة، وخفض تكلفة التشغيل بما يوافق متطلبات LEED.",
    icon: "gauge",
  },
];

export const stats = [
  { value: "+3", labelKey: "about.stats.experience" },
  { value: "+15", labelKey: "about.stats.projects" },
  { value: "+10", labelKey: "about.stats.clients" },
  { value: "%100", labelKey: "about.stats.commitment" },
];
