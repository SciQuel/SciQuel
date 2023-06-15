import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "text",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user === null) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials?.password ?? "",
          user.passwordHash,
        );

        if (passwordMatch) {
          return {
            id: user.id,
            email: user.email,
            name: `${user.lastName}, ${user.firstName}`,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
