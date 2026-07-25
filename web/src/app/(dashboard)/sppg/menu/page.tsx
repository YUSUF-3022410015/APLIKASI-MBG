import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";
import MenuActions from "./MenuActions";

export default async function SppgMenuPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SPPG") redirect("/login");

  const userId = session.user.id;
  const sppg = await prisma.sppgUnit.findFirst({
    where: { admin: { id: userId } },
  });

  const menus = await prisma.menu.findMany({
    where: { sppgId: sppg?.id },
    include: {
      _count: { select: { reviews: true, distributions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Menu</h1>
        <Link
          href="/dashboard/sppg/menu/baru"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Menu Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Judul</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Kalori</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Tanggal</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Distribusi</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Ulasan</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {menus.map((menu) => (
              <tr key={menu.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{menu.title}</td>
                <td className="p-4 text-gray-600">{menu.calories} kkal</td>
                <td className="p-4 text-gray-600">
                  {menu.dateServed.toLocaleDateString("id-ID")}
                </td>
                <td className="p-4 text-gray-600">{menu._count.distributions} sekolah</td>
                <td className="p-4 text-gray-600">{menu._count.reviews}</td>
                <td className="p-4">
                  <MenuActions menuId={menu.id} menuTitle={menu.title} />
                </td>
              </tr>
            ))}
            {menus.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  Belum ada menu. Buat menu pertama Anda!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
