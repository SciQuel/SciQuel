"use client";

import { type ReadingHistory } from "@/app/user-settings/actions/getReadingHistory";
import TopicTag from "@/components/TopicTag";
import { StoryTopic, type User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Avatar from "../Avatar";
import AvatarEditorButton from "../Avatar/AvatarEditorButton";
import ProgressBar from "./ProgressBar";
import StatsButton from "./StatsButton";
import HeartIcon from './HeartIcon';
import EmptyBadge from './EmptyBadge';
import { useState, useEffect } from 'react';


export default function GreetingCard({
  user,
}: {
  user: User;
}) {
  const session = useSession();

  {/*Makes sure that the Progress bar is always 2/3 width*/ }
  const progressBarWidth = "calc(2/3 * (100% - 250px))";

  {/*Window Resizing*/ }
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  {/*When things should be hidden These can be changed to hide or show things based on window size, they are temp*/ }
  const shouldHideBadges = windowWidth <= 1250;
  const shouldHideTopicTags = windowWidth <= 700
  return (

    <section className="flex min-h-[320px] flex-wrap overflow-hidden rounded-md border bg-white relative dark:bg-sciquelMuted">
      <div className="flex min-h-[280px] flex-1 flex-col items-center p-6 sm:flex-row sm:items-start lg:basis-7/12 relative">
        {/*Avatar Image*/}
        <div className="relative flex h-[6.75rem] w-[6.75rem] items-center justify-center rounded-full bg-gradient-to-b from-[#A1C9C1] to-[#58ABF8]">
          <AvatarEditorButton />
          <Avatar
            imageUrl={session.data?.user.image ?? undefined}
            label={user.firstName[0]}
            size="2xl"
          />
        </div>
        {/*Greeting and Progress Bar*/}
        <div className="mt-2 sm:ml-6" style={{ width: progressBarWidth }}>
          <p className="line-clamp-2 text-2xl font-semibold sm:text-3xl">
            Hi, {user.firstName}
          </p>
          <p className="text-lg text-gray-500 mb-2 dark:text-gray-200">Sciquel Rising Star</p>
          <ProgressBar numerator={3000} denominator={8000} />
          {/*Topic Tags and View Stats button*/}
          {!shouldHideTopicTags && (
            <div className="absolute bottom-4 left-0 w-2/3 flex justify-between">
              <div className="pb-6 pl-6 flex flex-col sm:flex-row gap-4 text-xs items-center">
                <div className="flex items-center">
                  <div style={{ marginRight: "0.5rem" }}>
                    <HeartIcon size="6" color="red" />
                  </div>
                  <p className="text-xl font-medium text-gray-600 dark:text-gray-200">Favorites:</p>
                </div>
                <div className="flex flex-1 items-center" style={{ marginTop: "0.35rem" }}>
                  <TopicTag name={StoryTopic.MATHEMATICS} />
                </div>
                <div className="flex flex-1 items-center pr-6" style={{ marginTop: "0.35rem" }}>
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
        <div className="absolute top-1/2 transform -translate-y-1/2 right-0 h-[80%] border-l border-gray-300 w-1/2 sm:w-1/3 flex flex-col pl-8 pr-8 justify-center dark:border-white">
          <div className="mb-1">
            <p className="text-md text-gray-500 font-semibold dark:text-gray-200">MY BADGES</p>
          </div>
          {/*Grid of empty badges for placeholder purposes*/}
          <div className="grid grid-cols-5 grid-rows-3 gap-x-3 gap-y-3 items-center justify-center flex-grow">
            {Array.from({ length: 15 }, (_, index) => (
              <EmptyBadge key={index} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
