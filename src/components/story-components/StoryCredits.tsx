"use client";

import { GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import { type StoryTopic } from "@prisma/client";
import { DateTime } from "luxon";
import Image from "next/image";
import { useContext } from "react";
import Avatar from "../Avatar";
import TopicTag from "../TopicTag";
import { PrintContext } from "./PrintContext";
import ShareLinks from "./ShareLinks";

interface Props {
  story: GetStoryResult;
}

export default function StoryCredits({ story }: Props) {
  const isPrintMode = useContext(PrintContext);

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
      <div className="relative h-screen">
        <Image
          src={story.thumbnailUrl}
          className="-z-10 h-full object-cover"
          fill={true}
          alt={story.title}
        />
        <div className="relative flex h-full flex-col justify-end px-12 pb-24 pt-10">
          <h1
            className="w-4/5 p-8 font-alegreyaSansSC text-6xl font-bold sm:text-8xl"
            style={{ color: story.titleColor }}
          >
            {story.title}
          </h1>
          <h2
            className="w-5/6 p-8 pt-0 font-alegreyaSansSC text-4xl font-semibold"
            style={{ color: story.summaryColor }}
          >
            {story.summary}
          </h2>
        </div>
      </div>
      <div className="h-fit w-screen">
        <p className="fs-2 mx-20 my-0 p-0">
          Title Image provided by Source name
        </p>
        <div className="relative mx-2 mt-0 flex w-screen flex-col sm:mx-auto md:w-[720px]">
          <div className="pointer-events-none top-0 flex flex-1 flex-row justify-start xl:absolute xl:-left-24 xl:flex-col xl:pt-3">
            <ShareLinks />
          </div>

          <div className="flex flex-row">
            <p className="mr-2">
              {story.storyType.slice(0, 1) +
                story.storyType.slice(1).toLowerCase()}
              | we need to add article type |
            </p>
            {story.tags.map((item: StoryTopic, index: number) => {
              return <TopicTag name={item} key={`${item}-${index}`} />;
            })}
          </div>
          <div>
            {story.storyContributions.map((element, index) => {
              return (
                <div className="flex flex-row items-center">
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
