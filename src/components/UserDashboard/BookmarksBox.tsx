"use client";

import Image from "next/image";
import { type Stories } from "@/app/api/stories/route";
import { Story } from "@prisma/client";
import { getWhatsNewArticles } from "@/app/page";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function BookmarksBox() {

  const session = useSession();
  const user_email = session.data?.user.email;
  const URL = `http://localhost:3000/api/user/bookmark/latest?user_email=${user_email}`;

  const [returnVal, setReturnVal] = useState(<p>Loading...</p>);

  const response = fetch(URL, {
    method: `GET`,
  })
    .then(response => {
      return response.json();
    })

  const latestBookmarks = response.then((data) => {
    const storyVal = data as Stories;
    console.log(`storyVal: `, storyVal)
    return storyVal as Stories;
  });

  let headlineArticle1: Story;
  let headlineArticle2: Story;
  let headlineArticle3: Story;

  useEffect(() => {
    latestBookmarks.then((data) => {
      headlineArticle1 = (data as Stories)?.[0];
      headlineArticle2 = (data as Stories)?.[1];
      headlineArticle3 = (data as Stories)?.[2];

      console.log(`HA1: `, headlineArticle1);
      console.log(`HA2: `, headlineArticle2);
      console.log(`HA3: `, headlineArticle3);
    });

    let temp = (
      <div>
        <h1 className="text-xl font-semibold">Bookmarks</h1>

        <br></br>

        <div className="flex items-center">
          <Image
              src={headlineArticle1.thumbnailUrl}
              fill={false}
              width={`${30}`}
              height={`${25}`}
              alt="bobtail"
              className="rounded-md aspect-square h-9 w-9 mx-3"
              style={{ position: "relative"}}
            />

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col ml-3">
                <h2 className="text-sm font-semibold">{headlineArticle1.title}</h2>
                <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
              </div>

              <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">{headlineArticle1.tags[0].toString()}</p> 
              /* idk if this is legal but i need to change the bg color based on the tag! */
            </div>
        </div>

        <hr className="solid my-3 border-[#D6D6D6]"></hr>

        <div className="flex items-center">
          <Image
              src={headlineArticle2.thumbnailUrl}
              fill={false}
              width={`${30}`}
              height={`${25}`}
              alt="bobtail"
              className="rounded-md aspect-square h-9 w-9 mx-3"
              style={{ position: "relative"}}
            />

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col ml-3">
                <h2 className="text-sm font-semibold">{headlineArticle2.title}</h2>
                <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
              </div>

              <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">{headlineArticle1.tags[0].toString()}</p>
            </div>
        </div>

        <hr className="solid my-3 border-[#D6D6D6]"></hr>

        <div className="flex items-center">
          <Image
              src={headlineArticle3.thumbnailUrl}
              fill={false}
              width={`${30}`}
              height={`${25}`}
              alt="bobtail"
              className="rounded-md aspect-square h-9 w-9 mx-3"
              style={{ position: "relative"}}
            />

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col ml-3">
                <h2 className="text-sm font-semibold">{headlineArticle3.title}</h2>
                <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
              </div>

              <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">{headlineArticle3.tags[0].toString()}</p>
            </div>
        </div>
      </div>
    )

    setReturnVal(temp);

  })



  // old code ⬇️
/*
  function handleStories() {
    return getWhatsNewArticles().then((data) => {
      const storyVal = data as Stories;
      return storyVal as Stories;
    })
  }

  const whatsNewArticles = Promise.resolve(handleStories());

  let headlineArticle: Story;

  useEffect(() => {
    whatsNewArticles.then((data) => {
      headlineArticle = (data as Stories)?.[0];

      let temp = (
          <div>
                <h1 className="text-xl font-semibold">Bookmarks</h1>

                <br></br>

                <div className="flex items-center">
                  <Image
                      src={headlineArticle.thumbnailUrl}
                      fill={false}
                      width={`${30}`}
                      height={`${25}`}
                      alt="bobtail"
                      className="rounded-md aspect-square h-9 w-9 mx-3"
                      style={{ position: "relative"}}
                    />

                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col ml-3">
                        <h2 className="text-sm font-semibold">Lights, Camera, Action!</h2>
                        <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
                      </div>

                      <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">BIOLOGY</p>
                    </div>
                </div>

                <hr className="solid my-3 border-[#D6D6D6]"></hr>

                <div className="flex items-center">
                  <Image
                      src={headlineArticle.thumbnailUrl}
                      fill={false}
                      width={`${30}`}
                      height={`${25}`}
                      alt="bobtail"
                      className="rounded-md aspect-square h-9 w-9 mx-3"
                      style={{ position: "relative"}}
                    />

                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col ml-3">
                        <h2 className="text-sm font-semibold">Lights, Camera, Action!</h2>
                        <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
                      </div>

                      <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">BIOLOGY</p>
                    </div>
                </div>

                <hr className="solid my-3 border-[#D6D6D6]"></hr>

                <div className="flex items-center">
                  <Image
                      src={headlineArticle.thumbnailUrl}
                      fill={false}
                      width={`${30}`}
                      height={`${25}`}
                      alt="bobtail"
                      className="rounded-md aspect-square h-9 w-9 mx-3"
                      style={{ position: "relative"}}
                    />

                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col ml-3">
                        <h2 className="text-sm font-semibold">Lights, Camera, Action!</h2>
                        <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
                      </div>

                      <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">BIOLOGY</p>
                    </div>
                </div>
              </div>
      )

      setReturnVal(temp)

    })
  })
*/

  return (
    <div className="flex flex-col border-2 border-solid border-gray-200 rounded-lg p-4 m-3 w-full">
      {returnVal}
    </div>

    // <div className="flex flex-col border-2 border-solid border-gray-200 rounded-lg p-4 m-3 w-full">
    //   <h1 className="text-xl font-semibold">Bookmarks</h1>

    //   <br></br>

    //   <div className="flex items-center">
    //     <Image
    //         src={headlineArticle.thumbnailUrl}
    //         fill={false}
    //         width={`${30}`}
    //         height={`${25}`}
    //         alt="bobtail"
    //         className="rounded-md aspect-square h-9 w-9 mx-3"
    //         style={{ position: "relative"}}
    //       />

    //       <div className="flex justify-between items-center w-full">
    //         <div className="flex flex-col ml-3">
    //           <h2 className="text-sm font-semibold">Lights, Camera, Action!</h2>
    //           <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
    //         </div>

    //         <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">BIOLOGY</p>
    //       </div>
    //   </div>

    //   <hr className="solid my-3 border-[#D6D6D6]"></hr>

    //   <div className="flex items-center">
    //     <Image
    //         src={headlineArticle.thumbnailUrl}
    //         fill={false}
    //         width={`${30}`}
    //         height={`${25}`}
    //         alt="bobtail"
    //         className="rounded-md aspect-square h-9 w-9 mx-3"
    //         style={{ position: "relative"}}
    //       />

    //       <div className="flex justify-between items-center w-full">
    //         <div className="flex flex-col ml-3">
    //           <h2 className="text-sm font-semibold">Lights, Camera, Action!</h2>
    //           <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
    //         </div>

    //         <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">BIOLOGY</p>
    //       </div>
    //   </div>

    //   <hr className="solid my-3 border-[#D6D6D6]"></hr>

    //   <div className="flex items-center">
    //     <Image
    //         src={headlineArticle.thumbnailUrl}
    //         fill={false}
    //         width={`${30}`}
    //         height={`${25}`}
    //         alt="bobtail"
    //         className="rounded-md aspect-square h-9 w-9 mx-3"
    //         style={{ position: "relative"}}
    //       />

    //       <div className="flex justify-between items-center w-full">
    //         <div className="flex flex-col ml-3">
    //           <h2 className="text-sm font-semibold">Lights, Camera, Action!</h2>
    //           <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
    //         </div>

    //         <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">BIOLOGY</p>
    //       </div>
    //   </div>
    // </div>
  )
}