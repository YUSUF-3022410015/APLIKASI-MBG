import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = session.user.role;
  if (role === "SPPG") redirect("/dashboard/sppg");
  if (role === "SEKOLAH") redirect("/dashboard/sekolah");
  if (role === "PEMERINTAH") redirect("/dashboard/pemerintah");

  return (
    <div className="text-center py-20 animate-fade-in-up">
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <h1 className="font-heading text-2xl font-bold mb-2">Selamat Datang</h1>
      <p className="text-gray-500">Silakan pilih menu di navigasi</p>
    </div>
  );
}
