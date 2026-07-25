export type Role = "ORTU" | "SEKOLAH" | "SPPG" | "PEMERINTAH";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
}

export interface Menu {
  id: string;
  title: string;
  description: string | null;
  calories: number;
  protein: number | null;
  carbohydrate: number | null;
  fat: number | null;
  ingredients: string[];
  imageUrl: string | null;
  dateServed: string;
  sppg: { name: string };
  avgRating: number | null;
}

export interface School {
  id: string;
  npsn: string;
  name: string;
  address: string | null;
  totalStudents: number | null;
  sppgMitra?: { name: string } | null;
}
