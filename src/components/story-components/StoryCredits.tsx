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

  const buildAuthors = () => {
    let authors: string[] = [];

    let authorIcons: (string | null)[] = [];

    let illustrators: string[] = [];
    let illustratorIcons: (string | null)[] = [];

    let animators: string[] = [];
    let animatorIcons: (string | null)[] = [];

    story.storyContributions.forEach((contributor, index) => {
      switch (contributor.contributionType) {
        case "AUTHOR":
          authors.push(
            `${contributor.user.firstName} ${contributor.user.lastName}`,
          );
          authorIcons.push(contributor.user.avatarUrl);
          break;
        case "ILLUSTRATOR":
          illustrators.push(
            `${contributor.user.firstName} ${contributor.user.lastName}`,
          );
          illustratorIcons.push(contributor.user.avatarUrl);
          break;
        case "ANIMATOR":
          animators.push(
            `${contributor.user.firstName} ${contributor.user.lastName}`,
          );
          animatorIcons.push(contributor.user.avatarUrl);
          break;
        default:
          authors.push(
            `${contributor.user.firstName} ${contributor.user.lastName}`,
          );
          authorIcons.push(contributor.user.avatarUrl);
          break;
      }
    });

    return (
      <div>
        {authors.length > 0 ? (
          <div className="flex flex-row items-center">
            {authorIcons.map((icon, index) => (
              <div
                className={
                  index < authorIcons.length - 1 ? "max-w-[1.5rem]" : ""
                }
                key={`author-icons-${icon}-${index}`}
              >
                <Avatar
                  imageUrl={icon ? icon : undefined}
                  label={authors[index].slice(0, 1)}
                  className="mr-2"
                  size="md"
                />
              </div>
            ))}
            <p>
              by{" "}
              {authors.slice(0, -1).map((author, index) => {
                if (authors.length > 2) {
                  return `${author}, `;
                } else {
                  return `${author} `;
                }
              })}{" "}
              {authors.length > 1 ? "and " : ""} {authors.slice(-1)}
            </p>
          </div>
        ) : (
          ""
        )}
        {illustrators.length > 0 ? (
          <div className="flex flex-row items-center">
            {illustratorIcons.map((icon, index) => (
              <div
                className={
                  index < illustratorIcons.length - 1 ? "max-w-[1.5rem]" : ""
                }
                key={`illust-icons-${icon}-${index}`}
              >
                <Avatar
                  imageUrl={icon ? icon : undefined}
                  label={illustrators[index].slice(0, 1)}
                  className="mr-2"
                  size="md"
                />
              </div>
            ))}
            <p className={`ml-[${illustrators.length}rem]`}>
              Illustrations by{" "}
              {illustrators.slice(0, -1).map((illustrator, index) => {
                if (illustrators.length > 2) {
                  return `${illustrator}, `;
                } else {
                  return `${illustrator} `;
                }
              })}{" "}
              {illustrators.length > 1 ? "and " : ""} {illustrators.slice(-1)}
            </p>
          </div>
        ) : (
          ""
        )}

        {animators.length > 0 ? (
          <div className="flex flex-row items-center">
            {animatorIcons.map((icon, index) => (
              <div
                className={
                  index < animatorIcons.length - 1 ? "max-w-[1.5rem]" : ""
                }
                key={`anim-icons-${icon}-${index}`}
              >
                <Avatar
                  imageUrl={icon ? icon : undefined}
                  label={animators[index].slice(0, 1)}
                  className="mr-2"
                  size="md"
                />
              </div>
            ))}
            <p className={`ml-[${animators.length}rem]`}>
              Animations by{" "}
              {animators.slice(0, -1).map((animator, index) => {
                if (animators.length > 2) {
                  return `${animator}, `;
                } else {
                  return `${animator} `;
                }
              })}{" "}
              {animators.length > 1 ? "and " : ""} {animators.slice(-1)}
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const buildPrintAuthors = () => {
    let authors: string[] = [];
    let illustrators: string[] = [];
    let animators: string[] = [];
    story.storyContributions.forEach((contributor, index) => {
      switch (contributor.contributionType) {
        case "AUTHOR":
          authors.push(
            `${contributor.user.firstName} ${contributor.user.lastName}`,
          );

          break;
        case "ILLUSTRATOR":
          illustrators.push(
            `${contributor.user.firstName} ${contributor.user.lastName}`,
          );

          break;
        case "ANIMATOR":
          animators.push(
            `${contributor.user.firstName} ${contributor.user.lastName}`,
          );

          break;
        default:
          authors.push(
            `${contributor.user.firstName} ${contributor.user.lastName}`,
          );

          break;
      }
    });

    return (
      <div>
        {authors.length > 0 ? (
          <p>
            by{" "}
            {authors.slice(0, -1).map((author, index) => {
              if (authors.length > 2) {
                return `${author}, `;
              } else {
                return `${author} `;
              }
            })}{" "}
            {authors.length > 1 ? "and " : ""} {authors.slice(-1)}
          </p>
        ) : (
          ""
        )}
        {illustrators.length > 0 ? (
          <p>
            Illustrations by{" "}
            {illustrators.slice(0, -1).map((illustrator, index) => {
              if (illustrators.length > 2) {
                return `${illustrator}, `;
              } else {
                return `${illustrator} `;
              }
            })}{" "}
            {illustrators.length > 1 ? "and " : ""} {illustrators.slice(-1)}
          </p>
        ) : (
          ""
        )}
        {animators.length > 0 ? (
          <p>
            Animations by{" "}
            {animators.slice(0, -1).map((animator, index) => {
              if (animators.length > 2) {
                return `${animator}, `;
              } else {
                return `${animator} `;
              }
            })}{" "}
            {animators.length > 1 ? "and " : ""} {animators.slice(-1)}
          </p>
        ) : (
          ""
        )}
      </div>
    );
  };

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
        <p className="my-1 font-sourceSerif4">
          Title Image provided by Source name
        </p>
        <h1 className="my-4 font-sourceSerif4 text-4xl">{story.title}</h1>
        <h2 className="font-sourceSerif4 text-2xl">{story.summary}</h2>
      </div>

      <div className="relative mx-2 mt-5 flex w-screen flex-col sm:mx-auto md:w-[720px]">
        <div className="pointer-events-none top-0 flex flex-1 flex-row justify-start xl:absolute xl:-left-24 xl:flex-col xl:pt-3">
          <ShareLinks storyId={story.id} />
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
            return (
              <p key={`${item}-${index}`} className="lowercase">
                {item}{" "}
              </p>
            );
          })}
        </div>
        {buildPrintAuthors()}
        {/* <div>
          {story.storyContributions.map((element, index) => {
            return (
              <p key={`contributor-header-${index}`}>
                {element.contributionType == "AUTHOR"
                  ? `by ${element.user.firstName} ${element.user.lastName}`
                  : `${element.contributionType} by ${element.user.firstName} ${element.user.lastName}`}
              </p>
            );
          })}
        </div> */}

        <p>
          {DateTime.fromJSDate(story.publishedAt).toFormat(
            "LLLL d',' y t ZZZZ",
          )}
          {story.updatedAt.toString() != story.publishedAt.toString()
            ? " | " +
              DateTime.fromJSDate(story.updatedAt).toFormat(
                "LLLL d',' y t ZZZZ",
              )
            : ""}
        </p>
      </div>
    </>
  ) : (
    <>
      <div className="absolute top-0 flex h-screen w-full items-end">
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
        <p className="fs-2 mx-2 my-0 p-0 font-sourceSerif4">
          Title Image provided by Source name
        </p>
        <div className="relative mx-2 mt-0 flex w-screen flex-col sm:mx-auto md:w-[720px]">
          <div className="pointer-events-none top-0 flex flex-1 flex-row justify-start xl:absolute xl:-left-24 xl:flex-col xl:pt-3">
            <ShareLinks storyId={story.id} />
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
          {/* <div>
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
          </div> */}
          {buildAuthors()}
          <p>
            {DateTime.fromJSDate(story.publishedAt).toFormat(
              "LLLL d',' y t ZZZZ",
            )}
            {story.updatedAt.toString() != story.publishedAt.toString()
              ? " | " +
                DateTime.fromJSDate(story.updatedAt).toFormat(
                  "LLLL d',' y t ZZZZ",
                )
              : ""}
          </p>
        </div>
      </div>
    </>
  );
}
