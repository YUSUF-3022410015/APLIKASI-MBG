"use client";

import { useState } from "react";
import { changePassword } from "./actions";

export default function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", error: false });

    const form = e.currentTarget;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Konfirmasi password tidak cocok", error: true });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: "Password minimal 6 karakter", error: true });
      setLoading(false);
      return;
    }

    try {
      await changePassword(new FormData(form));
      setMessage({ text: "Password berhasil diubah", error: false });
      form.reset();
    } catch (err: any) {
      setMessage({ text: err.message || "Gagal mengubah password", error: true });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
        <input type="password" name="currentPassword" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
        <input type="password" name="newPassword" required minLength={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
        <input type="password" name="confirmPassword" required minLength={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
      </div>
      {message.text && <p className={`text-sm ${message.error ? "text-red-500" : "text-green-600"}`}>{message.text}</p>}
      <button type="submit" disabled={loading} className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50">
        {loading ? "Mengubah..." : "Ubah Password"}
      </button>
    </form>
  );
}
