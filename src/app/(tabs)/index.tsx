import Link from "next/link";
import Image from "next/image";
import { UtensilsCrossed, CalendarDays, Users, Star, ChevronRight } from "lucide-react";
import prisma from "@/lib/db";

async function getMenus() {
  const menus = await prisma.menu.findMany({
    include: {
      sppg: {
        select: { name: true },
      },
      distributions: {
        include: {
          school: {
            select: { name: true },
          },
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return menus;
}

export default async function MenuFeedPage() {
  const menus = await getMenus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Menu MBG Hari Ini</h1>
          <p className="text-xl text-primary-100 mb-8">Jelajahi menu Bergizi Gratis dari SPPG terdekat</p>
          <div className="flex items-center justify-center gap-8 text-primary-100">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5" />
              <span>{menus.length}+ Menu</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>50+ Sekolah Mitra</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              <span>Updated Harian</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pilih Menu Anda</h2>
            <p className="text-gray-600">Semua menu disiapkan oleh unit SPPG terpercaya</p>
          </div>

          {menus.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum Ada Menu</h3>
              <p className="text-gray-500">Menu akan tersedia segera. Tetap pantau!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menus.map((menu, index) => (
                <Link
                  key={menu.id}
                  href={`/menu/${menu.id}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={menu.imageUrls[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
                      alt={menu.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-semibold text-primary-600">
                        {menu.calories} kcal
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {menu.sppg.name}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                      {menu.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {menu.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{menu._count.reviews} ulasan</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          <span>{new Date(menu.dateServed).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Mengapa Memilih Warung Nutrisi?</h2>
            <p className="text-gray-600">Platform yang terpercaya untuk kebutuhan nutrisi Anda</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Gratis</h3>
              <p className="text-sm text-gray-600">Program Makan Bergizi Gratis untuk semua</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Transparent</h3>
              <p className="text-sm text-gray-600">Informasi gizi lengkap dan akurat</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Terpercaya</h3>
              <p className="text-sm text-gray-600">Diawasi oleh pemerintah dan sekolah</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Terupdate</h3>
              <p className="text-sm text-gray-600">Menu baru setiap hari</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}