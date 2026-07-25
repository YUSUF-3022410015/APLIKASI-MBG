import Link from "next/link";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  id: string;
  title: string;
  calories: number;
  sppgName: string;
  avgRating?: number | null;
  className?: string;
}

export default function MenuCard({ id, title, calories, sppgName, avgRating, className }: MenuCardProps) {
  return (
    <Link
      href={`/menu/${id}`}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition",
        className
      )}
    >
      <div className="h-40 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
        <span className="text-5xl">🍱</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1 truncate">{title}</h3>
        <p className="text-sm text-gray-500 truncate">{sppgName}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-medium text-green-600">{calories} kkal</span>
          {avgRating && (
            <span className="text-sm text-yellow-500">★ {avgRating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
