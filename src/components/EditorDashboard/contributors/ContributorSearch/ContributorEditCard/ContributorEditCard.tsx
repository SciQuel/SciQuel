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

type SocialPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "facebook"
  | "website";

type SocialLink = { platform: SocialPlatform; url: string };

const inferPlatformFromUrl = (raw: string): SocialPlatform => {
  const s = raw.trim();

  const normalized =
    s.startsWith("http://") || s.startsWith("https://")
      ? s
      : `https://${s.replace(/^\/+/, "")}`;

  let host = "";
  try {
    host = new URL(normalized).hostname.toLowerCase();
  } catch {
    return "website";
  }

  host = host.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "instagram.com") return "instagram";
  if (host === "tiktok.com") return "tiktok";
  if (host === "facebook.com" || host === "fb.com") return "facebook";
  if (host === "twitter.com" || host === "x.com") return "twitter";
  if (host === "youtube.com" || host === "youtu.be") return "youtube";

  return "website";
};

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

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    (contributor as any).socialLinks?.length
      ? (contributor as any).socialLinks
      : [{ platform: "instagram", url: "" }],
  );

  const updateSocialLink = (i: number, patch: Partial<SocialLink>) => {
    setSocialLinks((prev) =>
      prev.map((x, idx) => (idx === i ? { ...x, ...patch } : x)),
    );
  };

  const addSocialLink = () =>
    setSocialLinks((prev) => [...prev, { platform: "website", url: "" }]);

  const removeSocialLink = (i: number) =>
    setSocialLinks((prev) => prev.filter((_, idx) => idx !== i));

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
                socialLinks,
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
            <div className="flex flex-col gap-2">
              <p>social links:</p>

              {socialLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="w-full rounded border-2 border-slate-600 px-2 py-1"
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => {
                      const url = e.target.value;
                      updateSocialLink(i, {
                        url,
                        platform: inferPlatformFromUrl(url),
                      });
                    }}
                    type="text"
                  />

                  <button
                    type="button"
                    className="rounded border border-slate-700 px-3 py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeSocialLink(i);
                    }}
                  //disabled={socialLinks.length === 1}
                  >
                    –
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="w-fit rounded-md border border-slate-700 px-4 py-1"
                onClick={addSocialLink}
              >
                + Add link
              </button>
            </div>
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
