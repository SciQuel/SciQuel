"use client";

import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import Image from "next/image";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import useFontSize from "./fontSize";

interface Props {
  story: GetStoryResult;
}

export default function TitleTop({ story }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);

  const headerFont = useFontSize(headerRef);

  return (
    <>
      <div className="m-0 flex w-screen flex-col ">
        <div className=" flex h-screen flex-col justify-center bg-teal-900">
          <div
            ref={headerRef}
            className={`relative m-10 flex h-fit min-h-0 flex-col items-center overflow-hidden`}
          >
            <h1
              className="  p-8 pb-0  font-bold  "
              style={{
                color: story.titleColor,

                fontSize: `${Math.max(headerFont, 14)}px`,
                lineHeight: `${Math.max(headerFont + 3, 14)}px`,
              }}
            >
              {story.title}
            </h1>
            <h2
              className="  p-8 pt-0  font-semibold  "
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
        <div className="relative h-screen w-full   md:w-auto">
          <Image
            fill
            src={story.thumbnailUrl}
            className="  object-cover"
            alt={story.title}
          />
        </div>
      </div>

      <p className="my-0 w-screen px-2 py-0 font-sourceSerif4">
        Title Image provided by Source name
      </p>
    </>
  );
}
