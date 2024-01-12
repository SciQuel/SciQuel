"use client";

import env from "@/lib/env";
import { type Feedback } from "@prisma/client";
import axios from "axios";
import { DateTime } from "luxon";
import { useState } from "react";

interface Props {
  message: Feedback;
  type: "feedback" | "get involved";
  updateMessage: (newMessage: Feedback) => void;
}

export default function ContactMessage({
  message,
  type,
  updateMessage,
}: Props) {
  const [updateTo, setUpdateTo] = useState("");

  console.log(message);
  const messageStatus = message.status.toLowerCase().replace("_", " ");
  return (
    <div
      className={`m-3 min-w-[30%] flex-1 border-4 border-sciquelTeal bg-sciquelCardBg p-2`}
    >
      <h1 className=" border-b-2 border-sciquelTeal pb-2 text-lg font-bold text-sciquelTeal">
        Message ({messageStatus}) :
        <span
          className={`float-right rounded-full px-2 ${
            type == "feedback" ? " bg-blue-100" : " bg-teal-200"
          }`}
        >
          {type}
        </span>
      </h1>
      <h2>
        From {message.name} at{" "}
        <a href={`mailto:${message.email}`}>{message.email}</a>
      </h2>
      <h2 className="mb-2 border-b-2 border-sciquelTeal pb-2">
        Date:{" "}
        {DateTime.fromJSDate(new Date(message.createdAt)).toLocaleString(
          DateTime.DATETIME_FULL,
        )}
      </h2>
      <h2>Text:</h2>
      <p>{message.message}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          console.log(updateTo, " is new status update for doc", message.id);
          let newStatus;
          if (updateTo == "in-progress") {
            newStatus = "NEEDS_RESPONSE";
          } else if (updateTo == "closed") {
            newStatus = "CLOSED";
          }

          if (newStatus) {
            try {
              const status = await axios.patch(
                `${env.NEXT_PUBLIC_SITE_URL}/api/contact/feedback/${message.id}`,
                {
                  new_status: newStatus,
                },
              );

              console.log(status);
              if (status.status == 200) {
                const newMessage = status.data.updatedFeedback as Feedback;
                updateMessage(newMessage);
              }
            } catch (err) {
              console.error(err);
            }
          }
        }}
        className="mt-2 flex flex-col border-t-2 border-sciquelTeal pt-2"
      >
        <div className="flex flex-row">
          <input
            value="in-progress"
            id={`in-progress-radio-${message.id}`}
            name={`change-status-${message.id}`}
            type="radio"
            checked={updateTo == "in-progress" ? true : false}
            onChange={(e) => {
              setUpdateTo(e.target.value);
            }}
          ></input>
          <label htmlFor={`in-progress-radio-${message.id}`}>
            Mark In-Progress
          </label>
        </div>
        <div className="flex flex-row">
          <input
            value="closed"
            id={`closed-radio-${message.id}`}
            name={`change-status-${message.id}`}
            type="radio"
            checked={updateTo == "closed" ? true : false}
            onChange={(e) => {
              setUpdateTo(e.target.value);
            }}
          ></input>
          <label htmlFor={`closed-radio-${message.id}`}>Mark Closed</label>
        </div>
        <button
          className="my-2 w-fit rounded bg-sciquelTeal p-2 text-white"
          type="submit"
        >
          Submit Status Change
        </button>
      </form>
    </div>
  );
}
