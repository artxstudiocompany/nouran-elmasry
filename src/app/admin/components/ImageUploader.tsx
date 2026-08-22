"use client";

import { useRef, useState } from "react";
import { clientUpload } from "@/lib/clientUpload";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({ label, value, onChange, folder = "uploads", accept = "image/*", maxSizeMB = 50 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large (max ${maxSizeMB}MB)`);
      return;
    }

    setUploading(true);
    try {
      const result = await clientUpload(file, folder);

      if ("url" in result) {
        onChange(result.url);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      setError(`Upload failed: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm text-ink-muted">{label}</label>
      {value && (
        <img
          src={value}
          alt={label}
          className="h-24 w-auto rounded-lg border border-white/10 object-cover"
        />
      )}
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2 text-sm text-ink-muted hover:border-glow/40 hover:text-glow disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Choose File"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
