"use client";

import { type GetContactResult } from "@/app/api/contact/route";
import env from "@/lib/env";
import { type ContactMessage } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import ContactBox from "./ContactBox";

export default function ContactDashboard() {
  const [unopened, setUnopened] = useState<ContactMessage[]>([]);
  const [inProgress, setInProgress] = useState<ContactMessage[]>([]);
  const [closed, setClosed] = useState<ContactMessage[]>([]);

  useEffect(() => {
    getContactMessage()
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  }, []);

  async function getContactMessage() {
    let queryParams = "?";
    const currentStart = 0;
    const currentEnd = 10;

    queryParams =
      `?start_index=${currentStart}` +
      `&end_index=${currentEnd}` +
      "&include_unopened=true" +
      "&include_needs_response=true&include_closed=true";

    try {
      const messageList: ContactMessage[] = [];
      const unopenedList: ContactMessage[] = [];
      const inProgressList: ContactMessage[] = [];
      const closedList: ContactMessage[] = [];
      const unopenedRes = await axios.get(
        `${env.NEXT_PUBLIC_SITE_URL}/api/contact/?status=UNOPENED&start_index=0&end_index=5`,
      );
      if (unopenedRes.status == 200) {
        const unopenedData = unopenedRes.data as GetContactResult;

        setUnopened(unopenedData.messages);
      }

      const closedRes = await axios.get(
        `${env.NEXT_PUBLIC_SITE_URL}/api/contact/?status=CLOSED&start_index=0&end_index=5`,
      );
      if (closedRes.status == 200) {
        const closedData = closedRes.data as GetContactResult;

        setClosed(closedData.messages);
      }

      const inProgressRes = await axios.get(
        `${env.NEXT_PUBLIC_SITE_URL}/api/contact/?status=NEEDS_RESPONSE&start_index=0&end_index=5`,
      );
      if (inProgressRes.status == 200) {
        const inProgressData = inProgressRes.data as GetContactResult;

        setInProgress(inProgressData.messages);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function buildWidgets() {
    const widgetList = ["Unopened", "In-Progress", "Closed"];

    return (
      <>
        {widgetList.map((item, index) => {
          let list;
          if (item == "Unopened") {
            list = unopened;
          } else if (item == "In-Progress") {
            list = inProgress;
          } else {
            list = closed;
          }
          return (
            <div
              key={item}
              className="m-1 rounded-lg border-4 border-sciquelTeal p-0"
            >
              <h2 className="w-full border-b-4 border-sciquelTeal bg-sciquelTeal p-4 text-xl font-bold text-white">
                {item}
              </h2>
              <div className="flex flex-row flex-wrap bg-[#d5e0df]">
                {list.length > 0 ? (
                  list.map((message, index) => {
                    return (
                      <ContactBox
                        updateScreenFunction={getContactMessage}
                        type={
                          message.contactType == "FEEDBACK"
                            ? "feedback"
                            : "get involved"
                        }
                        updateMessage={(newMessage: ContactMessage) => {
                          console.log("old: ", message);
                          console.log("new: ", newMessage);
                          const oldMessageState = message.status;
                          const newMessageState = newMessage.status;
                          if (oldMessageState != newMessageState) {
                            // update lists?

                            switch (newMessageState) {
                              case "UNOPENED":
                                setUnopened((state) => [...state, newMessage]);
                                break;
                              case "NEEDS_RESPONSE":
                                setInProgress((state) => [
                                  ...state,
                                  newMessage,
                                ]);
                                break;
                              case "CLOSED":
                                setClosed((state) => [...state, newMessage]);
                                break;
                              default:
                                break;
                            }
                            switch (item) {
                              case "Unopened":
                                setUnopened((state) =>
                                  state.toSpliced(index, 1),
                                );
                                break;
                              case "In-Progress":
                                setInProgress((state) =>
                                  state.toSpliced(index, 1),
                                );
                                break;
                              case "Closed":
                                setClosed((state) => state.toSpliced(index, 1));
                                break;
                              default:
                                // ???
                                console.error(
                                  "unknown contact list type: ",
                                  item,
                                );
                                break;
                            }
                          }
                        }}
                        message={message}
                        key={`${item}-message-${index}`}
                      />
                    );
                  })
                ) : (
                  <p className="p-2 text-lg">no messages</p>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return <div>{buildWidgets()}</div>;
}
