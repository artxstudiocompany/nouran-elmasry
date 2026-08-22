"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { useSiteData } from "@/store/DataContext";
import SectionHeading from "@/components/ui/SectionHeading";
import PdfPreview from "@/components/ui/PdfPreview";
import ProjectModal from "@/components/projects/ProjectModal";
import type { Project } from "@/types";

export default function Projects() {
  const { locale, t } = useI18n();
  const { projects } = useSiteData();
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="bg-night px-4 py-24 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading overline="SELECTED WORK" title={t.projects.title} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(project)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(project); } }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-night-panel/60 text-start transition-all duration-300 ease-out hover:border-glow/20 hover:shadow-lg hover:shadow-glow/5"
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-night-panel to-night-deep">
                {project.pdfUrl ? (
                  <PdfPreview pdfUrl={project.pdfUrl} className="h-full w-full" />
                ) : project.imageUrl ? (
                  <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-night-deep/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 flex gap-2">
                  <span className="rounded-full bg-glow/15 px-3 py-1 font-latin text-xs text-glow ring-1 ring-glow/25">
                    {project.year}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-ink-muted ring-1 ring-white/10">
                    {project.area}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-ink transition-colors duration-150 group-hover:text-glow-strong">
                  {locale === "ar" ? project.typeAr : project.type}
                </h3>
                <p className="mt-1 text-sm text-glow-dim">
                  {locale === "ar" ? project.categoryAr : project.category}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                  {locale === "ar" ? project.scopeAr : project.scope}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {(locale === "ar" ? project.systemsAr : project.systems)
                    .slice(0, 4)
                    .map((system) => (
                      <span
                        key={system}
                        className="rounded-full border border-white/10 bg-night-deep/50 px-2.5 py-0.5 text-xs text-ink-muted"
                      >
                        {system}
                      </span>
                    ))}
                  {project.pdfUrl && (
                    <span className="rounded-full border border-glow/20 bg-glow/10 px-2.5 py-0.5 text-xs text-glow">
                      PDF
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
