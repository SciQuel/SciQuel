import { type GetLatestBookmarkRes } from "@/app/api/user/bookmark/latest/route";
import { type GetLatestBrainsRes } from "@/app/api/user/brains/latest/route";
import ReadingDropDownContainer from "@/components/UserSettings/ReadingHistory/ReadingDropDownContainer";
import env from "@/lib/env";
import axios from "axios";
import { getServerSession } from "next-auth";
import getReadingHistory, {
  type ReadingHistory as ReadingHistoryType,
} from "../actions/getReadingHistory";

export default async function ReadingHistory() {
  const session = await getServerSession();
  const email: string = session?.user?.email || "";

  //get the brained ids and bookmark ids and then pass it to the client componenet
  const getBookMarkedReadingsIds = async () => {
    try {
      const response = await axios.get<GetLatestBookmarkRes>(
        `${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark/latest`,
        {
          params: {
            user_email: email,
            page_size: 100, //what can i pass as page size parameter
          },
        },
      );
      return response.data.map((bookmarked) => bookmarked.storyId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        throw err;
      } else {
        console.error("unknown error occured");
        throw new Error("unknown error occured");
      }
    }
  };

  const getBrainedReadingsIds = async () => {
    try {
      const response = await axios.get<GetLatestBrainsRes>(
        `${env.NEXT_PUBLIC_SITE_URL}/api/user/brains/latest`,
        {
          params: {
            user_email: email,
            page_size: 100,
          },
        },
      );
      return response.data.map((brained) => brained.storyId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const [BrainedReadingIds, BookmarkedReadingsIds, readingHistory] =
    await Promise.all([
      getBrainedReadingsIds(),
      getBookMarkedReadingsIds(),
      getReadingHistory() as Promise<ReadingHistoryType>,
    ]);

  //initalize arrays for certain readings, fix to contain just on arr of objects instead of seperate lists
  const todayReadings: ReadingHistoryType & { diffInDays: number }[] = [];
  const yesterdayReadings: ReadingHistoryType & { diffInDays: number }[] = [];
  const pastWeekReadings: ReadingHistoryType & { diffInDays: number }[] = [];

  for (const reading of readingHistory) {
    //find the differnce in days from the read date
    const readDate = new Date(reading.createdAt).getTime();
    const todayDate = new Date().getTime();
    const diffInMilliseconds = todayDate - readDate;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    //compare and add to corresponding array
    if (diffInDays === 0) {
      todayReadings.push({ ...reading, diffInDays });
    } else if (diffInDays === 1) {
      yesterdayReadings.push({ ...reading, diffInDays });
    } else if (diffInDays >= 7) {
      pastWeekReadings.push({ ...reading, diffInDays });
    }
  }

  // console.log("todayReadings", todayReadings);
  // console.log("yesterdayReadings", yesterdayReadings);
  // console.log("pastWeekReadings", pastWeekReadings);
  // console.log("readings", data);

  return (
    <div className=" flex w-full flex-col xs:px-2 md:px-6  ">
      <h2 className="mb-10 mt-8 text-3xl font-bold "> Reading History </h2>
      <ReadingDropDownContainer
        pastWeekReadings={pastWeekReadings}
        yesterdayReadings={yesterdayReadings}
        todayReadings={todayReadings}
        email={email}
        brained={BrainedReadingIds}
        bookmarked={BookmarkedReadingsIds}
      />
    </div>
  );
}
