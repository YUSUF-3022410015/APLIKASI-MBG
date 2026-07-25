import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SEKOLAH") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { distributionId } = await req.json();

    const distribution = await prisma.distribution.findUnique({
      where: { id: distributionId },
      include: { school: { include: { users: true } } },
    });

    if (!distribution) {
      return NextResponse.json({ error: "Distribusi tidak ditemukan" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true },
    });

    if (user?.schoolId !== distribution.schoolId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.distribution.update({
      where: { id: distributionId },
      data: {
        status: "DITERIMA",
        confirmedBy: session.user.id,
        confirmationTime: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengkonfirmasi" }, { status: 500 });
  }
}
