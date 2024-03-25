"use client";

import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import FormSelect from "@/components/Form/FormSelect";
import { StoryTopic, StoryType } from "@prisma/client";
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

  const [storyType, setStoryType] = useState<StoryType>("DIGEST");

  const [titleColor, setTitleColor] = useState("#000000");

  const [slug, setSlug] = useState("");

  const [topics, setTopics] = useState<StoryTopic[]>(["ASTRONOMY"]);

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
                formData.append("storyType", storyType);
                formData.append("category", "ARTICLE");
                formData.append("titleColor", titleColor);
                formData.append("summaryColor", titleColor);
                formData.append("slug", slug);
                formData.append("topics", JSON.stringify(topics));
                formData.append("subtopics", "[]");
                formData.append("generalSubjects", "[]");

                formData.append("staffPicks", "false");

                formData.append("contributions", "[]");

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
        <FormInput
          title="Slug"
          required
          indicateRequired
          value={slug}
          disabled={loading}
          onChange={(e) => {
            setDirty(true);
            setSlug(e.target.value);
          }}
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
        </div>
        <label className="my-5 block">
          Story Type
          <select
            className={clsx(
              `peer w-full rounded-md px-2 py-1 placeholder-transparent outline outline-1
                outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal
                focus:ring-0`,
              "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
            )}
            placeholder="Select a story type"
            value={storyType}
            onChange={(e) => {
              setDirty(true);
              setStoryType(e.target.value as StoryType);
            }}
          >
            <option value="DIGEST">Digest</option>
            <option value="ESSAY">Essay</option>
          </select>
        </label>
        <label className="flex flex-col">
          Title Color
          <input
            value={titleColor}
            type="color"
            onChange={(e) => {
              setDirty(true);
              setTitleColor(e.target.value);
            }}
          />
        </label>{" "}
        <label>
          Select Topic
          <select
            className={clsx(
              `peer w-full rounded-md px-2 py-1 placeholder-transparent outline outline-1
                outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal
                focus:ring-0`,
              "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
            )}
            placeholder="Select a story type"
            value={topics[0]}
            onChange={(e) => {
              setDirty(true);
              setTopics([e.target.value as StoryTopic]);
            }}
          >
            <option value="ASTRONOMY">Astronomy</option>
            <option value="BIOLOGY">Biology</option>
            <option value="CHEMICAL_ENGINEERING">Chemical Engineering</option>
            <option value="CHEMISTRY">Chemistry</option>
          </select>
        </label>{" "}
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
      </Form>
    </div>
  );
}
