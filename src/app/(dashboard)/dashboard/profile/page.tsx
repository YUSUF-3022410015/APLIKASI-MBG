import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import { requireAuth } from "@/lib/server-utils";
import { getUserFromApi } from "./actions";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  // Use API to get user data instead of direct db access
  let user = null;
  try {
    user = await getUserFromApi(session.user.id);
  } catch (error) {
    console.error("Error fetching user:", error);
    redirect("/login");
  }

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
