"use client";

import { GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import { type StoryTopic } from "@prisma/client";
import { DateTime } from "luxon";
import Image from "next/image";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Avatar from "../Avatar";
import TopicTag from "../TopicTag";
import { PrintContext } from "./PrintContext";
import ShareLinks from "./ShareLinks";

interface Props {
  story: GetStoryResult;
}

interface FontAction {
  type: "window update";
}

export default function StoryCredits({ story }: Props) {
  const isPrintMode = useContext(PrintContext);
  const headerRef = useRef<HTMLDivElement>(null);

  //72
  const [headerFont, dispatchHeaderFont] = useReducer(
    (state: number, action: FontAction) => {
      switch (action.type) {
        case "window update":
          if (
            headerRef.current &&
            headerRef.current.clientHeight > window.innerHeight * 0.9 - 90 &&
            state > 14
          ) {
            return state - 2;
          } else if (
            headerRef.current &&
            headerRef.current.clientHeight +
              state +
              Math.max(state - 23, 14) +
              32 <
              window.innerHeight * 0.9 - 90 &&
            state < 72
          ) {
            return state + 2;
          } else {
            return state;
          }

        default:
          throw Error("unknown action in header font reducer");
      }
    },
    72,
  );

  function handleWindowResize() {
    if (headerRef.current) {
      dispatchHeaderFont({ type: "window update" });
    }
  }

  useEffect(() => {
    console.log("is print mode? : ", isPrintMode);
    if (!isPrintMode) {
      window.addEventListener("resize", handleWindowResize);
    } else {
      window.removeEventListener("resize", handleWindowResize);
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [isPrintMode]);

  useLayoutEffect(() => {
    dispatchHeaderFont({ type: "window update" });
  }, [headerFont]);

  return isPrintMode ? (
    <>
      <div className="relative mx-auto w-screen max-w-[720px] pt-10">
        <Image
          src={story.thumbnailUrl}
          className="w-full min-w-0 object-cover"
          width={700}
          height={400}
          alt={story.title}
        />
        <p className="my-2  font-sourceSerif4 ">
          Title Image provided by Source name
        </p>
        <h1 className="my-4 font-sourceSerif4 text-4xl">{story.title}</h1>
        <h2 className="font-sourceSerif4 text-2xl">{story.summary}</h2>
      </div>

      <div className="relative mx-2 mt-5 flex w-screen flex-col sm:mx-auto md:w-[720px]">
        <div className="pointer-events-none top-0 flex flex-1 flex-row justify-start xl:absolute xl:-left-24 xl:flex-col xl:pt-3">
          <ShareLinks />
        </div>

        <div className="flex flex-row">
          <p className="mr-2">
            {story.storyType.slice(0, 1) +
              story.storyType.slice(1).toLowerCase()}{" "}
            | we need to add article type |
          </p>
          {story.tags.map((item: StoryTopic, index: number) => {
            return (
              <p key={`${item}-${index}`} className="lowercase">
                {item}{" "}
              </p>
            );
          })}
        </div>
        <div>
          {story.storyContributions.map((element, index) => {
            return (
              <p key={`contributor-header-${index}`}>
                {element.contributionType == "AUTHOR"
                  ? `by ${element.user.firstName} ${element.user.lastName}`
                  : `${element.contributionType} by ${element.user.firstName} ${element.user.lastName}`}
              </p>
            );
          })}
        </div>
        <p>
          {DateTime.fromJSDate(story.publishedAt).toLocaleString({
            ...DateTime.DATETIME_MED,
            timeZoneName: "short",
          })}
          {story.updatedAt != story.publishedAt
            ? " | " +
              DateTime.fromJSDate(story.updatedAt).toLocaleString({
                ...DateTime.DATETIME_MED,
                timeZoneName: "short",
              })
            : ""}
        </p>
      </div>
    </>
  ) : (
    <>
      <div className="absolute top-0 flex h-screen w-full items-end">
        <Image
          src={story.thumbnailUrl}
          className="-z-10 h-full object-cover"
          fill={true}
          alt={story.title}
        />
        <div
          ref={headerRef}
          className={`relative mx-12 my-20 flex min-h-0 w-full flex-col justify-end overflow-hidden `}
        >
          <h1
            className="mb-0 p-8 pb-0 font-alegreyaSansSC text-6xl font-bold sm:text-8xl lg:w-4/5"
            style={{
              color: story.titleColor,

              fontSize: `${Math.max(headerFont, 14)}px`,
              lineHeight: `${Math.max(headerFont + 3, 14)}px`,
            }}
          >
            {story.title}
          </h1>
          <h2
            className="p-8 pt-0 font-alegreyaSansSC text-4xl font-semibold lg:w-5/6"
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
      <div className="w-100 h-[calc(100vh_-_4rem)]" />
      <div className="h-fit w-screen">
        <p className="fs-2 mx-2 my-0 p-0">
          Title Image provided by Source name
        </p>
        <div className="relative mx-2 mt-0 flex w-screen flex-col sm:mx-auto md:w-[720px]">
          <div className="pointer-events-none top-0 flex flex-1 flex-row justify-start xl:absolute xl:-left-24 xl:flex-col xl:pt-3">
            <ShareLinks />
          </div>

          <div className="flex flex-row">
            <p className="mr-2">
              {story.category
                ? story.category.slice(0, 1) +
                  story.category.slice(1).toLowerCase()
                : ""}{" "}
              |{" "}
              {story.storyType
                ? story.storyType.slice(0, 1) +
                  story.storyType.slice(1).toLowerCase() +
                  " | "
                : ""}
            </p>
            {story.tags.map((item: StoryTopic, index: number) => {
              return <TopicTag name={item} key={`${item}-${index}`} />;
            })}
          </div>
          <div>
            {story.storyContributions.map((element, index) => {
              return (
                <div
                  className="my-1 flex flex-row items-center"
                  key={`${element.contributionType}-${element.user.id}`}
                >
                  <Avatar
                    imageUrl={element.user.avatarUrl ?? undefined}
                    label={element.user.firstName[0]}
                    className="mr-2"
                    size="md"
                  />
                  <p key={`contributor-header-${index}`}>
                    {element.contributionType == "AUTHOR"
                      ? `by ${element.user.firstName} ${element.user.lastName}`
                      : `${element.contributionType} by ${element.user.firstName} ${element.user.lastName}`}
                  </p>
                </div>
              );
            })}
          </div>
          <p>
            {DateTime.fromJSDate(story.publishedAt).toLocaleString({
              ...DateTime.DATETIME_MED,
              timeZoneName: "short",
            })}
            {story.updatedAt != story.publishedAt
              ? " | " +
                DateTime.fromJSDate(story.updatedAt).toLocaleString({
                  ...DateTime.DATETIME_MED,
                  timeZoneName: "short",
                })
              : ""}
          </p>
        </div>
      </div>
    </>
  );
}
