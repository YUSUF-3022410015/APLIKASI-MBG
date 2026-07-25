import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import ImageCarousel from "@/components/ImageCarousel";
import ReviewForm from "./ReviewForm";

export default async function MenuDetail({ params }: { params: { id: string } }) {
  const menu = await prisma.menu.findUnique({
    where: { id: params.id },
    include: {
      sppg: { select: { name: true } },
      reviews: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
          replies: {
            include: {
              user: { select: { fullName: true, role: true } },
            },
          },
        },
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
      },
      distributions: {
        include: { school: { select: { name: true } } },
      },
    },
  });

  if (!menu) notFound();

  const avgRating =
    menu.reviews.length > 0
      ? menu.reviews.reduce((s, r) => s + r.rating, 0) / menu.reviews.length
      : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ImageCarousel images={menu.imageUrls} title={menu.title} />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{menu.title}</h1>
          <p className="text-gray-500 mb-1">oleh {menu.sppg.name}</p>
          <p className="text-gray-400 text-sm mb-4">
            {menu.dateServed.toLocaleDateString("id-ID")}
          </p>

          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{menu.calories}</p>
              <p className="text-xs text-gray-500">Kalori</p>
            </div>
            {menu.protein && (
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{Number(menu.protein)}g</p>
                <p className="text-xs text-gray-500">Protein</p>
              </div>
            )}
            {menu.carbohydrate && (
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{Number(menu.carbohydrate)}g</p>
                <p className="text-xs text-gray-500">Karbohidrat</p>
              </div>
            )}
            {menu.fat && (
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{Number(menu.fat)}g</p>
                <p className="text-xs text-gray-500">Lemak</p>
              </div>
            )}
            {avgRating && (
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-500">★ {avgRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            )}
          </div>

          {menu.description && (
            <p className="text-gray-700 mb-4">{menu.description}</p>
          )}

          {menu.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Bahan Baku</h3>
              <div className="flex flex-wrap gap-2">
                {menu.ingredients.map((ingredient, i) => (
                  <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Distribusi ke:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {menu.distributions.map((d) => (
                <li key={d.id}>{d.school.name}</li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Ulasan ({menu.reviews.length})</h3>

            <ReviewForm menuId={menu.id} />

            <div className="space-y-4 mt-6">
              {menu.reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{review.user.fullName}</p>
                    <span className="text-yellow-500 text-sm">★ {review.rating}</span>
                  </div>
                  {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}

                  {review.replies.map((reply) => (
                    <div key={reply.id} className="ml-6 mt-3 pl-4 border-l-2 border-green-200">
                      <p className="text-xs font-medium text-green-600">
                        {reply.user.fullName} ({reply.user.role})
                      </p>
                      <p className="text-sm text-gray-600">{reply.comment}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
