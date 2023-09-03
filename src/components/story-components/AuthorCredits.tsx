"use client";

import { type ContributionType } from "@prisma/client";
import { useContext } from "react";
import Avatar from "../Avatar";
import { PrintContext } from "./PrintContext";

interface Props {
  storyContributions: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      bio: string;
      avatarUrl: string | null;
    };
    contributionType: ContributionType;
  }[];
}

export default function AuthorCredits({ storyContributions }: Props) {
  const isPrintMode = useContext(PrintContext);

  return isPrintMode ? (
    <div>
      {storyContributions.map((element, index) => (
        <div key={element.user.id}>
          <p className="w-[calc( 100% - 1rem )] mx-2 mb-1 p-0 font-sourceSerif4 text-xl font-semibold md:mx-auto md:w-[720px]">
            {element.contributionType.slice(0, 1) +
              element.contributionType.slice(1).toLowerCase()}
            :
          </p>
          <p className="w-[calc( 100% - 1rem )] mx-2 mb-2 p-0 font-sourceSerif4 text-lg md:mx-auto md:w-[720px]">
            <span className="font-semibold">
              {" "}
              {element.user.firstName} {element.user.lastName}{" "}
            </span>
            {element.user.bio}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <>
      {storyContributions.map((element, index) => (
        <div
          //
          key={`contributor-footer-${index}`}
          className="w-[calc( 100% - 1rem )] mx-2 mb-3 flex flex-row items-stretch rounded-2xl border border-sciquelCardBorder p-3 shadow-md md:mx-auto md:w-[720px]"
        >
          <Avatar
            imageUrl={element.user.avatarUrl ?? undefined}
            label={element.user.firstName[0]}
            className="m-5"
            size="4xl"
          />
          <div className="m-5 flex flex-[2.3] flex-col">
            <p className="flex-1 font-sourceSerif4 text-xl">
              <span className="font-alegreyaSansSC text-3xl font-medium text-sciquelTeal">
                {element.user.firstName} {element.user.lastName}{" "}
              </span>
              {element.user.bio}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
