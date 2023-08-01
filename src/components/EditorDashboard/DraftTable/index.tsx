"use client";

import { useState } from "react";

export default function DraftTable() {
  const [search, setSearch] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-5">
        <h4 className="text-lg font-semibold">Drafts</h4>
        <button className="rounded-md bg-teal-600 px-2 py-1 text-sm font-semibold text-white hover:bg-teal-700">
          + Create
        </button>
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
              <th className="w-44">Actions</th>
            </tr>
          </thead>
          <tbody className="border-gray-300 [&>tr:not(:last-child)]:border-b">
            <tr className="[&>td]:px-3 [&>td]:py-3">
              <td>Lights. Camera. Action.</td>
              <td>N/A</td>
              <td>Essay</td>
              <td>biology</td>
              <td>1 January 2023</td>
              <td>
                <button className="mr-2 rounded-md bg-teal-600 px-2 py-1 text-sm font-semibold text-white hover:bg-teal-700">
                  Edit
                </button>
                <button className="rounded-md bg-red-600 px-2 py-1 text-sm font-semibold text-white hover:bg-red-700">
                  Delete
                </button>
              </td>
            </tr>
            <tr className="[&>td]:px-3 [&>td]:py-3">
              <td>Lights. Camera. Action.</td>
              <td>N/A</td>
              <td>Essay</td>
              <td>biology</td>
              <td>1 January 2023</td>
              <td>
                <button className="mr-2 rounded-md bg-teal-600 px-2 py-1 text-sm font-semibold text-white hover:bg-teal-700">
                  Edit
                </button>
                <button className="rounded-md bg-red-600 px-2 py-1 text-sm font-semibold text-white hover:bg-red-700">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
