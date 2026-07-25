"use client";

import { useState } from "react";

export default function CariSekolahPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/schools?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cari Sekolah</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama sekolah atau NPSN..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "..." : "Cari"}
        </button>
      </form>

      <div className="space-y-3">
        {results.map((school: any) => (
          <div
            key={school.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="font-semibold">{school.name}</h3>
            <p className="text-sm text-gray-500">NPSN: {school.npsn}</p>
            {school.address && (
              <p className="text-sm text-gray-400">{school.address}</p>
            )}
            {school.sppgMitra && (
              <p className="text-sm text-green-600 mt-1">
                Mitra: {school.sppgMitra.name}
              </p>
            )}
          </div>
        ))}
        {results.length === 0 && query && !loading && (
          <p className="text-center text-gray-400 py-8">Sekolah tidak ditemukan</p>
        )}
      </div>
    </div>
  );
}
