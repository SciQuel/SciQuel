"use client";

import GreetingCard from "@/components/UserSettings/GreetingCard";
import { useSession } from "next-auth/react";

export default function Greeting() {
  const { data: session } = useSession();
  return <GreetingCard name={session.user.name} />;
}
