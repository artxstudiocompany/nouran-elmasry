import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

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
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        heroLogoUrl: body.heroLogoUrl,
        heroBgUrl: body.heroBgUrl,
        aboutBgUrl: body.aboutBgUrl,
        cvFileUrl: body.cvFileUrl,
        translationsEn: body.translationsEn,
        translationsAr: body.translationsAr,
      },
      create: {
        id: "default",
        heroLogoUrl: body.heroLogoUrl ?? "/images/logo.png",
        heroBgUrl: body.heroBgUrl ?? "/images/hero-plate.jpg",
        aboutBgUrl: body.aboutBgUrl ?? "/images/about-plate.jpg",
        cvFileUrl: body.cvFileUrl ?? "",
        translationsEn: body.translationsEn ?? "{}",
        translationsAr: body.translationsAr ?? "{}",
      },
    });
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Settings PUT error:", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
