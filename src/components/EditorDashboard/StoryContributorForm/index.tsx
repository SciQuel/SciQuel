"use client";

import { type patchStorySchema } from "@/app/api/stories/schema";
import Form from "@/components/Form";
import FormSelect from "@/components/Form/FormSelect";
import FormTextArea from "@/components/Form/FormTextArea";
import FormUserCombobox, {
  type ComboboxValue,
} from "@/components/Form/FormUserCombobox";
import {
  type ContributionType,
  type StoryContribution,
  type User,
} from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useReducer, useState, useTransition } from "react";
import { type z } from "zod";

interface Props {
  contributors?: (StoryContribution & {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      bio: string;
    };
  })[];
  authorDirectory: {
    firstName: User["firstName"];
    lastName: User["lastName"];
    email: User["email"];
    bio: User["bio"];
  }[];
  id: string;
}

type State = {
  contributionType: ContributionType;
  author: ComboboxValue;
  bio: string;
}[];

type Action =
  | {
      type: "ADD";
      payload: {
        contributionType: ContributionType;
      };
    }
  | {
      type: "EDIT";
      payload: {
        index: number;
        contributionType: ContributionType;
        author: ComboboxValue;
        bio: string;
      };
    }
  | {
      type: "DELETE";
      payload: {
        index: number;
      };
    };

export default function StoryContributorForm({
  authorDirectory,
  contributors = [],
  id,
}: Props) {
  const router = useRouter();

  const reducer = useCallback(
    function (state: State, action: Action) {
      switch (action.type) {
        case "ADD":
          return [
            ...state,
            {
              ...action.payload,
              author: {
                text: "",
              },
              bio: "",
            },
          ];
        case "EDIT":
          return [
            ...state.slice(0, action.payload.index),
            {
              contributionType: action.payload.contributionType,
              author: action.payload.author,
              bio:
                state[action.payload.index].author.email !==
                action.payload.author.email
                  ? authorDirectory[action.payload.index].bio
                  : action.payload.bio,
            },
            ...state.slice(action.payload.index + 1),
          ];
        case "DELETE":
          return [
            ...state.slice(0, action.payload.index),
            ...state.slice(action.payload.index + 1),
          ];
      }
    },
    [authorDirectory],
  );

  const [state, dispatch] = useReducer(
    reducer,
    contributors.map((contributor) => ({
      contributionType: contributor.contributionType,
      author: {
        text: `${contributor.user.firstName} ${contributor.user.lastName} <${contributor.user.email}>`,
        name: `${contributor.user.firstName} ${contributor.user.lastName}`,
        email: contributor.user.email,
      },
      bio: contributor.user.bio,
    })),
  );
  const [dirty, setDirty] = useState(false);
  const [loading, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2">
      <Form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            if (dirty) {
              const story = await axios.patch<z.infer<typeof patchStorySchema>>(
                "/api/stories",
                {
                  id,
                  contributions: state.map((entry) => ({
                    contributionType: entry.contributionType,
                    email: entry.author.email,
                    bio: entry.bio,
                  })),
                },
              );
              const nextPage = `/editor/story/content?id=${story.data.id}`;
              router.push(nextPage);
            } else {
              router.push(`/editor/story/content?id=${id}`);
            }
          });
        }}
      >
        {state.map((row, index) => (
          <div className="mb-5 flex flex-col" key={`form-row-${index}`}>
            <div className="flex flex-row items-end gap-2">
              <FormSelect
                title="Type"
                required
                indicateRequired
                value={row.contributionType}
                disabled={loading}
                onChange={(e) => {
                  setDirty(true);
                  dispatch({
                    type: "EDIT",
                    payload: {
                      index,
                      contributionType: e.target.value as ContributionType,
                      author: row.author,
                      bio: row.bio,
                    },
                  });
                }}
              />
              <FormUserCombobox
                title="User"
                required
                indicateRequired
                value={row.author}
                disabled={loading}
                onChange={(data) => {
                  setDirty(true);
                  dispatch({
                    type: "EDIT",
                    payload: {
                      index,
                      contributionType: row.contributionType,
                      author: data,
                      bio: row.bio,
                    },
                  });
                }}
                directory={authorDirectory}
              />
              <button
                className={clsx(
                  "h-8 rounded-md bg-red-600 px-2 py-1 text-sm font-semibold text-white hover:bg-red-700",
                  "disabled:pointer-events-none disabled:opacity-50",
                )}
                onClick={() => {
                  setDirty(true);
                  dispatch({ type: "DELETE", payload: { index } });
                }}
                type="button"
                disabled={loading}
              >
                Remove
              </button>
            </div>
            <FormTextArea
              title="Author's Bio (only applies to this story)"
              required
              indicateRequired
              value={row.bio}
              disabled={loading}
              onChange={(e) => {
                setDirty(true);
                dispatch({
                  type: "EDIT",
                  payload: {
                    index,
                    contributionType: row.contributionType,
                    author: row.author,
                    bio: e.target.value,
                  },
                });
              }}
            />
          </div>
        ))}
        <div>
          <button
            className={clsx(
              "h-8 rounded-md bg-teal-600 px-2 py-1 text-sm font-semibold text-white hover:bg-teal-700",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
            onClick={() => {
              setDirty(true);
              dispatch({
                type: "ADD",
                payload: { contributionType: "AUTHOR" },
              });
            }}
            type="button"
            disabled={loading}
          >
            + Add New Contributor
          </button>
        </div>
        <div>
          <button
            type="submit"
            className="mt-5 select-none rounded-md bg-teal-600 px-2 py-1 font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
            disabled={
              state.some((entry) => !entry.author.email || entry.bio === "") ||
              loading
            }
          >
            Continue
          </button>
        </div>
      </Form>
    </div>
  );
}
