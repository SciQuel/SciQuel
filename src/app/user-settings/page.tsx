import GreetingCard from "@/components/UserSettings/GreetingCard";
import QuizCard from "@/components/UserSettings/QuizCard";
import { StoryTopic } from "@prisma/client";

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

export default function UserSetting() {
  return (
    <div className="relative flex grow flex-col pt-6 md:pl-56">
      <GreetingCard />
      <div className="mt-6 flex min-h-[180px] w-full flex-nowrap gap-4 overflow-auto ">
        {mock_quiz_history.map((quizItem, idx) => (
          <QuizCard idx={idx} quizItem={quizItem} />
        ))}
      </div>

      <div className="mt-6 flex grow flex-wrap gap-6 border-4">
        <div className="min-h-[300px] basis-full rounded-md border bg-white lg:flex-1"></div>
        <div className="min-h-[300px] basis-full rounded-md border bg-white lg:flex-1"></div>
      </div>
    </div>
  );
}
