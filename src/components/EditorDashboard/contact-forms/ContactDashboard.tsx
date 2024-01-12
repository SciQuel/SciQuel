"use client";

import { type GetContactResult } from "@/app/api/contact/route";
import env from "@/lib/env";
import { type Feedback } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import ContactMessage from "./ContactMessage";

export default function ContactDashboard() {
  const [unopened, setUnopened] = useState<Feedback[]>([]);
  const [inProgress, setInProgress] = useState<Feedback[]>([]);
  const [closed, setClosed] = useState<Feedback[]>([]);

  useEffect(() => {
    (async () => {
      let queryParams = "?";
      const currentStart = 0;
      const currentEnd = 5;

      // queryParams += "include_feedback=true";
      // queryParams += "&include_get_involved=true";

      // queryParams += `&start_index=${currentStart}`;
      // queryParams += `&end_index=${currentEnd}`;

      // queryParams += "&include_unopened=true";
      // queryParams += "&include_needs_response=true";
      // queryParams += "&include_closed=true";

      queryParams =
        "?include_feedback=true&include_get_involved=true" +
        `&start_index=${currentStart}` +
        `&end_index=${currentEnd}` +
        "&include_unopened=true" +
        "&include_needs_response=false&include_closed=false";

      try {
        let unopenedList: Feedback[] = [];
        let inProgressList: Feedback[] = [];
        let closedList: Feedback[] = [];
        const contactMessages = await axios.get(
          `${env.NEXT_PUBLIC_SITE_URL}/api/contact${queryParams}`,
        );
        console.log(contactMessages);
        if (contactMessages.status == 200) {
          const data = contactMessages.data as GetContactResult;

          unopenedList = data.messages;
        }

        queryParams =
          "?include_feedback=true&include_get_involved=true" +
          `&start_index=${currentStart}` +
          `&end_index=${currentEnd}` +
          "&include_unopened=false" +
          "&include_needs_response=true&include_closed=false";

        const contactMessages2 = await axios.get(
          `${env.NEXT_PUBLIC_SITE_URL}/api/contact${queryParams}`,
        );
        console.log(contactMessages2);
        if (contactMessages2.status == 200) {
          const data = contactMessages2.data as GetContactResult;

          inProgressList = data.messages;
        }

        queryParams =
          "?include_feedback=true&include_get_involved=true" +
          `&start_index=${currentStart}` +
          `&end_index=${currentEnd}` +
          "&include_unopened=false" +
          "&include_needs_response=false&include_closed=true";

        const contactMessages3 = await axios.get(
          `${env.NEXT_PUBLIC_SITE_URL}/api/contact${queryParams}`,
        );
        console.log(contactMessages3);
        if (contactMessages3.status == 200) {
          const data = contactMessages3.data as GetContactResult;

          closedList = data.messages;
        }

        setUnopened(unopenedList);
        setInProgress(inProgressList);
        setClosed(closedList);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

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
                {list.map((message, index) => {
                  return (
                    <ContactMessage
                      updateMessage={(newMessage: Feedback) => {
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
                              setInProgress((state) => [...state, newMessage]);
                              break;
                            case "CLOSED":
                              setClosed((state) => [...state, newMessage]);
                              break;
                            default:
                              break;
                          }
                          switch (item) {
                            case "Unopened":
                              setUnopened((state) => state.toSpliced(index, 1));
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
                      type="feedback"
                      key={`${item}-message-${index}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return <div>{buildWidgets()}</div>;
}
