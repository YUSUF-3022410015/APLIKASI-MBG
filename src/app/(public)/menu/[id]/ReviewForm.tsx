"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Send } from "lucide-react";

interface Props {
  menuId: string;
}

export default function ReviewForm({ menuId }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Pilih rating bintang terlebih dahulu");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId, rating, comment: comment || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengirim ulasan");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setRating(0);
      setComment("");
      router.refresh();
    } catch {
      setError("Gagal mengirim ulasan");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-green-700 font-medium text-sm">Terima kasih! Ulasan Anda telah dikirim.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs text-green-600 underline hover:text-green-800"
        >
          Kirim ulasan lagi
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4">
      <p className="text-sm font-medium text-gray-700 mb-3">Beri Ulasan</p>

      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                star <= (hoverRating || rating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        {rating > 0 && <span className="text-sm text-gray-500 ml-2">{rating}/5</span>}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tulis komentar Anda (opsional)..."
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none mb-3"
      />

      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {loading ? "Mengirim..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}
