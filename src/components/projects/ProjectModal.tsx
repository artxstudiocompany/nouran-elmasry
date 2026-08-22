"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import PdfPreview from "@/components/ui/PdfPreview";
import type { Project } from "@/types";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { locale, t } = useI18n();

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!project) return null;

  const title = locale === "ar" ? project.typeAr : project.type;
  const category = locale === "ar" ? project.categoryAr : project.category;
  const scope = locale === "ar" ? project.scopeAr : project.scope;
  const systems = locale === "ar" ? project.systemsAr : project.systems;

  const systemColors = [
    "border-glow/30 text-glow",
    "border-glow-dim/30 text-glow-dim",
    "border-ink-muted/30 text-ink-muted",
    "border-glow-strong/30 text-glow-strong",
  ];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="glass relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/5"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 start-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {project.imageUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
                <img src={project.imageUrl} alt={title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night-deep/80 to-transparent" />
              </div>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-night-panel to-night-deep">
                <div className="absolute inset-0 bg-gradient-to-t from-night-deep/80 to-transparent" />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-glow-strong md:text-3xl">{title}</h2>
                  <p className="mt-1 text-sm text-glow-dim">{category}</p>
                </div>
                <div className="flex gap-2">
                  <span className="shrink-0 rounded-full bg-glow/15 px-3 py-1 font-latin text-xs text-glow ring-1 ring-glow/25">
                    {project.year}
                  </span>
                  <span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs text-ink-muted ring-1 ring-white/10">
                    {project.area}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-glow">{t.projects.scope}</h3>
                <p className="leading-relaxed text-ink-muted">{scope}</p>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-glow">{t.projects.systems}</h3>
                <div className="flex flex-wrap gap-2">
                  {systems.map((system, i) => (
                    <span
                      key={system}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium ${systemColors[i % systemColors.length]}`}
                    >
                      {system}
                    </span>
                  ))}
                </div>
              </div>

              {project.pdfUrl && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-glow">PDF</h3>
                  <PdfPreview pdfUrl={project.pdfUrl} className="rounded-lg border border-white/10" />
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={onClose}
                  className="hex-clip bg-glow/15 px-8 py-3 font-semibold text-glow-strong ring-1 ring-glow/70 transition-[background-color,color] duration-150 ease-out hover:bg-glow/25"
                >
                  {t.projects.close}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
