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

  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));

  const todayMenus = await prisma.menu.count({
    where: {
      sppgId: sppg?.id,
      dateServed: { gte: todayStart },
    },
  });

  const todayReviews = await prisma.review.count({
    where: {
      menu: { sppgId: sppg?.id },
      createdAt: { gte: todayStart },
    },
  });

  const totalPortionResult = await prisma.distribution.aggregate({
    where: { menu: { sppgId: sppg?.id } },
    _sum: { totalPortion: true },
  });

  const distributedPortionResult = await prisma.distribution.aggregate({
    where: {
      menu: { sppgId: sppg?.id },
      status: { in: ["DITERIMA", "SELESAI"] },
    },
    _sum: { totalPortion: true },
  });

  const totalPortions = totalPortionResult._sum.totalPortion || 0;
  const distributedPortions = distributedPortionResult._sum.totalPortion || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard SPPG</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Porsi</p>
          <p className="text-3xl font-bold text-purple-600">{totalPortions.toLocaleString("id-ID")}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Porsi Terdistribusi</p>
          <p className="text-3xl font-bold text-indigo-600">{distributedPortions.toLocaleString("id-ID")}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Sekolah Mitra</p>
          <p className="text-3xl font-bold text-teal-600">{sppg?._count.schools || 0}</p>
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
