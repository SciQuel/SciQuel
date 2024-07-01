"use client";

import { useState } from "react";
import { search, type ContributorResult } from "./actions";
import ContributorEditCard from "./ContributorEditCard/ContributorEditCard";

export default function ContributorSearch() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [foundContributors, setFoundContributors] = useState<
    ContributorResult[]
  >([]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(
            firstName ?? undefined,
            lastName ?? undefined,
            email ?? undefined,
          )
            .then((result) => {
              if (result) {
                setFoundContributors(result);
              } else {
                setFoundContributors([]);
              }
            })
            .catch(() => {
              setFoundContributors([]);
            });
        }}
        className="my-4 flex flex-col justify-start gap-4 border-y-2 border-slate-600 px-3 py-3"
      >
        <h2 className="bont-semibold text-lg underline">Search Contributors</h2>
        <p>All fields are optional. Returns the first 8 results.</p>
        <label>
          First name:{" "}
          <input
            className="mx-2 rounded border-2 border-slate-600"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            type="text"
          />
        </label>
        <label>
          Last name:{" "}
          <input
            className="mx-2 rounded border-2 border-slate-600"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            type="text"
          />
        </label>
        <label>
          Email:{" "}
          <input
            className="mx-2 rounded border-2 border-slate-600"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
          />
        </label>
        <button
          className="w-fit rounded-md border border-slate-700 px-4 py-1"
          type="submit"
        >
          submit
        </button>
      </form>
      <div>
        {foundContributors.map((contributor) => (
          <ContributorEditCard contributor={contributor} key={contributor.id} />
        ))}
      </div>
    </div>
  );
}
