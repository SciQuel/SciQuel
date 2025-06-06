"use client";

import { type ReadingHistory } from "@/app/user-settings/actions/getReadingHistory";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NextButton } from "../UserSettings/NextButton";
import { PrevButton } from "../UserSettings/PrevButton";
import ReadButton from "./ReadButton";

//left over from old greeting on user dashboard just in case it is necessary in the future
export default function Carousel({
  stories,
  autoSlide = false,
  autoSlideInterval = 3000,
}: {
  stories: ReadingHistory[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}) {
  const [readingHistoryIndex, setReadingHistoryIndex] = useState(0);

  const handleNext = () => {
    if (readingHistoryIndex < stories.length - 1) {
      setReadingHistoryIndex(readingHistoryIndex + 1);
    } else if (readingHistoryIndex === stories.length - 1) {
      setReadingHistoryIndex(0);
    }
  };

  const handlePrev = () => {
    if (readingHistoryIndex > 0) {
      setReadingHistoryIndex(readingHistoryIndex - 1);
    } else if (readingHistoryIndex === 0) {
      setReadingHistoryIndex(stories.length - 1);
    }
  };

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(handleNext, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <>
      <div className="relative grow overflow-hidden">
        <div
          className="flex h-full flex-nowrap transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${readingHistoryIndex * 100}%)` }}
        >
          {stories.map((story, idx) => (
            <Image
              key={idx}
              width={`${100}`}
              height={`${100}`}
              src={story.story.thumbnailUrl}
              alt="article image"
              className="h-full w-full flex-none"
            />
          ))}
        </div>
        <ReadButton />
      </div>
      <div className="flex justify-between bg-white px-6 py-4">
        <div className="h-fit basis-5/6">
          {stories.length > 0 && readingHistoryIndex < stories.length && (
            <p className="line-clamp-1 text-xl font-semibold">
              {stories[readingHistoryIndex].story.title}
            </p>
          )}
          <p>
            by{" "}
            <span className="text-[#69A297]">
              {stories.length > 0 &&
                stories[readingHistoryIndex].story.storyContributions &&
                stories[readingHistoryIndex].story.storyContributions.length >
                  0 &&
                stories[readingHistoryIndex].story.storyContributions[0]
                  .contributor && (
                  <>
                    {
                      stories[readingHistoryIndex].story.storyContributions[0]
                        .contributor.firstName
                    }{" "}
                    {
                      stories[readingHistoryIndex].story.storyContributions[0]
                        .contributor.lastName
                    }
                  </>
                )}
            </span>
          </p>
        </div>
        <div className="flex basis-1/6 items-center justify-center gap-2">
          <PrevButton onClick={handlePrev} />
          <NextButton onClick={handleNext} />
        </div>
      </div>
    </>
  );
}
