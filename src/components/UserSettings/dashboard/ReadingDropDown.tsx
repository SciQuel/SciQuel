'use client'
import { useState, useEffect } from 'react'
import Bookmark from '../../../../public/assets/images/bookmark-final.svg'
import Lightbulb from '../../../../public/assets/images/oi-lightbulb.svg'
import Share from '../../../../public/assets/images/oi-share-alt.svg'
import axios from 'axios'
import env from '@/lib/env'

const ReadingDropDown = ({ data, title, email, userId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [bookMarkedReadings, setBookMarkedReadings] = useState([])


  //get list of all stories the user has bookmarked
  useEffect(() => {
    const getBookMarkedReadings = async () => {
      try {
        const response = await axios.get(`${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark/latest`, {
          params: {
            user_email: email,
            page_size: data.length
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
      <div className="border-b-2 w-full cursor-pointer h-[45px]" onClick={() => setIsOpen(prev => !prev)}> {title} </div>

      {isOpen && (
        <div className='h-[500px] overflow-y-scroll scrollbar-cyan'>
          {data.map((reading) => (
            <ul className='mt-5' key={reading.storyId}>
              <div className='flex items-center gap-7'>
                <img src={reading.story.thumbnailUrl} alt={`Thumbnail of ${reading.story.title}`} className='w-20 h-20 object-cover' />
                <div>
                  <p>{reading.story.title}</p>
                  <p>{`by ${reading.storyId}`}</p>
                  <p>{`Viewed ${reading.diffInDays} days ago`}</p>
                </div>

                {/* Icons */}
                <div className='flex ml-auto items-center mr-5'>
                  <Bookmark fill={`${bookMarkedReadings.includes(reading.storyId) ? 'yellow' : 'none'}`} width='50px' height='20px' onClick={() => handleBookmarkClick(reading.storyId)} />
                  <Lightbulb width='50px' height='20px' />
                  <Share width='50px' height='20px' />
                </div>
              </div>
            </ul>
          ))}
        </div>
      )}
    </>
  )
}

export default ReadingDropDown
