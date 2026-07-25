import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-green-700">
          Warung Nutrisi
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/menu" className="text-sm text-gray-600 hover:text-green-600">
            Menu
          </Link>
          <Link href="/cari-sekolah" className="text-sm text-gray-600 hover:text-green-600">
            Cari Sekolah
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{session.user.name}</span>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
