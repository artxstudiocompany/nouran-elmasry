"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import { useSiteData } from "@/store/DataContext";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Skills() {
  const { t } = useI18n();
  const { skills } = useSiteData();

  return (
    <section className="section-padding relative">
      <div className="mx-auto max-w-5xl">
        <SectionHeading overline="TOOLS" title={t.skills.title} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3"
        >
          {skills.map((skill) => (
            <motion.span
              key={skill.name}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center rounded-full border border-white/10 bg-night-panel/40 px-5 py-2 text-sm text-ink-muted transition-colors duration-200 hover:border-glow/40 hover:text-glow"
            >
              {skill.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
