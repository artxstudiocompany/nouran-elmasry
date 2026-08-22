import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (err) {
    console.error("Skills GET error:", err);
    return NextResponse.json({ error: "Failed to load skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const item = await prisma.skill.create({
      data: {
        name: body.name ?? "",
        category: body.category ?? "",
        categoryAr: body.categoryAr ?? "",
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(item);
  } catch (err) {
    console.error("Skills POST error:", err);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
