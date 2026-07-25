import prisma from "@/lib/db";
import Link from "next/link";
import { UtensilsCrossed, Star, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MenuListPage() {
  const menus = await prisma.menu.findMany({
    include: {
      sppg: { select: { name: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div>
      <div className="mb-8 animate-fade-in-down">
        <h1 className="font-heading text-3xl font-bold">Menu Makan Bergizi Gratis</h1>
        <p className="text-gray-500 mt-2">Jelajahi menu bergizi dari berbagai unit SPPG</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu, i) => {
          const avgRating =
            menu.reviews.length > 0
              ? menu.reviews.reduce((s, r) => s + r.rating, 0) / menu.reviews.length
              : null;

          const imageUrl = menu.imageUrls[0] || null;

          return (
            <Link
              key={menu.id}
              href={`/menu/${menu.id}`}
              className="card-hover overflow-hidden group animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-48 bg-gradient-to-br from-primary-100 to-emerald-200 flex items-center justify-center relative overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt={menu.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <UtensilsCrossed className="w-16 h-16 text-primary-300" />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary-600 transition-colors">{menu.title}</h3>
                <p className="text-sm text-gray-500">{menu.sppg.name}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-primary-600">
                    <Flame className="w-4 h-4" />
                    {menu.calories} kkal
                  </span>
                  {avgRating && (
                    <span className="flex items-center gap-1 text-sm text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      {avgRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {menus.length === 0 && (
        <div className="text-center py-20">
          <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">Belum ada menu tersedia.</p>
        </div>
      )}
    </div>
  );
}
