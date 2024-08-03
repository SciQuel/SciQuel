"use client";

import { type Contribution } from "@/app/editor/(full-page)/story/info/StoryInfoEditorPageClient";
import Form from "@/components/Form";
import { type Contributor } from "@prisma/client";
import { useState, type Dispatch, type SetStateAction } from "react";
import { searchContributors } from "./actions";
import CurrentContributor from "./CurrentContributor";
import FoundContributor from "./FoundContributor";

interface Props {
  contributions: Contribution[];
  setContributions: Dispatch<SetStateAction<Contribution[]>>;
  storyId: string;
}

export default function ContributorSearch({
  contributions,
  setContributions,
  storyId,
}: Props) {
  const [foundContributors, setFoundContributors] = useState<Contributor[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bioText, setBioText] = useState("");
  const [slug, setSlug] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          searchContributors({ firstName, lastName, email, bioText, slug })
            .then((result) => {
              if (result) {
                setFoundContributors(result);
              } else {
                setErrorMsg("something went wrong");
              }
            })
            .catch((err) => {
              setErrorMsg("something went wrong");
            });
        }}
        className="mb-2 flex flex-col gap-2"
      >
        <p>Search Contributors</p>
        <label className="block">
          First Name:{" "}
          <input
            className="rounded-lg border px-2 py-1"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          ></input>
        </label>
        <label className="block">
          Last Name:{" "}
          <input
            className="rounded-lg border px-2 py-1"
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          ></input>
        </label>
        <label className="block">
          Email:{" "}
          <input
            className="rounded-lg border px-2 py-1"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </label>
        <label className="block">
          Slug:{" "}
          <input
            className="rounded-lg border px-2 py-1"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
            }}
          ></input>
        </label>
        <label className="block">
          Bio Text Keywords:{" "}
          <input
            className="rounded-lg border px-2 py-1"
            type="text"
            value={bioText}
            onChange={(e) => {
              setBioText(e.target.value);
            }}
          ></input>
        </label>
        <button type="submit">Search Contributors</button>
      </Form>
      <p>Search Results:</p>
      <div>
        {foundContributors.map((foundContributor, index) => (
          <FoundContributor
            storyId={storyId}
            contributor={foundContributor}
            key={foundContributor.id}
          />
        ))}
      </div>
      <p>Current Contributions:</p>
      <ul>
        {contributions.map((contribution) => (
          <CurrentContributor
            contribution={contribution}
            key={`${contribution.id}-${contribution.contributor.id}`}
          />
        ))}
      </ul>
    </div>
  );
}
