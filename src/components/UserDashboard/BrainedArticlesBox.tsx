"use client";

import Image from "next/image";
import { type Stories } from "@/app/api/stories/route";
import { Story } from "@prisma/client";
import { getWhatsNewArticles } from "@/app/page";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function BrainedArticleBox() {

  const session = useSession();
  const user_email = session.data?.user.email;
  const URL = `http://localhost:3000/api/user/brains/latest?user_email=${user_email}`; 

  const [returnVal, setReturnVal] = useState(<p>Loading...</p>);

  // const response = fetch(URL, {
  //   method: "GET",
  //   // add in user_email
  // })
  //   .then(response => {
  //     console.log(`response...?: `, response);
  //     return response.json();
  //   })

  // const latestBrainedArticle = response.then((data) => {
  //   const storyVal = data as Stories;
  //   console.log(`storyVal on brained!: `, storyVal);
  //   return storyVal as Stories
  // })

  // let headlineArticle: Story;
  
  // useEffect(() => {
  //   latestBrainedArticle.then((data) => {
  //     headlineArticle = (data as Stories)?.[0];
  //   })

  //   let temp = (
  //       <div className="flex items-center">
  //         <Image
  //           src={headlineArticle.thumbnailUrl}
  //           fill={false}
  //           width={`${50}`}
  //           height={`${50}`}
  //           alt="bobtail"
  //           className="rounded-md aspect-square h-12 w-12 mx-3"
  //           style={{ position: "relative"}}
  //         />
  
  
  //         <div className="flex justify-between w-full items-center">
  //           <div className="flex flex-col mx-3">
  //             <h2 className="text-sm font-semibold">{headlineArticle.title}</h2>
  //             <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
  //             <p className="text-[.6rem] mt-1 text-[#9E9E9E]">Saved March 2, 2024</p>
  //           </div>
  
  //           <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">BIOLOGY</p>
  //         </div>
  //       </div>
  //     )

  //     setReturnVal(temp);
  // })


  // old code ⬇️
  /*
  const whatsNewArticles = Promise.resolve(handleStories());

  function handleStories() {
    return getWhatsNewArticles().then((data) => {
      const storyVal = data as Stories;
      return storyVal as Stories;
    })
  }

  let headlineArticle: Story;
  
  useEffect(() => {
    whatsNewArticles.then((data) => {
      headlineArticle = (data as Stories)?.[0];
  
      let temp = (
        <div className="flex items-center">
          <Image
            src={headlineArticle.thumbnailUrl}
            fill={false}
            width={`${50}`}
            height={`${50}`}
            alt="bobtail"
            className="rounded-md aspect-square h-12 w-12 mx-3"
            style={{ position: "relative"}}
          />
  
  
          <div className="flex justify-between w-full items-center">
            <div className="flex flex-col mx-3">
              <h2 className="text-sm font-semibold">{headlineArticle.title}</h2>
              <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
              <p className="text-[.6rem] mt-1 text-[#9E9E9E]">Saved March 2, 2024</p>
            </div>
  
            <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">BIOLOGY</p>
          </div>
        </div>
      )

      setReturnVal(temp)

    })
  })
  */

  return (
    <div className="flex flex-col border-2 border-solid border-gray-200 rounded-lg p-4 m-3 w-full justify-items-stretch">
      <h1 className="text-xl font-semibold">Brained Articles</h1>
      
      <br></br>

      {/* FIXME: this is a mess, u gotta fix this */}
      {returnVal}

        {/* <p>(insert text box) Lorem ipsum dolor sit amet. Et nihil tempora aut internos voluptas quo magnam laborum et harum quibusdam At quod distinctio et deserunt voluptatem et reprehenderit vero.</p> */}
        {/* <Image
          src={headlineArticle.thumbnailUrl}
          fill={false}
          width={`${50}`}
          height={`${50}`}
          alt="bobtail"
          className="rounded-md aspect-square h-12 w-12 mx-3"
          style={{ position: "relative"}}
        />


        <div className="flex justify-between w-full items-center">
          <div className="flex flex-col mx-3">
            <h2 className="text-sm font-semibold">{headlineArticle.title}</h2>
            <p className="text-xs mt-1 text-[#696969]">By Jane Smith</p>
            <p className="text-[.6rem] mt-1 text-[#9E9E9E]">Saved March 2, 2024</p>
          </div>

          <p className="text-[.6rem] mx-3 bg-[#E3954F] rounded-full py-.5 px-1.5 text-white">BIOLOGY</p>
        </div> */}

        {/* <div className="w-4/10">
        </div> */}

    </div>
  )
}