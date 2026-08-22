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
    const item = await prisma.experience.update({
      where: { id },
      data: {
        year: body.year,
        position: body.position,
        positionAr: body.positionAr,
        company: body.company,
        companyAr: body.companyAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        order: body.order,
      },
    });
    return NextResponse.json(item);
  } catch (err) {
    console.error("Experience PUT error:", err);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
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
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Experience DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
