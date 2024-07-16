"use client";

import { type GetStoryResult } from "@/app/api/stories/id/[id]/route";
import { type patchStorySchema } from "@/app/api/stories/schema";
import FormTextArea from "@/components/Form/FormTextArea";
import axios from "axios";
import {
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react";
import useSWR from "swr";
import { type z } from "zod";

interface Props {
  storyId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data as GetStoryResult);

export default function EditFooterForm({ storyId, setIsOpen }: Props) {
  const { data, isLoading, mutate } = useSWR(
    `/api/stories/id/${storyId}?include_content=true`,
    fetcher,
  );
  const [value, setValue] = useState(data?.storyContent?.[0].footer ?? "");
  const [dirty, setDirty] = useState(false);
  const [submitLoading, startTransition] = useTransition();

  return (
    <>
      <div className="flex flex-col gap-2 px-4 pb-5">
        <FormTextArea
          title="Footer Text"
          value={value}
          disabled={isLoading || submitLoading}
          onChange={(e) => {
            setDirty(true);
            setValue(e.target.value);
          }}
        />
      </div>
      <hr />
      <div className="flex flex-row gap-2 p-4">
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-md bg-red-500 px-3 py-2 font-semibold text-white hover:bg-red-600"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            startTransition(async () => {
              try {
                if (dirty) {
                  await axios.patch<z.infer<typeof patchStorySchema>>(
                    `/api/stories/id/${storyId}`,
                    {
                      footer: value !== "" ? value : null,
                    },
                  );
                  await mutate();
                  setIsOpen(false);
                }
              } catch (err) {
                console.error(err);
              }
            });
          }}
          className={`rounded-md bg-blue-500 px-3 py-2 font-semibold text-white
          hover:bg-blue-600 disabled:pointer-events-none disabled:opacity-40`}
          disabled={isLoading || submitLoading}
        >
          Submit
        </button>
      </div>
    </>
  );
}
