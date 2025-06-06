"use client";

import { type GetStoriesResult, type Stories } from "@/app/api/stories/route";
import env from "@/lib/env";
import { type Story } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
// import { getWhatsNewArticles } from "@/app/page";
import { useEffect, useState } from "react";

export default function SavedDefinitionsBox() {
  // 📝: this box is supposed to display the last 3 definitions a user saved. the entirety of this code is a placeholder-- needs to properly implement an API call.

  function handleStories() {
    // N.B.: takes Promise type and resolves it into a story. kinda.
    return axios.get(`${env.NEXT_PUBLIC_SITE_URL}/api/stories`).then((data) => {
      if (data.status == 200) {
        const result = data.data as GetStoriesResult;
        return result.stories.map((story) => ({
          ...story,
          createdAt: new Date(story.createdAt),
          publishedAt: new Date(story.publishedAt),
          updatedAt: new Date(story.updatedAt),
        }));
      } else {
        return [];
      }
    });
  }

  const whatsNewArticles = Promise.resolve(handleStories()); // FIXME: instead of using info from an api call, just calls on a placeholder article's thumbnail image
  const [returnVal, setReturnVal] = useState(<p>Loading...</p>);

  let headlineArticle: Story;

  useEffect(() => {
    whatsNewArticles
      .then((data) => {
        headlineArticle = (data as Stories)?.[0]; // N.B.: uses the first article in the arr of Stories

        const temp = (
          <div>
            <div className="flex items-center">
              <Image
                src={headlineArticle.thumbnailUrl}
                fill={false}
                width={`${30}`}
                height={`${25}`}
                alt="thumbnail of article"
                className="mx-3 aspect-square h-9 w-9 rounded-md"
                style={{ position: "relative" }}
              />

              {/* FIXME: all of this should be based off the API call */}
              <div className="ml-3 flex flex-col">
                <h2 className="text-sm font-semibold">Wavelength</h2>
                <p className="mt-1 text-xs text-[#696969]">
                  noun. A property of light that, among other things, dictates
                  the color of a beam of light.
                </p>
                <p className="mt-1 text-[.6rem]">
                  <span className="font-semibold">Article:</span> Lights,
                  Camera, Action!
                </p>
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
                className="mx-3 aspect-square h-9 w-9 rounded-md"
                style={{ position: "relative" }}
              />

              <div className="ml-3 flex flex-col">
                <h2 className="mt-1 text-sm font-semibold">Wavelength</h2>
                <p className="mt-1 text-xs text-[#696969]">
                  noun. A property of light that, among other things, dictates
                  the color of a beam of light.
                </p>
                <p className="mt-1 text-[.6rem]">
                  <span className="font-semibold">Article:</span> Lights,
                  Camera, Action!
                </p>
              </div>
            </div>
          </div>
        );

        setReturnVal(temp);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return (
    <div className="m-3 flex w-full flex-col rounded-lg border-2 border-solid border-gray-200 p-4">
      <h1 className="text-xl font-semibold">Saved Definitions</h1>
      <br></br>

      {returnVal}
    </div>
  );
}
