"use client";

import env from "@/lib/env";
import axios from "axios";
import { useState } from "react";
import { type ReadingHistory as ReadingHistoryType } from "../../../app/user-settings/actions/getReadingHistory";
import DropDownContent from "./DropDownContent";
import DropDownTabs from "./DropDownTabs";

interface PropTypes {
  data: ReadingHistoryType & { diffInDays: number }[];
  title: string;
  email: string;
  brained: string[];
  bookmarked: string[];
  openDropDown: string;
  onClick: (title: string) => void;
}

const ReadingDropDown: React.FC<PropTypes> = ({
  data,
  title,
  email,
  brained,
  bookmarked,
  openDropDown,
  onClick,
}) => {
  const [bookMarkedReadingsIds, setBookMarkedReadingsIds] = useState([
    ...bookmarked,
  ]);
  const [brainedReadingIds, setBrainedReadingsIds] = useState([...brained]);

  const handleBookmarkClick = async (storyId: string) => {
    //checck if user has the reading bookmarked
    const isCurrentlyBookmarked = bookMarkedReadingsIds.includes(storyId);

    if (!isCurrentlyBookmarked) {
      setBookMarkedReadingsIds([...bookMarkedReadingsIds, storyId]);
      try {
        await axios.post(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark`, {
          story_id: storyId,
          user_email: email,
        });
      } catch (error) {
        console.error(error);
        setBookMarkedReadingsIds(
          bookMarkedReadingsIds.filter((id) => id != storyId),
        );
      }
    }

    if (isCurrentlyBookmarked) {
      setBookMarkedReadingsIds(
        bookMarkedReadingsIds.filter((id) => id != storyId),
      );
      try {
        await axios.delete(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark`, {
          params: {
            story_id: storyId,
            user_email: email,
          },
        });
      } catch (error) {
        console.error(error);
        setBookMarkedReadingsIds([...bookMarkedReadingsIds, storyId]);
      }
    }
  };

  const handleBrainClick = async (storyId: string) => {
    const isBrained = brainedReadingIds.includes(storyId);
    if (isBrained) {
      setBrainedReadingsIds(brainedReadingIds.filter((id) => id != storyId));
      try {
        await axios.delete(`${env.NEXT_PUBLIC_SITE_URL}/api/user/brains`, {
          params: {
            story_id: storyId,
            user_email: email,
          },
        });
      } catch (err) {
        console.error(err);
        setBrainedReadingsIds([...brainedReadingIds, storyId]);
      }
    }
    if (!isBrained) {
      setBrainedReadingsIds([...brainedReadingIds, storyId]);
      try {
        await axios.post(`${env.NEXT_PUBLIC_SITE_URL}/api/user/brains`, {
          story_id: storyId,
          user_email: email,
        });
      } catch (err) {
        console.error(err);
        setBrainedReadingsIds(brainedReadingIds.filter((id) => id != storyId));
      }
    }
  };

  return (
    <>
      <DropDownTabs
        openDropDown={openDropDown}
        title={title}
        onClick={onClick}
      />

      {openDropDown === title && (
        <DropDownContent
          data={data}
          bookMarkedReadingsIds={bookMarkedReadingsIds}
          brainedReadingIds={brainedReadingIds}
          handleBookmarkClick={handleBookmarkClick}
          handleBrainClick={handleBrainClick}
        />
      )}
    </>
  );
};

export default ReadingDropDown;
