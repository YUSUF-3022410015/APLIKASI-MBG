import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { UtensilsCrossed, Upload, X, Check, Loader2 } from "lucide-react";

interface MenuFormData {
  title: string;
  description: string;
  calories: string;
  dateServed: string;
  targetSchools: string[];
}

export default function NewMenuForm() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<MenuFormData({
    title: "",
    description: "",
    calories: "",
    dateServed: new Date().toISOString().split('T')[0],
    targetSchools: [],
  }));

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file
    if (!file.type.startsWith('image/')) {
      setError("Hanya file gambar yang diperbolehkan");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setImageFile(file);
    setError("");

    // Preview gambar
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);
    setError("");
    setSuccess(false);

    try {
      // Validasi form
      if (!formData.title || !formData.description || !formData.calories) {
        setError("Mohon isi semua field yang required");
        setIsUploading(false);
        return;
      }

      if (!imageFile) {
        setError("Mohon unggah foto menu");
        setIsUploading(false);
        return;
      }

      // Upload gambar ke Cloudinary
      const formDataToSend = new FormData();
      formDataToSend.append('file', imageFile);
      formDataToSend.append('upload_preset', 'warung_nutrisi');

      // Simulasi progress upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dict-cloud/upload`,
        {
          method: 'POST',
          body: formDataToSend,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!cloudinaryResponse.ok) {
        throw new Error('Upload gambar gagal');
      }

      const cloudinaryData = await cloudinaryResponse.json();

      // Simpan data menu ke database
      const menuResponse = await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: cloudinaryData.secure_url,
          calories: parseInt(formData.calories),
          dateServed: new Date(formData.dateServed),
        }),
      });

      if (!menuResponse.ok) {
        throw new Error('Gagal menyimpan menu');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      calories: "",
      dateServed: new Date().toISOString().split('T')[0],
      targetSchools: [],
    });
    removeImage();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Buat Postingan Menu Baru</h1>
              <p className="text-primary-100 text-sm">Unggah foto menu makanan dan informasi gizi</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-800">Menu berhasil diunggah! Menu Anda akan muncul segera.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <X className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Foto Menu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Foto Menu * <span className="text-xs text-gray-500">(Maks 5MB, JPG/PNG)</span>
              </label>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium mb-2">Klik untuk unggah foto menu</p>
                    <p className="text-sm text-gray-400">PNG, JPG hingga 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview menu"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Section: Informasi Menu */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Menu * <span className="text-xs text-gray-500">(misal: Nasi Kucing Spesial)</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nasi Kucing Spesial"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kalori * <span className="text-xs text-gray-500">(per porsi)</span>
                </label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                  placeholder="350"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={isUploading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi * <span className="text-xs text-gray-500">(bahan, rasa, dll.)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nasi dengan lauk ikan teri, sayur kangkung, dan sambal pedas..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                disabled={isUploading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Sajian
                </label>
                <input
                  type="date"
                  value={formData.dateServed}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateServed: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Sekolah
                </label>
                <select
                  multiple
                  value={formData.targetSchools}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    targetSchools: Array.from(e.target.selectedOptions, option => option.value)
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-12"
                  disabled={isUploading}
                >
                  <option value="SMK NEGERI 1 JAKARTA">SMK Negeri 1 Jakarta</option>
                  <option value="SMPN 5 BANDUNG">SMPN 5 Bandung</option>
                  <option value="SDN CILACAP">SDN Cilacap</option>
                  <option value="SMK PELABUHAN UJUNG">SMK Pelabuhan Ujungk</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Tahan Ctrl untuk memilih beberapa</p>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Mengunggah menu...</span>
                  <span className="text-sm text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={resetForm}
                disabled={isUploading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isUploading || !imagePreview}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Unggah Menu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

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
    const form = e.currentTarget;
    const formData = new FormData(form);

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
      const res = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          calories,
          protein: protein ? parseFloat(protein) : null,
          carbohydrate: carbohydrate ? parseFloat(carbohydrate) : null,
          fat: fat ? parseFloat(fat) : null,
          ingredients,
          imageUrls,
          dateServed,
          schoolIds: targetSchools,
        }),
      });

      if (res.ok) {
        router.push("/dashboard/sppg/menu");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan menu");
      }
    });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Buat Postingan Menu Baru</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foto Menu (bisa pilih banyak)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 file:font-medium"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Mengupload...</p>}
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Foto ${i + 1}`} className="h-20 w-20 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
          <input type="text" name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea name="description" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kalori (kkal)</label>
            <input type="number" name="calories" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Saji</label>
            <input type="date" name="dateServed" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
            <input type="number" step="0.1" name="protein" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Karbohidrat (g)</label>
            <input type="number" step="0.1" name="carbohydrate" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lemak (g)</label>
            <input type="number" step="0.1" name="fat" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bahan Baku (pisahkan koma)</label>
          <input type="text" name="ingredients" placeholder="Nasi, Telur, Wortel, Buncis" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>

        {schools.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Sekolah</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {schools.map((school) => (
                <label key={school.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                  <input type="checkbox" name="schoolIds" value={school.id} className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span className="text-sm">{school.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={isPending || uploading} className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
          {isPending ? "Menyimpan..." : "Simpan Menu"}
        </button>
      </form>
    </div>
  );
}
