"use client";

import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

interface Props {
  id?: string;
  title?: string;
  summary?: string;
  image?: string;
  caption?: string;
}

export default function StoryInfoForm({
  id: storyId,
  title: initialTitle,
  summary: initialSummary,
  image: initialImage,
  caption: initialCaption,
}: Props) {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle ?? "");
  const [summary, setSummary] = useState(initialSummary ?? "");
  const [image, setImage] = useState<File | string | null>(
    initialImage ?? null,
  );
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [dirty, setDirty] = useState(false);
  const [loading, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            try {
              if (dirty) {
                const formData = new FormData();
                if (storyId) {
                  formData.append("id", storyId);
                }
                formData.append("title", title);
                formData.append("summary", summary);
                formData.append("imageCaption", caption);
                if (image === null) {
                  return;
                } else if (typeof image === "string") {
                  formData.append("imageUrl", image);
                } else {
                  const file = new File([image], image.name);
                  formData.append("image", file, file.name);
                }
                const story = await axios.put<{ id: string }>(
                  "/api/stories",
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  },
                );
                const nextPage = `/editor/story/contributors?id=${story.data.id}`;
                router.push(nextPage);
              } else {
                router.push(`/editor/story/contributors?id=${storyId}`);
              }
            } catch (err) {
              console.error(err);
            }
          });
        }}
      >
        <FormInput
          title="Story Title"
          required
          indicateRequired
          value={title}
          onChange={(e) => {
            setDirty(true);
            setTitle(e.target.value);
          }}
          disabled={loading}
        />
        <FormInput
          title="Summary"
          required
          indicateRequired
          value={summary}
          onChange={(e) => {
            setDirty(true);
            setSummary(e.target.value);
          }}
          disabled={loading}
        />
        <div className="mt-5">
          <h3 className="mb-2">Background Image</h3>
          <label
            className={clsx(
              "cursor-pointer select-none rounded-md bg-teal-600 px-2 py-1 font-semibold text-white hover:bg-teal-700",
              loading && "pointer-events-none opacity-50",
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fileUploadRef.current?.click();
              }
            }}
            tabIndex={loading ? undefined : 0}
          >
            <input
              type="file"
              className="hidden"
              ref={fileUploadRef}
              onChange={(e) => {
                setDirty(true);
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
          <FormInput
            title="Image Caption"
            required
            indicateRequired
            value={caption}
            onChange={(e) => {
              setDirty(true);
              setCaption(e.target.value);
            }}
            disabled={loading}
          />
          <button
            type="submit"
            className="mt-5 select-none rounded-md bg-teal-600 px-2 py-1 font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
            disabled={
              title.length === 0 ||
              summary.length === 0 ||
              image === null ||
              caption.length === 0 ||
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
