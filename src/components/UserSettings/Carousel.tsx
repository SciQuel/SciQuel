"use client";

import { useEffect, useState } from "react";
import { type Reading } from "./GreetingCard";
import { NextButton } from "./NextButton";
import { PrevButton } from "./PrevButton";
import ReadButton from "./ReadButton";

export default function Carousel({
  stories,
  autoSlide = false,
  autoSlideInterval = 3000,
}: {
  stories: Reading[];
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
            <img
              key={idx}
              src={story.thumbnailUrl}
              alt="article image"
              className="h-full w-full flex-none"
            />
          ))}
        </div>
        <ReadButton />
      </div>
      <div className="flex justify-between bg-white px-6 py-4">
        <div className="h-fit basis-5/6">
          <p className="line-clamp-1 text-xl font-semibold">
            {stories[readingHistoryIndex].title}
          </p>
          <p>
            by{" "}
            <span className="text-[#69A297]">
              {
                stories[readingHistoryIndex].storyContributions[0].contributor
                  .firstName
              }{" "}
              {
                stories[readingHistoryIndex].storyContributions[0].contributor
                  .lastName
              }
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
