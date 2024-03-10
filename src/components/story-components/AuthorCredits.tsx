"use client";

import { type ContributionType } from "@prisma/client";
import { useContext } from "react";
import Avatar from "../Avatar";
import { PrintContext } from "./PrintContext";

interface StoryContribution {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    bio: string;
    avatarUrl: string | null;
  };
  contributionType: ContributionType;
}

interface Props {
  storyContributions: StoryContribution[];
}

export default function AuthorCredits({ storyContributions }: Props) {
  const isPrintMode = useContext(PrintContext);

  function buildPrintCredits() {
    const authors: StoryContribution[] = [];
    const animators: StoryContribution[] = [];
    const illustrators: StoryContribution[] = [];

    storyContributions.forEach((contributor) => {
      switch (contributor.contributionType) {
        case "ANIMATOR":
          animators.push(contributor);
          break;

        case "AUTHOR":
          authors.push(contributor);
          break;

        case "ILLUSTRATOR":
          illustrators.push(contributor);
          break;

        default:
          authors.push(contributor);
          break;
      }
    });

    return (
      <>
        {authors.length > 0 ? (
          <div className="w-[calc( 100% - 1rem )] mx-2 mb-2 p-0 font-sourceSerif4 text-lg md:mx-auto md:w-[768px]">
            <h1 className="font-bold">Author{authors.length > 1 ? "s" : ""}</h1>
            {authors.map((element) => (
              <p key={`footer-credits-${element.user.id}`} className="">
                <a
                  className="font-semibold"
                  href={`/contributors/${element.user.firstName.toLowerCase()}-${element.user.lastName.toLowerCase()}`}
                >
                  {" "}
                  {element.user.firstName} {element.user.lastName}{" "}
                </a>
                {element.user.bio}
              </p>
            ))}
          </div>
        ) : (
          <></>
        )}
        {illustrators.length > 0 ? (
          <div className="w-[calc( 100% - 1rem )] mx-2 mb-2 p-0 font-sourceSerif4 text-lg md:mx-auto md:w-[768px]">
            <h1 className="font-bold">
              Illustrator{illustrators.length > 1 ? "s" : ""}
            </h1>
            {illustrators.map((element) => (
              <p key={`footer-credits-${element.user.id}`}>
                <a
                  className="font-semibold"
                  href={`/contributors/${element.user.firstName.toLowerCase()}-${element.user.lastName.toLowerCase()}`}
                >
                  {" "}
                  {element.user.firstName} {element.user.lastName}{" "}
                </a>
                {element.user.bio}
              </p>
            ))}
          </div>
        ) : (
          <></>
        )}
        {animators.length > 0 ? (
          <div className="w-[calc( 100% - 1rem )] mx-2 mb-2 p-0 font-sourceSerif4 text-lg md:mx-auto md:w-[768px]">
            <h1 className="font-bold">
              Animator{animators.length > 1 ? "s" : ""}
            </h1>
            {animators.map((element) => (
              <p key={`footer-credits-${element.user.id}`}>
                <a
                  className="font-semibold"
                  href={`/contributors/${element.user.firstName.toLowerCase()}-${element.user.lastName.toLowerCase()}`}
                >
                  {" "}
                  {element.user.firstName} {element.user.lastName}{" "}
                </a>
                {element.user.bio}
              </p>
            ))}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }

  return isPrintMode ? (
    <div>
      {buildPrintCredits()}
      {/* {storyContributions.map((element, index) => (
        <div key={element.user.id} className="my-2">
          <p className="w-[calc( 100% - 1rem )] mx-2 mb-1 p-0 font-sourceSerif4 text-xl font-semibold md:mx-auto md:w-[768px]">
            {element.contributionType.slice(0, 1) +
              element.contributionType.slice(1).toLowerCase()}
            :
          </p>
          <p className="w-[calc( 100% - 1rem )] mx-2 mb-2 p-0 font-sourceSerif4 text-lg md:mx-auto md:w-[768px]">
            <a
              className="font-semibold"
              href={`/contributors/${element.user.firstName.toLowerCase()}-${element.user.lastName.toLowerCase()}`}
            >
              {" "}
              {element.user.firstName} {element.user.lastName}{" "}
            </a>
            {element.user.bio}
          </p>
        </div>
      ))} */}
    </div>
  ) : (
    <div className="mb-8">
      {storyContributions.map((element, index) => (
        <div
          //
          key={`contributor-footer-${index}`}
          className="w-[calc( 100% - 1rem )] mx-2 mb-4 flex flex-row items-stretch rounded-2xl border border-sciquelCardBorder p-3 shadow-md md:mx-auto md:w-[768px]"
        >
          <Avatar
            imageUrl={element.user.avatarUrl ?? undefined}
            label={element.user.firstName[0]}
            className="m-5"
            size="4xl"
          />
          <div className="m-5 flex flex-[2.3] flex-col">
            <p className="flex-1 font-sourceSerif4 text-xl">
              <a
                className="font-alegreyaSansSC text-2xl font-medium text-sciquelTeal"
                href={`/contributors/${element.user.firstName.toLowerCase()}-${element.user.lastName.toLowerCase()}`}
              >
                {element.user.firstName} {element.user.lastName}{" "}
              </a>

              {element.user.bio}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
