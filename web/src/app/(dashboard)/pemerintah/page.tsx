import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import SppgVerification from "./SppgVerification";

export default async function PemerintahDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PEMERINTAH") redirect("/login");

  const totalSppg = await prisma.sppgUnit.count({ where: { isActive: true } });
  const totalSchools = await prisma.school.count({ where: { isActive: true } });
  const totalMenus = await prisma.menu.count();
  const totalUsers = await prisma.user.count();

  const avgRating = await prisma.review.aggregate({
    _avg: { rating: true },
  });

  const unverifiedSppg = await prisma.sppgUnit.findMany({
    where: { isVerified: false, isActive: true },
    include: {
      admin: { select: { fullName: true, email: true } },
      _count: { select: { menus: true, schools: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Pemerintah</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">SPPG Aktif</p>
          <p className="text-3xl font-bold text-green-600">{totalSppg}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Sekolah Terdaftar</p>
          <p className="text-3xl font-bold text-blue-600">{totalSchools}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Menu</p>
          <p className="text-3xl font-bold text-purple-600">{totalMenus}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Pengguna</p>
          <p className="text-3xl font-bold text-indigo-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Rating Rata-rata</p>
          <p className="text-3xl font-bold text-orange-600">
            {avgRating._avg.rating?.toFixed(1) || "0.0"}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Verifikasi Akun SPPG ({unverifiedSppg.length} menunggu)</h2>
      {unverifiedSppg.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-400">Semua akun SPPG sudah terverifikasi.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {unverifiedSppg.map((sppg) => (
            <div key={sppg.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{sppg.name}</h3>
                <p className="text-sm text-gray-500">{sppg.admin?.fullName} ({sppg.admin?.email})</p>
                <p className="text-xs text-gray-400">
                  {sppg._count.menus} menu, {sppg._count.schools} sekolah terdaftar
                </p>
              </div>
              <SppgVerification sppgId={sppg.id} sppgName={sppg.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
