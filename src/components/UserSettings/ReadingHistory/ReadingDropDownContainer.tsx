"use client";

//container that contains the tabs, (today, yesterday, past week) gets the data from server and passes it to the dropdown
import { useState } from "react";
import { type ReadingHistory as ReadingHistoryType } from "../../../app/user-settings/actions/getReadingHistory";
import ReadingDropDown from "./ReadingDropDown";

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
  yesterdayReadings,
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
    <div className="  flex h-full w-full flex-grow flex-col gap-5 overflow-hidden ">
      <ReadingDropDown
        title={"Past Week"}
        data={pastWeekReadings}
        email={email}
        brained={brained}
        bookmarked={bookmarked}
        onClick={handleClick}
        openDropDown={openDropDown}
      />
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
    </div>
  );
};
export default ReadingDropDownContainer;
