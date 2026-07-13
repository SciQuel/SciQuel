/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { env } from "process";
import { type GetStoriesResult } from "@/app/api/stories/route";
import { type Story } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function publishStory(story: Story, isPublished: boolean) {
  const cookieStore = await cookies(); //support in nextjs 15
  const storyURL = new URL(
    `${env.NEXT_PUBLIC_SITE_URL}/api/stories/id/${
      story.id
    }?${new URLSearchParams({ id: story.id })}`,
  );
  await fetch(storyURL, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({
      published: isPublished,
    }),
  }).catch((err) => console.log(err));
  revalidateTag("draftStories");
}

export const storyFetcher = async (isPublished: string) => {
  const cookieStore = await cookies();
  return (await fetch(
    `${env.NEXT_PUBLIC_SITE_URL}/api/stories?published=${isPublished}`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      credentials: "include",
      method: "GET",
      next: { tags: ["draftStories"] },
    },
  ).then((r) => r.json())) as GetStoriesResult;
};
