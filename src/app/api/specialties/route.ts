import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.specialty.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (err) {
    console.error("Specialties GET error:", err);
    return NextResponse.json({ error: "Failed to load specialties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const item = await prisma.specialty.create({
      data: {
        title: body.title ?? "",
        titleAr: body.titleAr ?? "",
        description: body.description ?? "",
        descriptionAr: body.descriptionAr ?? "",
        icon: body.icon ?? "wind",
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(item);
  } catch (err) {
    console.error("Specialties POST error:", err);
    return NextResponse.json({ error: "Failed to create specialty" }, { status: 500 });
  }
}
