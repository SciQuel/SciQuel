"use client";

import { type GetContactResult } from "@/app/api/contact/route";
import env from "@/lib/env";
import { type ContactMessage } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import ContactBox from "./ContactBox";

export default function ContactDashboard() {
  const [unopened, setUnopened] = useState<ContactMessage[]>([]);
  const [inProgress, setInProgress] = useState<ContactMessage[]>([]);
  const [closed, setClosed] = useState<ContactMessage[]>([]);

  const [unopenedStart, setUnopenedStart] = useState(0);
  const [unopenedTotal, setUnopenedTotal] = useState(0);

  const [inProgressStart, setInProgressStart] = useState(0);
  const [inProgressTotal, setInProgressTotal] = useState(0);

  const [closedStart, setClosedStart] = useState(0);
  const [closedTotal, setClosedTotal] = useState(0);

  const countPerGet = 4;

  useEffect(() => {
    updateUnopened(unopenedStart)
      .then(() => {
        console.log("updated unopened list");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [unopenedStart]);

  useEffect(() => {
    updateInProgress(inProgressStart)
      .then(() => {
        console.log("updated in progress list");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [inProgressStart]);

  useEffect(() => {
    updateClosed(closedStart)
      .then(() => {
        console.log("updated closed");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [closedStart]);

  // useEffect(() => {
  //   getContactMessage()
  //     .then(() => {})
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

  async function updateUnopened(newStart: number) {
    try {
      const unopenedRes = await axios.get(
        `${
          env.NEXT_PUBLIC_SITE_URL
        }/api/contact/?status=UNOPENED&start_index=${newStart}&end_index=${
          newStart + countPerGet - 1
        }`,
      );
      if (unopenedRes.status == 200) {
        const unopenedData = unopenedRes.data as GetContactResult;

        setUnopened((state) => {
          const newState = [...state];
          unopenedData.messages.forEach((message) => {
            if (!state.some((element) => element.id == message.id)) {
              newState.push(message);
            }
          });
          return newState;
        });
        setUnopenedTotal(unopenedData.total_count);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function updateInProgress(newStart: number) {
    const inProgressRes = await axios.get(
      `${
        env.NEXT_PUBLIC_SITE_URL
      }/api/contact/?status=NEEDS_RESPONSE&start_index=${newStart}&end_index=${
        newStart + countPerGet - 1
      }`,
    );
    if (inProgressRes.status == 200) {
      const inProgressData = inProgressRes.data as GetContactResult;

      setInProgress((state) => {
        const newState = [...state];
        inProgressData.messages.forEach((message) => {
          if (!state.some((element) => element.id == message.id)) {
            newState.push(message);
          }
        });
        return newState;
      });

      setInProgressTotal(inProgressData.total_count);
    }
  }

  async function updateClosed(newStart: number) {
    try {
      const closedRes = await axios.get(
        `${
          env.NEXT_PUBLIC_SITE_URL
        }/api/contact/?status=CLOSED&start_index=${newStart}&end_index=${
          newStart + countPerGet - 1
        }`,
      );
      if (closedRes.status == 200) {
        const closedData = closedRes.data as GetContactResult;

        setClosed((state) => {
          const newState = [...state];
          closedData.messages.forEach((message) => {
            if (!state.some((element) => element.id == message.id)) {
              newState.push(message);
            }
          });
          return newState;
        });

        setClosedTotal(closedData.total_count);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function buildWidgets() {
    const widgetList = ["Unopened", "In-Progress", "Closed"];

    return (
      <>
        {widgetList.map((item) => {
          let list;
          let total;

          let setStart: Dispatch<SetStateAction<number>>;
          if (item == "Unopened") {
            list = unopened;
            total = unopenedTotal;

            setStart = setUnopenedStart;
          } else if (item == "In-Progress") {
            list = inProgress;
            total = inProgressTotal;

            setStart = setInProgressStart;
          } else {
            list = closed;
            total = closedTotal;

            setStart = setClosedStart;
          }
          return (
            <div
              key={item}
              className="m-1 w-full rounded-lg border-4 border-sciquelTeal p-0 sm:w-auto"
            >
              <h2 className="w-full border-b-4 border-sciquelTeal bg-sciquelTeal p-4 text-xl font-bold text-white">
                {item}
              </h2>
              {total > 0 ? (
                <p className="bg-[#d5e0df] p-2 font-semibold">
                  Showing Messages 1 through {list.length} out of {total}{" "}
                  {list.length < total ? (
                    <button
                      type="button"
                      onClick={() => {
                        setStart((state) => state + countPerGet);
                      }}
                    >
                      Load More
                    </button>
                  ) : (
                    <></>
                  )}
                </p>
              ) : (
                <></>
              )}

              <div className="h-screen overflow-y-scroll bg-[#d5e0df] ">
                {list.length > 0 ? (
                  list.map((message, index) => {
                    return (
                      <ContactBox
                        updateScreenFunction={() => {
                          setClosed([]);
                          setInProgress([]);
                          setUnopened([]);
                          setClosedStart(0);
                          setInProgressStart(0);
                          setUnopenedStart(0);
                        }}
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
                                setUnopenedTotal((state) => state + 1);
                                break;
                              case "NEEDS_RESPONSE":
                                setInProgress((state) => [
                                  ...state,
                                  newMessage,
                                ]);
                                setInProgressTotal((state) => state + 1);
                                break;
                              case "CLOSED":
                                setClosed((state) => [...state, newMessage]);
                                setClosedTotal((state) => state + 1);
                                break;
                              default:
                                break;
                            }
                            switch (item) {
                              case "Unopened":
                                setUnopened((state) => {
                                  const newState = [...state];
                                  newState.splice(index, 1);
                                  return newState;
                                });
                                setUnopenedTotal((state) => state - 1);
                                break;
                              case "In-Progress":
                                setInProgress((state) => {
                                  const newState = [...state];
                                  newState.splice(index, 1);
                                  return newState;
                                });
                                setInProgressTotal((state) => state - 1);
                                break;
                              case "Closed":
                                setClosed((state) => {
                                  const newState = [...state];
                                  newState.splice(index, 1);
                                  return newState;
                                });
                                setClosedTotal((state) => state - 1);
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
                        key={`${item}-message-${message.id}`}
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

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3">{buildWidgets()}</div>
      <Link
        className="m-2 text-lg font-bold text-sciquelTeal"
        href="/editor/dashboard/contact/archive"
      >
        View Archive
      </Link>
    </div>
  );
}
