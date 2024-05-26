"use client";

import { type GenSubSearchResponse } from "@/app/api/stories/general_subjects/search/route";
import env from "@/lib/env";
import { type GeneralSubject } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

export default function GenSubSearch() {
  const [searchName, setSearchName] = useState("");
  const [resultStatus, setResultStatus] = useState("");
  const [resultList, setResultList] = useState<GeneralSubject[]>([]);

  return (
    <>
      <form
        className="m-2"
        onSubmit={(e) => {
          e.preventDefault();
          axios
            .get(
              `${env.NEXT_PUBLIC_SITE_URL}/api/stories/general_subjects/search/?search_string=${searchName}`,
            )
            .then((result) => {
              console.log(result);
              setResultStatus("Successfully found general subjects");
              const data = result.data as GenSubSearchResponse;
              setResultList(data.docs);
            })
            .catch((err) => {
              console.error(err);
              setResultStatus("Something went wrong!");
            });
        }}
      >
        <h2 className="text-2xl">search general subjects</h2>
        <label>
          name:{" "}
          <input
            className="mx-2 rounded border-2"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
            }}
            type="text"
          ></input>
        </label>
        <button className="rounded-full bg-green-300 px-2 py-1" type="submit">
          post test
        </button>
        {resultStatus ? (
          <p className="m-2">
            {resultStatus}{" "}
            <button
              className="rounded-full bg-slate-300 px-4 py-1"
              type="button"
              onClick={() => {
                setSearchName("");
                setResultStatus("");
              }}
            >
              reset form
            </button>
          </p>
        ) : (
          <></>
        )}
      </form>

      {resultList.length > 0 ? (
        <ul className="m-4 flex flex-row flex-wrap gap-3">
          {resultList.map((result) => {
            return (
              <li
                className="w-fit rounded-full bg-slate-300 px-4 py-2"
                key={result.id}
              >
                {result.name}
              </li>
            );
          })}
        </ul>
      ) : (
        <></>
      )}
    </>
  );
}
