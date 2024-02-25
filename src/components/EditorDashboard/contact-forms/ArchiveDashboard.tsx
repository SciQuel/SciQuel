"use client";

import { type GetContactResult } from "@/app/api/contact/route";
import env from "@/lib/env";
import { type ContactMessage } from "@prisma/client";
import axios from "axios";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export default function ContactArchiveDashboard() {
  const messagesPerPage = 2;
  const [startIndex, setStartIndex] = useState(0);
  const [allMessages, setAllMessages] = useState<ContactMessage[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [totalMessageCount, setTotalMessageCount] = useState(0);

  useEffect(() => {
    if (allMessages[startIndex]) {
      console.log("using already-fetched messages");
      console.log(startIndex, startIndex + messagesPerPage - 1);
      setMessages(allMessages.slice(startIndex, startIndex + messagesPerPage));
    } else {
      getArchivedMessages()
        .then((messages) => {
          console.log(messages);
          if (messages) {
            setMessages(messages.messages);
            setAllMessages((state) => {
              const copyState = [...state];

              for (let i = 0; i < messagesPerPage; i++) {
                copyState[startIndex + i] = messages.messages[i];
              }
              return copyState;
            });
            setTotalMessageCount(messages.total_count);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [startIndex]);

  async function getArchivedMessages() {
    try {
      const res = await axios.get(
        `${
          env.NEXT_PUBLIC_SITE_URL
        }/api/contact/?status=ARCHIVED&start_index=${startIndex}&end_index=${
          startIndex + messagesPerPage - 1
        }`,
      );
      console.log(res);
      return res.data as GetContactResult;
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>
        Currently Showing Messages {startIndex + 1} through{" "}
        {Math.min(startIndex + messagesPerPage, totalMessageCount)} of{" "}
        {totalMessageCount}
        {startIndex - messagesPerPage >= 0 ? (
          <button
            onClick={() => {
              setStartIndex((state) => state - messagesPerPage);
            }}
            className="mx-2 rounded border-2 border-sciquelTeal px-1"
            type="button"
          >
            Prev Page
          </button>
        ) : (
          <></>
        )}
        {startIndex + messagesPerPage < totalMessageCount ? (
          <button
            onClick={() => {
              setStartIndex((state) => state + messagesPerPage);
            }}
            className="mx-2 rounded border-2 border-sciquelTeal px-1"
            type="button"
          >
            Next Page
          </button>
        ) : (
          <></>
        )}
      </h2>
      <div className="flex flex-row flex-wrap">
        {messages.map((message) =>
          message ? (
            <div
              key={message.id}
              className="m-3 h-fit rounded border-4  border-sciquelTeal bg-sciquelCardBg p-2 md:max-w-sm lg:w-1/3 lg:max-w-md "
            >
              <h1 className=" text-lg font-bold">Archived Message</h1>
              <p>
                <span className="font-bold">From:</span> {message.email}
              </p>
              <p>
                <span className="font-bold"> Date: </span>
                {DateTime.fromJSDate(
                  new Date(message.createdAt),
                ).toLocaleString(DateTime.DATE_FULL)}
              </p>
              <p>
                <span className="font-bold">Message:</span> {message.message}
              </p>
            </div>
          ) : (
            <></>
          ),
        )}
      </div>
    </div>
  );
}
