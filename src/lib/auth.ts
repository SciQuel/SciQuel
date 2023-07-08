import prisma from "@/lib/prisma";
import { AuthVerificationType, type User } from "@prisma/client";
import bcrypt, { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import env from "./env";
import mailer from "./mailer";

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
      async authorize(credentials, _req) {
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
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }
      const userRecord = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (userRecord) {
        // TODO: Add page explaining verification
        return userRecord.verified
          ? true
          : `/auth/verify?user=${userRecord.email}`;
      }
      return "/auth/login";
    },
  },
};

export function hashPassword(password: string) {
  return hashSync(password, 10);
}

export async function sendAccountVerification(user: User) {
  const authVerification = await prisma.authVerification.create({
    data: {
      user: { connect: { id: user.id } },
      type: AuthVerificationType.EMAIL_VERIFICATION,
    },
  });

  const token = jwt.sign(
    { email: user.email, id: authVerification.id },
    process.env.NEXTAUTH_SECRET ?? "",
  );
  const verifyLink = `${env.NEXT_PUBLIC_SITE_URL}/auth/verify/${token}`;
  await mailer.sendMail({
    from: '"SciQuel" <no-reply@sciquel.org>',
    replyTo: '"SciQuel Team" <team@sciquel.org>',
    to: user.email,
    subject: "Complete your account registration",
    text: `Please complete your account registration by verifying your email with the following link: ${verifyLink}`,
  });
}
