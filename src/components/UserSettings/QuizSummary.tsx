"use client";

export default function QuizSummary() {
  return (
    <section className="flex min-h-[240px] overflow-hidden rounded-md bg-sciquelGreen">
      <div className="flex w-1/3 items-center justify-center">
        <div className="border-middle border-r border-black p-6 pb-2 pt-2">
          {/* Content for the leftmost section (quizzes completed) */}
          Quizzes Completed
        </div>
      </div>
      <div className="flex w-1/3 items-center justify-center">
        <div className="border-middle border-r border-black p-6 pb-2 pt-2">
          {/* Content for the middle section (highest score) */}
          Highest Score
        </div>
      </div>
      <div className="flex w-1/3 items-center justify-center">
        <div className="border-middle border-black p-6 pb-2 pt-2">
          {/* Content for the rightmost section (number of correct answers) */}
          Number of Correct Answers
        </div>
      </div>
    </section>
  );
}
