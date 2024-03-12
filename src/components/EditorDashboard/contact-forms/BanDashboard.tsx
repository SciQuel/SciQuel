"use client";

import { type GetRecentBanResult } from "@/app/api/contact/admin/recent/route";
import { type GetBanResult } from "@/app/api/contact/admin/route";
import env from "@/lib/env";
import { type BlockedUser } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import BannedUserBox from "./BannedUserBox";

export default function BannedUserDashboard() {
  const [searchType, setSearchType] = useState("IP");
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState<null | BlockedUser[]>(
    null,
  );
  const [searchError, setSearchError] = useState("");

  const [recentBans, setRecentBans] = useState<undefined | BlockedUser[]>(
    undefined,
  );
  const [totalBans, setTotalBans] = useState<undefined | number>(undefined);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    getRecents(startIndex)
      .then()
      .catch(() => {
        setRecentBans(undefined);
      });
  }, [startIndex]);

  async function getRecents(startIndex: number) {
    try {
      const newMessagesRes = await axios.get(
        `${env.NEXT_PUBLIC_SITE_URL}/api/contact/admin/recent?start_index=${startIndex}`,
      );
      if (newMessagesRes.status == 200) {
        const { bans, count } = newMessagesRes.data as GetRecentBanResult;
        setRecentBans(bans);
        setTotalBans(count);
      }
    } catch (err) {
      console.error(err);
      setRecentBans(undefined);
    }
  }

  async function getSearchResults() {
    if (!searchString) {
      setSearchError("Search text is empty. Please fill out the input box.");
    } else {
      try {
        const response = await axios.get(
          `${env.NEXT_PUBLIC_SITE_URL}/api/contact/admin`,
          {
            params: {
              category: searchType,
              search_string: searchString,
            },
          },
        );
        if (response.status == 200) {
          const data = response.data as GetBanResult;
          setSearchResults(data.bans);
        } else {
          setSearchError(`Something went wrong. code: ${response.status}`);
        }
      } catch (err) {
        console.error(err);
        setSearchError("Something went wrong.  Please try again later");
      }
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getSearchResults()
            .then(() => {
              setSearchError("");
            })
            .catch((err) => {
              console.error(err);
              setSearchError("Something went wrong.  Please try again later");
            });
        }}
      >
        <label>
          Search Bans:{" "}
          <input
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
            required
            type="search"
          ></input>
        </label>
        <label>
          Value:
          <select
            className="mx-1 rounded-sm bg-white p-1"
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
            }}
          >
            <option value="IP">User IP</option>
            <option value="EMAIL">User Email</option>
            <option value="REASON">Ban Reason</option>
          </select>
        </label>
        <button
          className="mx-2 rounded bg-sciquelTeal px-3 py-2 text-white"
          type="submit"
        >
          Search
        </button>
        {searchError ? (
          <p className="m-2 rounded border-2 border-red-800 bg-red-100 p-1 text-lg font-semibold text-red-900">
            {searchError}
          </p>
        ) : (
          <></>
        )}
      </form>
      {searchResults ? (
        searchResults.length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {searchResults.map((bannedUser) => (
              <BannedUserBox
                key={`search-user-${bannedUser.id}`}
                record={bannedUser}
                updateRecentsOnChange={false}
              />
            ))}
          </div>
        ) : (
          <p>No matching results found</p>
        )
      ) : (
        <></>
      )}
      <div>
        <h1>Recent Activity</h1>
        {recentBans && recentBans.length > 0 ? (
          <>
            {" "}
            <h2>
              Showing Accounts {startIndex + 1} through{" "}
              {Math.min(startIndex + 8, totalBans ? totalBans : startIndex + 9)}{" "}
              of {totalBans}
              {startIndex > 0 ? (
                <button
                  className="mx-2 my-1 rounded-md border border-black px-1 "
                  onClick={() => {
                    setStartIndex((oldIndex) => {
                      return Math.max(oldIndex - 8, 0);
                    });
                  }}
                >
                  {"< "}back
                </button>
              ) : (
                <></>
              )}
              {totalBans && startIndex + 8 < totalBans ? (
                <button
                  className="mx-2 my-1 rounded-md border border-black px-1 "
                  onClick={() => {
                    setStartIndex((oldIndex) => {
                      return oldIndex + 8;
                    });
                  }}
                >
                  next{" >"}
                </button>
              ) : (
                <></>
              )}
            </h2>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentBans ? (
                recentBans?.map((ban) => (
                  <BannedUserBox
                    updateRecentsOnChange={true}
                    getRecents={() => {
                      getRecents(startIndex)
                        .then()
                        .catch((err) => {
                          console.error(err);
                        });
                    }}
                    record={ban}
                    key={`ban-block-${ban.id}`}
                  />
                ))
              ) : (
                <>loading...</>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
        {recentBans ? (
          recentBans.length == 0 ? (
            <>no accounts to show</>
          ) : (
            <></>
          )
        ) : (
          <>loading</>
        )}
      </div>
    </div>
  );
}
