import getCurrentUser from "@/app/user-settings/actions/getCurrentUser";
import GreetingCard from "@/components/UserDashboard/GreetingCard";
import { type User } from "@prisma/client";

export default async function Greeting() {
  const currUser: User | null = await getCurrentUser();
  if (currUser === null) return null;
  return <GreetingCard user={currUser} />;
}
