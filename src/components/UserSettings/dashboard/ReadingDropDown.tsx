'use client'
import { useState, useEffect } from 'react'
import Bookmark from '../../../../public/assets/images/bookmark-final.svg'
import Lightbulb from '../../../../public/assets/images/oi-lightbulb.svg'
import Share from '../../../../public/assets/images/oi-share-alt.svg'
import ArrowDown from '../../../../public/assets/images/oi-chevron-down.svg'
import axios from 'axios'
import env from '@/lib/env'
import Link from 'next/link'

const ReadingDropDown = ({ data, title, email, userId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [bookMarkedReadings, setBookMarkedReadings] = useState([])


  //get list of all stories the user has bookmarked
  //can this part be on the backend, or should i do the logic to find what stories are bookmarked on front
  useEffect(() => {
    const getBookMarkedReadings = async () => {
      try {
        const response = await axios.get(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark/latest`, {
          params: {
            user_email: email,
            page_size: data.length //what can i pass as page size parameter
          }
        })
        const bookmarkedReadings = response.data
        setBookMarkedReadings(bookmarkedReadings.map(reading => reading.storyId)) // Store only storyIds
      } catch (err) {
        console.error(err.message)
      }
    }
    getBookMarkedReadings()
  }, [email, data.length])

  const handleBookmarkClick = async (storyId: number) => {

    //checck if user has the reading bookmarked
    const isCurrentlyBookmarked = bookMarkedReadings.includes(storyId)

    try {
      if (!isCurrentlyBookmarked) {
        await axios.post(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark`, {
          story_id: storyId,
          user_email: email
        })
        setBookMarkedReadings([...bookMarkedReadings, storyId])
      } else {
        await axios.delete(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark`, {
          params: {
            story_id: storyId,
            user_email: email
          }
        })
        setBookMarkedReadings(bookMarkedReadings.filter(id => id !== storyId))
      }
    } catch (error) {
      console.error(error.message)
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

        <div className='max-h-[500px] overflow-y-scroll scrollbar-cyan'>
          {data.length === 0 && <p> No stories read {title} </p>}
          {data.map((reading) => (
            <ul className='mt-5' key={reading.storyId}>
              <div className='flex  items-center gap-7'>
                <img src={reading.story.thumbnailUrl} alt={`Thumbnail of ${reading.story.title}`} className='w-20 h-20 object-cover' />
                <div>
                  <Link href={`/stories/${new Date(reading.story.createdAt).getUTCFullYear()}/${new Date(reading.story.createdAt).getUTCMonth() + 1}/${new Date(reading.story.createdAt).getUTCDate()}/${reading.story.slug}`}>
                    <p className='font-bold'>{reading.story.title}</p>
                  </Link>
                  <p className='text-sm font-light'>{`By ${reading.story.title}`}</p>
                  <p className='text-sm font-light'>{`Viewed ${reading.diffInDays} days ago`}</p>

                </div>




                {/* Icons */}
                <div className='flex ml-auto items-center mr-5 ' >
                  <button className='cursor-pointer'>
                    <Bookmark fill={`${bookMarkedReadings.includes(reading.storyId) ? 'yellow' : 'none'}`} width='50px' height='20px' onClick={() => handleBookmarkClick(reading.storyId)} />
                  </button>
                  <button className='cursor-pointer'>
                    <Lightbulb width='50px' height='20px' />
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
