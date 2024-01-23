"use client";

import { type GetRecentBanResult } from "@/app/api/contact/admin/recent/route";
import env from "@/lib/env";
import { type BlockedUser } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import BannedUserBox from "./BannedUserBox";

export default function BannedUserDashboard() {
  const [searchType, setSearchType] = useState("ip");
  const [recentBans, setRecentBans] = useState<undefined | BlockedUser[]>(
    undefined,
  );
  const [totalBans, setTotalBans] = useState<undefined | number>(undefined);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    getRecents(startIndex)
      .then()
      .catch((err) => {
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

  return (
    <div>
      <form>
        <label>
          Search Bans: <input type="search"></input>
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
            <option value="ip">User IP</option>
            <option value="email">User Email</option>
            <option value="reason">Ban Reason</option>
          </select>
        </label>
        <button
          className="mx-2 rounded bg-sciquelTeal px-3 py-2 text-white"
          type="submit"
        >
          Search
        </button>
      </form>
      <div>
        <h1>Recent Activity</h1>
        {recentBans && recentBans.length > 0 ? (
          <>
            {" "}
            <h2>
              Showing Accounts {startIndex + 1} through{" "}
              {Math.min(startIndex + 6, totalBans ? totalBans : 0)} of{" "}
              {totalBans}
            </h2>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentBans ? (
                recentBans?.map((ban, index) => (
                  <BannedUserBox
                    getRecents={() => {
                      getRecents(startIndex);
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
