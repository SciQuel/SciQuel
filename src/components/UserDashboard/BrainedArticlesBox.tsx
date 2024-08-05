"use client";

import Image from "next/image";
import { type Stories } from "@/app/api/stories/route";
import { Story } from "@prisma/client";
import { getWhatsNewArticles } from "@/app/page";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { TopicColor } from "../TopicTag";

export default function BrainedArticleBox() {

  const session = useSession();
  const user_email = session.data?.user.email;
  const URL = `http://localhost:3000/api/user/brains/latest?user_email=${user_email}`; 

  const [returnVal, setReturnVal] = useState(<p>Loading...</p>);

  useEffect(() => {
    let storyURL: string;
    const response = axios
      .get(URL)
      .then(response => {
        // console.log(`response rn... `, response.data)

        if (response.data.length == 0) {
          setReturnVal(<p className="italic">You don't have any Brained Articles!</p>)
        } else {
          
          const bookmarkedDate = new Date(response.data[0].createdAt);
          const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
          const formattedBookmarkedDate = bookmarkedDate.toLocaleDateString("en-US", options);

          storyURL = `http://localhost:3000/api/stories/id/${response.data[0].storyId}`;

          const x = axios
            .get(storyURL)
            .then(response => {
              // console.log(`curr data: `, response.data)
              const tagColor = TopicColor(response.data.tags[0]);

              const authorName = (() => {
                let contributors = response.data.storyContributions;
                // console.log(`contributors: `, contributors);
                let count = 0;
                let authorFound = false;

                while ((count < contributors.length) && (!authorFound)) {
                  // console.log(`contributors[${count}]`, contributors[count]);

                  if (contributors[count].contributionType == "AUTHOR") {
                    authorFound = true;
                  } else {
                    count ++;
                  }
                }
                
                return contributors[count].contributor.firstName + " " + contributors[count].contributor.lastName

              });

              let temp = (
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
                      <p className="text-[.6rem] mt-1 text-[#9E9E9E]">Saved {formattedBookmarkedDate}</p>
                    </div>

                    <div style={{'--customColor': tagColor} as React.CSSProperties }>
                      <p className='bg-[var(--customColor)] text-[.6rem] mx-3 rounded-full py-.5 px-1.5 text-white'>{response.data.tags[0]}</p>
                    </div>
                  </div>
                </div>
              )
        
              setReturnVal(temp);
        
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