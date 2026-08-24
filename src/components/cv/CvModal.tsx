"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react";
import { useI18n } from "@/i18n/provider";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  downloadName: string;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.15;

export default function CvModal({ isOpen, onClose, pdfUrl, downloadName }: CvModalProps) {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const docRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const renderPage = useCallback(async (pageNum: number, currentZoom: number) => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!doc || !canvas || !container) return;

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    setPageLoading(true);

    try {
      const pdfPage = await doc.getPage(pageNum);
      const dpr = window.devicePixelRatio || 1;
      const containerWidth = container.clientWidth;
      const baseViewport = pdfPage.getViewport({ scale: 1 });
      const baseScale = (containerWidth / baseViewport.width) * dpr;
      const scale = baseScale * currentZoom;
      const viewport = pdfPage.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = (containerWidth * currentZoom) + "px";
      canvas.style.height = (containerWidth * (baseViewport.height / baseViewport.width) * currentZoom) + "px";

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const task = pdfPage.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = task;
      await task.promise;
      renderTaskRef.current = null;
      setPageLoading(false);
    } catch (err: any) {
      if (err?.name === "RenderingCancelledException") return;
      console.error("CV page render failed:", err);
      setPageLoading(false);
    }
  }, []);

  const loadDocument = useCallback(async (url: string) => {
    setLoading(true);
    setError(false);
    setPage(1);
    setZoom(1);

    try {
      if (docRef.current?.destroy) docRef.current.destroy();
      docRef.current = null;

      const { loadPdfDocument } = await import("@/lib/pdfHelper");
      const { doc } = await loadPdfDocument(url, 15000);
      docRef.current = doc;
      setTotal(doc.numPages);
      setLoading(false);
    } catch (err) {
      console.error("CV document load failed:", err);
      setLoading(false);
      setError(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      if (docRef.current?.destroy) {
        docRef.current.destroy();
        docRef.current = null;
      }
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      return;
    }

    document.body.style.overflow = "hidden";
    loadDocument(pdfUrl);

    return () => {
      document.body.style.overflow = "";
      if (docRef.current?.destroy) {
        docRef.current.destroy();
        docRef.current = null;
      }
    };
  }, [isOpen, pdfUrl, loadDocument]);

  useEffect(() => {
    if (!isOpen || loading || error || !docRef.current) return;
    renderPage(page, zoom);
  }, [page, zoom, loading, error, isOpen, renderPage]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPage((p) => Math.max(1, p - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPage((p) => Math.min(total, p + 1));
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
      } else if (e.key === "-") {
        e.preventDefault();
        setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
      } else if (e.key === "0") {
        e.preventDefault();
        setZoom(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, total]);

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(total, p + 1));
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  const resetZoom = () => setZoom(1);

  const pageLabel = t.cv.pageOf
    .replace("{current}", String(page))
    .replace("{total}", String(total));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={t.cv.title}
        >
          <motion.div
            className="absolute inset-0 bg-night-deep/95 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/5 px-3 sm:px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
              aria-label={t.cv.close}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {total > 1 && (
                <>
                  <button
                    onClick={prevPage}
                    disabled={page <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
                    aria-label={t.cv.prevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="min-w-[4rem] text-center font-latin text-xs text-ink-muted">
                    {pageLabel}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={page >= total}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
                    aria-label={t.cv.nextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              <div className="ms-1 flex items-center gap-1 border-s border-white/10 ps-1.5 sm:ms-2 sm:ps-2">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
                  aria-label={t.cv.zoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={resetZoom}
                  className="flex h-9 min-w-[3rem] items-center justify-center rounded-full border border-white/10 bg-night-deep/80 px-1 font-latin text-xs text-ink-muted transition-colors hover:border-glow/30 hover:text-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
                  aria-label={t.cv.resetZoom}
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  onClick={zoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
                  aria-label={t.cv.zoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              <a
                href={pdfUrl}
                download={downloadName}
                className="ms-1 flex h-9 items-center gap-1.5 rounded-full border border-glow/30 bg-glow/10 px-3 text-xs font-medium text-glow transition-colors hover:bg-glow/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70 sm:ms-2 sm:px-4"
                aria-label={t.cv.download}
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.cv.download}</span>
              </a>
            </div>
          </motion.div>

          <div
            ref={containerRef}
            className="relative z-10 flex flex-1 items-start justify-center overflow-auto bg-night-deep/50 p-2 sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
            {loading && (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-glow/30 border-t-glow" />
                  <p className="text-sm text-ink-muted">{t.cv.loading}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                  <svg className="h-12 w-12 text-ink-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  <p className="text-sm text-ink-muted">{t.cv.error}</p>
                  <button
                    onClick={() => loadDocument(pdfUrl)}
                    className="rounded-full border border-glow/30 bg-glow/10 px-5 py-2 text-xs font-medium text-glow transition-colors hover:bg-glow/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
                  >
                    {t.cv.retry}
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && (
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {pageLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-glow/30 border-t-glow" />
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  className={`block rounded-lg shadow-2xl ring-1 ring-white/10 ${pageLoading ? "opacity-50" : ""}`}
                />

                {total > 1 && (
                  <>
                    <button
                      onClick={prevPage}
                      disabled={page <= 1}
                      className="absolute start-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted backdrop-blur transition-colors hover:border-glow/30 hover:text-glow disabled:opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
                      aria-label={t.cv.prevPage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={page >= total}
                      className="absolute end-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted backdrop-blur transition-colors hover:border-glow/30 hover:text-glow disabled:opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
                      aria-label={t.cv.nextPage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
