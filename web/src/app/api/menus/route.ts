import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        sppg: { select: { name: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const menusWithRating = menus.map((menu) => {
      const avgRating =
        menu.reviews.length > 0
          ? menu.reviews.reduce((sum, r) => sum + r.rating, 0) / menu.reviews.length
          : null;
      return { ...menu, avgRating };
    });

    return NextResponse.json(menusWithRating);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data menu" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SPPG") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, calories, protein, carbohydrate, fat, ingredients, imageUrl, dateServed, schoolIds } = body;

    if (!title || !calories || !dateServed) {
      return NextResponse.json({ error: "Judul, kalori, dan tanggal wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { sppgId: true },
    });

    if (!user?.sppgId) {
      return NextResponse.json({ error: "Akun tidak terhubung ke SPPG" }, { status: 400 });
    }

    const menu = await prisma.menu.create({
      data: {
        sppgId: user.sppgId,
        title,
        description: description || null,
        calories: parseInt(calories),
        protein: protein ? parseFloat(protein) : null,
        carbohydrate: carbohydrate ? parseFloat(carbohydrate) : null,
        fat: fat ? parseFloat(fat) : null,
        ingredients: ingredients || [],
        imageUrl: imageUrl || null,
        dateServed: new Date(dateServed),
        distributions: schoolIds?.length
          ? {
              create: schoolIds.map((schoolId: string) => ({
                schoolId,
                totalPortion: 0,
                status: "DISIAPKAN" as const,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan menu" }, { status: 500 });
  }
}
