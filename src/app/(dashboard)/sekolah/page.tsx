import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import SekolahActions from "./SekolahActions";

export default async function SekolahDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SEKOLAH") redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { school: true },
  });

  if (!user?.school) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard Sekolah</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Akun Anda belum terhubung ke sekolah manapun.</p>
          <p className="text-sm text-gray-400 mt-2">Hubungi admin untuk menghubungkan akun Anda ke sekolah.</p>
        </div>
      </div>
    );
  }

  const distributions = await prisma.distribution.findMany({
    where: { schoolId: user.schoolId! },
    include: {
      menu: {
        include: {
          sppg: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDistributions = distributions.filter(
    (d) => new Date(d.menu.dateServed) >= today
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard Sekolah</h1>
      <p className="text-gray-500 mb-6">
        Selamat datang, {user.fullName} - {user.school.name}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Menu Hari Ini</p>
          <p className="text-3xl font-bold text-green-600">{todayDistributions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Distribusi</p>
          <p className="text-3xl font-bold text-blue-600">{distributions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Sudah Diterima</p>
          <p className="text-3xl font-bold text-purple-600">
            {distributions.filter((d) => d.status === "DITERIMA").length}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Daftar Distribusi Makanan</h2>
      <div className="space-y-4">
        {distributions.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-400">Belum ada distribusi makanan untuk sekolah Anda.</p>
          </div>
        ) : (
          distributions.map((dist) => (
            <div key={dist.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{dist.menu.title}</h3>
                  <p className="text-sm text-gray-500">oleh {dist.menu.sppg.name}</p>
                  <p className="text-sm text-gray-400">
                    Tanggal saji: {new Date(dist.menu.dateServed).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-sm text-gray-400">Porsi: {dist.totalPortion}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      dist.status === "DITERIMA"
                        ? "bg-green-100 text-green-700"
                        : dist.status === "DIKIRIM"
                        ? "bg-blue-100 text-blue-700"
                        : dist.status === "SELESAI"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {dist.status}
                    </span>
                    {dist.confirmationTime && (
                      <span className="text-xs text-gray-400 ml-2">
                        Dikonfirmasi: {new Date(dist.confirmationTime).toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                </div>
                <SekolahActions
                  distributionId={dist.id}
                  status={dist.status}
                  menuTitle={dist.menu.title}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
