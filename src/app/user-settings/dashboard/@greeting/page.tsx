"use client";

import GreetingCard from "@/components/UserSettings/GreetingCard";
import { useSession } from "next-auth/react";

export default function Greeting() {
  const { data: session } = useSession();
  let userName = "James";
  if (session && session.user) {
    userName = String(session.user.name);
  }
  return <GreetingCard name={userName} />;
}
