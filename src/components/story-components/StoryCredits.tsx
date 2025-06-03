"use client";

import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import { type StoryTopic } from "@prisma/client";
import { DateTime } from "luxon";
import Image from "next/image";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
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

const contributorPrefixMap = {
  AUTHOR: {
    prefix: "by ",
  },
  ILLUSTRATOR: {
    prefix: "illustrations by ",
  },
  ANIMATOR: {
    prefix: "Animations by ",
  },
} as {
  AUTHOR: {
    prefix: string;
  };
  ANIMATOR: {
    prefix: string;
  };
  ILLUSTRATOR: {
    prefix: string;
  };
};

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
    console.log(story);
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

  function buildContributors() {
    const contributorMap = {
      AUTHOR: [],
      ILLUSTRATOR: [],
      ANIMATOR: [],
    } as {
      [key: string]: {
        name: string;
        icon: string | null;
        slug: string;
      }[];
    };

    const otherMap = {} as {
      [key: string]: {
        name: string;
        icon: string | null;
        slug: string;
        otherContributionPrefix: string;
      }[];
    };
    story.storyContributions.forEach((contributor) => {
      switch (contributor.contributionType) {
        case "AUTHOR":
          contributorMap.AUTHOR.push({
            name: `${contributor.contributor.firstName} ${contributor.contributor.lastName}`,
            icon: contributor.contributor.avatarUrl,
            slug: contributor.contributor.contributorSlug,
          });

          break;
        case "ILLUSTRATOR":
          contributorMap.ILLUSTRATOR.push({
            name: `${contributor.contributor.firstName} ${contributor.contributor.lastName}`,
            icon: contributor.contributor.avatarUrl,
            slug: contributor.contributor.contributorSlug,
          });
          break;
        case "ANIMATOR":
          contributorMap.ANIMATOR.push({
            name: `${contributor.contributor.firstName} ${contributor.contributor.lastName}`,
            icon: contributor.contributor.avatarUrl,
            slug: contributor.contributor.contributorSlug,
          });
          break;
        default:
          if (
            contributor.otherContributorType &&
            otherMap[contributor.otherContributorType]
          ) {
            otherMap[contributor.otherContributorType].push({
              name: `${contributor.contributor.firstName} ${contributor.contributor.lastName}`,
              icon: contributor.contributor.avatarUrl,
              otherContributionPrefix:
                contributor.otherContributorCredit ?? "by ",
              slug: contributor.contributor.contributorSlug,
            });
          } else if (
            contributor.otherContributorType &&
            contributor.otherContributorCredit
          ) {
            otherMap[contributor.otherContributorType] = [
              {
                name: `${contributor.contributor.firstName} ${contributor.contributor.lastName}`,
                icon: contributor.contributor.avatarUrl,
                otherContributionPrefix:
                  contributor.otherContributorCredit ?? "by ",
                slug: contributor.contributor.contributorSlug,
              },
            ];
          }
          break;
      }
    });

    return (
      <div className="flex flex-col">
        {Object.keys(contributorMap).map((key) =>
          contributorMap[key].length > 0 ? (
            <div className="flex flex-row items-center" key={key}>
              {contributorMap[key].map((icon, index) => (
                <Avatar
                  key={`author-icons-${icon.icon}-${index}`}
                  imageUrl={icon.icon ? icon.icon : undefined}
                  label={icon.name[index]?.slice(0, 1)}
                  className="my-1 me-2  "
                  size="md"
                />
              ))}
              <p>
                {contributorPrefixMap[
                  key as "AUTHOR" | "ANIMATOR" | "ILLUSTRATOR"
                ]
                  ? contributorPrefixMap[
                      key as "AUTHOR" | "ANIMATOR" | "ILLUSTRATOR"
                    ].prefix
                  : "by "}
                {contributorMap[key].slice(0, -1).map((author) => {
                  if (contributorMap[key].length > 2) {
                    return (
                      <>
                        <a href={`/profile/${author.slug}`}>{author.name}</a>,{" "}
                      </>
                    );
                  } else {
                    return (
                      <>
                        <a href={`/profile/${author.slug}`}>{author.name}</a>{" "}
                      </>
                    );
                  }
                })}{" "}
                {contributorMap[key].length > 1 ? "and " : ""}{" "}
                {contributorMap[key].slice(-1).map((finalContributors) => (
                  <a href={`/profile/${finalContributors.slug}`}>
                    {finalContributors.name}
                  </a>
                ))}
              </p>
            </div>
          ) : (
            <></>
          ),
        )}
        {Object.keys(otherMap).map((key) => (
          <div className="flex flex-row items-center" key={key}>
            {otherMap[key].map((icon, index) => (
              <Avatar
                key={`author-icons-${icon.icon}-${index}`}
                imageUrl={icon.icon ? icon.icon : undefined}
                label={icon.name[index].slice(0, 1)}
                className="my-1 me-2  "
                size="md"
              />
            ))}
            <p>
              {otherMap[key][0].otherContributionPrefix
                ? otherMap[key][0].otherContributionPrefix
                : "by "}
              {otherMap[key].slice(0, -1).map((author) => {
                if (otherMap[key].length > 2) {
                  return (
                    <>
                      <a href={`/profile/${author.slug}`}>{author.name}</a>,{" "}
                    </>
                  );
                } else {
                  return (
                    <>
                      <a href={`/profile/${author.slug}`}>{author.name}</a>{" "}
                    </>
                  );
                }
              })}{" "}
              {otherMap[key].length > 1 ? "and " : ""}{" "}
              {otherMap[key].slice(-1).map((finalContributors) => (
                <a href={`/profile/${finalContributors.slug}`}>
                  {finalContributors.name}
                </a>
              ))}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return isPrintMode ? (
    <>
      <div className="relative mx-0 w-screen max-w-[768px] px-2 pt-10 md:mx-auto md:px-0">
        <Image
          src={story.thumbnailUrl}
          className="w-full min-w-0 object-cover"
          width={700}
          height={400}
          alt={story.title}
        />
        <p className="my-1 font-sourceSerif4">
          {story.storyContent[0].coverImgCredit ?? ""}
        </p>
        <h1 className="my-4  font-customTest text-4xl">{story.title}</h1>
        <h2 className="font-customTest text-2xl">{story.summary}</h2>
      </div>

      <div className="relative mx-0 mt-5 flex w-screen flex-col px-2 font-sourceSerif4 sm:mx-auto md:w-[768px] md:px-0">
        <div className="pointer-events-none top-0 flex flex-1 flex-row justify-start xl:hidden">
          <ShareLinks />
        </div>

        <div className="flex flex-row ">
          <p className="mr-1 ">
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
          {story.topics?.map((item: StoryTopic, index: number) => {
            return (
              <p key={`${item}-${index}`} className="lowercase">
                {item}{" "}
              </p>
            );
          })}
        </div>
        {buildContributors()}

        <p>
          {DateTime.fromJSDate(story.publishedAt).toFormat(
            "LLLL d',' y',' t ZZZZ",
          )}
          {story.updatedAt.toString() != story.publishedAt.toString()
            ? " | " +
              DateTime.fromJSDate(story.updatedAt).toFormat(
                "LLLL d',' y',' t ZZZZ",
              )
            : ""}
        </p>
      </div>
    </>
  ) : (
    <>
      <div className="relative left-0 m-0 -mt-24 flex min-h-screen w-screen items-end lg:-mt-12">
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
            className="mb-0 rounded-t-xl p-8 pb-0 font-customTest text-6xl font-bold sm:text-8xl lg:w-4/5"
            style={{
              color: story.titleColor,

              fontSize: `${Math.max(headerFont, 14)}px`,
              lineHeight: `${Math.max(headerFont + 3, 14)}px`,
            }}
          >
            {story.title}
          </h1>
          <h2
            className=" p-8 pt-0 font-besley text-2xl   lg:w-5/6"
            style={{
              color: story.summaryColor,

              fontSize: `${Math.max(headerFont - 33, 14)}px`,
              lineHeight: `${Math.max(headerFont - 28, 14)}px`,
            }}
          >
            {story.summary}
          </h2>
        </div>
      </div>
      {/* <div className="h-[calc(100vh_-_7.5rem)] w-full" />{" "} */}
      <p className="my-0 w-screen px-2 py-0 font-sourceSerif4">
        {story.storyContent[0].coverImgCredit ?? " "}
      </p>
      <div className=" -mt-6 grid grid-cols-1 justify-self-start pt-0 font-sourceSerif4 xl:grid-cols-[1fr_768px_1fr] ">
        <div className="relative mt-[3.7rem] hidden justify-end px-[1.45rem] xl:flex">
          <ShareLinks />
        </div>
        <div className="relative mx-0 mt-0 flex w-screen flex-col px-2 md:mx-auto md:w-[768px] md:px-0">
          <div className="pointer-events-none relative top-7 flex flex-1 flex-row flex-wrap justify-start xl:hidden">
            <ShareLinks />
          </div>

          <div className="mt-8 flex flex-row">
            <p className="mr-1  ">
              {story.category
                ? story.category.slice(0, 1) +
                  story.category.slice(1).toLowerCase()
                : ""}{" "}
              |{" "}
              {story.storyType
                ? story.storyType.slice(0, 1) +
                  story.storyType.slice(1).toLowerCase() +
                  " |"
                : ""}
            </p>
            {story.topics?.map((item: StoryTopic, index: number) => {
              return <TopicTag name={item} key={`${item}-${index}`} />;
            })}
          </div>

          {buildContributors()}
          <p className=" ">
            {DateTime.fromJSDate(story.publishedAt).toFormat(
              "LLLL d',' y',' t ZZZZ",
            )}
            {story.updatedAt.toString() != story.publishedAt.toString()
              ? " | " +
                DateTime.fromJSDate(story.updatedAt).toFormat(
                  "LLLL d',' y',' t ZZZZ",
                )
              : ""}
          </p>
        </div>
      </div>
    </>
  );
}
