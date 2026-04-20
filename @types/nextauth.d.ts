import "next-auth";
import { DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    firstName: string;
    lastName: string;
  }

  interface Session {
    user: {
      firstName: string;
      lastName: string;
    } & DefaultUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName: string;
    lastName: string;
  }
}
