"use client";

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { Prisma, Subtopic } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createSubtopic, getSubtopics } from "./actions";

interface Props {
  subtopics: Subtopic[];
  setSubtopics: Dispatch<SetStateAction<Subtopic[]>>;
  storyId?: string;
}

async function getSubtopicList(query?: string) {
  try {
    const res = await getSubtopics(15, query);

    if (res.status != 200) {
      console.error(res);
      return res.error ?? "unknown error";
    }

    return res.subtopics ?? [];
  } catch (err) {
    console.error(err);
    return "unknown error";
  }
}

export default function ArticleSubtopics({
  subtopics,
  setSubtopics,
  storyId,
}: Props) {
  const [subtopicQuery, setSubtopicQ] = useState("");
  const [filteredSubtopics, setFilteredSubtopics] = useState<Subtopic[]>([]);
  const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);

  const [error, setError] = useState("");

  async function getAllSubtopics() {
    try {
      const subtopicList = await getSubtopicList(subtopicQuery ?? undefined);
      if (typeof subtopicList != "string") {
        setFilteredSubtopics(subtopicList);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }
  }

  async function createSubtopicFromQuery() {
    try {
      const result = await createSubtopic(subtopicQuery);

      if (result.error) {
        setError(result.error);
      }

      getAllSubtopics();
    } catch (err) {
      setError("Something went wrong while creating your subtopic!");
    }
  }

  useEffect(() => {
    getAllSubtopics();
  }, []);

  return (
    <div>
      <Popover className={`relative`}>
        <label className="inline-flex flex-row items-center gap-2">
          Select Subtopics
          <PopoverButton className>
            <span className="sr-only">Open Subtopic Select Popup</span>
            <PlusCircleIcon className="h-6 w-6" />
          </PopoverButton>
        </label>
        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => {
            setSubtopicQ("");
          }}
          beforeEnter={() => {
            getAllSubtopics();
          }}
        >
          <PopoverPanel className={`absolute z-10 mx-4 my-1 w-max`}>
            <div className="border-1 grid grid-cols-1 gap-1 rounded-md border bg-white px-1 py-1 shadow-lg shadow-gray-400">
              <input
                className="my-1"
                placeholder="Search a subtopic"
                value={subtopicQuery}
                onChange={(event) => {
                  setSubtopicQ(event.target.value);
                }}
              />
              <div className="flex flex-row flex-wrap gap-3">
                <button
                  className="rounded-full border border-slate-500 px-2"
                  type="button"
                  onClick={() => {
                    getAllSubtopics();
                  }}
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    setShowCreateConfirmation(true);
                  }}
                  type="button"
                  className="rounded-full border border-slate-500 px-2"
                >
                  Create New
                </button>
              </div>
              {showCreateConfirmation ? (
                <div>
                  <p>
                    <strong>Are you sure?</strong>
                  </p>
                  <p className="mr-4 max-w-72">
                    Click yes to create a subtopic with the name:{" "}
                    <strong>{subtopicQuery}</strong>
                  </p>
                  <div className="flex flex-row flex-wrap gap-3">
                    <button
                      onClick={() => {
                        createSubtopicFromQuery()
                          .then(() => {
                            setShowCreateConfirmation(false);
                          })
                          .catch((err) => {
                            console.error(err);
                            setShowCreateConfirmation(false);
                          });
                      }}
                      type="button"
                      className="rounded border border-slate-500 px-2"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateConfirmation(false);
                      }}
                      type="button"
                      className="rounded border border-slate-500 px-2"
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <></>
              )}

              {filteredSubtopics.length < 1 ? (
                <>
                  <p>No subtopics found</p>
                </>
              ) : (
                <></>
              )}
              <ul className="max-h-[170px] overflow-y-auto px-1">
                {filteredSubtopics.map((subtopic) => (
                  <li className="">
                    <label className="flex flex-row items-center gap-1 py-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={
                          subtopics.findIndex((value) => {
                            return value.name == subtopic.name;
                          }) > -1
                            ? true
                            : false
                        }
                        onChange={() => {
                          setSubtopics((state) => {
                            const existingIndex = state.findIndex(
                              (value) => value.name == subtopic.name,
                            );
                            if (existingIndex > -1) {
                              return state.toSpliced(existingIndex, 1);
                            } else {
                              return [...state, subtopic];
                            }
                          });
                        }}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <span className={`ml-1`}>
                        {subtopic.name.replaceAll("_", " ")}
                      </span>
                      <span className="mx-1 text-xs font-semibold text-[#0d6efd]">{`(${
                        subtopic.numStories
                      } ARTICLE${subtopic.numStories != 1 ? "S" : ""})`}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
      <ul className={`mb-3 mt-2 flex w-full flex-row flex-wrap gap-2`}>
        {subtopics.map((existingSubtopic, sIndex) => (
          <li
            key={`${existingSubtopic.name}-${sIndex}`}
            className=" flex flex-row items-center rounded-full border border-sciquelTeal px-2 py-1"
          >
            <span className="">
              {existingSubtopic.name.toLowerCase().replaceAll("_", " ")}
              <button
                type="button"
                onClick={() => {
                  setSubtopics((state) => {
                    const copy = [...state];
                    copy.splice(sIndex, 1);
                    return copy;
                  });
                }}
                className="ml-1 px-1 font-bold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="8"
                  height="8"
                  className="cursor-pointer"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="8"
                    y2="8"
                    className="stroke-sciquelTeal stroke-2 hover:shadow-lg hover:shadow-black"
                  />
                  <line
                    x1="0"
                    y1="8"
                    x2="8"
                    y2="0"
                    className="stroke-sciquelTeal stroke-2 hover:shadow-lg hover:shadow-black"
                  />
                </svg>
                <span className="sr-only"> Delete this subtopic</span>
              </button>{" "}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
