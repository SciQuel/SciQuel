/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Bookmark from "../../../../public/assets/images/bookmark-final.svg";
import Lightbulb from "../../../../public/assets/images/oi-lightbulb.svg";
import shareIcon from "../../../../public/assets/images/story-share.png";
import { type ReadingHistory as ReadingHistoryType } from "../../../app/user-settings/actions/getReadingHistory";
import ShareDropDown from './ShareDropDown';

interface Props {
  data: (ReadingHistoryType[number] & { diffInDays: number })[];
  bookMarkedReadingsIds: string[];
  brainedReadingIds: string[];
  handleBrainClick: (storyId: string) => Promise<void>;
  handleBookmarkClick: (storyId: string) => Promise<void>;
}

const DropDownContent: React.FC<Props> = ({
  data,
  bookMarkedReadingsIds,
  handleBrainClick,
  handleBookmarkClick,
}) => {
  const [activeSharePopup, setActiveSharePopup] = useState<string | "">("");
  const popupRefs: React.MutableRefObject<Record<string, React.RefObject<HTMLDivElement>>> = useRef({});

  const handleShareClick = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    setActiveSharePopup(storyId);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!activeSharePopup) return;
      const activeRef = popupRefs?.current?.[activeSharePopup];
      if (activeRef && !activeRef?.current?.contains(e.target as Node)) {
        setActiveSharePopup("");
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [activeSharePopup]);

  const bookMarkedReadings = useMemo(() =>
    data.map((reading) => ({ ...reading, uuid: crypto.randomUUID() })),
    [data]
  );

  const iconButtonClass =
    " flex h-[30px] w-[30px]  md:h-[40px] md:w-[40px] p-1 md:p-2 justify-center items-center rounded-full bg-[#76a89f] transition ease-linear";

  return (
    <div className="z-50  max-h-full overflow-y-scroll scrollbar-cyan mb-2">
      <ul className="h-full mr-3 relative">
        {data?.length === 0 && (
          <p className="text-md font-bold">No Readings</p>
        )}
        {bookMarkedReadings?.map((reading) => (
          <li className="h-auto min-h-[35%] mb-2 relative" key={reading.uuid}>
            <div className="flex justify-between py-2 gap-7">
              {/* Image + Text */}
              <div className="flex gap-3">
                <img
                  src={reading?.story?.thumbnailUrl}
                  alt={`Thumbnail of ${reading.story.title}`}
                  className="h-20 w-20 rounded-md object-cover"
                />
                <div className="line-clamp-5">
                  <Link
                    href={`/stories/${new Date(reading.createdAt).getUTCFullYear()}/${new Date(
                      reading.createdAt
                    ).getUTCMonth() + 1}/${new Date(
                      reading.createdAt
                    ).getUTCDate()}/${reading.story.slug}`}
                  >
                    <p className="font-bold">{reading.story.title}</p>
                  </Link>
                  <p className="text-sm font-light">By {reading.story.title}</p>
                  <p className="text-sm font-light">
                    Viewed {reading.diffInDays} days ago
                  </p>
                </div>
              </div>

              {/* Icon Buttons */}
              <div className="flex flex-col gap-2 items-center justify-center relative">
                <div>
                  <div className="flex justify-end  gap-3">
                    {/* Bookmark Button */}
                    <button
                      className={iconButtonClass}
                      onClick={() => handleBookmarkClick(reading.story.id)}
                    >
                      <Bookmark
                        className="w-full h-full max-w-[20px] max-h-[20px] md:max-w-[25px] md:max-h-[25px]"
                        fill={
                          bookMarkedReadingsIds.includes(reading.story.id)
                            ? "yellow"
                            : "none"
                        }
                        role="button"
                      />
                    </button>

                    {/* Brain Button */}
                    <button
                      className={iconButtonClass}
                      onClick={() => handleBrainClick(reading.story.id)}
                    >
                      <Lightbulb
                        className="w-full h-full max-w-[20px] max-h-[20px] md:max-w-[25px] md:max-h-[25px]"
                        role="button"
                      />
                    </button>

                    {/* Share Button */}
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(e) => handleShareClick(e, reading.uuid)}
                        className={iconButtonClass}
                      >
                        <Image
                          src={shareIcon}
                          alt="share a link to this story"
                          className="w-full h-full max-w-[20px] max-h-[20px] md:max-w-[25px] md:max-h-[25px] object-contain"
                        />
                        <span className="sr-only">
                          share a link to this story
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Share Popup */}
                  <ShareDropDown
                    activeSharePopup={activeSharePopup}
                    popupRefs={popupRefs}
                    reading={reading}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropDownContent;
