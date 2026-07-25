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
    const { distributionId, category, description, menuTitle } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true },
    });

    if (!user?.schoolId) {
      return NextResponse.json({ error: "Akun tidak terhubung ke sekolah" }, { status: 400 });
    }

    const report = await prisma.quickReport.create({
      data: {
        reporterId: session.user.id,
        schoolId: user.schoolId,
        category,
        description: description || `${menuTitle} - ${category}`,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengirim laporan" }, { status: 500 });
  }
}
