"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react";
import { useI18n } from "@/i18n/provider";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  downloadName: string;
}

export default function CvModal({ isOpen, onClose, pdfUrl, downloadName }: CvModalProps) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<any>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const minZoom = 0.5;
  const maxZoom = 3;
  const zoomStep = 0.25;

  const renderPage = useCallback(
    async (doc: any, pageNum: number, scale: number) => {
      if (!canvasRef.current || !containerRef.current) return;
      const p = await doc.getPage(pageNum);
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const dpr = window.devicePixelRatio || 1;
      const vp = p.getViewport({ scale: 1.2 * scale * dpr });
      canvas.width = vp.width;
      canvas.height = vp.height;
      canvas.style.width = vp.width / dpr + "px";
      canvas.style.height = vp.height / dpr + "px";
      await p.render({ canvasContext: canvas.getContext("2d")!, viewport: vp }).promise;
    },
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError(false);
      setPage(1);
      setZoom(1);

      try {
        const { loadPdfDocument } = await import("@/lib/pdfHelper");
        const { doc } = await loadPdfDocument(pdfUrl, 20000);
        if (cancelled) { doc.destroy(); return; }
        docRef.current = doc;
        setTotal(doc.numPages);
        setLoading(false);
      } catch (err) {
        console.error("CV modal load failed:", err);
        if (!cancelled) {
          setLoadError(true);
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      if (docRef.current?.destroy) docRef.current.destroy();
      docRef.current = null;
    };
  }, [isOpen, pdfUrl]);

  useEffect(() => {
    if (!docRef.current || loading) return;
    renderPage(docRef.current, page, zoom);
  }, [page, zoom, loading, renderPage]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(total, p + 1));
  const zoomIn = () => setZoom((z) => Math.min(maxZoom, z + zoomStep));
  const zoomOut = () => setZoom((z) => Math.max(minZoom, z - zoomStep));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-night-deep/95 backdrop-blur-md" onClick={onClose} />

          <div className="relative z-10 flex h-14 items-center justify-between border-b border-white/5 px-4">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow"
              aria-label={t.cv.close}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              {total > 1 && (
                <>
                  <button
                    onClick={prevPage}
                    disabled={page <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow disabled:opacity-30"
                    aria-label={t.cv.prevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-latin text-sm text-ink-muted">
                    {page} / {total}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={page >= total}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow disabled:opacity-30"
                    aria-label={t.cv.nextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              <div className="ms-2 flex items-center gap-1 border-s border-white/10 ps-2">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= minZoom}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow disabled:opacity-30"
                  aria-label={t.cv.zoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-latin text-xs text-ink-muted">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={zoom >= maxZoom}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow disabled:opacity-30"
                  aria-label={t.cv.zoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              <a
                href={pdfUrl}
                download={downloadName}
                className="ms-2 flex h-9 items-center gap-2 rounded-full border border-glow/30 bg-glow/10 px-4 text-xs font-medium text-glow transition-colors hover:bg-glow/20"
                aria-label={t.cv.download}
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.cv.download}</span>
              </a>
            </div>
          </div>

          <div
            ref={containerRef}
            className="relative z-10 flex flex-1 items-center justify-center overflow-auto p-4"
          >
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-glow/30 border-t-glow" />
              </div>
            ) : loadError ? (
              <div className="flex h-40 items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-ink-muted">Failed to load PDF</p>
                  <a href={pdfUrl} download={downloadName} className="mt-3 inline-block text-xs text-glow underline">Download instead</a>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative origin-top"
                style={{ transform: `scale(${zoom})` }}
              >
                <canvas
                  ref={canvasRef}
                  className="block rounded-lg shadow-2xl ring-1 ring-white/10"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
