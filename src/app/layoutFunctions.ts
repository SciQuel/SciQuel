import { authOptions } from "@/lib/auth";
import { getServerSession, type Session } from "next-auth";

export async function layoutGetServerSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  return session;
}
