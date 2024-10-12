'use client'
import ArticleList from "../ArticleList"
import { useState, useEffect } from "react"
import { type Story } from "@prisma/client"

interface Props {
  brainedStories: Story,
  bookmarkData: Story,
  definition: any
}

type Orders = "asc" | "desc"

const SavedPage = ({ brainedStories, bookmarkData, definitions }: Props) => {
  const [topic, setTopic] = useState('brain')
  const [sortOrder, setSortOrder] = useState<Orders>('asc')
  const [sortedData, setSortedData] = useState<Story[]>([])
  let articlesToSort: Story
  useEffect(() => {

    switch (topic) {
      case 'brain':
        articlesToSort = brainedStories;

        break;
      case 'bookmark':
        articlesToSort = bookmarkData;
        break;

      case 'definition':
        articlesToSort = []
        break;
    }
    const sortedDataResults = [...articlesToSort].sort((a, b) => {
      let result = sortOrder === 'asc' ? a.publishedAt - b.publishedAt : b.publishedAt - a.publishedAt

      return result

    })
    setSortedData(sortedDataResults)

  }, [sortOrder, topic])

  const ArticleTypeBar = () => {
    return (
      <ul className="flex items-center gap-4 ">
        <button>
          <li onClick={() => setTopic('brain')} className={`${topic === 'brain' ? 'bg-sciquelTeal text-white' : 'bg-[#c8dbe1]'} text-black px-1 rounded-md text-sm border-4 border-sciquelFooter`}> Brained Articles </li>
        </button>
        <button>
          <li onClick={() => setTopic('bookmark')} className={`${topic === 'bookmark' ? 'bg-sciquelTeal text-white' : 'bg-[#c8dbe1]'} text-black px-1 rounded-md text-sm border-4 border-sciquelFooter`}> Bookmark </li>
        </button>
        <button>
          <li onClick={() => setTopic('definition')} className={`${topic === 'definition' ? 'bg-sciquelTeal text-white' : 'bg-[#c8dbe1]'} text-black px-1 rounded-md text-sm border-4 border-sciquelFooter`}> Definitions </li>
        </button>
      </ul >
    )
  }

  const SelectForm = () => {
    return (
      <select value={sortOrder} onChange={(e: React.ChangeEvent) => setSortOrder(e.target.value)} className="ml-auto ">
        <option value='desc'> Newest to Oldest </option>
        <option value='asc' > Oldest to Newst </option>
      </select>
    )
  }

  return (

    <div className="flex flex-col  h-screen ">
      <div className=" mt-5 w-full  ">
        <h1 className="font-bold mb-1 text-xl"> Saved </h1>
        <div className="flex ">
          <ArticleTypeBar />
          <SelectForm />
        </div>

      </div>
      <div className='flex flex-col mb-5  mt-5 overflow-y-scroll overflow-x-hidden before:block before:mt-3  before:border-b-4 before:mr-10 before:w-full before:border-slate-400 before:mb-5 '>


        {(topic === 'brain' || topic === 'bookmark') && (
          <ArticleList articles={sortedData} preferHorizontal={true} hoverEffect={false} />
        )}

        {topic === 'definition' && <p> Definitions will be here </p>}





      </div>


    </div>
  )
}
export default SavedPage