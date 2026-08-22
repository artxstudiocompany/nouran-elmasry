import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const profile = await prisma.profile.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" },
    });
    return NextResponse.json(profile);
  } catch (err) {
    console.error("Profile GET error:", err);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const profile = await prisma.profile.upsert({
      where: { id: "default" },
      update: {
        name: body.name,
        nameAr: body.nameAr,
        title: body.title,
        titleAr: body.titleAr,
        tagline: body.tagline,
        taglineAr: body.taglineAr,
        bio: body.bio,
        bioAr: body.bioAr,
        email: body.email,
        phone: body.phone,
        linkedin: body.linkedin,
        whatsapp: body.whatsapp,
      },
      create: {
        id: "default",
        name: body.name ?? "",
        nameAr: body.nameAr ?? "",
        title: body.title ?? "",
        titleAr: body.titleAr ?? "",
        tagline: body.tagline ?? "",
        taglineAr: body.taglineAr ?? "",
        bio: body.bio ?? "",
        bioAr: body.bioAr ?? "",
        email: body.email ?? "",
        phone: body.phone ?? "",
        linkedin: body.linkedin ?? "",
        whatsapp: body.whatsapp ?? "",
      },
    });
    return NextResponse.json(profile);
  } catch (err) {
    console.error("Profile PUT error:", err);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
