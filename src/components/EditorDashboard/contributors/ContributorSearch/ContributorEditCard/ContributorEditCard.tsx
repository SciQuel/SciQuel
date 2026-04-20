"use client";

import Avatar from "@/components/Avatar";
import { useState } from "react";
import { type ContributorResult } from "../actions";
import {
  replaceContributorImage,
  updateContributorTextFields,
} from "./actions";

interface Props {
  contributor: ContributorResult;
}

export default function ContributorEditCard({ contributor }: Props) {
  const [email, setEmail] = useState(contributor.email ?? "");
  const [firstName, setFirstName] = useState(contributor.firstName);
  const [lastName, setLastName] = useState(contributor.lastName);
  const [bio, setBio] = useState(contributor.bio ?? "");
  const [slug, setSlug] = useState(contributor.contributorSlug);
  const [avatarUrl, setAvatarUrl] = useState(contributor.avatarUrl ?? "");
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [finished, setFinished] = useState(false);

  return (
    <div className="m-2 flex w-fit flex-row gap-3 rounded-lg border-2 border-slate-600 p-2">
      {editMode ? (
        <div>
          <div>
            <p className="text-ld font-bold">avatar edit section</p>
            <p>Old avatar: </p>
            <div className="flex w-full items-center justify-center">
              <Avatar
                imageUrl={avatarUrl}
                label={contributor.firstName.slice(0, 1)}
                size="2xl"
              />
            </div>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (newAvatar) {
                  console.log(contributor.id);
                  console.log(newAvatar ? newAvatar.name : "no new avatar");
                  const formData = new FormData();
                  formData.append("contributorId", contributor.id);
                  formData.append("newAvatar", newAvatar);
                  replaceContributorImage(formData)
                    .then((result) => {
                      if (result.newAvatarUrl) {
                        console.log(result.newAvatarUrl);
                        setAvatarUrl(result.newAvatarUrl);
                      } else {
                        console.log("something went wrong");
                        console.log(result.error);
                      }
                    })
                    .catch((err) => {
                      console.log("something went wrong");
                      console.error(err);
                    });
                }
              }}
            >
              <p>Upload new avatar?</p>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(event) =>
                  setNewAvatar(event.target.files?.[0] ?? null)
                }
              />
              <button
                className="w-fit rounded-md border border-slate-700 px-4 py-1"
                type="submit"
              >
                Submit new avatar
              </button>
            </form>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateContributorTextFields(
                contributor.id,
                firstName,
                lastName,
                email,
                slug,
                bio,
              )
                .then((result) => {
                  if (result.error) {
                    console.error(result.error);
                  } else {
                    setFinished(true);
                  }
                })
                .catch((err) => {
                  console.error(err);
                  setFinished(false);
                });
            }}
            className="my-4 flex flex-col justify-start gap-2 border-y-2 border-slate-600 px-3 py-3"
          >
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
            <label>
              Slug:{" "}
              <input
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
              Submit text field updates
            </button>
            {finished ? (
              <p>
                Data successfully updated. Please refresh the page to view all
                changes
              </p>
            ) : (
              <></>
            )}
          </form>
          <button
            onClick={() => {
              setEditMode(false);
            }}
            className="w-fit rounded-md border border-slate-700 px-4 py-1"
            type="button"
          >
            Close editor without saving
          </button>
        </div>
      ) : (
        <>
          <div>
            <Avatar
              imageUrl={avatarUrl}
              label={contributor.firstName.slice(0, 1)}
              size="2xl"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold">
              {contributor.firstName} {contributor.lastName}
            </h3>
            <p>
              <span className="font-bold">Email: </span>
              {contributor.email}
            </p>
            <p>
              <span className="font-bold">Slug: </span>
              {contributor.contributorSlug}
            </p>
            <p>
              {" "}
              <span className="font-bold">Bio: </span>
              {contributor.bio}
            </p>
            <button
              onClick={() => {
                setEditMode(true);
              }}
              className="w-fit rounded-md border border-slate-700 px-4 py-1"
            >
              Edit contributor
            </button>
          </div>
        </>
      )}
    </div>
  );
}
