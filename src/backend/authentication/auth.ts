import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string } & DefaultSession["user"];
  }
}

export type User = {
  id: string;
} & DefaultSession["user"];

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: { ...session.user, id: token.sub },
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Buscar usuário no banco
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;

        // Comparar senha digitada com a do banco
        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) return null;

        return { id: user.id.toString(), email: user.email, name: user.name };
      }
    })
  ]
};

export const getServerAuthSession = () => getServerSession(authOptions);
