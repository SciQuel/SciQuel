"use client";

import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import Image from "next/image";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import useFontSize from "./fontSize";

interface Props {
  story: GetStoryResult;
}

export default function TitleOnImage({ story }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);

  const headerFont = useFontSize(headerRef);

  return (
    <>
      <div className="absolute left-0 top-0 m-0 flex min-h-screen w-screen items-end">
        <Image
          src={story.thumbnailUrl}
          className="h-full object-cover"
          fill={true}
          alt={story.title}
        />
        <div
          ref={headerRef}
          className={`relative m-10 flex min-h-0 w-full flex-col justify-end overflow-hidden `}
        >
          <h1
            className=" mb-0 p-8 pb-0 text-6xl font-bold sm:text-8xl lg:w-4/5"
            style={{
              color: story.titleColor,

              fontSize: `${Math.max(headerFont, 14)}px`,
              lineHeight: `${Math.max(headerFont + 3, 14)}px`,
            }}
          >
            {story.title}
          </h1>
          <h2
            className=" p-8 pt-0 text-4xl font-semibold lg:w-5/6"
            style={{
              color: story.summaryColor,

              fontSize: `${Math.max(headerFont - 28, 14)}px`,
              lineHeight: `${Math.max(headerFont - 25, 14)}px`,
            }}
          >
            {story.summary}
          </h2>
        </div>
      </div>
      <div className="h-[calc(100vh_-_6rem)] w-full" />{" "}
      <p className="my-0 w-screen px-2 py-0 font-sourceSerif4">
        Title Image provided by Source name
      </p>
    </>
  );
}
