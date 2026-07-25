import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const userData = await AsyncStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return { "x-user-id": user.id };
    }
  } catch {}
  return {};
}

export async function fetchMenus() {
  const res = await fetch(`${API_URL}/api/menus`);
  if (!res.ok) throw new Error("Gagal mengambil data menu");
  return res.json();
}

export async function fetchMenuDetail(id: string) {
  const res = await fetch(`${API_URL}/api/menus/${id}`);
  if (!res.ok) throw new Error("Gagal mengambil detail menu");
  return res.json();
}

export async function fetchSchools(query: string) {
  const res = await fetch(`${API_URL}/api/schools?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Gagal mencari sekolah");
  return res.json();
}

export async function submitReview(menuId: string, rating: number, comment: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ menuId, rating, comment }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Gagal mengirim ulasan");
  }
  return res.json();
}

export async function mobileLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/mobile-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal login");
  return data;
}

export async function registerUser(fullName: string, email: string, password: string, role: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal mendaftar");
  return data;
}
