"use client";

import Form from "@/components/Form";
import { type ContributionType, type Contributor } from "@prisma/client";
import { useState } from "react";
import { addContribution } from "./actions";

interface Props {
  storyId: string;
  contributor: Contributor;
}

export default function ContributorAddForm({ storyId, contributor }: Props) {
  const [contributionType, setContributionType] =
    useState<ContributionType>("AUTHOR");
  const [bio, setBio] = useState("");
  const [otherContributorType, setOtherContributorType] = useState("");
  const [otherContributorCredit, setOtherContributorCredit] = useState("");
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);

  return finished ? (
    <div>
      <p>Thank you for your submission. It has been recorded.</p>
    </div>
  ) : (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        if (contributionType == "OTHER") {
          if (otherContributorCredit && otherContributorType) {
            addContribution(
              storyId,
              contributor.id,
              contributionType,
              bio,
              otherContributorType,
              otherContributorCredit,
            )
              .then((result) => {
                console.log(result);
                if (result.status == "error") {
                  if (result.error == "Contribution already exists") {
                    setError(
                      "This contributor is already listed in this story.",
                    );
                  } else {
                    setError("Something went wrong!");
                  }
                } else {
                  setError("");
                  setFinished(true);
                }
              })
              .catch((err) => {
                console.error(err);
                setError("Something went wrong!");
              });
          } else {
            setError(
              "Please make sure custom contribution type and credit are fully filled in.",
            );
          }
        } else {
          addContribution(storyId, contributor.id, contributionType, bio)
            .then((result) => {
              console.log(result);
              if (result.status == "error") {
                if (result.error == "Contribution already exists") {
                  setError("This contributor is already listed in this story.");
                } else {
                  setError("Something went wrong!");
                }
              } else {
                setError("");
                setFinished(true);
              }
            })
            .catch((err) => {
              console.error(err);
              setError("Something went wrong!");
            });
        }
      }}
    >
      <p className="font-semibold">Add contribution to story:</p>
      <p>Select "other" contribution type to show custom contribution inputs</p>
      <label className="block">
        Contribution Type:{" "}
        <select
          value={contributionType}
          onChange={(e) =>
            setContributionType(e.target.value as ContributionType)
          }
        >
          <option value="AUTHOR">Author</option>
          <option value="ILLUSTRATOR">Illustrator</option>
          <option value="ANIMATOR">Animator</option>
          <option value="PHOTOGRAPHER">Photographer</option>
          <option value="VIDEOGRAPHER">Videographer</option>
          <option value="OTHER">Other</option>
        </select>
      </label>
      {contributionType == "OTHER" ? (
        <>
          <label className="block">
            Custom Contribution Type:
            <input
              className="w-full rounded border border-slate-300 px-2 py-1"
              type="text"
              value={otherContributorType}
              onChange={(e) => {
                setOtherContributorType(e.target.value);
              }}
            />
          </label>
          <label className="block">
            Custom Contribution Credit:
            <input
              className="w-full rounded border border-slate-300 px-2 py-1"
              type="text"
              value={otherContributorCredit}
              onChange={(e) => {
                setOtherContributorCredit(e.target.value);
              }}
            />
          </label>
        </>
      ) : (
        <></>
      )}
      <label>
        Bio (specific to this story):
        <textarea
          className="w-full rounded border border-slate-300 px-2 py-1"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </label>
      {error ? (
        <p className="rounded-lg border border-red-600 text-red-950">{error}</p>
      ) : (
        <></>
      )}
      <button
        className="my-2 rounded-lg border bg-slate-800 px-2 py-1 text-white"
        type="submit"
      >
        Add Contributor
      </button>
    </Form>
  );
}
