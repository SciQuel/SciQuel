"use client";

import { type ReadingHistory } from "@/app/user-settings/actions/getReadingHistory";
import TopicTag from "@/components/TopicTag";
import { StoryTopic, type Contributor, type User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Avatar from "../Avatar";
import AvatarEditorButton from "../Avatar/AvatarEditorButton";
import Carousel from "./Carousel";

export type Reading = {
  storyContributions: {
    contributor: Contributor;
  }[];
  title: string;
  thumbnailUrl: string;
};

export default function GreetingCard({
  user,
  readingHistory,
}: {
  user: User;
  readingHistory: ReadingHistory[];
}) {
  const session = useSession();
  const getGreeting = () => {
    const currHr = new Date().getHours();
    if (currHr < 12) return "Good morning";
    else if (currHr < 18) return "Good afternoon";
    else return "Good Evening";
  };

  const stories: Reading[] = readingHistory.map((item) => item.story);

  return (
    <section className="flex min-h-[320px] flex-wrap overflow-hidden rounded-md border bg-white">
      <div className="relative flex min-h-[280px] flex-1 flex-col items-center p-6 sm:flex-row sm:items-start lg:basis-7/12">
        <div>
          <div className="relative flex h-[6.75rem] w-[6.75rem] items-center justify-center rounded-full bg-gradient-to-b from-[#A1C9C1] to-[#58ABF8]">
            <AvatarEditorButton />
            <Avatar
              imageUrl={session.data?.user.image ?? undefined}
              label={user.firstName[0]}
              size="2xl"
            />
          </div>
        </div>
        <div className="mt-2 sm:ml-6">
          <p className="line-clamp-2 text-2xl font-semibold sm:text-3xl">
            {getGreeting()}, {user.firstName}
          </p>
          <div className="mt-3 flex max-h-[24px] flex-wrap justify-start gap-2 text-xs">
            <TopicTag name={StoryTopic.MATHEMATICS} />
            <TopicTag name={StoryTopic.MEDICINE} />
            <TopicTag name={StoryTopic.COMPUTER_SCIENCE} />
          </div>
        </div>
        <p className="absolute bottom-4 left-6 font-thin">
          A member since{" "}
          {user.joinedAt.toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
          })}
        </p>
      </div>

      <div className="flex h-[320px] basis-full flex-col lg:basis-5/12">
        <Carousel stories={stories} autoSlide={true} />
      </div>
    </section>
  );
}
