import getCurrentUser from "@/app/user-settings/actions/getCurrentUser";
import QuizCard from "@/components/UserSettings/QuizCard";
import { StoryTopic, type Quiz } from "@prisma/client";
import getQuizHistory from "../../actions/getQuizHistory";

// mock data
const mock_quiz_history = [
  {
    title: "Lights, Camera, Action!",
    topic: StoryTopic.PHYSICS,
    date: "May 15, 2022",
    type: "Pre-Quiz",
    total: 3,
    score: 1,
  },
  {
    title: "Lights, Camera, Action!",
    topic: StoryTopic.PHYSICS,
    date: "May 15, 2022",
    type: "Post-Quiz",
    total: 3,
    score: 3,
  },
  {
    title: "Lights, Camera, Action!",
    topic: StoryTopic.PHYSICS,
    date: "May 15, 2022",
    type: "Pre-Quiz",
    total: 3,
    score: 1,
  },
  {
    title: "Lights, Camera, Action!",
    topic: StoryTopic.PHYSICS,
    date: "May 15, 2022",
    type: "Post-Quiz",
    total: 3,
    score: 3,
  },
  {
    title: "Lights, Camera, Action!",
    topic: StoryTopic.PHYSICS,
    date: "May 15, 2022",
    type: "Pre-Quiz",
    total: 3,
    score: 1,
  },
  {
    title: "Lights, Camera, Action!",
    topic: StoryTopic.PHYSICS,
    date: "May 15, 2022",
    type: "Post-Quiz",
    total: 3,
    score: 3,
  },
];

export default async function QuizHistory() {
  const quizs = await getQuizHistory();
  return (
    <section className="mt-6 flex min-h-[180px] w-full flex-nowrap gap-4 overflow-auto ">
      {quizs?.map((quizItem, idx) => (
        <QuizCard idx={idx} quiz={quizItem} key={quizItem.id} />
      ))}
    </section>
  );
}
