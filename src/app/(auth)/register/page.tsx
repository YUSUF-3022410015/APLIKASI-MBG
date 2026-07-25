"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", fullName: "", role: "ORTU" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Gagal mendaftar");
      setLoading(false);
      return;
    }
    router.push("/login");
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-scale-in">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-7 h-7 text-primary-600" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Daftar Akun</h1>
        <p className="text-gray-500 mt-1">Warung Nutrisi — MBG</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-field !pl-11" placeholder="Nama Lengkap" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field !pl-11" placeholder="contoh@email.com" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field !pl-11" placeholder="Minimal 6 karakter" required minLength={6} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Daftar Sebagai</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "ORTU", label: "Orang Tua / Murid" },
              { value: "SEKOLAH", label: "Pihak Sekolah" },
            ].map((opt) => (
              <button key={opt.value} type="button" onClick={() => setForm({ ...form, role: opt.value })}
                className={`py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                  form.role === opt.value ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm text-center py-2.5 rounded-lg border border-red-100">{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Memproses...
            </span>
          ) : "Daftar"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
