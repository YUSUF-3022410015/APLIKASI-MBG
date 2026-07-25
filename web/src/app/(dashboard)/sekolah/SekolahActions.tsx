"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  distributionId: string;
  status: string;
  menuTitle: string;
}

export default function SekolahActions({ distributionId, status, menuTitle }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportCategory, setReportCategory] = useState("TELAT");
  const [reportDesc, setReportDesc] = useState("");

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch("/api/distributions/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ distributionId }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {}
    setLoading(false);
  }

  async function handleReport() {
    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distributionId,
          category: reportCategory,
          description: reportDesc,
          menuTitle,
        }),
      });
      if (res.ok) {
        setShowReport(false);
        setReportDesc("");
        alert("Laporan terkirim ke SPPG");
      }
    } catch {}
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2 ml-4">
      {status !== "DITERIMA" && status !== "SELESAI" && (
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "..." : "Konfirmasi Terima"}
        </button>
      )}
      <button
        onClick={() => setShowReport(!showReport)}
        className="px-3 py-1.5 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition"
      >
        Lapor Masalah
      </button>

      {showReport && (
        <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <select
            value={reportCategory}
            onChange={(e) => setReportCategory(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mb-2"
          >
            <option value="TELAT">Telat</option>
            <option value="PORSI_KURANG">Porsi Kurang</option>
            <option value="RASA">Rasa</option>
            <option value="KEBERSIHAN">Kebersihan</option>
            <option value="LAINNYA">Lainnya</option>
          </select>
          <textarea
            value={reportDesc}
            onChange={(e) => setReportDesc(e.target.value)}
            placeholder="Deskripsi masalah..."
            rows={2}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReport}
              disabled={loading}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
            >
              Kirim
            </button>
            <button
              onClick={() => setShowReport(false)}
              className="px-3 py-1 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
