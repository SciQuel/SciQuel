import { type GetStoryResult } from "@/app/api/stories/id/[id]/route";
import {
  type GetLatestBookmarkRes as Bookmarks,
  type GetLatestBookmarkRes,
} from "@/app/api/user/bookmark/latest/route";
import {
  type GetLatestBrainsRes as Brained,
  type GetLatestBrainsRes,
} from "@/app/api/user/brains/latest/route";
import SavedPage from "@/components/UserSettings/SavedPage";
import env from "@/lib/env";
import axios, { type AxiosResponse } from "axios";
import { getServerSession } from "next-auth";

export default async function SavedPaged() {
  const session = await getServerSession();

  const email = session?.user.email;

  //fetch data
  const fetchBrainedIds = async () => {
    const response: AxiosResponse<GetLatestBrainsRes> = await axios.get(
      `${env.NEXT_PUBLIC_SITE_URL}/api/user/brains/latest`,
      {
        params: {
          user_email: email,
          page_size: 100,
        },
      },
    );
    return response.data.map((story: Brained[number]) => story.storyId);
  };
  const data = await fetchBrainedIds();

  //get brained stores from brained ids
  let BrainedStories: GetStoryResult[] = await Promise.all(
    data.map(async (id: string) => {
      const resp: AxiosResponse<GetStoryResult> = await axios.get(
        `${env.NEXT_PUBLIC_SITE_URL}/api/stories/id/${id}`,
      );
      return resp.data;
    }),
  );

  //get bookimarked data
  const getBookmarkedIds = async () => {
    const resp: AxiosResponse<GetLatestBookmarkRes> = await axios.get(
      `${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark/latest`,
      {
        params: {
          user_email: email,
          page_size: 100,
        },
      },
    );

    return resp.data.map((story: Bookmarks[number]) => story.storyId);
  };

  const bookMarkedIds = await getBookmarkedIds();

  let bookMarkedStories: GetStoryResult[] = await Promise.all(
    bookMarkedIds.map(async (id: string) => {
      const resp: AxiosResponse<GetStoryResult> = await axios.get(
        `${env.NEXT_PUBLIC_SITE_URL}/api/stories/id/${id}`,
      );

      return resp.data;
    }),
  );

  const convertDatesInStories = (stories: GetStoryResult[]) => {
    const result = stories.map((story) => ({
      ...story,
      publishedAt: new Date(story.publishedAt),
    }));
    return result;
  };

  bookMarkedStories = convertDatesInStories(bookMarkedStories);
  BrainedStories = convertDatesInStories(BrainedStories);

  return (
    <div className="mx-10 h-full w-full">
      <SavedPage
        brainedStories={BrainedStories}
        bookmarkData={bookMarkedStories}
        definitions={"empty"}
      />
    </div>
  );
}
