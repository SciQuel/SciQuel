import getCurrentUser from "@/app/user-settings/actions/getCurrentUser";
import GreetingCard from "@/components/UserSettings/GreetingCard";

export default async function Greeting() {
  const currUser = await getCurrentUser();
  return <GreetingCard user={currUser} />;
}
