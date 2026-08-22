import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { pathname } = await req.json();

    if (!pathname) {
      return NextResponse.json({ error: "pathname is required" }, { status: 400 });
    }

    const token = await generateClientTokenFromReadWriteToken({
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      pathname,
      allowOverwrite: true,
    });

    return NextResponse.json({ clientToken: token });
  } catch (err) {
    console.error("Client token error:", err);
    return NextResponse.json(
      { error: `Failed to generate token: ${err instanceof Error ? err.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
