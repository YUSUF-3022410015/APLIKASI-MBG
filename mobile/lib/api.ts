const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchMenus() {
  const res = await fetch(`${API_URL}/api/menus`);
  if (!res.ok) throw new Error("Gagal mengambil data menu");
  return res.json();
}

export async function fetchSchools(query: string) {
  const res = await fetch(`${API_URL}/api/schools?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Gagal mencari sekolah");
  return res.json();
}

export async function submitReview(menuId: string, rating: number, comment: string) {
  const res = await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menuId, rating, comment }),
  });
  if (!res.ok) throw new Error("Gagal mengirim ulasan");
  return res.json();
}
