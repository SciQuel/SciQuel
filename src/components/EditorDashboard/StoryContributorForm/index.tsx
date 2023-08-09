"use client";

import Form from "@/components/Form";
import FormSelect from "@/components/Form/FormSelect";
import FormUserCombobox, {
  type ComboboxValue,
} from "@/components/Form/FormUserCombobox";
import {
  type ContributionType,
  type StoryContribution,
  type User,
} from "@prisma/client";
import { useReducer } from "react";

interface Props {
  contributors?: (StoryContribution & {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  })[];
  authorDirectory: {
    firstName: User["firstName"];
    lastName: User["lastName"];
    email: User["email"];
  }[];
}

type State = {
  contributionType: ContributionType;
  author: ComboboxValue;
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
      };
    }
  | {
      type: "DELETE";
      payload: {
        index: number;
      };
    };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          ...action.payload,
          author: {
            text: "",
          },
        },
      ];
    case "EDIT":
      return [
        ...state.slice(0, action.payload.index),
        {
          contributionType: action.payload.contributionType,
          author: action.payload.author,
        },
        ...state.slice(action.payload.index + 1),
      ];
    case "DELETE":
      return [
        ...state.slice(0, action.payload.index),
        ...state.slice(action.payload.index + 1),
      ];
  }
}

export default function StoryContributorForm({
  authorDirectory,
  contributors = [],
}: Props) {
  const [state, dispatch] = useReducer(
    reducer,
    contributors.map((contributor) => ({
      contributionType: contributor.contributionType,
      author: {
        text: `${contributor.user.firstName} ${contributor.user.lastName} <${contributor.user.email}>`,
        name: `${contributor.user.firstName} ${contributor.user.lastName}`,
        email: contributor.user.email,
      },
    })),
  );

  return (
    <div className="flex flex-col gap-2">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {state.map((row, index) => (
          <div
            className="mb-5 flex flex-row items-end gap-2"
            key={`form-row-${index}`}
          >
            <FormSelect
              title="Type"
              required
              indicateRequired
              value={row.contributionType}
              onChange={(e) =>
                dispatch({
                  type: "EDIT",
                  payload: {
                    index,
                    contributionType: e.target.value as ContributionType,
                    author: row.author,
                  },
                })
              }
            />
            <FormUserCombobox
              title="User"
              value={row.author}
              onChange={(data) =>
                dispatch({
                  type: "EDIT",
                  payload: {
                    index,
                    contributionType: row.contributionType,
                    author: data,
                  },
                })
              }
              directory={authorDirectory}
            />
            <button
              className="h-8 rounded-md bg-red-600 px-2 py-1 text-sm font-semibold text-white hover:bg-red-700"
              onClick={() => dispatch({ type: "DELETE", payload: { index } })}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="h-8 rounded-md bg-teal-600 px-2 py-1 text-sm font-semibold text-white hover:bg-teal-700"
          onClick={() =>
            dispatch({ type: "ADD", payload: { contributionType: "AUTHOR" } })
          }
          type="button"
        >
          + Add New Contributor
        </button>
      </Form>
    </div>
  );
}
