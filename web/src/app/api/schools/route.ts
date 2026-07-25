import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const schools = await prisma.school.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { npsn: { contains: query } },
        ],
      },
      include: {
        sppgMitra: { select: { name: true } },
      },
      orderBy: { name: "asc" },
      take: 20,
    });

    return NextResponse.json(schools);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mencari sekolah" }, { status: 500 });
  }
}
