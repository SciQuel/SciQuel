"use client";

import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import { useRef, useState } from "react";

interface Props {
  title?: string;
  summary?: string;
  image?: string;
}

export default function StoryInfoForm({
  title: initialTitle,
  summary: initialSummary,
  image: initialImage,
}: Props) {
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialTitle ?? "");
  const [summary, setSummary] = useState(initialSummary ?? "");
  const [image, setImage] = useState<File | string | null>(
    initialImage ?? null,
  );
  return (
    <div className="flex flex-col gap-2">
      <Form>
        <FormInput
          title="Story Title"
          required
          indicateRequired
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <FormInput
          title="Summary"
          required
          indicateRequired
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <div className="mt-5">
          <h3 className="mb-2">Background Image</h3>
          <label
            className="cursor-pointer rounded-md bg-teal-600 px-2 py-1 font-semibold text-white hover:bg-teal-700"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fileUploadRef.current?.click();
              }
            }}
            tabIndex={0}
          >
            <input
              type="file"
              className="hidden"
              ref={fileUploadRef}
              onChange={(e) => {
                setImage(e.target.files?.[0] ?? null);
              }}
              accept="image/jpeg, image/png, image/gif"
            />
            Select file to upload
          </label>
          <div className="my-5 rounded-md border bg-white p-2">
            <h3 className="mb-3 text-xl font-semibold">Image Preview</h3>
            {image && typeof image !== "string" ? (
              <>
                <p>Uploaded file: {image.name}</p>
                <div className="h-96">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(image)}
                    className="h-full object-contain"
                  />
                </div>
              </>
            ) : typeof image === "string" ? (
              <>
                <p>Image URL: {image}</p>
                <div className="h-96">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} className="h-full object-contain" />
                </div>
              </>
            ) : (
              <p className="italic">No image uploaded</p>
            )}
          </div>
          <button
            type="button"
            className="mt-5 select-none rounded-md bg-teal-600 px-2 py-1 font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
            disabled={
              title.length === 0 || summary.length === 0 || image === null
            }
          >
            Continue
          </button>
        </div>
      </Form>
    </div>
  );
}
