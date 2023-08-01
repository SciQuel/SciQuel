import getCurrentUser from "@/app/user-settings/actions/getCurrentUser";
import QuizCard from "@/components/UserSettings/QuizCard";
import { StoryTopic, type Quiz, type Story } from "@prisma/client";
import getQuizHistory from "../../actions/getQuizHistory";

type QuizAndStory = Quiz & { story: Story };

export default async function QuizHistory() {
  const quizs: QuizAndStory[] | null = await getQuizHistory();
  return (
    <section className="mt-6 flex min-h-[180px] w-full flex-nowrap gap-4 overflow-auto ">
      {quizs?.map((quizItem: QuizAndStory, idx) => (
        <QuizCard idx={idx} quiz={quizItem} key={quizItem.id} />
      ))}
    </section>
  );
}
