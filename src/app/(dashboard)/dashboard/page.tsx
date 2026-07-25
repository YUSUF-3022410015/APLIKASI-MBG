import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const role = session.user.role;

  if (role === "SPPG") redirect("/dashboard/sppg");
  if (role === "SEKOLAH") redirect("/dashboard/sekolah");
  if (role === "PEMERINTAH") redirect("/dashboard/pemerintah");

  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold">Selamat Datang</h1>
      <p className="text-gray-500 mt-2">Silakan pilih menu di navigasi</p>
    </div>
  );
}
