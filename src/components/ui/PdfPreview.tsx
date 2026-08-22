"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  pdfUrl: string;
  className?: string;
}

export default function PdfPreview({ pdfUrl, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const docRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError(false);
      setPage(1);

      try {
        const { loadPdfDocument } = await import("@/lib/pdfHelper");
        const { doc } = await loadPdfDocument(pdfUrl, 15000);
        if (cancelled) { doc.destroy(); return; }
        docRef.current = doc;
        setTotal(doc.numPages);
        setLoading(false);
      } catch (err) {
        console.error("PDF preview load failed:", err);
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
  }, [pdfUrl]);

  useEffect(() => {
    const doc = docRef.current;
    if (!doc || !canvasRef.current || !containerRef.current) return;

    let renderTask: any;

    doc.getPage(page).then((p: any) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const vp = p.getViewport({ scale: 1 });
      const scale = (w / vp.width) * dpr;
      const viewport = p.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = w + "px";
      canvas.style.height = (viewport.height / dpr) + "px";

      renderTask = p.render({ canvasContext: canvas.getContext("2d")!, viewport });
    });

    return () => { renderTask?.cancel(); };
  }, [page, total, loading]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-night-panel ${className}`}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-glow/30 border-t-glow" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-night-panel ${className}`}>
        <span className="text-sm text-ink-muted">PDF unavailable</span>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className={`flex items-center justify-center bg-night-panel ${className}`}>
        <span className="text-sm text-ink-muted">PDF</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-night-panel ${className}`}>
      <canvas ref={canvasRef} className="block w-full" />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setPage((p) => Math.max(1, p - 1)); }}
            disabled={page <= 1}
            className="absolute start-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-night-deep/80 text-ink-muted backdrop-blur transition-colors hover:text-glow disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setPage((p) => Math.min(total, p + 1)); }}
            disabled={page >= total}
            className="absolute end-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-night-deep/80 text-ink-muted backdrop-blur transition-colors hover:text-glow disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="absolute bottom-2 end-3 z-10 rounded-full bg-night-deep/80 px-2.5 py-0.5 font-latin text-xs text-ink-muted backdrop-blur">
            {page} / {total}
          </span>
        </>
      )}
    </div>
  );
}
