"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Leaf, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-heading font-bold text-lg text-primary-700">
          <Leaf className="w-6 h-6" />
          Warung Nutrisi
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/menu" className="btn-ghost text-sm">Menu</Link>
          <Link href="/cari-sekolah" className="btn-ghost text-sm">Cari Sekolah</Link>
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="btn-primary text-sm !px-4 !py-2 gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-ghost text-sm gap-2">
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm !px-5 !py-2.5">Masuk</Link>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-gray-200/50 px-4 py-4 space-y-2 animate-slide-down">
          <Link href="/menu" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium">Menu MBG</Link>
          <Link href="/cari-sekolah" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium">Cari Sekolah</Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium">Dashboard</Link>
              <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-red-600">Keluar</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold text-center">Masuk</Link>
          )}
        </div>
      )}
    </nav>
  );
}
