"use client";

import axios from "axios";
import { useState } from "react";

export default function CreateStoryPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  return (
    <div className="mt-10">
      <div className="text-center">
        <p>This page is a temporary tool.</p>
      </div>
      <div className="mx-44 mt-10 flex flex-col gap-3">
        <div className="flex flex-row gap-3">
          <label htmlFor="title" className="mt-1 w-1/12 text-right">
            Title
          </label>
          <input
            id="title"
            className="grow rounded border border-gray-400 px-2 py-1"
            placeholder="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3">
          <label htmlFor="content" className="mt-1 w-1/12 text-right">
            Article Content
          </label>
          <textarea
            id="content"
            className="h-96 grow rounded border border-gray-400 px-2 py-1"
            placeholder="Article Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="text-center">
          <button
            className="rounded bg-slate-300 px-2 py-1 transition-colors hover:bg-slate-400"
            onClick={() => {
              void axios
                .post("/api/stories", { title, content })
                .then((res) => {
                  if (res.status < 300) {
                    setTitle("");
                    setContent("");
                  } else {
                    alert(
                      `Error with status ${
                        res.status
                      } has occurred:\n${JSON.stringify(res.data, null, 2)}`,
                    );
                  }
                });
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
