"use client";

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { GeneralSubject } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createSubject, getSubjects, subjectExists } from "./subjectActions";

interface Props {
  subjects: GeneralSubject[];
  setSubjects: Dispatch<SetStateAction<GeneralSubject[]>>;
}

export default function ArticleSubjects({ subjects, setSubjects }: Props) {
  const [subjectQ, setSubjectQ] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState(subjects);
  const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);

  const [error, setError] = useState("");

  async function getSubjectsByQuery() {
    try {
      const res = await getSubjects(15, subjectQ);
      if (res.status == 200) {
        setFilteredSubjects(res.subjects);
      } else {
        setFilteredSubjects([]);
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong getting the subjects! Please try again later.",
      );
    }
  }

  async function createSubjectFromQuery() {
    try {
      const alreadyExists = await subjectExists(subjectQ);
      if (alreadyExists.status != 200) {
        setError(alreadyExists.error);
      } else if (alreadyExists.itemExists) {
        if (alreadyExists.itemType == "SUBJECT") {
          setError("Subject already exists.");
        } else {
          setError("This item already exists as a subject.");
        }
      } else {
        const res = await createSubject(subjectQ);
        if (res.error) {
          setError(res.error);
        }
        getSubjectsByQuery();
      }
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong creating your subject! Please try again later.",
      );
    }
  }

  useEffect(() => {
    getSubjectsByQuery();
  }, []);

  return (
    <div className="mb-3">
      <Popover className={`relative`}>
        <PopoverButton className={`flex flex-row gap-2`}>
          Select Subjects <PlusCircleIcon className="h-6 w-6" />
        </PopoverButton>
        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => {
            setSubjectQ("");
          }}
          beforeEnter={() => {
            getSubjectsByQuery();
          }}
        >
          <PopoverPanel className={`absolute z-10 mx-4 my-1 w-max`}>
            <div className="border-1 grid grid-cols-1 gap-1 rounded-md border bg-white px-1 py-1 shadow-lg shadow-gray-400">
              <input
                type="text"
                className="my-1"
                placeholder="Search a subject"
                value={subjectQ}
                onChange={(e) => {
                  setSubjectQ(e.target.value);
                }}
              />
              <div className="flex flex-row flex-wrap gap-3">
                <button
                  className="rounded-full border border-slate-500 px-2"
                  type="button"
                  onClick={() => {
                    getSubjectsByQuery();
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
                    Click yes to create a subject with the name:{" "}
                    <strong>{subjectQ}</strong>
                  </p>
                  <div className="flex flex-row flex-wrap gap-3">
                    <button
                      onClick={() => {
                        createSubjectFromQuery()
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
              )}{" "}
              {filteredSubjects.length < 1 ? (
                <>
                  <p>No subjects found</p>
                </>
              ) : (
                <></>
              )}{" "}
              <ul className="max-h-[170px] overflow-y-auto px-1">
                {filteredSubjects.map((subject) => (
                  <li className="">
                    <label className="flex flex-row items-center gap-1 py-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={
                          subjects.findIndex((value) => {
                            return value.name == subject.name;
                          }) > -1
                            ? true
                            : false
                        }
                        onChange={() => {
                          setSubjects((state) => {
                            const existingIndex = state.findIndex(
                              (value) => value.name == subject.name,
                            );
                            if (existingIndex > -1) {
                              return state.toSpliced(existingIndex, 1);
                            } else {
                              return [...state, subject];
                            }
                          });
                        }}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <span className={`ml-1`}>
                        {subject.name.replaceAll("_", " ")}
                      </span>
                      <span className="mx-1 text-xs font-semibold text-[#0d6efd]">{`(${
                        subject.numStories
                      } ARTICLE${subject.numStories != 1 ? "S" : ""})`}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>{" "}
      <ul className={`mb-3 mt-2 flex w-full flex-row flex-wrap gap-2`}>
        {subjects.map((existingSubject, sIndex) => (
          <li
            key={`${existingSubject.name}-${sIndex}`}
            className=" flex flex-row items-center rounded-full border border-sciquelTeal px-2 py-1"
          >
            <span className="">
              {existingSubject.name.toLowerCase().replaceAll("_", " ")}
              <button
                type="button"
                onClick={() => {
                  setSubjects((state) => {
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
                <span className="sr-only"> Delete this subject</span>
              </button>{" "}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
