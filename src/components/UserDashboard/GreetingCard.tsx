"use client";

import TopicTag from "@/components/TopicTag";
import { StoryTopic, type User } from "@prisma/client";
import { useEffect, useState } from "react";
import Avatar from "../Avatar";
import AvatarEditorButton from "../Avatar/AvatarEditorButton";
import EmptyBadge from "./EmptyBadge";
import HeartIcon from "./HeartIcon";
import ProgressBar from "./ProgressBar";
import StatsButton from "./StatsButton";

export default function GreetingCard({ user }: { user: User }) {
  {
    /*Makes sure that the Progress bar is always 2/3 width*/
  }
  const progressBarWidth = "calc(2/3 * (100% - 250px))";

  {
    /*Window Resizing*/
  }
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  {
    /*When things should be hidden These can be changed to hide or show things based on window size, they are temp*/
  }
  const shouldHideBadges = windowWidth <= 1250;
  const shouldHideTopicTags = windowWidth <= 700;
  return (
    <section className="relative flex min-h-[320px] flex-wrap overflow-hidden rounded-md border bg-white dark:bg-sciquelMuted">
      <div className="relative flex min-h-[280px] flex-1 flex-col items-center p-6 sm:flex-row sm:items-start lg:basis-7/12">
        {/*Avatar Image*/}
        <div className="relative flex h-[6.75rem] w-[6.75rem] items-center justify-center rounded-full bg-gradient-to-b from-[#A1C9C1] to-[#58ABF8]">
          <AvatarEditorButton />
          <Avatar
            imageUrl={user.avatarUrl ?? undefined}
            label={user.firstName[0]}
            size="2xl"
          />
        </div>
        {/*Greeting and Progress Bar*/}
        <div className="mt-2 sm:ml-6" style={{ width: progressBarWidth }}>
          <p className="line-clamp-2 text-2xl font-semibold sm:text-3xl">
            Hi, {user.firstName}
          </p>
          <p className="mb-2 text-lg text-gray-500 dark:text-gray-200">
            Sciquel Rising Star
          </p>
          <ProgressBar numerator={3000} denominator={8000} />
          {/*Topic Tags and View Stats button*/}
          {!shouldHideTopicTags && (
            <div className="absolute bottom-4 left-0 flex w-2/3 justify-between">
              <div className="flex flex-col items-center gap-4 pb-6 pl-6 text-xs sm:flex-row">
                <div className="flex items-center">
                  <div style={{ marginRight: "0.5rem" }}>
                    <HeartIcon size="6" color="red" />
                  </div>
                  <p className="text-xl font-medium text-gray-600 dark:text-gray-200">
                    Favorites:
                  </p>
                </div>
                <div
                  className="flex flex-1 items-center"
                  style={{ marginTop: "0.35rem" }}
                >
                  <TopicTag name={StoryTopic.MATHEMATICS} />
                </div>
                <div
                  className="flex flex-1 items-center pr-6"
                  style={{ marginTop: "0.35rem" }}
                >
                  <TopicTag name={StoryTopic.MECHANICAL_ENGINEERING} />
                </div>
              </div>
              <div className="pr-10">
                <StatsButton />
              </div>
            </div>
          )}
        </div>
      </div>
      {/*Grey vertical Line and Badges*/}
      {!shouldHideBadges && (
        <div className="absolute right-0 top-1/2 flex h-[80%] w-1/2 -translate-y-1/2 transform flex-col justify-center border-l border-gray-300 pl-8 pr-8 dark:border-white sm:w-1/3">
          <div className="mb-1">
            <p className="text-md font-semibold text-gray-500 dark:text-gray-200">
              MY BADGES
            </p>
          </div>
          {/*Grid of empty badges for placeholder purposes*/}
          <div className="grid flex-grow grid-cols-5 grid-rows-3 items-center justify-center gap-x-3 gap-y-3">
            {Array.from({ length: 15 }, (_, index) => (
              <EmptyBadge key={index} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
