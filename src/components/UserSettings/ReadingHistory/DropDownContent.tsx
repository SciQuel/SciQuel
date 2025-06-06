/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
'use client";';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Bookmark from "../../../../public/assets/images/bookmark-final.svg";
import Lightbulb from "../../../../public/assets/images/oi-lightbulb.svg";
import shareIcon from "../../../../public/assets/images/story-share.png";
import { type ReadingHistory as ReadingHistoryType } from "../../../app/user-settings/actions/getReadingHistory";
import ShareDropDown from "./ShareDropDown";

interface Props {
  data: ReadingHistoryType;
  bookMarkedReadingsIds: string[];
  brainedReadingIds: string[];
  handleBrainClick: (storyId: string) => Promise<void>;
  handleBookmarkClick: (storyId: string) => Promise<void>;
}

const DropDownContent: React.FC<Props> = ({
  data,
  bookMarkedReadingsIds,
  brainedReadingIds,
  handleBrainClick,
  handleBookmarkClick,
}) => {
  const [activeSharePopup, setActiveSharePopup] = useState<number | "">("");
  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleShareClick = (storyId: number) => {
    setActiveSharePopup(storyId);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setActiveSharePopup("");
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [activeSharePopup]);
  return (
    <>
      <ul className=" scrollbar-cyan mb-2 overflow-x-visible overflow-y-scroll">
        {data?.length === 0 && (
          <p className="text-md font-bold"> No Readings </p>
        )}
        {data?.map((reading) => (
          <li className="relative mb-5" key={crypto.randomUUID()}>
            <div className="flex items-center gap-7">
              <img
                src={reading?.story?.thumbnailUrl}
                alt={`Thumbnail of ${reading.story.title}`}
                className="h-20 w-20 rounded-md object-cover"
              />
              <div className=" flex-grow basis-0">
                <Link
                  href={`/stories/${new Date(
                    reading.createdAt,
                  ).getUTCFullYear()}/${
                    new Date(reading.createdAt).getUTCMonth() + 1
                  }/${new Date(reading.createdAt).getUTCDate()}/${
                    reading.story.slug
                  }`}
                >
                  <p className="font-bold">{reading.story.title}</p>
                </Link>
                <p className="text-sm font-light">{`By ${reading.story.title}`}</p>
                <p className="text-sm font-light">{`Viewed ${reading.diffInDays} days ago`}</p>
              </div>

              {/* Icons */}
              <div className="relative flex flex-col">
                <div className="relative ml-auto mr-5 flex items-center ">
                  <Bookmark
                    fill={`${
                      bookMarkedReadingsIds.includes(reading.story.id)
                        ? "yellow"
                        : "none"
                    }`}
                    width="50px"
                    height="20px"
                    role="button"
                    onClick={() => handleBookmarkClick(reading.story.id)}
                  />

                  <Lightbulb
                    role="button"
                    onClick={() => handleBrainClick(reading.story.id)}
                    width={`${brainedReadingIds.includes(reading.story.id)}`}
                    height="20px"
                  />
                  <div className=" relative flex items-center justify-center">
                    <button
                      onClick={() => handleShareClick(reading.id)}
                      className=""
                    >
                      <Image src={shareIcon} alt="share a link to this story" />
                      <span className="sr-only">
                        share a link to this story
                      </span>
                    </button>
                  </div>
                </div>
                {activeSharePopup === reading.id && (
                  <ShareDropDown popupRef={popupRef} />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
export default DropDownContent;
