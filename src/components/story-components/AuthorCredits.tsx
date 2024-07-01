"use client";

import { type ContributionType } from "@prisma/client";
import { useContext } from "react";
import Avatar from "../Avatar";
import { PrintContext } from "./PrintContext";

interface StoryContribution {
  contributor: {
    id: string;
    firstName: string;
    lastName: string;
    contributorSlug: string;
    avatarUrl: string | null;
  };
  contributionType: ContributionType;
  otherContributorType?: string;
  otherContributorCredit?: string;
  contributorByline?: string;
  bio: string | null;
}

const contributorPrefixMap = {
  AUTHOR: {
    prefix: "Authors",
  },
  ILLUSTRATOR: {
    prefix: "Illustrators",
  },
  ANIMATOR: {
    prefix: "Animators",
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

interface Props {
  storyContributions: StoryContribution[];
}

export default function AuthorCredits({ storyContributions }: Props) {
  const isPrintMode = useContext(PrintContext);

  function buildPrintContributors() {
    const contributorMap = {
      AUTHOR: [],
      ILLUSTRATOR: [],
      ANIMATOR: [],
    } as {
      [key: string]: {
        name: string;
        icon: string | null;
        slug: string;
        bio: string;
      }[];
    };

    const otherMap = {} as {
      [key: string]: {
        name: string;
        icon: string | null;
        slug: string;
        otherContributionPrefix: string;
        bio: string;
      }[];
    };

    storyContributions.forEach((contributor) => {
      switch (contributor.contributionType) {
        case "AUTHOR":
          contributorMap.AUTHOR.push({
            name: `${contributor.contributor.firstName} ${contributor.contributor.lastName}`,
            icon: contributor.contributor.avatarUrl,
            slug: contributor.contributor.contributorSlug,
            bio: contributor.bio ?? contributor.contributorByline ?? "",
          });

          break;
        case "ILLUSTRATOR":
          contributorMap.ILLUSTRATOR.push({
            name: `${contributor.contributor.firstName} ${contributor.contributor.lastName}`,
            icon: contributor.contributor.avatarUrl,
            slug: contributor.contributor.contributorSlug,
            bio: contributor.bio ?? contributor.contributorByline ?? "",
          });
          break;
        case "ANIMATOR":
          contributorMap.ANIMATOR.push({
            name: `${contributor.contributor.firstName} ${contributor.contributor.lastName}`,
            icon: contributor.contributor.avatarUrl,
            slug: contributor.contributor.contributorSlug,
            bio: contributor.bio ?? contributor.contributorByline ?? "",
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
              bio: contributor.bio ?? contributor.contributorByline ?? "",
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
                bio: contributor.bio ?? contributor.contributorByline ?? "",
              },
            ];
          }
          break;
      }
    });

    return (
      <>
        {Object.keys(contributorMap).map((contributionType) => {
          const contributors = contributorMap[contributionType];
          if (contributors.length > 0) {
            return (
              <div
                key={contributionType}
                className="w-[calc( 100% - 1rem )] mx-2 mb-2 p-0 font-sourceSerif4 text-lg md:mx-auto md:w-[768px]"
              >
                <h1 className="font-bold">
                  {
                    contributorPrefixMap[
                      contributionType as "AUTHOR" | "ILLUSTRATOR" | "ANIMATOR"
                    ].prefix
                  }
                  {contributors.length > 1 ? "s" : ""}
                </h1>
                {contributors.map((element) => (
                  <p key={`footer-credits-${element.slug}`} className="">
                    <a
                      className="font-semibold"
                      href={`/profile/${element.slug}`}
                    >
                      {" "}
                      {element.name}{" "}
                    </a>
                    {element.bio}
                  </p>
                ))}
              </div>
            );
          }
          return <></>;
        })}
        {Object.keys(otherMap).map((contributionType) => {
          const contributors = otherMap[contributionType];

          return (
            <div
              key={contributionType}
              className="w-[calc( 100% - 1rem )] mx-2 mb-2 p-0 font-sourceSerif4 text-lg md:mx-auto md:w-[768px]"
            >
              <h1 className="font-bold">
                {contributors[0]
                  ? contributors[0].otherContributionPrefix
                  : "Other contributor"}
                {contributors.length > 1 ? "s" : ""}
              </h1>
              {contributors.map((element) => (
                <p key={`footer-credits-${element.slug}`} className="">
                  <a
                    className="font-semibold"
                    href={`/profile/${element.slug}`}
                  >
                    {" "}
                    {element.name}{" "}
                  </a>
                  {element.bio}
                </p>
              ))}
            </div>
          );
        })}
      </>
    );
  }

  return isPrintMode ? (
    <div>{buildPrintContributors()}</div>
  ) : (
    <div className="mb-8">
      {storyContributions.map((element, index) => (
        <div
          //
          key={`contributor-footer-${index}`}
          className="w-[calc( 100% - 1rem )] mx-2 mb-4 flex flex-row items-stretch rounded-2xl border border-sciquelCardBorder p-3 shadow-md md:mx-auto md:w-[768px]"
        >
          <Avatar
            imageUrl={element.contributor.avatarUrl ?? undefined}
            label={element.contributor.firstName[0]}
            className="m-5"
            size="4xl"
          />
          <div className="m-5 flex flex-[2.3] flex-col">
            <p className="flex-1 font-sourceSerif4 text-xl">
              <a
                className="font-alegreyaSansSC text-3xl font-medium text-sciquelTeal"
                href={`/profile/${element.contributor.contributorSlug}`}
              >
                {element.contributor.firstName} {element.contributor.lastName}{" "}
              </a>

              {element.bio ?? element.contributorByline ?? ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
