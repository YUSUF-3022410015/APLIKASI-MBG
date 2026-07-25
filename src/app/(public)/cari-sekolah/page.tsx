"use client";

import { useState } from "react";
import { Search, School, MapPin, Building2 } from "lucide-react";

export default function CariSekolahPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/schools?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Cari Sekolah</h1>
        <p className="text-gray-500 mt-2">Temukan sekolah mitra program MBG di seluruh Indonesia</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama sekolah atau NPSN..."
          className="input-field !pl-12 !pr-36 !py-4"
        />
        <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !px-6 !py-2.5 text-sm">
          {loading ? (
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          ) : "Cari"}
        </button>
      </form>

      <div className="space-y-3">
        {results.map((school: any, i: number) => (
          <div key={school.id} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <School className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold">{school.name}</h3>
                <p className="text-sm text-gray-500">NPSN: {school.npsn}</p>
                {school.address && <p className="text-sm text-gray-400 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {school.address}</p>}
                {school.sppgMitra && (
                  <p className="text-sm text-primary-600 font-medium mt-2 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Mitra: {school.sppgMitra.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {searched && results.length === 0 && !loading && (
          <div className="card p-10 text-center">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Sekolah tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
