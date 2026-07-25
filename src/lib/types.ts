import { Role } from "@prisma/client";

export type UserRole = Role;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}
