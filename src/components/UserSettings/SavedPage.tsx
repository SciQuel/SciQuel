/* eslint-disable prettier/prettier */
"use client";

import { type Stories } from "@/app/api/stories/route";
import { useEffect, useState } from "react";
import ArticleList from "../ArticleList";

interface Props {
  brainedStories: Stories;
  bookmarkData: Stories;
  definitions: any;
}

type Orders = "asc" | "desc";

const SavedPage = ({ brainedStories, bookmarkData, definitions }: Props) => {
  const [topic, setTopic] = useState("brain");
  const [sortOrder, setSortOrder] = useState<Orders>("asc");
  const [sortedData, setSortedData] = useState<Stories>([]);
  let articlesToSort: Stories;

  useEffect(() => {
    switch (topic) {
      case "brain":
        articlesToSort = brainedStories;

        break;
      case "bookmark":
        articlesToSort = bookmarkData;
        break;

      case "definition":
        articlesToSort = [];
        break;
    }
    const sortedDataResults = [...articlesToSort].sort((a, b) => {
      const result =
        sortOrder === "asc"
          ? a.publishedAt.getTime() - b.publishedAt.getTime()
          : b.publishedAt.getTime() - a.publishedAt.getTime();

      return result;
    });
    setSortedData(sortedDataResults);
  }, [sortOrder, topic]);

  // Component that shows bar of topics and allows user to choose */
  const ArticleTypeBar = () => {
    return (
      <ul className="flex items-center gap-4 ">
        <button aria-label="change topic">
          <li
            onClick={() => setTopic("brain")}
            className={`${topic === "brain" ? "bg-sciquelTeal text-white" : "bg-[#c8dbe1]"
              } rounded-md border-4 border-sciquelFooter px-1 text-sm text-black`}
          >
            {" "}
            Brained Articles{" "}
          </li>
        </button>
        <button>
          <li
            onClick={() => setTopic("bookmark")}
            className={`${topic === "bookmark"
              ? "bg-sciquelTeal text-white"
              : "bg-[#c8dbe1]"
              } rounded-md border-4 border-sciquelFooter px-1 text-sm text-black`}
          >
            {" "}
            Bookmark{" "}
          </li>
        </button>
        <button>
          <li
            onClick={() => setTopic("definition")}
            className={`${topic === "definition"
              ? "bg-sciquelTeal text-white"
              : "bg-[#c8dbe1]"
              } rounded-md border-4 border-sciquelFooter px-1 text-sm text-black`}
          >
            {" "}
            Definitions{" "}
          </li>
        </button>
      </ul>
    );
  };

  //The select option to change how data is ordered */
  const SelectForm = () => {
    return (
      <select
        aria-label="Sort Readings"
        value={sortOrder}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setSortOrder(e.target.value as Orders)
        }
        className="ml-auto "
      >
        <option value="desc"> Newest to Oldest </option>
        <option value="asc"> Oldest to Newest </option>
      </select>
    );
  };

  return (
    <div className="flex h-screen  flex-col ">
      <div className=" mt-5 w-full  ">
        <h1 className="mb-1 text-xl font-bold"> Saved </h1>
        <div className="flex ">
          <ArticleTypeBar />
          <SelectForm />
        </div>
      </div>
      <div className="mb-5 mt-5 flex  flex-col overflow-x-hidden overflow-y-scroll before:mb-5 before:mr-10  before:mt-3 before:block before:w-full before:border-b-4 before:border-slate-400 ">
        {sortedData.length === 0 && <p> No data </p>}

        {(topic === "brain" || topic === "bookmark") && (
          <ArticleList
            articles={sortedData}
            preferHorizontal={true}
            hoverEffect={false}
          />
        )}

        {topic === "definition" && <p> Definitions will be here </p>}
      </div>
    </div>
  );
};
export default SavedPage;
