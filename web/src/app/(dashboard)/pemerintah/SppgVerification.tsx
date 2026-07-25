"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SppgVerification({ sppgId, sppgName }: { sppgId: string; sppgName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleVerify(action: "verify" | "reject") {
    const msg = action === "verify"
      ? `Verifikasi SPPG "${sppgName}"?`
      : `Tolak SPPG "${sppgName}"?`;
    if (!confirm(msg)) return;

    setLoading(true);
    const res = await fetch("/api/sppg/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sppgId, action }),
    });
    if (res.ok) router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleVerify("verify")}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "..." : "Setujui"}
      </button>
      <button
        onClick={() => handleVerify("reject")}
        disabled={loading}
        className="px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition disabled:opacity-50"
      >
        Tolak
      </button>
    </div>
  );
}
