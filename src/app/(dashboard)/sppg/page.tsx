import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";
import { UtensilsCrossed, CalendarCheck, MessageSquare, Users, PackageCheck, Plus } from "lucide-react";

export default async function SppgDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SPPG") redirect("/login");

  const userId = session.user.id;
  const sppg = await prisma.sppgUnit.findFirst({
    where: { admin: { id: userId } },
    include: { _count: { select: { menus: true, schools: true } } },
  });

  if (!sppg) {
    return (
      <div className="animate-fade-in-up">
        <h1 className="font-heading text-2xl font-bold mb-6">Dashboard SPPG</h1>
        <div className="card p-10 text-center">
          <p className="text-gray-500">Akun Anda belum terhubung ke unit SPPG.</p>
        </div>
      </div>
    );
  }

  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
  const todayMenus = await prisma.menu.count({ where: { sppgId: sppg.id, dateServed: { gte: todayStart } } });
  const todayReviews = await prisma.review.count({ where: { menu: { sppgId: sppg.id }, createdAt: { gte: todayStart } } });

  const totalPortionResult = await prisma.distribution.aggregate({ where: { menu: { sppgId: sppg.id } }, _sum: { totalPortion: true } });
  const distributedPortionResult = await prisma.distribution.aggregate({ where: { menu: { sppgId: sppg.id }, status: { in: ["DITERIMA", "SELESAI"] } }, _sum: { totalPortion: true } });

  const totalPortions = totalPortionResult._sum.totalPortion || 0;
  const distributedPortions = distributedPortionResult._sum.totalPortion || 0;

  const stats = [
    { icon: UtensilsCrossed, value: sppg._count.menus, label: "Total Menu", color: "text-green-600", bg: "bg-green-50" },
    { icon: CalendarCheck, value: todayMenus, label: "Menu Hari Ini", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: MessageSquare, value: todayReviews, label: "Komentar Baru", color: "text-orange-600", bg: "bg-orange-50" },
    { icon: PackageCheck, value: totalPortions.toLocaleString("id-ID"), label: "Total Porsi", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: PackageCheck, value: distributedPortions.toLocaleString("id-ID"), label: "Porsi Terdistribusi", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: Users, value: sppg._count.schools, label: "Sekolah Mitra", color: "text-teal-600", bg: "bg-teal-50" },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Dashboard SPPG</h1>
          <p className="text-gray-500 mt-1">{sppg.name}</p>
        </div>
        <Link href="/dashboard/sppg/menu/baru" className="btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Buat Menu Baru
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
    </div>
  );
}
