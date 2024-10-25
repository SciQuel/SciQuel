"use client";

import { useState } from "react";
import ReadingDropDown from "./ReadingDropDown";
import { ReadingHistory as ReadingHistoryType } from "../../../app/user-settings/actions/getReadingHistory";

interface Props {
  email: string;
  brained: string[];
  bookmarked: string[];
  pastWeekReadings: ReadingHistoryType & { diffInDays: number }[];
  todayReadings: ReadingHistoryType & { diffInDays: number }[];
  yesterdayReadings: ReadingHistoryType & { diffInDays: number }[];
}
const ReadingDropDownContainer: React.FC<Props> = ({
  pastWeekReadings,
  email,
  brained,
  bookmarked,
  todayReadings,
  yesterdayReadings
}) => {

  const [openDropDown, setOpenDropDown] = useState("");
  const handleClick = (title: string) => {
    if (openDropDown === title) {
      setOpenDropDown("");
    } else {
      setOpenDropDown(title);
    }
  };
  return (
    <div className="ml-20 flex h-full flex-col gap-5  ">
      <ReadingDropDown
        title={"Today"}
        data={todayReadings}
        email={email}
        brained={brained}
        bookmarked={bookmarked}
        onClick={handleClick}
        openDropDown={openDropDown}
      />
      <ReadingDropDown
        title={"Yesterday"}
        data={yesterdayReadings}
        email={email}
        brained={brained}
        bookmarked={bookmarked}
        onClick={handleClick}
        openDropDown={openDropDown}
      />
      <ReadingDropDown
        title={"Past Week"}
        data={pastWeekReadings}
        email={email}
        brained={brained}
        bookmarked={bookmarked}
        onClick={handleClick}
        openDropDown={openDropDown}
      />
    </div>
  );
};
export default ReadingDropDownContainer;
