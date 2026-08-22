import { put, del } from "@vercel/blob";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_PDF_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
const ALLOWED_PDF_TYPES = ["application/pdf"];

export function validateFile(file: File, kind: "image" | "pdf"): string | null {
  const maxSize = kind === "image" ? MAX_IMAGE_SIZE : MAX_PDF_SIZE;
  const allowed = kind === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_PDF_TYPES;

  if (!allowed.includes(file.type)) {
    return `Invalid file type: ${file.type}. Allowed: ${allowed.join(", ")}`;
  }
  if (file.size > maxSize) {
    return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: ${maxSize / 1024 / 1024}MB`;
  }
  return null;
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}

export async function uploadToBlob(
  file: File,
  folder: string
): Promise<{ url: string; pathname: string } | { error: string }> {
  const ext = file.name.split(".").pop() || "bin";
  const timestamp = Date.now();
  const safeName = sanitizeFilename(file.name.replace(/\.[^.]+$/, ""));
  const pathname = `${folder}/${safeName}-${timestamp}.${ext}`;

  try {
    const result = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return { url: result.url, pathname };
  } catch (err) {
    return { error: `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}` };
  }
}

export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // Ignore deletion errors (file may already be gone)
  }
}
