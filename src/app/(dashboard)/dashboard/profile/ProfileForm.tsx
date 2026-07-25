"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "./actions";

interface Props {
  user: { fullName: string; email: string; phone: string | null; address: string | null };
}

export default function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await updateProfile(new FormData(e.currentTarget));
      setMessage("Profil berhasil diperbarui");
      router.refresh();
    } catch {
      setMessage("Gagal memperbarui profil");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" value={user.email} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <input type="text" name="fullName" defaultValue={user.fullName} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
        <input type="tel" name="phone" defaultValue={user.phone || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
        <textarea name="address" rows={2} defaultValue={user.address || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
      </div>
      {message && <p className={`text-sm ${message.includes("berhasil") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
      <button type="submit" disabled={loading} className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50">
        {loading ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </form>
  );
}
