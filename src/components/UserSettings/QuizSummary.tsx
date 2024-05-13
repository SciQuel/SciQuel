"use client";

import { type ReadingHistory } from "@/app/user-settings/actions/getReadingHistory";
import TopicTag from "@/components/TopicTag";
import { StoryTopic, type User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Avatar from "../Avatar";
import AvatarEditorButton from "../Avatar/AvatarEditorButton";
import Carousel from "../UserDashboard/Carousel";


export default function QuizSummary() {

  return (
    <section className="flex min-h-[240px] overflow-hidden rounded-md bg-sciquelGreen">
      <div className="w-1/3 flex items-center justify-center">
        <div className="p-6 pt-2 pb-2 border-r border-black border-middle">
          {/* Content for the leftmost section (quizzes completed) */}
          Quizzes Completed
        </div>
      </div>
      <div className="w-1/3 flex items-center justify-center">
        <div className="p-6 pt-2 pb-2 border-r border-black border-middle">
          {/* Content for the middle section (highest score) */}
          Highest Score
        </div>
      </div>
      <div className="w-1/3 flex items-center justify-center">
        <div className="p-6 pt-2 pb-2 border-black border-middle">
          {/* Content for the rightmost section (number of correct answers) */}
          Number of Correct Answers
        </div>
      </div>
    </section>

  );
}