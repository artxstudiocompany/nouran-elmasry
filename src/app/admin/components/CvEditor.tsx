"use client";

import { useState, useRef } from "react";
import { useSiteData } from "@/store/DataContext";
import SavedIndicator, { useSaveIndicator } from "./SavedIndicator";

export default function CvEditor() {
  const data = useSiteData();
  const { saved, show } = useSaveIndicator();
  const inputRef = useRef<HTMLInputElement>(null);

  const [cvFile, setCvFile] = useState(data.cvFile);
  const [uploading, setUploading] = useState(false);

  const hasUpload = !!cvFile && cvFile !== "";

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("File size must be less than 4MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "pdfs/cv");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json().catch(() => null);

      if (res.ok && result?.url) {
        setCvFile(result.url);
      } else {
        alert(result?.error || `Upload failed (status ${res.status})`);
      }
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setCvFile("");
  };

  const handleSave = async () => {
    const ok = await data.updateCvFile(cvFile);
    show(ok);
  };

  const input =
    "w-full rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-glow/60 focus:outline-none focus:ring-1 focus:ring-glow/40";

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">CV File</h2>
        <p className="text-sm text-ink-muted">
          Upload the engineer&apos;s CV PDF. This file will be displayed in the Professional File section and available for download.
        </p>

        <div className="flex items-center gap-4">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-glow/15 px-6 py-2.5 text-sm font-semibold text-glow ring-1 ring-glow/50 hover:bg-glow/25 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : hasUpload ? "Replace CV" : "Upload CV"}
          </button>

          {hasUpload && (
            <button
              onClick={handleRemove}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/20"
            >
              Remove Uploaded CV
            </button>
          )}
        </div>

        <div className="rounded-lg border border-white/5 bg-night-deep/50 p-4">
          <p className="text-xs text-ink-muted">
            Status:{" "}
            <span className={hasUpload ? "text-glow" : "text-ink-muted"}>
              {hasUpload ? "Custom CV uploaded" : "Using default placeholder"}
            </span>
          </p>
          {cvFile && (
            <p className="mt-1 text-xs text-ink-muted font-latin break-all">
              URL: {cvFile}
            </p>
          )}
        </div>
      </section>

      <button
        onClick={handleSave}
        className="rounded-lg bg-glow/15 px-8 py-2.5 text-sm font-semibold text-glow ring-1 ring-glow/50 hover:bg-glow/25"
      >
        Save CV Settings
      </button>

      <SavedIndicator saved={saved} />
    </div>
  );
}
