import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function SppgDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SPPG") redirect("/login");

  const userId = session.user.id;
  const sppg = await prisma.sppgUnit.findFirst({
    where: { admin: { id: userId } },
    include: {
      _count: { select: { menus: true, schools: true } },
    },
  });

  const todayMenus = await prisma.menu.count({
    where: {
      sppgId: sppg?.id,
      dateServed: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
  });

  const todayReviews = await prisma.review.count({
    where: {
      menu: { sppgId: sppg?.id },
      createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard SPPG</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Menu</p>
          <p className="text-3xl font-bold text-green-600">{sppg?._count.menus || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Menu Hari Ini</p>
          <p className="text-3xl font-bold text-blue-600">{todayMenus}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Komentar Baru</p>
          <p className="text-3xl font-bold text-orange-600">{todayReviews}</p>
        </div>
      </div>

      <Link
        href="/dashboard/sppg/menu/baru"
        className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
      >
        + Buat Postingan Menu
      </Link>
    </div>
  );
}
