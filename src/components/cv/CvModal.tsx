"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { useI18n } from "@/i18n/provider";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  downloadName: string;
}

export default function CvModal({ isOpen, onClose, pdfUrl, downloadName }: CvModalProps) {
  const { t } = useI18n();
  const [zoom, setZoom] = useState(1);

  const minZoom = 0.5;
  const maxZoom = 2;
  const zoomStep = 0.1;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setZoom(1);
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
              <div className="flex items-center gap-1">
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

          <div className="relative z-10 flex flex-1 items-start justify-center overflow-auto bg-night-deep/50 p-4">
            <div
              className="origin-top"
              style={{ transform: `scale(${zoom})` }}
            >
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                className="h-[85vh] w-[680px] rounded-lg border-0 bg-white shadow-2xl ring-1 ring-white/10"
                title="CV Viewer"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
