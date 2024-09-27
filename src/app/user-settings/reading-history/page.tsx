/*  - Ask about backend query also including author name for the article
   - Add Typescript types
   -  updates test data to test time filtering
  - Ask if the client side fetching for bookmarks is fine, and global css styles for scrollbar
  - What do the other icon buttons do 
*/
import ReadingDropDown from "@/components/UserSettings/dashboard/ReadingDropDown";
import getReadingHistory from "../actions/getReadingHistory";
import { ReadingHistoryType } from "../actions/getReadingHistory";
import { getServerSession } from "next-auth";

export default async function ReadingHistory() {
  const session = await getServerSession()
  const { email, userId } = session?.user

  const data: ReadingHistoryType[] = await getReadingHistory()
  console.log(data)
  const todayReadings: ReadingHistoryType & { diffInDays: number }[] = []
  const yesterdayReadings: ReadingHistoryType & { diffInDays: number }[] = []
  const pastWeekReadings: ReadingHistoryType & { diffInDays: number }[] = []

  //check dataes and calculate what array they should belong in
  //no attribute in data for read time, so just u9se published time for now and get logic down
  //does past week mean after 7 days or just any day before yesterday
  for (const reading of data) {


    const readDate = new Date(reading.story.createdAt).getTime()
    const todayDate = new Date().getTime()
    const diffInMilliseconds = todayDate - readDate
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))

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

        <li className="mb-3"> <ReadingDropDown title={'Today'} data={todayReadings} email={email} userId={userId} /> </li>
        <li className='mb-3'>  <ReadingDropDown title={'Yesterday'} data={yesterdayReadings} email={email} userId={userId} /> </li>
        <li className="mb-3">  <ReadingDropDown title={'Past Week'} data={pastWeekReadings} email={email} userId={userId} /> </li>
      </ul >

    </div >
  )
}
