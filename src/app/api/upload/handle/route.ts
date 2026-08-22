import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await handleUpload({
      body,
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("images/") && !pathname.startsWith("pdfs/") && !pathname.startsWith("uploads/")) {
          throw new Error("Invalid path: only images/, pdfs/, uploads/ folders allowed");
        }
        return {};
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Handle upload error:", err);
    return NextResponse.json(
      { error: `Upload handling failed: ${err instanceof Error ? err.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
