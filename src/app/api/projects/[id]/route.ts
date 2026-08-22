import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const project = await prisma.project.update({
      where: { id },
      data: {
        type: body.type,
        typeAr: body.typeAr,
        category: body.category,
        categoryAr: body.categoryAr,
        scope: body.scope,
        scopeAr: body.scopeAr,
        systems: body.systems,
        systemsAr: body.systemsAr,
        imageUrl: body.imageUrl,
        pdfUrl: body.pdfUrl,
        year: body.year,
        area: body.area,
        order: body.order,
        published: body.published,
      },
    });
    return NextResponse.json(project);
  } catch (err) {
    console.error("Project PUT error:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Project DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
