"use client";

import axios, { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
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

    axios
      .get(URL)
      .then((response: AxiosResponse<any, any>) => {
        if (response.data.length == 0) {
          // N.B.: if (!response)
          setReturnVal(<p className="italic">You don't have any Bookmarks!</p>);
        } else {
          // N.B.: returns arr of latest 4 bookmarks, including when they were made, storyId, etc.
          storyURL1 = `http://localhost:3000/api/stories/id/${
            response.data[0][`storyId`]
          }`;
          storyURL2 = `http://localhost:3000/api/stories/id/${
            response.data[1][`storyId`]
          }`;
          storyURL3 = `http://localhost:3000/api/stories/id/${
            response.data[2][`storyId`]
          }`;

          // N.B.: a, b, c are the individual calls for each of the 3 articles' info
          axios
            .get(storyURL1)
            .then((response: AxiosResponse<any, any>) => {
              console.log(`response`, response);
              const tagColor1 = TopicColor(response.data.topics[0]); // N.B.: matches tag string to hex code

              const authorName1 = () => {
                // N.B.: traverses arr of storyContributions and return first person listed as an "AUTHOR"'s full name
                const contributors = response.data.storyContributions;
                let count = 0;
                let authorFound = false;

                while (count < contributors.length && !authorFound) {
                  if (contributors[count].contributionType == "AUTHOR") {
                    authorFound = true;
                  } else {
                    count++;
                  }
                }

                return (
                  contributors[count].contributor.firstName +
                  " " +
                  contributors[count].contributor.lastName
                );
              };

              const article1 = // N.B.: defining the html for the first article
                (
                  <div>
                    <div className="flex items-center">
                      <Image
                        src={response.data.thumbnailUrl}
                        fill={false}
                        width={`${30}`}
                        height={`${25}`}
                        alt="thumbnail of article"
                        className="mx-3 aspect-square h-9 w-9 rounded-md"
                        style={{ position: "relative" }}
                      />

                      <div className="flex w-full items-center justify-between">
                        <div className="ml-3 flex flex-col">
                          <h2 className="text-sm font-semibold">
                            {response.data.title}
                          </h2>
                          <p className="mt-1 text-xs text-[#696969]">
                            By {authorName1()}
                          </p>
                        </div>

                        <p
                          style={
                            {
                              "--customColor": tagColor1,
                            } as React.CSSProperties
                          }
                          className="py-.5 mx-3 rounded-full bg-[var(--customColor)] px-1.5 text-[.6rem] text-white"
                        >
                          {response.data.topics[0]}
                        </p>
                      </div>
                    </div>

                    <hr className="solid my-3 border-[#D6D6D6]"></hr>
                  </div>
                );

              axios
                .get(storyURL2)
                .then((response: AxiosResponse<any, any>) => {
                  const tagColor2 = TopicColor(response.data.topics[0]);

                  const authorName2 = () => {
                    const contributors = response.data.storyContributions;
                    let count = 0;
                    let authorFound = false;

                    while (count < contributors.length && !authorFound) {
                      if (contributors[count].contributionType == "AUTHOR") {
                        authorFound = true;
                      } else {
                        count++;
                      }
                    }

                    return (
                      contributors[count].contributor.firstName +
                      " " +
                      contributors[count].contributor.lastName
                    );
                  };

                  const article2 = (
                    <div>
                      <div className="flex items-center">
                        <Image
                          src={response.data.thumbnailUrl}
                          fill={false}
                          width={`${30}`}
                          height={`${25}`}
                          alt="thumbnail of article"
                          className="mx-3 aspect-square h-9 w-9 rounded-md"
                          style={{ position: "relative" }}
                        />

                        <div className="flex w-full items-center justify-between">
                          <div className="ml-3 flex flex-col">
                            <h2 className="text-sm font-semibold">
                              {response.data.title}
                            </h2>
                            <p className="mt-1 text-xs text-[#696969]">
                              By {authorName2()}
                            </p>
                          </div>

                          <p
                            style={
                              {
                                "--customColor": tagColor2,
                              } as React.CSSProperties
                            }
                            className="py-.5 mx-3 rounded-full bg-[var(--customColor)] px-1.5 text-[.6rem] text-white"
                          >
                            {response.data.topics[0]}
                          </p>
                        </div>
                      </div>

                      <hr className="solid my-3 border-[#D6D6D6]"></hr>
                    </div>
                  );

                  axios
                    .get(storyURL3)
                    .then((response: AxiosResponse<any, any>) => {
                      const tagColor3 = TopicColor(response.data.topics[0]);

                      const authorName3 = () => {
                        const contributors = response.data.storyContributions;
                        let count = 0;
                        let authorFound = false;

                        while (count < contributors.length && !authorFound) {
                          if (
                            contributors[count].contributionType == "AUTHOR"
                          ) {
                            authorFound = true;
                          } else {
                            count++;
                          }
                        }

                        return (
                          contributors[count].contributor.firstName +
                          " " +
                          contributors[count].contributor.lastName
                        );
                      };

                      const article3 = (
                        <div>
                          <div className="flex items-center">
                            <Image
                              src={response.data.thumbnailUrl}
                              fill={false}
                              width={`${30}`}
                              height={`${25}`}
                              alt="thumbnail of article"
                              className="mx-3 aspect-square h-9 w-9 rounded-md"
                              style={{ position: "relative" }}
                            />

                            <div className="flex w-full items-center justify-between">
                              <div className="ml-3 flex flex-col">
                                <h2 className="text-sm font-semibold">
                                  {response.data.title}
                                </h2>
                                <p className="mt-1 text-xs text-[#696969]">
                                  By {authorName3()}
                                </p>
                              </div>

                              <p
                                style={
                                  {
                                    "--customColor": tagColor3,
                                  } as React.CSSProperties
                                }
                                className="py-.5 mx-3 rounded-full bg-[var(--customColor)] px-1.5 text-[.6rem] text-white"
                              >
                                {response.data.topics[0]}
                              </p>
                            </div>
                          </div>
                        </div>
                      );

                      setReturnVal(
                        // N.B.: sets state variable equal to all of the articles created in the previous API calls
                        <div>
                          {article1}
                          {article2}
                          {article3}
                        </div>,
                      );
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="m-3 flex w-full flex-col rounded-lg border-2 border-solid border-gray-200 p-4">
      <h1 className="text-xl font-semibold">Bookmarks</h1>
      <br></br>

      {returnVal}
    </div>
  );
}
