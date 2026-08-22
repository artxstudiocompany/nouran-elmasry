import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Skill DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
