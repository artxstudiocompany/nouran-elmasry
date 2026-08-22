import { upload } from "@vercel/blob/client";

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}

function getExtension(filename: string): string {
  return filename.split(".").pop() || "bin";
}

export interface ClientUploadResult {
  url: string;
  pathname: string;
}

export interface ClientUploadError {
  error: string;
}

export async function clientUpload(
  file: File,
  folder: string
): Promise<ClientUploadResult | ClientUploadError> {
  const ext = getExtension(file.name);
  const timestamp = Date.now();
  const safeName = sanitizeFilename(file.name.replace(/\.[^.]+$/, ""));
  const pathname = `${folder}/${safeName}-${timestamp}.${ext}`;

  try {
    const tokenRes = await fetch("/api/upload/client-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname }),
    });

    const tokenData = await tokenRes.json().catch(() => null);
    if (!tokenRes.ok || !tokenData?.clientToken) {
      return { error: tokenData?.error || `Token request failed (${tokenRes.status})` };
    }

    const result = await upload(pathname, file, {
      clientToken: tokenData.clientToken,
      access: "public",
    });

    return { url: result.url, pathname };
  } catch (err) {
    return { error: `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}` };
  }
}
