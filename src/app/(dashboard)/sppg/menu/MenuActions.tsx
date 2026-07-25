"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  menuId: string;
  menuTitle: string;
}

export default function MenuActions({ menuId, menuTitle }: Props) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Hapus menu "${menuTitle}"?`)) return;

    const res = await fetch(`/api/menus/${menuId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/dashboard/sppg/menu/${menuId}/edit`}
        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
      >
        Hapus
      </button>
    </div>
  );
}
