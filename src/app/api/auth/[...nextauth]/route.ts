import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
