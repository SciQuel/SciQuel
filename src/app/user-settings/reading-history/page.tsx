import ReadingDropDownContainer from "@/components/UserSettings/ReadingHistory/ReadingDropDownContainer";
import getReadingHistory from "../actions/getReadingHistory";
import { ReadingHistory as ReadingHistoryType } from "../actions/getReadingHistory";
import { getServerSession } from "next-auth";
import { GetLatestBookmarkRes } from "@/app/api/user/bookmark/latest/route";
import { GetLatestBrainsRes } from "@/app/api/user/brains/latest/route";
import axios from "axios";
import env from "@/lib/env";


export default async function ReadingHistory() {
  const session = await getServerSession()
  const email: string = session?.user?.email || ''



  //get the brained ids and bookmark ids and then pass it to the client componenet 
  const getBookMarkedReadingsIds = async () => {
    try {
      const response = await axios.get<GetLatestBookmarkRes>(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark/latest`, {
        params: {
          user_email: email,
          page_size: 100 //what can i pass as page size parameter
        }
      })
      return response.data.map(bookmarked => bookmarked.storyId)
    } catch (err: any) {
      console.error(err.message)
      throw err
    }
  }

  const getBrainedReadingsIds = async () => {
    try {
      const response = await axios.get<GetLatestBrainsRes>(`${env.NEXT_PUBLIC_SITE_URL}/api/user/brains/latest`, {
        params: {
          user_email: email,
          page_size: 100
        }
      })
      return response.data.map(brained => brained.storyId)
    } catch (err) {
      console.error(err)
      throw err
    }
  }


  const [BrainedReadingIds, BookmarkedReadingsIds] = await Promise.all([
    getBrainedReadingsIds(), getBookMarkedReadingsIds()
  ])


  //get reading history
  const data: ReadingHistoryType = await getReadingHistory()


  //initalize arrays for certain readings, fix to contain just on arr of objects instead of seperate lists
  const todayReadings: ReadingHistoryType & { diffInDays: number }[] = []
  const yesterdayReadings: ReadingHistoryType & { diffInDays: number }[] = []
  const pastWeekReadings: ReadingHistoryType & { diffInDays: number }[] = []



  for (const reading of data) {

    //find the differnce in days from the read date
    const readDate = new Date(reading.createdAt).getTime()
    const todayDate = new Date().getTime()
    const diffInMilliseconds = todayDate - readDate
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))


    //compare and add to corresponding array
    if (diffInDays === 0) {
      todayReadings.push({ ...reading, diffInDays })
    } else if (diffInDays === 1) {
      yesterdayReadings.push({ ...reading, diffInDays })
    } else if (diffInDays >= 7) {
      pastWeekReadings.push({ ...reading, diffInDays })
    }
  }




  return (
    <div className=" h-screen flex-grow overflow-y-auto pr-36 ">

      <h2 className='ml-8 mt-8 text-3xl mb-10 font-bold ' > Reading History </h2>
      <ReadingDropDownContainer pastWeekReadings={pastWeekReadings} yesterdayReadings={yesterdayReadings} todayReadings={todayReadings} email={email} brained={BrainedReadingIds} bookmarked={BookmarkedReadingsIds} />

    </div >
  )
}
