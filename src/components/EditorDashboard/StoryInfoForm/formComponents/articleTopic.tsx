"use client";

import TopicTag from "@/components/TopicTag";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { StoryTopic } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  topics: StoryTopic[];
  setTopics: Dispatch<SetStateAction<StoryTopic[]>>;
}

const topicTagColors: Record<StoryTopic, string> = {
  ASTRONOMY: "#A44A3F",
  BIOLOGY: "#D15B2B",
  CHEMICAL_ENGINEERING: "#E3954F",
  CHEMISTRY: "#C39075",
  COMPUTER_SCIENCE: "#FFC834",
  ELECTRICAL_ENGINEERING: "#ACB377",
  ENVIRONMENTAL_SCIENCE: "#54623A",
  GEOLOGY: "#387270",
  MATHEMATICS: "#50A2A7",
  MECHANICAL_ENGINEERING: "#0A2B5E",
  MEDICINE: "#7282AC",
  PHYSICS: "#AB95B3",
  PSYCHOLOGY: "#624563",
  SOCIOLOGY: "#CC6666",
  TECHNOLOGY: "#4E413F",
} as const;

const allTopics: StoryTopic[] = [
  "ASTRONOMY",
  "BIOLOGY",
  "CHEMICAL_ENGINEERING",
  "CHEMISTRY",
  "COMPUTER_SCIENCE",
  "ELECTRICAL_ENGINEERING",
  "ENVIRONMENTAL_SCIENCE",
  "GEOLOGY",
  "MATHEMATICS",
  "MECHANICAL_ENGINEERING",
  "MEDICINE",
  "PHYSICS",
  "PSYCHOLOGY",
  "SOCIOLOGY",
  "TECHNOLOGY",
];

function getFilteredTopics(filterQuery: string) {
  return allTopics.filter((topic) =>
    topic.includes(filterQuery.toUpperCase().replaceAll(" ", "_")),
  );
}

export default function ArticleTopic({ topics, setTopics }: Props) {
  const [topicQuery, setTopicQuery] = useState("");
  const [filteredTopics, setFilteredTopics] = useState(allTopics);

  function toggleTopic(topic: StoryTopic) {
    const foundIndex = topics.indexOf(topic);
    if (foundIndex > -1) {
      setTopics(topics.toSpliced(foundIndex, 1));
    } else {
      setTopics([...topics, topic]);
    }
  }

  return (
    <div>
      <Popover className={`relative`}>
        <label className="inline-flex flex-row items-center gap-2">
          Select Topics
          <PopoverButton>
            <span className=" sr-only">Open Topics Select Popup</span>
            <PlusCircleIcon className="h-6 w-6" />
          </PopoverButton>
        </label>
        <PopoverPanel className={`absolute z-10 mx-4 my-1 w-max`}>
          <div className="border-1 grid grid-cols-1 gap-1 rounded-md border bg-white px-1 py-1 shadow-lg shadow-gray-400">
            <input
              placeholder="Search a topic"
              onChange={(event) => {
                setFilteredTopics(getFilteredTopics(event.target.value));
                setTopicQuery(event.target.value);
              }}
            />
            <ul className="max-h-[170px] overflow-y-auto px-1">
              {filteredTopics.length === 0 && topicQuery !== "" ? (
                <div className="relative cursor-default select-none py-2 text-center text-sm text-gray-700">
                  No results found.
                </div>
              ) : (
                filteredTopics.map((topic) => (
                  <li>
                    <div className="flex items-center py-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={topics.includes(topic)} // Controlled by state updates
                          onChange={() => {
                            toggleTopic(topic);
                          }}
                          className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <span className={`ml-2 `}>
                          {topic.replace("_", " ")}
                        </span>
                      </label>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </PopoverPanel>
      </Popover>
      <div className="mb-3 mt-2 flex flex-row flex-wrap gap-2">
        {topics.map((topic, tIndex) => (
          // <TopicTag name={topic} />
          <span
            style={{
              backgroundColor: topicTagColors[topic],
            }}
            className=" rounded-full px-3 py-1 text-white"
          >
            {topic.toLowerCase().replaceAll("_", " ")}
            <button className="ml-2">
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
                  className="stroke-white stroke-2 hover:shadow-lg hover:shadow-black"
                />
                <line
                  x1="0"
                  y1="8"
                  x2="8"
                  y2="0"
                  className="stroke-white stroke-2 hover:shadow-lg hover:shadow-black"
                />
              </svg>
              <span className="sr-only">Remove Topic Tag</span>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
