"use client";

import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import Image from "next/image";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import useFontSize from "./fontSize";
import useWindowDimensions from "./windowDimensions";

interface Props {
  story: GetStoryResult;
}

export default function TitleRight({ story }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowDimensions();

  const headerFont = useFontSize(headerRef);

  return (
    <>
      <div className="m-0 mt-8 flex w-screen max-w-[720px] flex-col-reverse content-center px-2 md:mt-0 md:grid md:h-screen md:max-w-[100vw] md:grid-cols-2  md:px-0">
        <div className="relative h-80 w-full max-w-[720px] md:h-screen md:w-auto md:max-w-full">
          <Image
            fill
            src={story.thumbnailUrl}
            className="  object-cover"
            alt={story.title}
          />
        </div>
        <div className="mb-2 md:mb-0 md:h-full md:bg-teal-950">
          <div
            ref={headerRef}
            className={`relative flex h-fit min-h-0 flex-col overflow-hidden  md:m-10`}
          >
            <h1
              className="  mb-0 pb-0 text-6xl font-bold sm:text-8xl md:p-8 lg:w-4/5"
              style={{
                color: width >= 768 ? story.titleColor : "#000000",

                fontSize:
                  width >= 768 ? `${Math.max(headerFont, 14)}px` : "2.25rem",
                lineHeight:
                  width >= 768 ? `${Math.max(headerFont + 3, 14)}px` : "2.5rem",
              }}
            >
              {story.title}
            </h1>
            <h2
              className="  pt-0 text-4xl font-semibold md:p-8 lg:w-5/6"
              style={{
                color: width >= 768 ? story.summaryColor : "#000000",

                fontSize:
                  width >= 768
                    ? `${Math.max(headerFont - 28, 14)}px`
                    : "1.5rem",
                lineHeight:
                  width >= 768 ? `${Math.max(headerFont - 25, 14)}px` : "2rem",
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
