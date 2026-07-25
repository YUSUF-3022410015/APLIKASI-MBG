import Link from "next/link";
import Image from "next/image";
import { UtensilsCrossed, Building2, ScrollText, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

const roles = [
  { icon: UtensilsCrossed, label: "Orang Tua / Murid", desc: "Lihat menu & beri ulasan", href: "/menu" },
  { icon: Building2, label: "Pihak Sekolah", desc: "Konfirmasi distribusi", href: "/login" },
  { icon: ScrollText, label: "SPPG", desc: "Kelola menu & distribusi", href: "/login" },
  { icon: ShieldCheck, label: "Pemerintah", desc: "Verifikasi & monitoring", href: "/login" },
];

const stats = [
  { value: "500+", label: "Sekolah Terdaftar" },
  { value: "20K+", label: "Porsi Dibagikan" },
  { value: "50+", label: "Unit SPPG Aktif" },
  { value: "4.8", label: "Rating Rata-rata" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-heading font-bold text-xl text-primary-700">
            <Image src="/logo.svg" alt="Warung Nutrisi" width={32} height={32} className="w-8 h-8" />
            Warung Nutrisi
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/menu" className="btn-ghost text-sm">Menu</Link>
            <Link href="/cari-sekolah" className="btn-ghost text-sm">Cari Sekolah</Link>
            <Link href="/login" className="btn-primary text-sm !px-5 !py-2.5">Masuk</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6 animate-fade-in-down">
              <Sparkles className="w-4 h-4" />
              Platform Resmi MBG
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 animate-fade-in-up">
              Makan Bergizi Gratis
              <span className="text-primary-600 block mt-2">untuk Indonesia</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
              Platform terintegrasi untuk mengelola, memantau, dan menikmati program 
              Makan Bergizi Gratis — dari SPPG hingga ke meja makan siswa.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
              <Link href="/menu" className="btn-primary text-base !px-8 !py-4 gap-2 group">
                Lihat Menu MBG
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/register" className="btn-secondary text-base !px-8 !py-4">
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="font-heading text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Untuk Semua Pihak</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Warung Nutrisi menghubungkan seluruh ekosistem MBG dalam satu platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <Link
                  key={role.label}
                  href={role.href}
                  className="card-hover p-6 group animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-1">{role.label}</h3>
                  <p className="text-sm text-gray-500">{role.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Bergabung?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-lg mx-auto">
            Daftarkan sekolah atau unit SPPG Anda sekarang dan wujudkan generasi sehat Indonesia.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 active:scale-[0.97] transition-all duration-200">
            Daftar Sekarang
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white font-heading font-semibold">
              <Image src="/logo.svg" alt="Warung Nutrisi" width={24} height={24} className="w-6 h-6 brightness-150" />
              Warung Nutrisi
            </div>
            <p className="text-sm">
              Platform Makan Bergizi Gratis (MBG) — © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
