"use client";

import { type GetDefinitionsResult } from "@/app/api/stories/definitions/route";
import env from "@/lib/env";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const fetchDefinitions = (url: string) =>
  fetch(url).then((r) => r.json() as Promise<GetDefinitionsResult>);

export default function DefinitionsDisplay({ storyId }: { storyId: string }) {
  const { data, isLoading } = useSWR(
    `${env.NEXT_PUBLIC_SITE_URL}/api/stories/definitions?storyId=${storyId}`,
    fetchDefinitions,
  );

  const [search, setSearch] = useState("");

  const filteredDefinitions =
    data?.dictionaryDefinitions.filter((definition) =>
      definition.word.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  return (
    <div className="mb-20 flex flex-col gap-2">
      <div className="flex flex-row items-center gap-5">
        <h4 className="text-lg font-semibold">Story Definitions</h4>
        <div className="grow text-right">
          <input
            className={`peer w-64 rounded-md px-2 py-1 outline outline-1 outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal focus:ring-0`}
            placeholder="Search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-auto rounded-md border border-gray-300 bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-left text-sm uppercase">
            <tr className="[&>th]:px-3 [&>th]:py-3">
              <th>Word</th>
              <th>Definition</th>
              <th>Example Sentence(s)</th>
              <th>Alternative Spellings</th>
              <th>Word Audio</th>
              <th>Definition Audio</th>
              <th>Use Audio</th>
              <th className="w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="border-gray-300 [&>tr:not(:last-child)]:border-b">
            {filteredDefinitions.map((definition) => (
              <tr key={definition.id} className="[&>td]:px-3 [&>td]:py-3">
                <td>{definition.word}</td>
                <td>{definition.definition}</td>
                <td>{definition.exampleSentences.join(", ")}</td>
                <td>{definition.alternativeSpellings?.join(", ") ?? "N/A"}</td>
                <td>
                  {definition.wordAudioUrl && (
                    <audio controls>
                      <source src={definition.wordAudioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </td>
                <td>
                  {definition.definitionAudioUrl && (
                    <audio controls>
                      <source
                        src={definition.definitionAudioUrl}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </td>
                <td>
                  {definition.useAudioUrl && (
                    <audio controls>
                      <source src={definition.useAudioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </td>
                <td>
                  <Link
                    href={`/editor/story/info?id=${storyId}`}
                    className="mr-2 rounded-md bg-teal-600 px-2 py-1 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={8} className="py-3 text-center italic">
                  Loading data...
                </td>
              </tr>
            )}
            {filteredDefinitions.length === 0 && !isLoading && (
              <tr>
                <td colSpan={8} className="py-3 text-center italic">
                  No definitions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .overflow-auto {
          overflow-x: auto;
        }

        .min-w-full {
          min-width: 100%;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f2f2f2;
        }

        td audio {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}
