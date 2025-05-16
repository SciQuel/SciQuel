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
  // Add this at the top of your file or in a separate mock data file for testing purposes.

  // Add this at the top of your file or in a separate mock data file for testing purposes.

  // Replace your `data` array with this updated structure
  const data = [
    {
      id: "6488c6f6f5f617c772f6f61a",
      story: {
        storyType: "DIGEST",
        category: "ARTICLE",
        title: "Test title",
        titleColor: "#FF5733",
        slug: "the-wonders-of-astronomy",
        summary: "Explore the vast universe and its mysteries.",
        summaryColor: "#C70039",
        tags: ["ASTRONOMY", "SCIENCE"],
        published: true,
        thumbnailUrl: "https://example.com/astronomy-thumbnail.jpg",
        coverCaption: "A breathtaking view of the Milky Way.",
        createdAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 10 days ago
        publishedAt: new Date(
          Date.now() - 9 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 9 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      },
    },
    {
      id: "66eb375020f5a6e81d8f2455",
      story: {
        storyType: "ESSAY",
        category: "PODCAST",
        title: "Test Title",
        slug: "the-future-of-technology",
        summary: "A deep dive into emerging technologies.",
        summaryColor: "#39C7C7",
        tags: ["TECHNOLOGY", "INNOVATION"],
        published: true,
        thumbnailUrl: "https://example.com/technology-thumbnail.jpg",
        coverCaption: "A glimpse into the future of AI.",
        createdAt: new Date(
          Date.now() - 20 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 20 days ago
        publishedAt: new Date(
          Date.now() - 19 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 19 days ago
        updatedAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 10 days ago
      },
    },
    {
      id: "story3",
      story: {
        storyType: "DIGEST",
        category: "ARTICLE",
        title: "Advancements in Medicine",
        titleColor: "#5733FF",
        slug: "advancements-in-medicine",
        summary: "How technology is transforming healthcare.",
        summaryColor: "#C739C7",
        tags: ["MEDICINE", "HEALTHCARE"],
        published: true,
        thumbnailUrl: "https://example.com/medicine-thumbnail.jpg",
        coverCaption: "A new era of medical breakthroughs.",
        createdAt: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 30 days ago
        publishedAt: new Date(
          Date.now() - 29 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 29 days ago
        updatedAt: new Date(
          Date.now() - 15 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 15 days ago
      },
    },
    {
      id: "story4",
      story: {
        storyType: "ESSAY",
        category: "PODCAST",
        title: "Exploring Psychology",
        titleColor: "#FF33A1",
        slug: "exploring-psychology",
        summary: "Understanding the human mind and behavior.",
        summaryColor: "#C73357",
        tags: ["PSYCHOLOGY", "SCIENCE"],
        published: true,
        thumbnailUrl: "https://example.com/psychology-thumbnail.jpg",
        coverCaption: "The complexities of the human brain.",
        createdAt: new Date(
          Date.now() - 40 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 40 days ago
        publishedAt: new Date(
          Date.now() - 39 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 39 days ago
        updatedAt: new Date(
          Date.now() - 20 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 20 days ago
      },
    },
  ];

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

  const [BrainedReadingIds, BookmarkedReadingsIds] = await Promise.all([
    getBrainedReadingsIds(),
    getBookMarkedReadingsIds(),
    // getReadingHistory() as Promise<ReadingHistoryType>,
  ]);

  //initalize arrays for certain readings, fix to contain just on arr of objects instead of seperate lists
  const todayReadings: ReadingHistoryType & { diffInDays: number }[] = [];
  const yesterdayReadings: ReadingHistoryType & { diffInDays: number }[] = [];
  const pastWeekReadings: ReadingHistoryType & { diffInDays: number }[] = [];

  for (const reading of data) {
    //find the differnce in days from the read date
    const readDate = new Date(reading.story.createdAt).getTime();
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

  console.log("todayReadings", todayReadings);
  console.log("yesterdayReadings", yesterdayReadings);
  console.log("pastWeekReadings", pastWeekReadings);
  console.log("readings", data);

  return (
    <div className=" flex w-full flex-col pr-36 ">
      <h2 className="mb-10 ml-8 mt-8 text-3xl font-bold "> Reading History </h2>
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
