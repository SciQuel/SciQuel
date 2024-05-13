import getCurrentUser from "@/app/user-settings/actions/getCurrentUser";
import GreetingCard from "@/components/UserSettings/QuizSummary";
import { type User } from "@prisma/client";
import getReadingHistory from "../../actions/getReadingHistory";
import QuizSummary from "@/components/UserSettings/QuizSummary";

export default async function Summary() {
  //get info from db
  return <QuizSummary />;
}