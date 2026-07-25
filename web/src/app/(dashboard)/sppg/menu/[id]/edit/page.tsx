import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import EditMenuForm from "./EditMenuForm";

export default async function EditMenuPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SPPG") redirect("/login");

  const menu = await prisma.menu.findUnique({
    where: { id: params.id },
    include: {
      distributions: { select: { schoolId: true } },
    },
  });

  if (!menu) notFound();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { sppgId: true },
  });

  if (user?.sppgId !== menu.sppgId) notFound();

  const sppg = await prisma.sppgUnit.findFirst({
    where: { id: user?.sppgId || "" },
  });

  const schools = await prisma.school.findMany({
    where: { isActive: true, sppgMitraId: sppg?.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const selectedSchoolIds = menu.distributions.map((d) => d.schoolId);

  return (
    <EditMenuForm
      menu={{
        id: menu.id,
        title: menu.title,
        description: menu.description || "",
        calories: menu.calories,
        protein: menu.protein ? Number(menu.protein) : null,
        carbohydrate: menu.carbohydrate ? Number(menu.carbohydrate) : null,
        fat: menu.fat ? Number(menu.fat) : null,
        ingredients: menu.ingredients,
        imageUrl: menu.imageUrl || "",
        dateServed: menu.dateServed.toISOString().split("T")[0],
      }}
      schools={schools}
      selectedSchoolIds={selectedSchoolIds}
    />
  );
}
