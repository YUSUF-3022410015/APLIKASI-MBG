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
      select: { schoolId: true, school: { select: { name: true, sppgMitraId: true } } },
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

    if (user.school?.sppgMitraId) {
      const sppgAdmin = await prisma.user.findFirst({
        where: { adminOf: { id: user.school.sppgMitraId } },
        select: { id: true },
      });
      if (sppgAdmin) {
        await prisma.notification.create({
          data: {
            userId: sppgAdmin.id,
            title: "Laporan Masalah dari Sekolah",
            body: `${user.school.name} melaporkan: ${category} - ${description || menuTitle}`,
          },
        });
      }
    }

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengirim laporan" }, { status: 500 });
  }
}
