import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import NewMenuForm from "./NewMenuForm";

export default async function NewMenuPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SPPG") redirect("/login");

  const userId = session.user.id;
  const sppg = await prisma.sppgUnit.findFirst({
    where: { admin: { id: userId } },
  });

  const schools = await prisma.school.findMany({
    where: { isActive: true, sppgMitraId: sppg?.id ?? "" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return <NewMenuForm schools={schools} />;
}
