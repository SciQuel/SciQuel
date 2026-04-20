"use client";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren } from "react";

interface Props {
  session: Session | null;
}

export default function AuthProvider({
  session,
  children,
}: PropsWithChildren<Props>) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
