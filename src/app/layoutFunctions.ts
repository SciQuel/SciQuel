import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function layoutGetServerSession() {
  const session = await getServerSession(authOptions);
  return session;
}
