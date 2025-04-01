import getCurrentUser from "@/app/user-settings/actions/getCurrentUser";
import GreetingCard from "@/components/UserSettings/GreetingCard";
import { type User } from "@prisma/client";
import getReadingHistory, {
  type ReadingHistory,
} from "../../actions/getReadingHistory";

export default async function Greeting() {
  const currUser: User | null = await getCurrentUser();
  const readingHistory = await getReadingHistory();
  if (currUser === null) return null;
  if (readingHistory === null) return null;
  return (
    <GreetingCard
      user={currUser}
      readingHistory={readingHistory as ReadingHistory[]}
    />
  );
}
