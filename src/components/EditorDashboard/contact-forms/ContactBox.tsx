"use client";

import env from "@/lib/env";
import { type ContactMessage } from "@prisma/client";
import axios from "axios";
import { DateTime } from "luxon";
import { useState, type FormEvent } from "react";
import UserBanForm from "./BanForm";

interface Props {
  message: ContactMessage;
  type: "feedback" | "get involved";
  updateMessage: (newMessage: ContactMessage) => void;
  updateScreenFunction: () => void;
}

export default function ContactBox({
  message,
  type,
  updateMessage,
  updateScreenFunction,
}: Props) {
  const [updateTo, setUpdateTo] = useState("");
  const [banFormUser, setBanFormUser] = useState<null | ContactMessage>(null);

  const [reply, setReply] = useState("");
  const [shouldReply, setShouldReply] = useState(false);
  const messageStatus = message.status.toLowerCase().replace("_", " ");

  async function archive() {
    const newStatus = "ARCHIVED";
    try {
      const status = await axios.patch(
        `${env.NEXT_PUBLIC_SITE_URL}/api/contact/feedback/${message.id}`,
        {
          new_status: newStatus,
          send_reply: shouldReply,
          reply_text: reply,
        },
      );

      console.log(status);
      if (status.status == 200) {
        const newMessage = status.data.updatedContactMessage as ContactMessage;
        updateMessage(newMessage);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function updateStatus(e: FormEvent) {
    e.preventDefault();

    console.log(updateTo, " is new status update for doc", message.id);
    let newStatus;
    if (updateTo == "in-progress") {
      newStatus = "NEEDS_RESPONSE";
    } else if (updateTo == "closed") {
      newStatus = "CLOSED";
    } else if (updateTo == "unopened") {
      newStatus = "UNOPENED";
    }

    if (newStatus) {
      try {
        const status = await axios.patch(
          `${env.NEXT_PUBLIC_SITE_URL}/api/contact/feedback/${message.id}`,
          {
            new_status: newStatus,
            send_reply: shouldReply,
            reply_text: reply,
          },
        );

        console.log(status);
        if (status.status == 200) {
          const newMessage = status.data.updatedFeedback as ContactMessage;
          updateMessage(newMessage);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  return (
    <div
      className={`m-3 h-fit border-4  border-sciquelTeal bg-sciquelCardBg p-2 `}
    >
      <h1 className="flex justify-between border-b-2 border-sciquelTeal pb-2 text-lg font-bold text-sciquelTeal">
        Message ({messageStatus}) :
        <span
          className={`h-fit rounded-full px-2 ${
            type == "feedback" ? " bg-blue-100" : " bg-teal-200"
          }`}
        >
          {type}
        </span>
      </h1>
      <div className="mb-2 flex w-full flex-row flex-wrap border-b-2 border-sciquelTeal ">
        <div className=" ">
          <h2>
            From {message.name} at{" "}
            <a href={`mailto:${message.email}`}>{message.email}</a>
          </h2>
          <h2 className="pb-2">
            Date:{" "}
            {DateTime.fromJSDate(new Date(message.createdAt)).toLocaleString(
              DateTime.DATETIME_FULL,
            )}
          </h2>
        </div>
        {!banFormUser ? (
          <button
            className="my-2 rounded  bg-red-600 px-2 py-1 text-white"
            onClick={() => {
              setBanFormUser(message);
            }}
          >
            open user ban form
          </button>
        ) : (
          <></>
        )}
      </div>

      <h2>Text:</h2>
      <p>{message.message}</p>

      <form
        onSubmit={(e) => {
          updateStatus(e);
        }}
        className="mt-2 flex flex-col border-t-2 border-sciquelTeal pt-2"
      >
        <p>Reply:</p>
        <textarea
          value={reply}
          onChange={(e) => {
            setReply(e.target.value);
          }}
        />
        <label>
          <input
            type="checkbox"
            checked={shouldReply}
            onChange={() => {
              setShouldReply((state) => !state);
            }}
          />
          Send reply email
        </label>
        {message.status != "UNOPENED" ? (
          <div className="flex flex-row">
            <input
              value="unopened"
              id={`unopened-radio-${message.id}`}
              name={`change-status-${message.id}`}
              type="radio"
              checked={updateTo == "unopened" ? true : false}
              onChange={(e) => {
                setUpdateTo(e.target.value);
              }}
            ></input>
            <label htmlFor={`unopened-radio-${message.id}`}>
              Mark Unopened
            </label>
          </div>
        ) : (
          <></>
        )}

        {message.status != "NEEDS_RESPONSE" ? (
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
        ) : (
          <></>
        )}

        {message.status != "CLOSED" ? (
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
        ) : (
          <></>
        )}

        <button
          className="my-2 w-fit rounded bg-sciquelTeal p-2 text-white"
          type="submit"
        >
          Submit Status Change
        </button>
      </form>
      {message.status == "CLOSED" ? (
        <button
          onClick={archive}
          type="button"
          className="my-2 w-fit rounded bg-red-500 p-2 text-white"
        >
          Archive
        </button>
      ) : (
        <></>
      )}
      <div>
        {banFormUser ? (
          <UserBanForm
            updateScreenFunction={updateScreenFunction}
            closeFunction={() => setBanFormUser(null)}
            message={message}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
