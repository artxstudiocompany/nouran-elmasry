"use client";

interface Props {
  pdfUrl: string;
  className?: string;
}

export default function PdfPreview({ pdfUrl, className = "" }: Props) {
  return (
    <div className={`relative overflow-hidden bg-night-panel ${className}`}>
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        className="absolute inset-0 h-[150%] w-full border-0 bg-white"
        style={{ transform: "scale(0.667)", transformOrigin: "top left" }}
        title="PDF Preview"
        loading="lazy"
      />
    </div>
  );
}
