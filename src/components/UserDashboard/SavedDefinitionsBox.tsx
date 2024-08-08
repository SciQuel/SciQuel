"use client";

import Image from "next/image";
import { type Stories } from "@/app/api/stories/route";
import { Story } from "@prisma/client";
import { getWhatsNewArticles } from "@/app/page";
import { useEffect, useState } from "react";

export default function SavedDefinitionsBox() {

  // 📝: this box is supposed to display the last 3 definitions a user saved. the entirety of this code is a placeholder-- needs to properly implement an API call.

  function handleStories() { // N.B.: takes Promise type and resolves it into a story. kinda.
    return getWhatsNewArticles().then((data) => {
      const storyVal = data as Stories;
      return storyVal as Stories;
    })
  }

  const whatsNewArticles = Promise.resolve(handleStories()); // FIXME: instead of using info from an api call, just calls on a placeholder article's thumbnail image
  const [returnVal, setReturnVal] = useState(<p>Loading...</p>);

  let headlineArticle: Story;

  useEffect(() => {
    whatsNewArticles.then((data) => {
      headlineArticle = (data as Stories)?.[0]; // N.B.: uses the first article in the arr of Stories

      let temp = (
        <div>
              <div className="flex items-center">
                <Image
                    src={headlineArticle.thumbnailUrl}
                    fill={false}
                    width={`${30}`}
                    height={`${25}`}
                    alt="thumbnail of article"
                    className="rounded-md aspect-square h-9 w-9 mx-3"
                    style={{ position: "relative"}}
                  />

                  {/* FIXME: all of this should be based off the API call */}
                  <div className="flex flex-col ml-3"> 
                    <h2 className="text-sm font-semibold">Wavelength</h2>
                    <p className="text-xs mt-1 text-[#696969]">noun. A property of light that, among other things, dictates the color of a beam of light.</p>
                    <p className="text-[.6rem] mt-1"><span className="font-semibold">Article:</span> Lights, Camera, Action!</p>
                  </div>
              </div>

              <hr className="solid my-2 border-[#D6D6D6]"></hr>

              <div className="flex items-center">
                <Image
                    src={headlineArticle.thumbnailUrl}
                    fill={false}
                    width={`${30}`}
                    height={`${25}`}
                    alt="thumbnail of article"
                    className="rounded-md aspect-square h-9 w-9 mx-3"
                    style={{ position: "relative"}}
                  />

                  <div className="flex flex-col ml-3">
                    <h2 className="text-sm mt-1 font-semibold">Wavelength</h2>
                    <p className="text-xs mt-1 text-[#696969]">noun. A property of light that, among other things, dictates the color of a beam of light.</p>
                    <p className="text-[.6rem] mt-1"><span className="font-semibold">Article:</span> Lights, Camera, Action!</p>
                  </div>
              </div>
            </div>
      )

      setReturnVal(temp)

    })
  })


  return (
    <div className="flex flex-col border-2 border-solid border-gray-200 rounded-lg p-4 m-3 w-full">
      <h1 className="text-xl font-semibold">Saved Definitions</h1>
      <br></br>

      {returnVal}
    </div>
  )
}