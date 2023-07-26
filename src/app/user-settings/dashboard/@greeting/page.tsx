import getCurrentUser from "@/app/user-settings/actions/getCurrentUser";
import GreetingCard from "@/components/UserSettings/GreetingCard";

<<<<<<< HEAD
export default async function Greeting() {
  const currUser = await getCurrentUser();
  return <GreetingCard user={currUser} />;
=======
export default function Greeting() {
  const { data: session } = useSession();
  let userName = "James";
  if (session && session.user) {
    userName = session.user.firstName;
  }
  return <GreetingCard name={userName} />;
>>>>>>> main
}
