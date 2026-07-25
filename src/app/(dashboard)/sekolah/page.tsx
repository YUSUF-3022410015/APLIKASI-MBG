import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import SekolahActions from "./SekolahActions";
import { CalendarCheck, Truck, Building2, ClipboardCheck } from "lucide-react";

export default async function SekolahDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SEKOLAH") redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { school: true },
  });

  if (!user?.school) {
    return (
      <div className="animate-fade-in-up">
        <h1 className="font-heading text-2xl font-bold mb-6">Dashboard Sekolah</h1>
        <div className="card p-8 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Akun Anda belum terhubung ke sekolah manapun.</p>
          <p className="text-sm text-gray-400 mt-2">Hubungi admin untuk menghubungkan akun Anda ke sekolah.</p>
        </div>
      </div>
    );
  }

  const distributions = await prisma.distribution.findMany({
    where: { schoolId: user.schoolId! },
    include: { menu: { include: { sppg: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayDistributions = distributions.filter((d) => new Date(d.menu.dateServed) >= today);

  const stats = [
    { icon: CalendarCheck, value: todayDistributions.length, label: "Menu Hari Ini", color: "text-green-600", bg: "bg-green-50" },
    { icon: Truck, value: distributions.length, label: "Total Distribusi", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: ClipboardCheck, value: distributions.filter((d) => d.status === "DITERIMA").length, label: "Sudah Diterima", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold">Dashboard Sekolah</h1>
        <p className="text-gray-500 mt-1">Selamat datang, {user.fullName} — {user.school.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-6 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <p className={`font-heading text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Truck className="w-5 h-5 text-gray-400" />
        <h2 className="font-heading text-lg font-semibold">Daftar Distribusi Makanan</h2>
      </div>

      <div className="space-y-4">
        {distributions.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-gray-400">Belum ada distribusi makanan untuk sekolah Anda.</p>
          </div>
        ) : (
          distributions.map((dist, i) => (
            <div key={dist.id} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold">{dist.menu.title}</h3>
                  <p className="text-sm text-gray-500">oleh {dist.menu.sppg.name}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-400">
                    <span>📅 {new Date(dist.menu.dateServed).toLocaleDateString("id-ID")}</span>
                    <span>🍽️ {dist.totalPortion} porsi</span>
                    {dist.confirmationTime && (
                      <span>✅ Dikonfirmasi {new Date(dist.confirmationTime).toLocaleString("id-ID")}</span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      dist.status === "DITERIMA" ? "bg-green-100 text-green-700" :
                      dist.status === "DIKIRIM" ? "bg-blue-100 text-blue-700" :
                      dist.status === "SELESAI" ? "bg-purple-100 text-purple-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {dist.status}
                    </span>
                  </div>
                </div>
                <SekolahActions distributionId={dist.id} status={dist.status} menuTitle={dist.menu.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
