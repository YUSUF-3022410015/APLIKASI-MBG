import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

function getUserId(session: any, req: Request): string | null {
  if (session?.user?.id) return session.user.id;
  const mobileUserId = req.headers.get("x-user-id");
  if (mobileUserId) return mobileUserId;
  return null;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session, req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { menuId, rating, comment, parentId } = await req.json();

    if (!menuId || !rating) {
      return NextResponse.json({ error: "menuId dan rating wajib diisi" }, { status: 400 });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating harus antara 1 dan 5" }, { status: 400 });
    }

    const menu = await prisma.menu.findUnique({ where: { id: menuId } });
    if (!menu) {
      return NextResponse.json({ error: "Menu tidak ditemukan" }, { status: 404 });
    }

    if (parentId) {
      const parentReview = await prisma.review.findUnique({ where: { id: parentId } });
      if (!parentReview) {
        return NextResponse.json({ error: "Review induk tidak ditemukan" }, { status: 404 });
      }

      const reply = await prisma.review.create({
        data: {
          menuId,
          userId,
          rating: parentReview.rating,
          comment: comment || null,
          parentId,
        },
      });
      return NextResponse.json(reply);
    }

    const existingReview = await prisma.review.findFirst({
      where: { menuId, userId, parentId: null },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Anda sudah memberikan ulasan untuk menu ini" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        menuId,
        userId,
        rating: Math.round(rating),
        comment: comment || null,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengirim ulasan" }, { status: 500 });
  }
}
