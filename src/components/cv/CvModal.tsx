"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { useI18n } from "@/i18n/provider";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  downloadName: string;
}

export default function CvModal({ isOpen, onClose, pdfUrl, downloadName }: CvModalProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const objectRef = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    setLoading(true);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
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

          <div className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/5 px-3 sm:px-4">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-night-deep/80 text-ink-muted transition-colors hover:border-glow/30 hover:text-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
              aria-label={t.cv.close}
            >
              <X className="h-4 w-4" />
            </button>

            <a
              href={pdfUrl}
              download={downloadName}
              className="flex h-9 items-center gap-1.5 rounded-full border border-glow/30 bg-glow/10 px-4 text-xs font-medium text-glow transition-colors hover:bg-glow/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
              aria-label={t.cv.download}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.cv.download}</span>
            </a>
          </div>

          <div className="relative z-10 flex-1 overflow-hidden bg-night-deep/50">
            <div
              className="flex h-full items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-glow/30 border-t-glow" />
                    <p className="text-sm text-ink-muted">{t.cv.loading}</p>
                  </div>
                </div>
              )}

              <object
                ref={objectRef}
                data={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                type="application/pdf"
                className="h-full w-full max-w-5xl rounded-lg ring-1 ring-white/10"
                style={{ minHeight: "80vh" }}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              >
                <iframe
                  src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  className="h-full w-full border-0"
                  style={{ minHeight: "80vh" }}
                  title="CV Viewer"
                  onLoad={() => setLoading(false)}
                />
              </object>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
