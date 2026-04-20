"use client";

import { useState } from "react";
import { type ContributorResult } from "../ContributorSearch/actions";
import ContributorEditCard from "../ContributorSearch/ContributorEditCard/ContributorEditCard";
import { createContributor } from "./actions";

export default function ContributorCreate() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [slug, setSlug] = useState("");

  const [finished, setFinished] = useState(false);
  const [conflicts, setConflicts] = useState<ContributorResult[]>([]);
  console.log(conflicts);
  return finished ? (
    <div>
      <h2>Thank you for your submission. The contributor has been created.</h2>
    </div>
  ) : (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email || !firstName || !lastName || !bio || !slug) {
            return;
          }

          createContributor(firstName, lastName, email, bio, slug)
            .then((result) => {
              console.log(result);
              if (result.error) {
                if (result.contributors) {
                  console.log("setting conflicts");
                  setConflicts(result.contributors);
                }
              } else {
                setFinished(true);
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }}
        className="my-4 flex h-fit flex-col justify-start gap-4 border-y-2 border-slate-600 px-3 py-3"
      >
        <h2 className="bont-semibold text-lg underline">
          Create New Contributors
        </h2>
        <label>
          First name:{" "}
          <input
            required
            className="mx-2 rounded border-2 border-slate-600"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            type="text"
          />
        </label>{" "}
        <label>
          Last name:{" "}
          <input
            required
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
            required
            className="mx-2 rounded border-2 border-slate-600"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
          />
        </label>
        <label>
          Slug:{" "}
          <input
            required
            className="mx-2 rounded border-2 border-slate-600"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
            }}
            type="text"
          />
        </label>
        <label>
          bio:{" "}
          <textarea
            required
            className="mx-2 w-full rounded border-2 border-slate-600"
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />
        </label>
        <button
          className="w-fit rounded-md border border-slate-700 px-4 py-1"
          type="submit"
        >
          submit
        </button>
      </form>
      {conflicts.length > 0 ? (
        <>
          <p>Conflicting contributors:</p>
          {conflicts.map((conflictingContributor) => (
            <ContributorEditCard
              contributor={conflictingContributor}
              key={conflictingContributor.id}
            />
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
