"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { fullName, phone: phone || null, address: address || null },
  });

  revalidatePath("/dashboard/profile");
}

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.passwordHash) throw new Error("Akun tidak memiliki password (mungkin login via Google)");

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) throw new Error("Password saat ini salah");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  revalidatePath("/dashboard/profile");
}
