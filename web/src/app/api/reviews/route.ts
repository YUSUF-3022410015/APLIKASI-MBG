import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { menuId, rating, comment } = await req.json();

    const review = await prisma.review.create({
      data: {
        menuId,
        userId: session.user.id,
        rating,
        comment,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengirim ulasan" }, { status: 500 });
  }
}
