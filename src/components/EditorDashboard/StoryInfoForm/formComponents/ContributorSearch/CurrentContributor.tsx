"use client";

import Form from "@/components/Form";
import {
  Prisma,
  StoryContribution,
  type ContributionType,
} from "@prisma/client";
import { useState } from "react";
import { deleteContribution, editContribution } from "./actions";

interface Props {
  contribution: Prisma.StoryContributionGetPayload<{
    include: {
      contributor: true;
    };
  }>;
}

export default function CurrentContributor({ contribution }: Props) {
  const [showEdits, setShowEdits] = useState(false);

  const [currentBio, setCurrentBio] = useState(contribution.bio ?? "");
  const [editingBio, setEditingBio] = useState(contribution.bio ?? "");

  const [currentContributionTypeInfo, setCurrentCotributionTypeInfo] = useState(
    {
      contributionType: contribution.contributionType,
      otherContributorType: contribution.otherContributorType ?? "",
      otherContributorCredit: contribution.otherContributorCredit ?? "",
    },
  );
  const [editContributionType, setEditContributionType] = useState({
    contributionType: contribution.contributionType,
    otherContributorType: contribution.otherContributorType ?? "",
    otherContributorCredit: contribution.otherContributorCredit ?? "",
  });

  const [error, setError] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteDone, setDeleteDone] = useState(false);

  return (
    <li className="my-2 rounded-lg border bg-white px-2 py-1">
      <p>
        {`${contribution.contributor?.firstName} ${contribution.contributor?.lastName}`}
        {deleteDone ? (
          <>
            {" "}
            <span className="my-2 rounded-lg border border-red-800 bg-red-50 px-1 text-red-900">
              Deleted
            </span>
          </>
        ) : (
          <></>
        )}
      </p>
      <div>
        <button
          type="button"
          onClick={() => {
            setShowDelete((state) => !state);
          }}
          className="my-2 rounded-lg border border-red-800 bg-red-50 px-1 text-red-900"
        >
          Delete Contribution
        </button>
      </div>
      {showDelete ? (
        <div className=" w-full rounded-lg p-2">
          <p className="w-full text-center">
            Are you sure you want to delete this contribution?
          </p>
          <div className="flex  flex-row justify-evenly">
            <button
              type="button"
              onClick={() => {
                deleteContribution(contribution.id)
                  .then((result) => {
                    if (result.status == "success") {
                      setDeleteDone(true);
                    }
                  })
                  .catch((err) => console.error(err));
              }}
              className="my-2 rounded-lg border border-red-800 bg-red-50 px-1 text-red-900"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDelete(false);
              }}
              className=" my-2 rounded-lg border border-slate-700 bg-slate-50 px-1"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
      <p>
        <span>Story-specific bio:</span> {currentBio}
      </p>
      <p>Contribution Type: {currentContributionTypeInfo.contributionType}</p>
      {currentContributionTypeInfo.otherContributorType ? (
        <p>
          Other contribution type:{" "}
          {currentContributionTypeInfo.otherContributorType}
        </p>
      ) : (
        <></>
      )}
      {currentContributionTypeInfo.otherContributorCredit ? (
        <p>
          Other contribution credit:{" "}
          {currentContributionTypeInfo.otherContributorCredit}
        </p>
      ) : (
        <></>
      )}
      <button
        onClick={() => {
          setShowEdits((state) => !state);
        }}
        className="my-2 rounded-lg border bg-slate-800 px-2 py-1 text-white"
        type="button"
      >
        Open Edit Form
      </button>
      {showEdits ? (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            editContribution(
              contribution.id,
              editingBio,
              editContributionType.contributionType ?? undefined,
              editContributionType.otherContributorType ?? undefined,
              editContributionType.otherContributorCredit ?? undefined,
            )
              .then((result) => {
                console.log(result);
                if (result.status == "error") {
                  setError(
                    "Something went wrong, update this section later with details",
                  );
                } else if (result.data) {
                  setCurrentBio(result.data.bio ?? "");
                  setCurrentCotributionTypeInfo({
                    contributionType: result.data.contributionType,
                    otherContributorType:
                      result.data.otherContributorType ?? "",
                    otherContributorCredit:
                      result.data.otherContributorCredit ?? "",
                  });
                  setError("");
                }
              })
              .catch((err) => {
                console.error(err);
                setError("Something went wrong");
              });
          }}
        >
          <label>
            Bio (specific to this story):
            <textarea
              className="w-full rounded border border-slate-300 px-2 py-1"
              value={editingBio}
              onChange={(e) => setEditingBio(e.target.value)}
            />
          </label>
          <label className="block">
            Contribution Type:{" "}
            <select
              value={editContributionType.contributionType}
              onChange={(e) =>
                setEditContributionType((state) => ({
                  ...state,
                  contributionType: e.target.value as ContributionType,
                }))
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

          <label className="block">
            Custom Contribution Type:
            <input
              className="w-full rounded border border-slate-300 px-2 py-1"
              type="text"
              value={editContributionType.otherContributorType}
              onChange={(e) => {
                setEditContributionType((state) => ({
                  ...state,
                  otherContributorType: e.target.value,
                }));
              }}
            />
          </label>
          <label className="block">
            Custom Contribution Credit:
            <input
              className="w-full rounded border border-slate-300 px-2 py-1"
              type="text"
              value={editContributionType.otherContributorCredit}
              onChange={(e) => {
                setEditContributionType((state) => ({
                  ...state,
                  otherContributorCredit: e.target.value,
                }));
              }}
            />
          </label>

          <button
            className="my-2 rounded-lg border bg-slate-800 px-2 py-1 text-white"
            type="submit"
          >
            Submit updates
          </button>
        </Form>
      ) : (
        <></>
      )}
    </li>
  );
}
