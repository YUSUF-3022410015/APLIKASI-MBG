import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id: params.id },
      include: {
        sppg: { select: { name: true, id: true } },
        distributions: { select: { schoolId: true } },
      },
    });

    if (!menu) {
      return NextResponse.json({ error: "Menu tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data menu" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SPPG") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, calories, protein, carbohydrate, fat, ingredients, imageUrl, dateServed, schoolIds } = body;

    const existing = await prisma.menu.findUnique({
      where: { id: params.id },
      select: { sppgId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Menu tidak ditemukan" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { sppgId: true },
    });

    if (user?.sppgId !== existing.sppgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const menu = await prisma.menu.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        calories: parseInt(calories),
        protein: protein ? parseFloat(protein) : null,
        carbohydrate: carbohydrate ? parseFloat(carbohydrate) : null,
        fat: fat ? parseFloat(fat) : null,
        ingredients: ingredients || [],
        imageUrl: imageUrl || null,
        dateServed: new Date(dateServed),
      },
    });

    if (schoolIds) {
      await prisma.distribution.deleteMany({ where: { menuId: params.id } });
      if (schoolIds.length > 0) {
        await prisma.distribution.createMany({
          data: schoolIds.map((schoolId: string) => ({
            menuId: params.id,
            schoolId,
            totalPortion: 0,
            status: "DISIAPKAN",
          })),
        });
      }
    }

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate menu" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SPPG") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.menu.findUnique({
      where: { id: params.id },
      select: { sppgId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Menu tidak ditemukan" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { sppgId: true },
    });

    if (user?.sppgId !== existing.sppgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.distribution.deleteMany({ where: { menuId: params.id } });
    await prisma.review.deleteMany({ where: { menuId: params.id } });
    await prisma.menu.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus menu" }, { status: 500 });
  }
}
