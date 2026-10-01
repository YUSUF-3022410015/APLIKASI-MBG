import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Users, Clock, Star, UtensilsCrossed } from "lucide-react";
import prisma from "@/lib/db";

async function getSchools() {
  const schools = await prisma.school.findMany({
    select: {
      id: true,
      name: true,
      npsn: true,
      address: true,
      totalStudents: true,
      sppg: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          distributions: true,
        },
      },
    },
    orderBy: { name: "asc" },
    take: 20,
  });

  return schools;
}

export default async function SearchSchoolsPage() {
  const schools = await getSchools();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
              <UtensilsCrossed className="w-6 h-6" />
              Warung Nutrisi
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/menu" className="text-gray-600 hover:text-primary-600">Menu</Link>
              <Link href="/cari-sekolah" className="text-primary-600 font-semibold">Cari Sekolah</Link>
              <Link href="/login" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Masuk</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cari Sekolah Mitra</h1>
            <p className="text-xl opacity-90">Temukan sekolah yang berpartisipasi dalam program Makan Bergizi Gratis</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-2 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="pl-4 pr-2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama sekolah atau NPSN..."
                  className="flex-1 py-3 px-4 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors font-medium">
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schools List */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sekolah Terdaftar ({schools.length})</h2>
            <p className="text-gray-600">Semua sekolah mitra SPPG yang aktif berpartisipasi</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <Link
                key={school.id}
                href={`/sekolah/${school.id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200 group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {school.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>NPSN: {school.npsn}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Users className="w-4 h-4" />
                        <span>{school.totalStudents} siswa</span>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      AKTIF
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">SPPG Mitra:</span>
                      <span className="text-sm font-medium text-gray-900">{school.sppg.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Distribusi:</span>
                      <span className="text-sm font-medium text-blue-600">{school._count.distributions} kali</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full bg-gray-50 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {schools.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tidak ada sekolah ditemukan</h3>
              <p className="text-gray-500">Coba kata kunci pencarian yang berbeda</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sekolah Anda Belum Terdaftar?</h2>
          <p className="text-gray-600 mb-6">Hubungi admin SPPG untuk mendaftarkan sekolah Anda dalam program MBG.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Daftar Sekarang
            </button>
            <button className="bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">Platform Makan Bergizi Gratis (MBG) — © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}