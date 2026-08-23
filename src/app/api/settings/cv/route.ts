import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { cvFileUrl } = await req.json();

    if (typeof cvFileUrl !== "string") {
      return NextResponse.json({ error: "cvFileUrl must be a string" }, { status: 400 });
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: { cvFileUrl },
      create: {
        id: "default",
        cvFileUrl,
      },
    });

    return NextResponse.json({ success: true, cvFileUrl: settings.cvFileUrl });
  } catch (err) {
    console.error("CV save error:", err);
    return NextResponse.json(
      { error: `Failed to save CV: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
