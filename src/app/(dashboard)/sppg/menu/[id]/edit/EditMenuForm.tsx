"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface MenuData {
  id: string;
  title: string;
  description: string;
  calories: number;
  protein: number | null;
  carbohydrate: number | null;
  fat: number | null;
  ingredients: string[];
  imageUrls: string[];
  dateServed: string;
}

interface School {
  id: string;
  name: string;
}

export default function EditMenuForm({ menu, schools, selectedSchoolIds }: {
  menu: MenuData;
  schools: School[];
  selectedSchoolIds: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageUrls, setImageUrls] = useState<string[]>(menu.imageUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      } catch {}
    }
    setImageUrls((prev) => [...prev, ...urls]);
    setUploading(false);
    if (urls.length === 0) setError("Gagal upload gambar");
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const calories = parseInt(formData.get("calories") as string);
    const protein = formData.get("protein") as string;
    const carbohydrate = formData.get("carbohydrate") as string;
    const fat = formData.get("fat") as string;
    const ingredientsRaw = formData.get("ingredients") as string;
    const dateServed = formData.get("dateServed") as string;
    const targetSchools = formData.getAll("schoolIds") as string[];

    if (!title || !calories || !dateServed) {
      setError("Judul, kalori, dan tanggal wajib diisi");
      return;
    }

    const ingredients = ingredientsRaw
      ? ingredientsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    startTransition(async () => {
      const res = await fetch(`/api/menus/${menu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, calories,
          protein: protein ? parseFloat(protein) : null,
          carbohydrate: carbohydrate ? parseFloat(carbohydrate) : null,
          fat: fat ? parseFloat(fat) : null,
          ingredients, imageUrls, dateServed, schoolIds: targetSchools,
        }),
      });
      if (res.ok) {
        router.push("/dashboard/sppg/menu");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Gagal mengupdate menu");
      }
    });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Menu</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foto Menu (bisa pilih banyak)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 file:font-medium" />
          {uploading && <p className="text-sm text-gray-500 mt-1">Mengupload...</p>}
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Foto ${i + 1}`} className="h-20 w-20 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
          <input type="text" name="title" required defaultValue={menu.title} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea name="description" rows={3} defaultValue={menu.description} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kalori (kkal)</label>
            <input type="number" name="calories" required defaultValue={menu.calories} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Saji</label>
            <input type="date" name="dateServed" required defaultValue={menu.dateServed} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
            <input type="number" step="0.1" name="protein" defaultValue={menu.protein ?? ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Karbohidrat (g)</label>
            <input type="number" step="0.1" name="carbohydrate" defaultValue={menu.carbohydrate ?? ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lemak (g)</label>
            <input type="number" step="0.1" name="fat" defaultValue={menu.fat ?? ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bahan Baku (pisahkan koma)</label>
          <input type="text" name="ingredients" defaultValue={menu.ingredients.join(", ")} placeholder="Nasi, Telur, Wortel, Buncis" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>
        {schools.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Sekolah</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {schools.map((school) => (
                <label key={school.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                  <input type="checkbox" name="schoolIds" value={school.id} defaultChecked={selectedSchoolIds.includes(school.id)} className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span className="text-sm">{school.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={isPending || uploading} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">Batal</button>
        </div>
      </form>
    </div>
  );
}
