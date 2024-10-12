'use client'
import { useState, useEffect } from 'react'
import Bookmark from '../../../../public/assets/images/bookmark-final.svg'
import Lightbulb from '../../../../public/assets/images/oi-lightbulb.svg'
import Share from '../../../../public/assets/images/oi-share-alt.svg'
import ArrowDown from '../../../../public/assets/images/oi-chevron-down.svg'
import axios from 'axios'
import env from '@/lib/env'
import Link from 'next/link'
import { ReadingHistory as ReadingHistoryType } from '../../../app/user-settings/actions/getReadingHistory'
import { GetLatestBookmarkRes } from '@/app/api/user/bookmark/latest/route'

interface PropTypes {
  data: ReadingHistoryType & { diffInDays: number }[];
  title: string;
  email: string;
}



const ReadingDropDown: React.FC<PropTypes> = ({ data, title, email, brained, bookmarked }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [bookMarkedReadingsIds, setBookMarkedReadingsIds] = useState([...bookmarked])
  const [brainedReadingIds, setBrainedReadingsIds] = useState([...brained])
  console.log(bookMarkedReadingsIds)




  const handleBookmarkClick = async (storyId: string) => {

    //checck if user has the reading bookmarked
    const isCurrentlyBookmarked = bookMarkedReadingsIds.includes(storyId)

    if (!isCurrentlyBookmarked) {
      setBookMarkedReadingsIds([...bookMarkedReadingsIds, storyId])
      try {
        await axios.post(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark`, {
          story_id: storyId,
          user_email: email
        })
        console.log('story bookmarked')
      } catch (error) {
        console.error(error)
        setBookMarkedReadingsIds(bookMarkedReadingsIds.filter(id => id != storyId))
      }
    }


    if (isCurrentlyBookmarked) {
      setBookMarkedReadingsIds(bookMarkedReadingsIds.filter(id => id != storyId))
      try {
        await axios.delete(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark`, {
          params: {
            story_id: storyId,
            user_email: email
          }
        })
      } catch (error) {
        console.error(error)
        setBookMarkedReadingsIds([...bookMarkedReadingsIds, storyId])
      }
    }
  }

  const handleBrainClick = async (storyId: string) => {
    const isBrained = brainedReadingIds.includes(storyId)
    if (isBrained) {
      setBrainedReadingsIds(brainedReadingIds.filter(id => id != storyId))
      try {
        await axios.delete(`${env.NEXT_PUBLIC_SITE_URL}/api/user/brains`, {
          params: {
            story_id: storyId,
            user_email: email
          }
        })
      } catch (err) {
        console.error(err)
        setBrainedReadingsIds([...brainedReadingIds, storyId])
      }
    }
    if (!isBrained) {
      setBrainedReadingsIds([...brainedReadingIds, storyId])
      try {
        await axios.post(`${env.NEXT_PUBLIC_SITE_URL}/api/user/brains`, {
          story_id: storyId,
          user_email: email
        })
      } catch (err) {
        console.error(err)
        setBrainedReadingsIds(brainedReadingIds.filter(id => id != storyId))
      }
    }
  }

  return (
    <>
      <div className=" border-b-2 w-full  h-[45px] flex cursor-pointer" onClick={() => setIsOpen(prev => !prev)}> {title}
        <button className='ml-auto mr-5'>
          <ArrowDown transform={isOpen ? 'rotate(180)' : ''} />
        </button>
      </div>

      {isOpen && (

        <div className='max-h-[500px] overflow-y-scroll scrollbar-cyan mt-3'>


          {data.map((reading) => (
            <ul className='mt-5' key={reading.story.id}>
              <div className='flex  items-center gap-7'>
                <img src={reading.story.thumbnailUrl} alt={`Thumbnail of ${reading.story.title}`} className='w-20 h-20 object-cover rounded-md' />
                <div>
                  <Link href={`/stories/${new Date(reading.createdAt).getUTCFullYear()}/${new Date(reading.createdAt).getUTCMonth() + 1}/${new Date(reading.createdAt).getUTCDate()}/${reading.story.slug}`}>
                    <p className='font-bold'>{reading.story.title}</p>
                  </Link>
                  <p className='text-sm font-light'>{`By ${reading.story.title}`}</p>
                  <p className='text-sm font-light'>{`Viewed ${reading.diffInDays} days ago`}</p>

                </div>

                {/* Icons */}
                <div className='flex ml-auto items-center mr-5 ' >
                  <button className='cursor-pointer'>
                    <Bookmark fill={`${bookMarkedReadingsIds.includes(reading.story.id) ? 'yellow' : 'none'}`} width='50px' height='20px' onClick={() => handleBookmarkClick(reading.story.id)} />
                  </button>
                  <button onClick={() => handleBrainClick(reading.story.id)} className='cursor-pointer'>
                    <Lightbulb width={`${brainedReadingIds.includes(reading.story.id) ? '30px' : '20px'}`} height='20px' />
                  </button>
                  <button className='cursor-pointer'>
                    <Share width='50px' height='20px' />
                  </button>
                </div>
              </div >

            </ul >

          ))}
        </div >
      )}
    </>
  )
}

export default ReadingDropDown
