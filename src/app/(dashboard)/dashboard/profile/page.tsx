import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { fullName: true, email: true, phone: true, address: true, avatarUrl: true, passwordHash: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profil & Pengaturan</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4">Informasi Profil</h2>
        <ProfileForm user={user} />
      </div>

      {user.passwordHash && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Ubah Password</h2>
          <PasswordForm />
        </div>
      )}

      {!user.passwordHash && (
        <p className="text-sm text-gray-400 mt-4">
          Akun terhubung dengan Google. Kelola password melalui akun Google Anda.
        </p>
      )}
    </div>
  );
}
