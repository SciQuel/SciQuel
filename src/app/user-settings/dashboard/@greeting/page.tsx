import GreetingCard from "@/components/UserSettings/GreetingCard";
import env from "@/lib/env";
import { type User } from "@prisma/client";
import { useSession } from "next-auth/react";

export default async function Greeting() {
  const { data: session } = useSession();
  if (!session || !session.user || !session?.user?.email) return null;
  const userEmail = session.user.email;
  const res = await fetch(
    `${env.NEXT_PUBLIC_SITE_URL}/api/settings/user?email=${userEmail}`,
  );
  if (!res.ok) {
    return null;
  }
  const user = (await res.json()) as User;

  return <GreetingCard user={user} />;
}
