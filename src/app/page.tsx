import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-green-50 to-white">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🍱</span>
      </div>
      <h1 className="text-4xl font-bold text-green-700 mb-3">Warung Nutrisi</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Platform Terintegrasi Makan Bergizi Gratis untuk Indonesia
      </p>
      <div className="flex gap-4">
        <Link
          href="/menu"
          className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Lihat Menu
        </Link>
        <Link
          href="/login"
          className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition"
        >
          Daftar
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
        {["Orang Tua", "Sekolah", "SPPG", "Pemerintah"].map((role) => (
          <div key={role} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-600">{role}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-gray-400">
        Platform Makan Bergizi Gratis - Warung Nutrisi
      </p>
    </div>
  );
}
