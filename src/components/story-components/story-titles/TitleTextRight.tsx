"use client";

import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import Image from "next/image";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import useFontSize from "./fontSize";

interface Props {
  story: GetStoryResult;
}

export default function TitleRight({ story }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);

  const headerFont = useFontSize(headerRef);

  return (
    <>
      <div className="m-0 mt-8 flex w-screen max-w-[720px] flex-col-reverse content-center px-2 md:mt-0 md:grid md:max-w-[100vw] md:grid-cols-2  md:px-0">
        <div className="relative h-screen w-full md:h-auto md:w-auto">
          <Image
            fill
            src={story.thumbnailUrl}
            className="  object-cover"
            alt={story.title}
          />
        </div>
        <div className=" mb-2 bg-teal-950 md:mb-0">
          <div
            ref={headerRef}
            className={`relative m-10 flex h-fit min-h-0 flex-col  overflow-hidden`}
          >
            <h1
              className="  mb-0 p-8 pb-0 text-6xl font-bold sm:text-8xl lg:w-4/5"
              style={{
                color: story.titleColor,

                fontSize: `${Math.max(headerFont, 14)}px`,
                lineHeight: `${Math.max(headerFont + 3, 14)}px`,
              }}
            >
              {story.title}
            </h1>
            <h2
              className="  p-8 pt-0 text-4xl font-semibold lg:w-5/6"
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
      </div>

      <p className="my-0 w-screen px-2 py-0 font-sourceSerif4">
        Title Image provided by Source name
      </p>
    </>
  );
}
