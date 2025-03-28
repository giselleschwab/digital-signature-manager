import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserRepositoryMemory } from "../user/UserRepositoryMemory";
import { LoginHandler } from "../user/LoginHandler";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: User;
    }
}

export type User = {
    id: string;
} & DefaultSession["user"];

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                },
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
            authorize(credentials) {
                try {
                    // aqui vai a integração com o banco de dados
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const useRepo = new UserRepositoryMemory();
                    const hander = new LoginHandler(useRepo);

                    const user = hander.execute(credentials);
                    if (!user) return null;
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    };
                } catch{
                    return null;
                }
            }
        })
    ]
}

export const getServerAuthSession = () => getServerSession(authOptions);