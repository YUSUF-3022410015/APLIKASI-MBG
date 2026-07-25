import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import EditMenuForm from "./EditMenuForm";

export default async function EditMenuPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SPPG") redirect("/login");

  const userId = session.user.id;
  const sppg = await prisma.sppgUnit.findFirst({
    where: { admin: { id: userId } },
  });

  if (!sppg) redirect("/dashboard/sppg");

  const menu = await prisma.menu.findUnique({
    where: { id: params.id },
    include: {
      distributions: { select: { schoolId: true } },
    },
  });

  if (!menu || menu.sppgId !== sppg.id) redirect("/dashboard/sppg/menu");

  const schools = await prisma.school.findMany({
    where: { isActive: true, sppgMitraId: sppg.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const menuData = {
    id: menu.id,
    title: menu.title,
    description: menu.description || "",
    calories: menu.calories,
    protein: menu.protein ? Number(menu.protein) : null,
    carbohydrate: menu.carbohydrate ? Number(menu.carbohydrate) : null,
    fat: menu.fat ? Number(menu.fat) : null,
    ingredients: menu.ingredients,
    imageUrls: menu.imageUrls,
    dateServed: menu.dateServed.toISOString().split("T")[0],
  };

  return (
    <EditMenuForm
      menu={menuData}
      schools={schools}
      selectedSchoolIds={menu.distributions.map((d) => d.schoolId)}
    />
  );
}
