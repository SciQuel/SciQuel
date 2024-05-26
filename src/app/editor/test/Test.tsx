"use client";

import env from "@/lib/env";
import axios from "axios";
import { useState } from "react";

export default function Test() {
  const [newName, setNewName] = useState("");
  const [result, setResult] = useState("");

  return (
    <form
      className="m-2"
      onSubmit={(e) => {
        e.preventDefault();
        axios
          .post(`${env.NEXT_PUBLIC_SITE_URL}/api/stories/subtopics/create`, {
            name: newName,
          })
          .then((result) => {
            console.log(result);
            setResult("Successfully created subtopic");
          })
          .catch((err) => {
            console.error(err);
            setResult("Something went wrong!");
          });
      }}
    >
      <h2 className="text-2xl">create new subtopic</h2>
      <label>
        name:{" "}
        <input
          className="mx-2 rounded border-2"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
          }}
          type="text"
        ></input>
      </label>
      <button className="rounded-full bg-green-300 px-2 py-1" type="submit">
        post test
      </button>
      {result ? (
        <p className="m-2">
          {result}{" "}
          <button
            className="rounded-full bg-slate-300 px-4 py-1"
            type="button"
            onClick={() => {
              setNewName("");
              setResult("");
            }}
          >
            reset form
          </button>
        </p>
      ) : (
        <></>
      )}
    </form>
  );
}
