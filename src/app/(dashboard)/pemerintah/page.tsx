import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import SppgVerification from "./SppgVerification";
import { Building2, GraduationCap, UtensilsCrossed, Users, Star, ShieldCheck } from "lucide-react";

export default async function PemerintahDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PEMERINTAH") redirect("/login");

  const totalSppg = await prisma.sppgUnit.count({ where: { isActive: true } });
  const totalSchools = await prisma.school.count({ where: { isActive: true } });
  const totalMenus = await prisma.menu.count();
  const totalUsers = await prisma.user.count();
  const avgRating = await prisma.review.aggregate({ _avg: { rating: true } });

  const unverifiedSppg = await prisma.sppgUnit.findMany({
    where: { isVerified: false, isActive: true },
    include: { admin: { select: { fullName: true, email: true } }, _count: { select: { menus: true, schools: true } } },
    orderBy: { createdAt: "asc" },
  });

  const stats = [
    { icon: Building2, value: totalSppg, label: "SPPG Aktif", color: "text-green-600", bg: "bg-green-50" },
    { icon: GraduationCap, value: totalSchools, label: "Sekolah Terdaftar", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: UtensilsCrossed, value: totalMenus, label: "Total Menu", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Users, value: totalUsers, label: "Total Pengguna", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: Star, value: avgRating._avg.rating?.toFixed(1) || "0.0", label: "Rating Rata-rata", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="animate-fade-in-up">
      <h1 className="font-heading text-2xl font-bold mb-8">Dashboard Pemerintah</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5 animate-fade-in-up text-center" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className={`font-heading text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mb-5">
        <ShieldCheck className="w-5 h-5 text-gray-400" />
        <h2 className="font-heading text-lg font-semibold">Verifikasi Akun SPPG</h2>
        {unverifiedSppg.length > 0 && (
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">{unverifiedSppg.length} menunggu</span>
        )}
      </div>

      {unverifiedSppg.length === 0 ? (
        <div className="card p-10 text-center">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">Semua akun SPPG sudah terverifikasi.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {unverifiedSppg.map((sppg) => (
            <div key={sppg.id} className="card p-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-semibold">{sppg.name}</h3>
                <p className="text-sm text-gray-500">{sppg.admin?.fullName} ({sppg.admin?.email})</p>
                <p className="text-xs text-gray-400 mt-1">{sppg._count.menus} menu · {sppg._count.schools} sekolah</p>
              </div>
              <SppgVerification sppgId={sppg.id} sppgName={sppg.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
