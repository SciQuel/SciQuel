"use client";

import { type Stories } from "@/app/api/stories/route";
import { type ContributionType } from "@prisma/client";
import { useContext } from "react";
import MoreCard from "../MoreCard";
import AuthorCredits from "./AuthorCredits";
import FromThisSeries from "./FromThisSeries";
import { PrintContext } from "./PrintContext";

interface Props {
  storyContributions: {
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
  }[];

  articles1: Stories;
  articles2: Stories;
}

export default function StoryFooter({
  storyContributions,
  articles1,
  articles2,
}: Props) {
  const isPrintMode = useContext(PrintContext);

  return (
    <>
      {isPrintMode ? (
        <div className="w-100 mb-2">
          <AuthorCredits storyContributions={storyContributions} />
        </div>
      ) : (
        <>
          <AuthorCredits storyContributions={storyContributions} />
          <FromThisSeries />
          <MoreCard articles1={articles1} articles2={articles2} />
        </>
      )}
    </>
  );
}
