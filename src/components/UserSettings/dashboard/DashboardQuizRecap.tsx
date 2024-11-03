// import QuizCard from "@/components/UserSettings/QuizCard";
// import getQuizHistory, { type QuizHistory } from "../../actions/getQuizHistory";

export default function DashboardQuizRecap() {
  // const quizzes: QuizHistory[] | null = await getQuizHistory();
  // if (!quizzes) return null;
  return (
    <section className="mt-6 flex min-h-[180px] w-full flex-nowrap gap-4 overflow-auto ">
      {/* {quizzes?.map((quizItem: QuizHistory, idx) => (
        <QuizCard idx={idx} quiz={quizItem} key={idx} />
      ))} */}
    </section>
  );
}
