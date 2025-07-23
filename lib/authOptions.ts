// lib/authOptions.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        return isValid
          ? { id: String(user.id), username: user.username, name: user.name }
          : null;
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies import("next-auth").AuthOptions;