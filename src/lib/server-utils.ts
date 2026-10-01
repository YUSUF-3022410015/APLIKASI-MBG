"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function requireAuth(role?: string[]) {
  const session = await getServerSession();
  
  if (!session || !session.user) {
    redirect("/login");
  }
  
  if (role && !role.includes(session.user.role as string)) {
    redirect("/dashboard");
  }
  
  return session;
}
