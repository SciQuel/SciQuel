"use client";

import { type Contributor } from "@prisma/client";
import { useState } from "react";
import ContributorAddForm from "./ContributorAddForm";

interface Props {
  contributor: Contributor;
  storyId: string;
}

export default function FoundContributor({ contributor, storyId }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="my-2 rounded-lg border border-slate-300 bg-slate-50 p-2">
      <p>{`${contributor.firstName} ${contributor.lastName}`}</p>
      <p>Slug: {contributor.contributorSlug}</p>
      <p>{contributor.email ?? "No associated email"}</p>
      <p>{contributor.bio}</p>
      <button
        type="button"
        className="my-2 rounded-lg border bg-slate-800 px-2 py-1 text-white"
        onClick={() => {
          setShowForm((state) => !state);
        }}
      >
        Show Add Contribution Form
      </button>
      {showForm ? (
        <ContributorAddForm storyId={storyId} contributor={contributor} />
      ) : (
        <></>
      )}
    </div>
  );
}
