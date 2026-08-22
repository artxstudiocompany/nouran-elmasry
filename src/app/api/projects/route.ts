import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch (err) {
    console.error("Projects GET error:", err);
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const project = await prisma.project.create({
      data: {
        type: body.type ?? "",
        typeAr: body.typeAr ?? "",
        category: body.category ?? "",
        categoryAr: body.categoryAr ?? "",
        scope: body.scope ?? "",
        scopeAr: body.scopeAr ?? "",
        systems: body.systems ?? "[]",
        systemsAr: body.systemsAr ?? "[]",
        imageUrl: body.imageUrl ?? null,
        pdfUrl: body.pdfUrl ?? null,
        year: body.year ?? "",
        area: body.area ?? "",
        order: body.order ?? 0,
        published: body.published ?? true,
      },
    });
    return NextResponse.json(project);
  } catch (err) {
    console.error("Projects POST error:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
