import prisma from "@/lib/db";
import Link from "next/link";

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
      <h1 className="text-2xl font-bold mb-6">Menu Makan Bergizi Gratis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => {
          const avgRating =
            menu.reviews.length > 0
              ? menu.reviews.reduce((s, r) => s + r.rating, 0) / menu.reviews.length
              : null;

          return (
            <Link
              key={menu.id}
              href={`/menu/${menu.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                <span className="text-6xl">🍱</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{menu.title}</h3>
                <p className="text-sm text-gray-500">{menu.sppg.name}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-medium text-green-600">
                    {menu.calories} kkal
                  </span>
                  {avgRating && (
                    <span className="text-sm text-yellow-500">
                      ★ {avgRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
