//navbar is  not responsive

import axios from "axios"
import env from "@/lib/env"
import { type Stories } from "@/app/api/stories/route";
import { getServerSession } from "next-auth";
import SavedPage from "@/components/UserSettings/SavedPage";
import { type GetLatestBookmarkRes as Bookmarks } from "@/app/api/user/bookmark/latest/route";
import { type GetLatestBrainsRes as Brained } from "@/app/api/user/brains/latest/route";

export default async function SavedPaged() {

  const session = await getServerSession()

  const email = session?.user.email

  //fetch data
  const fetchBrainedIds = async () => {
    const response = await axios.get(`${env.NEXT_PUBLIC_SITE_URL}/api/user/brains/latest`, {
      params: {
        user_email: email,
        page_size: 10
      }

    })
    return response.data.map((story: Brained[number]) => story.storyId)

  }
  const data = await fetchBrainedIds()
  let BrainedStories: Stories = await Promise.all(
    data.map(async (id: string) => {
      const resp = await axios.get(`${env.NEXT_PUBLIC_SITE_URL}/api/stories/id/${id}`)
      return resp.data
    })
  )



  //get bookimarked data
  const getBookmarkedIds = async () => {
    const resp = await axios.get(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark/latest`, {
      params: {
        user_email: email,
        page_size: 20
      }

    })


    console.log(resp.data)
    return resp.data.map((story: Bookmarks[number]) => story.storyId)
  }

  const bookMarkedIds = await getBookmarkedIds()

  let bookMarkedStories = await Promise.all(
    bookMarkedIds.map(async (id: string) => {
      const resp = await axios.get(`${env.NEXT_PUBLIC_SITE_URL}/api/stories/id/${id}`)

      return resp.data

    })
  )


  //can this function be in seperate file???
  const convertDatesInStories = (stories: Stories) => {
    const result = stories.map((story) => ({
      ...story, publishedAt: new Date(story.publishedAt),



    }))
    return result
  }


  bookMarkedStories = convertDatesInStories(bookMarkedStories)
  BrainedStories = convertDatesInStories(BrainedStories)


  return (
    <div className="w-full mx-10">

      <SavedPage brainedStories={BrainedStories} bookmarkData={bookMarkedStories} definitions={'empty'} />
    </div>
  )

}