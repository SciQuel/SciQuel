"use client";

import env from "@/lib/env";
import { type BlockedUser } from "@prisma/client";
import axios from "axios";
import { DateTime } from "luxon";
import { useState } from "react";

interface Props {
  record: BlockedUser;
  getRecents: () => void;
}

export default function BannedUserBox({ record, getRecents }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  async function reverseBan() {
    try {
      const res = await axios.delete(
        `${env.NEXT_PUBLIC_SITE_URL}/api/contact/admin`,
        {
          data: {
            id: record.id,
          },
        },
      );

      if (res.status == 200) {
        getRecents();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="  rounded border-2 border-sciquelTeal p-2 ">
      <h2>Recent Ban</h2>
      <h3>Email: {record.email ? record.email : "unknown"}</h3>
      <h3>IP: {record.ip ? record.ip : "unknown"}</h3>
      <h3>Reason:</h3>
      <p>{record.reason}</p>
      <h3>Ban End Date:</h3>
      <p>
        {record.banEndTime
          ? DateTime.fromJSDate(new Date(record.banEndTime)).toLocaleString(
              DateTime.DATETIME_FULL,
            )
          : "None (Permanent Ban)"}
      </p>
      <div className="flex flex-col">
        <button
          onClick={() => {
            setShowConfirm(true);
          }}
          className="bg-red-500 px-1 text-white"
          type="button"
        >
          Reverse Ban
        </button>
        {showConfirm ? (
          <div>
            <p>Are you sure you would like to reverse this ban?</p>
            <div className="flex flex-row">
              <button
                onClick={() => {
                  reverseBan();
                }}
                className="me-2 flex-1 bg-red-500 text-white"
                type="button"
              >
                yes
              </button>{" "}
              <button
                onClick={() => {
                  setShowConfirm(false);
                }}
                className="flex-1 bg-sciquelTeal text-white"
                type="button"
              >
                no
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
