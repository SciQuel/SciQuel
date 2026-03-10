"use client";

import { type GetStoriesResult } from "@/app/api/stories/route";
import env from "@/lib/env";
import { DateTime } from "luxon";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const storyFetcher = (url: string) =>
  fetch(url).then((r) => r.json() as Promise<GetStoriesResult>);

export default function DraftTable() {
  const { data, isLoading } = useSWR(
    `${env.NEXT_PUBLIC_SITE_URL}/api/stories?published=false`,
    storyFetcher,
  );
  const [search, setSearch] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-5">
        <h4 className="text-lg font-semibold">Drafts</h4>
        <Link
          href="/editor/story/info"
          className="rounded-md bg-teal-600 px-2 py-1 text-sm font-semibold text-white hover:bg-teal-700"
        >
          + Create
        </Link>
        <div className="grow text-right">
          <input
            className={`peer w-64 rounded-md px-2 py-1 outline outline-1
            outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal
            focus:ring-0`}
            placeholder="Search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-clip rounded-md border border-gray-300 bg-white">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-left text-sm uppercase">
            <tr className="[&>th]:px-3 [&>th]:py-3">
              <th>Name</th>
              <th>Series</th>
              <th>Type</th>
              <th>Tags</th>
              <th>Creation Date</th>
              <th className="w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="border-gray-300 [&>tr:not(:last-child)]:border-b">
            {data?.stories?.map((story) => (
              <tr className="[&>td]:px-3 [&>td]:py-3">
                <td>{story.title}</td>
                <td>N/A</td>
                <td>{`${story.storyType[0]}${story.storyType
                  .slice(1)
                  .toLowerCase()}`}</td>
                <td>{story.topics.join(" ").toLowerCase()}</td>
                <td>
                  {DateTime.fromISO(
                    story.createdAt as unknown as string,
                  ).toLocaleString(DateTime.DATETIME_FULL)}
                </td>
                <td className="flex flex-row">
                  <Link
                    href={`/editor/story/info?id=${story.id}`}
                    className="mr-2 rounded-md bg-teal-600 px-2 py-1 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/editor/story/dictionary?id=${story.id}`}
                    className="mr-2 rounded-md bg-teal-600 px-2 py-1 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    Dictionary
                  </Link>
                  <button className="rounded-md bg-blue-600 px-2 py-1 text-sm font-semibold text-white hover:bg-blue-700">
                    Publish
                  </button>
                </td>
              </tr>
            ))}
            {!data && isLoading && (
              <tr>
                <td colSpan={7} className="py-3 text-center italic">
                  Loading data
                </td>
              </tr>
            )}
            {(!data || data.stories?.length === 0) && !isLoading && (
              <tr>
                <td colSpan={7} className="py-3 text-center italic">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
