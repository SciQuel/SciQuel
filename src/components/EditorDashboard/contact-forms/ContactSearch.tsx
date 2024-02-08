"use client";

import { type GetContactSearchResult } from "@/app/api/contact/search/route";
import env from "@/lib/env";
import { type ContactMessage } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import ContactBox from "./ContactBox";

export default function ContactSearch() {
  const [searchString, setSearchString] = useState("");
  const [searchCategory, setSearchCategory] = useState("IP");

  const [searchResults, setSearchResults] = useState<ContactMessage[] | null>(
    null,
  );

  const [error, setError] = useState("");

  async function search() {
    if (!searchString) {
      setError("Search value is required.");
    }

    try {
      const results = await axios.get(
        `${env.NEXT_PUBLIC_SITE_URL}/api/contact/search`,
        {
          params: {
            search_string: searchString,
            field: searchCategory,
          },
        },
      );
      if (results.status == 200) {
        const resultData = results.data as GetContactSearchResult;
        setSearchResults(resultData.messages);
      } else {
        setError(`Something went wrong. Code: ${results.status}`);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    }
  }

  return (
    <div className="w-full px-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search()
            .then((result) => {})
            .catch((err) => {
              console.error(err);
              setError("Something went wrong. Please try again later.");
            });
        }}
        className="my-2 rounded-lg border-4 border-sciquelTeal px-6 py-4  "
      >
        <h1 className="text-xl font-bold text-sciquelTeal">
          Search Contact Messages:
        </h1>
        <div className="flex flex-row flex-wrap">
          <label className="block p-2">
            Input Search Value:{" "}
            <input
              required
              value={searchString}
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
              type="search"
            />
          </label>
          <label className="block p-2">
            Search Category:{" "}
            <select
              className="mx-1 rounded-sm bg-white p-1"
              value={searchCategory}
              onChange={(e) => {
                setSearchCategory(e.target.value);
              }}
            >
              <option value="MESSAGE">Message Text</option>
              <option value="IP">User IP</option>
              <option value="EMAIL">User Email</option>
              <option value="NAME">User Name</option>
            </select>
          </label>
          <button
            className="rounded-full border-4 border-sciquelTeal px-4 text-lg font-semibold"
            type="submit"
          >
            Search
          </button>
        </div>
        {error ? <p>{error}</p> : <></>}
      </form>
      {searchResults !== null ? (
        <div>
          <h2>Results:</h2>
          {searchResults.length > 0 ? (
            searchResults.map((item, index) => (
              <ContactBox
                type={
                  item.contactType == "FEEDBACK" ? "feedback" : "get involved"
                }
                updateMessage={() => {}}
                message={item}
                updateScreenFunction={() => {}}
                key={`search-results-${item.id}`}
              />
            ))
          ) : (
            <p>No matching messages found.</p>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
