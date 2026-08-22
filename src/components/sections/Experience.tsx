"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import { useSiteData } from "@/store/DataContext";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Experience() {
  const { dir, t } = useI18n();
  const { experience } = useSiteData();
  const isRtl = dir === "rtl";

  return (
    <section id="experience" className="section-padding relative">
      <div className="mx-auto max-w-4xl">
        <SectionHeading overline="EXPERIENCE" title={t.experience.title} />

        <div className="relative mt-14">
          <div className="absolute bottom-0 top-0 w-px bg-night-line sm:start-1/2 sm:-translate-x-px" />

          <div className="space-y-10">
            {experience.map((entry, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center"
                >
                  <div className="absolute top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-glow bg-night-deep sm:start-1/2 sm:-translate-x-1/2">
                    <div className="h-2 w-2 rounded-full bg-glow" />
                  </div>

                  <div className={`w-full ps-10 sm:w-1/2 sm:ps-0 ${isEven ? "sm:pe-12 sm:text-end" : "sm:ms-auto sm:ps-12 sm:text-start"}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                      className="rounded-2xl border border-white/5 bg-night-panel/60 p-6"
                    >
                      <span className="mb-3 inline-block rounded-full bg-glow/10 px-4 py-1 font-latin text-sm text-glow ring-1 ring-glow/25">
                        {entry.year}
                      </span>
                      <h3 className="text-lg font-semibold text-ink">
                        {isRtl ? entry.positionAr : entry.position}
                      </h3>
                      <p className="mt-1 text-sm text-glow-dim">
                        {isRtl ? entry.companyAr : entry.company}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {isRtl ? entry.descriptionAr : entry.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
