"use client";

import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import Image from "next/image";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import useFontSize from "./fontSize";

interface Props {
  story: GetStoryResult;
}

export default function TitleTop({ story }: Props) {
  return (
    <>
      <div className="relative mx-auto w-screen max-w-[720px] px-2 pt-6 md:px-0 md:pt-8">
        <div className=" flex flex-col justify-start">
          <h1 className="py-4 pb-0 text-4xl  font-bold  ">{story.title}</h1>
          <h2 className="py-4 pt-0 text-2xl  font-semibold  ">
            {story.summary}
          </h2>
        </div>
        <div className="relative  w-full  ">
          <Image
            src={story.thumbnailUrl}
            className="w-full min-w-0  object-cover"
            width={700}
            height={400}
            alt={story.title}
          />
        </div>
        <p className="my-2 font-sourceSerif4 ">
          Title Image provided by Source name
        </p>
      </div>
    </>
  );
}
