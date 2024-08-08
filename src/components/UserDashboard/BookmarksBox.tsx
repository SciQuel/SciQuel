"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { TopicColor } from "../TopicTag";

export default function BookmarksBox() {
  // 📝: this box displays the last 3 bookmarks a user makes. this code is 100% complete.

  const session = useSession();
  const user_email = session.data?.user.email;
  const URL = `http://localhost:3000/api/user/bookmark/latest?user_email=${user_email}`; // N.B.: like brained articles, need 2 api calls. this first one only returns info on the bookmark, not on the stories itself

  const [returnVal, setReturnVal] = useState(<p>Loading...</p>);

  useEffect(() => {
    let storyURL1: string;
    let storyURL2: string;
    let storyURL3: string;

    const response = axios
      .get(URL)
      .then(response => {
        if (response.data.length == 0) { // N.B.: if (!response)
          setReturnVal(<p className="italic">You don't have any Bookmarks!</p>)
        } else {
          // N.B.: returns arr of latest 4 bookmarks, including when they were made, storyId, etc.
          storyURL1 = `http://localhost:3000/api/stories/id/${response.data[0][`storyId`]}`;
          storyURL2 = `http://localhost:3000/api/stories/id/${response.data[1][`storyId`]}`;
          storyURL3 = `http://localhost:3000/api/stories/id/${response.data[2][`storyId`]}`;
          
          // N.B.: a, b, c are the individual calls for each of the 3 articles' info
          const a = axios
            .get(storyURL1)
            .then(response => {

              const tagColor1 = TopicColor(response.data.tags[0]); // N.B.: matches tag string to hex code

              const authorName1 = (() => { // N.B.: traverses arr of storyContributions and return first person listed as an "AUTHOR"'s full name
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

                return contributors[count].contributor.firstName + " " + contributors[count].contributor.lastName;

              });

              let article1 = ( // N.B.: defining the html for the first article
                <div>
                  <div className="flex items-center">
                    <Image
                    src={response.data.thumbnailUrl}
                    fill={false}
                    width={`${30}`}
                    height={`${25}`}
                    alt="thumbnail of article"
                    className="rounded-md aspect-square h-9 w-9 mx-3"
                    style={{ position: "relative"}}
                  />

                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col ml-3">
                      <h2 className="text-sm font-semibold">{response.data.title}</h2>
                      <p className="text-xs mt-1 text-[#696969]">By {authorName1()}</p>
                    </div>

                    <p style={{'--customColor': tagColor1} as React.CSSProperties}
                      className="text-[.6rem] mx-3 bg-[var(--customColor)] rounded-full py-.5 px-1.5 text-white">{response.data.tags[0]}</p> 
                    </div>
                  </div>

                  <hr className="solid my-3 border-[#D6D6D6]"></hr>
                </div>
              );

            const b = axios
              .get(storyURL2)
              .then(response => {
                const tagColor2 = TopicColor(response.data.tags[0]);
                
                const authorName2 = (() => {
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

                  return contributors[count].contributor.firstName + " " + contributors[count].contributor.lastName;

                });

                let article2 = (
                  <div>
                    <div className="flex items-center">
                      <Image
                      src={response.data.thumbnailUrl}
                      fill={false}
                      width={`${30}`}
                      height={`${25}`}
                      alt="thumbnail of article"
                      className="rounded-md aspect-square h-9 w-9 mx-3"
                      style={{ position: "relative"}}
                    />

                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col ml-3">
                        <h2 className="text-sm font-semibold">{response.data.title}</h2>
                        <p className="text-xs mt-1 text-[#696969]">By {authorName2()}</p>
                      </div>

                      <p style={{'--customColor': tagColor2} as React.CSSProperties}
                        className="text-[.6rem] mx-3 bg-[var(--customColor)] rounded-full py-.5 px-1.5 text-white">{response.data.tags[0]}</p> 
                      </div>
                    </div>

                    <hr className="solid my-3 border-[#D6D6D6]"></hr>
                  </div>
                );

                const c = axios
                  .get(storyURL3)
                  .then(response => {
                    const tagColor3 = TopicColor(response.data.tags[0]);
                    
                    const authorName3 = (() => {
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

                      return contributors[count].contributor.firstName + " " + contributors[count].contributor.lastName;

                    });

                    let article3 = (
                      <div>
                        <div className="flex items-center">
                          <Image
                          src={response.data.thumbnailUrl}
                          fill={false}
                          width={`${30}`}
                          height={`${25}`}
                          alt="thumbnail of article"
                          className="rounded-md aspect-square h-9 w-9 mx-3"
                          style={{ position: "relative"}}
                        />

                        <div className="flex justify-between items-center w-full">
                          <div className="flex flex-col ml-3">
                            <h2 className="text-sm font-semibold">{response.data.title}</h2>
                            <p className="text-xs mt-1 text-[#696969]">By {authorName3()}</p>
                          </div>

                          <p style={{'--customColor': tagColor3} as React.CSSProperties}
                            className="text-[.6rem] mx-3 bg-[var(--customColor)] rounded-full py-.5 px-1.5 text-white">{response.data.tags[0]}</p> 
                          </div>
                        </div>

                      </div>
                    );

                    setReturnVal(( // N.B.: sets state variable equal to all of the articles created in the previous API calls
                      <div>
                        {article1}
                        {article2}
                        {article3}
                      </div>
                    ));
                  })
              })
            })
        }
      })
  }, []);

  return (
    <div className="flex flex-col border-2 border-solid border-gray-200 rounded-lg p-4 m-3 w-full">
      <h1 className="text-xl font-semibold">Bookmarks</h1>
      <br></br>

      {returnVal}
    </div>
  )
}