/*  - Ask about backend query also including author name for the article
   - Add Typescript types
   -  updates test data to test time filtering
  - What do the other icon buttons do 
  -- imported type does not contain some needed attributes
  
*/
import ReadingDropDown from "@/components/UserSettings/dashboard/ReadingDropDown";
import getReadingHistory from "../actions/getReadingHistory";
import { ReadingHistory as ReadingHistoryType } from "../actions/getReadingHistory";
import { getServerSession } from "next-auth";
import axios from "axios";
import env from "@/lib/env";

export default async function ReadingHistory() {
  const session = await getServerSession()
  const email: string = session?.user?.email || ''

  //get the brained ids and bookmark ids and then pass it to the client componenet 
  const getBookMarkedReadingsIds = async () => {
    try {
      const response = await axios.get(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark/latest`, {
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
      const response = await axios.get(`${env.NEXT_PUBLIC_SITE_URL}/api/user/brains/latest`, {
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

  const data: ReadingHistoryType = await getReadingHistory()

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
    <div className="flex flex-col flex-grow mr-36">

      <h2 className='ml-8 mt-8 text-2xl mb-10 font-bold ' > Reading History </h2>
      {data.length === 0 && <p> You have nothing Read Recently </p>}


      <ul className="ml-20 ">

        <li className="mb-3"> <ReadingDropDown title={'Today'} data={todayReadings} email={email} brained={BrainedReadingIds} bookmarked={BookmarkedReadingsIds} /> </li>
        <li className='mb-3'>  <ReadingDropDown title={'Yesterday'} data={yesterdayReadings} email={email} brained={BrainedReadingIds} bookmarked={BookmarkedReadingsIds} /> </li>
        <li className="mb-3">  <ReadingDropDown title={'Past Week'} data={pastWeekReadings} email={email} brained={BrainedReadingIds} bookmarked={BookmarkedReadingsIds} /> </li>
      </ul >

    </div >
  )
}
