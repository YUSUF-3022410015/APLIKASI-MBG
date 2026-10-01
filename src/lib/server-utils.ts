import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function requireAuth(role?: string[]) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }
  
  if (role && !role.includes(session.user.role as string)) {
    redirect("/dashboard");
  }
  
  return session;
}