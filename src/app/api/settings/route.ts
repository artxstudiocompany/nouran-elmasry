import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" },
    });
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const existing = await prisma.siteSettings.findUnique({ where: { id: "default" } });

    const updateData: Record<string, unknown> = {};
    if (body.heroLogoUrl !== undefined) updateData.heroLogoUrl = body.heroLogoUrl;
    if (body.heroBgUrl !== undefined) updateData.heroBgUrl = body.heroBgUrl;
    if (body.aboutBgUrl !== undefined) updateData.aboutBgUrl = body.aboutBgUrl;
    if (body.cvFileUrl !== undefined) updateData.cvFileUrl = body.cvFileUrl;
    if (body.translationsEn !== undefined) updateData.translationsEn = body.translationsEn;
    if (body.translationsAr !== undefined) updateData.translationsAr = body.translationsAr;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: updateData,
      create: {
        id: "default",
        heroLogoUrl: body.heroLogoUrl ?? "/images/logo.png",
        heroBgUrl: body.heroBgUrl ?? "/images/hero-plate.jpg",
        aboutBgUrl: body.aboutBgUrl ?? "/images/about-plate.jpg",
        cvFileUrl: body.cvFileUrl ?? "",
        translationsEn: body.translationsEn ?? JSON.stringify(enMessages),
        translationsAr: body.translationsAr ?? JSON.stringify(arMessages),
      },
    });
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Settings PUT error:", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
