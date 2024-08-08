"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { TopicColor } from "../TopicTag";

export default function BrainedArticleBox() {

  // 📝: this box is supposed to showcase your most recent "brained article". this code is 100% complete.

  const session = useSession(); // N.B.: opens a session, used to access user info
  const user_email = session.data?.user.email;
  const URL = `http://localhost:3000/api/user/brains/latest?user_email=${user_email}`;

  const [returnVal, setReturnVal] = useState(<p>Loading...</p>);

  useEffect(() => {
    let storyURL: string;
    const response = axios
      .get(URL)
      .then(response => {
        if (response.data.length == 0) { // N.B.: a.k.a. if (!response) essentially
          setReturnVal(<p className="italic">You don't have any Brained Articles!</p>)

        } else {
          // N.B.: the first api call returns an arr of the date/etc. when a brained article was created. also the story id of the article.
          //       but the actual info of the stories needs to be a separate api call

          const brainedDate = new Date(response.data[0].createdAt); // N.B.: we do need the date it was brained which is returned in the first arr
          const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
          const formattedBrainedDate = brainedDate.toLocaleDateString("en-US", options);

          storyURL = `http://localhost:3000/api/stories/id/${response.data[0].storyId}`; // N.B.: create 2nd api call, this time for story-specific info

          const x = axios
            .get(storyURL)
            .then(response => {
              const tagColor = TopicColor(response.data.tags[0]); // N.B.: calls function that matches tagColor as a string to its hex code

              const authorName = (() => { // N.B.: traverses storyContributions arr and returns the first "AUTHOR"'s full name in arr
                let contributors = response.data.storyContributions;
                let count = 0;
                let authorFound = false;

                while ((count < contributors.length) && (!authorFound)) {
                  if (contributors[count].contributionType == "AUTHOR") {
                    authorFound = true;
                  } else {
                    count ++;
                  }
                }
                
                return contributors[count].contributor.firstName + " " + contributors[count].contributor.lastName

              });

              let temp = ( // N.B.: now creating the html of the box...
                <div className="flex items-center">
                  <Image 
                    src={response.data.thumbnailUrl}
                    fill={false}
                    width={`${50}`}
                    height={`${50}`}
                    alt="thumbnail of article"
                    className="rounded-md aspect-square h-12 w-12 mx-3"
                    style={{ position: "relative"}}
                  />
          
          
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col mx-3">
                      <h2 className="text-sm font-semibold">{response.data.title}</h2>
                      <p className="text-xs mt-1 text-[#696969]">By {authorName()}</p>
                      <p className="text-[.6rem] mt-1 text-[#9E9E9E]">Saved {formattedBrainedDate}</p>
                    </div>

                    <div style={{'--customColor': tagColor} as React.CSSProperties }>
                      <p className='bg-[var(--customColor)] text-[.6rem] mx-3 rounded-full py-.5 px-1.5 text-white'>{response.data.tags[0]}</p>
                    </div>
                  </div>
                </div>
              )
        
              setReturnVal(temp); // N.B.: ... and setting the state variable to the new html code so it'll actually dynamically update!
        
            });
        }
      })
  }, []);

  return (
    <div className="flex flex-col border-2 border-solid border-gray-200 rounded-lg p-4 m-3 w-full justify-items-stretch">
      <h1 className="text-xl font-semibold">Brained Articles</h1>
      
      <br></br>

      {returnVal}

    </div>
  )
}