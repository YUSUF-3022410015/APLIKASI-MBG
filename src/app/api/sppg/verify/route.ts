import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PEMERINTAH") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sppgId, action } = await req.json();

    if (action === "verify") {
      await prisma.sppgUnit.update({
        where: { id: sppgId },
        data: { isVerified: true },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "reject") {
      await prisma.sppgUnit.update({
        where: { id: sppgId },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses verifikasi" }, { status: 500 });
  }
}
