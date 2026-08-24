"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import { useSiteData } from "@/store/DataContext";
import SectionHeading from "@/components/ui/SectionHeading";
import CvModal from "@/components/cv/CvModal";

const CV_DOWNLOAD_NAME = "Nouran-El-Masry-CV.pdf";

const metaKeys = [
  "document",
  "profile",
  "specialization",
  "file",
  "status",
] as const;

function CvPagePreview({ pdfUrl }: { pdfUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const docRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const { loadPdfDocument } = await import("@/lib/pdfHelper");
        const { doc } = await loadPdfDocument(pdfUrl, 10000);
        if (cancelled) { doc.destroy(); return; }
        docRef.current = doc;
        const page = await doc.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const dpr = window.devicePixelRatio || 1;
        const w = container.clientWidth;
        const vp = page.getViewport({ scale: 1 });
        const scale = (w / vp.width) * dpr;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = w + "px";
        canvas.style.height = (viewport.height / dpr) + "px";

        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        if (!cancelled) setLoading(false);
      } catch (err) {
        console.error("CV preview load failed:", err);
        if (!cancelled) { setError(true); setLoading(false); }
      }
    };

    load();
    return () => {
      cancelled = true;
      if (docRef.current?.destroy) docRef.current.destroy();
      docRef.current = null;
    };
  }, [pdfUrl]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-night-panel"
      style={{ aspectRatio: "1 / 1.414" }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-night-panel">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-glow/30 border-t-glow" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-night-panel">
          <span className="text-sm text-ink-muted">PDF unavailable</span>
        </div>
      )}
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}

export default function CvSection() {
  const { dir, t } = useI18n();
  const { cvFile } = useSiteData();
  const isRtl = dir === "rtl";
  const [modalOpen, setModalOpen] = useState(false);

  if (!cvFile) {
    return (
      <section id="cv" className="section-padding relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading overline={t.cv.overline} title={t.cv.title} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-center"
          >
            <p className="text-lg font-semibold text-glow-dim">{t.cv.subtitle}</p>
            <p className="mt-2 text-sm text-ink-muted">{t.cv.description}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-12 flex max-w-md flex-col items-center gap-4 rounded-xl border border-dashed border-white/10 bg-night-panel/30 p-10 text-center"
          >
            <svg className="h-12 w-12 text-ink-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p className="text-sm text-ink-muted">{t.cv.noCv || "Upload your CV from the admin panel to preview it here."}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  const metaLabels = metaKeys.map((key) => ({
    key,
    label: isRtl ? keyLabelsAr[key] : keyLabelsEn[key],
    value: t.cv.meta[`${key}Value` as keyof typeof t.cv.meta],
  }));

  return (
    <section id="cv" className="section-padding relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(233,237,180,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(233,237,180,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading overline={t.cv.overline} title={t.cv.title} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-center"
        >
          <p className="text-lg font-semibold text-glow-dim">{t.cv.subtitle}</p>
          <p className="mt-2 text-sm text-ink-muted">{t.cv.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mt-14"
        >
          <div className="hidden md:block">
            <div className="absolute -start-6 top-1/2 -translate-y-1/2 space-y-6" dir="ltr">
              {metaLabels.slice(0, 3).map((m, i) => (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  className="text-end"
                >
                  <p className="font-latin text-[10px] tracking-[0.2em] text-ink-muted/60">{m.label}</p>
                  <p className="font-latin text-xs text-glow-dim">{m.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="absolute -end-6 top-1/2 -translate-y-1/2 space-y-6" dir="ltr">
              {metaLabels.slice(3).map((m, i) => (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + (i + 3) * 0.06 }}
                >
                  <p className="font-latin text-[10px] tracking-[0.2em] text-ink-muted/60">{m.label}</p>
                  <p className="font-latin text-xs text-glow-dim">{m.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div
            className="group relative mx-auto max-w-md cursor-pointer"
            onClick={() => setModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setModalOpen(true); } }}
            aria-label={t.cv.view}
          >
            <div className="relative overflow-hidden rounded-lg ring-1 ring-white/10 transition-shadow duration-500 group-hover:ring-glow/30 group-hover:shadow-[0_0_60px_rgba(233,237,180,0.12)]">
              <CvPagePreview pdfUrl={cvFile} />

              <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={() => setModalOpen(true)}
              />

              <div className="pointer-events-none absolute inset-0 z-20 cv-scanner opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-night-deep/60 via-night-deep/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-2 rounded-full bg-night-deep/80 px-5 py-2.5 text-sm font-medium text-glow ring-1 ring-glow/30 backdrop-blur-sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  {t.cv.clickToView}
                </div>
              </div>
            </div>

            <div className="absolute -inset-3 -z-10 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ boxShadow: "0 0 80px rgba(233,237,180,0.06)" }} />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3 md:hidden">
            {metaLabels.map((m) => (
              <span key={m.key} className="font-latin text-[10px] text-ink-muted/50">{m.value}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => setModalOpen(true)}
            className="hex-clip bg-glow/15 px-9 py-3 text-[15px] font-semibold text-glow-strong ring-1 ring-glow/70 transition-[background-color,color,box-shadow] duration-150 ease-out hover:bg-glow/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
            style={{ boxShadow: "0 0 28px rgba(233,237,180,0.35)" }}
          >
            <span className="relative">{t.cv.view}</span>
          </button>

          <a
            href={cvFile}
            download={CV_DOWNLOAD_NAME}
            className="hex-clip bg-night-deep/40 px-9 py-3 text-[15px] font-semibold text-ink ring-1 ring-glow/35 transition-[background-color,color] duration-150 ease-out hover:bg-glow/10 hover:text-glow-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
          >
            <span className="relative">{t.cv.download}</span>
          </a>
        </motion.div>
      </div>

      <CvModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        pdfUrl={cvFile}
        downloadName={CV_DOWNLOAD_NAME}
      />
    </section>
  );
}

const keyLabelsEn: Record<string, string> = {
  document: "DOCUMENT",
  profile: "PROFILE",
  specialization: "SPECIALIZATION",
  file: "FILE",
  status: "STATUS",
};

const keyLabelsAr: Record<string, string> = {
  document: "المستند",
  profile: "الملف",
  specialization: "التخصص",
  file: "الملف",
  status: "الحالة",
};
