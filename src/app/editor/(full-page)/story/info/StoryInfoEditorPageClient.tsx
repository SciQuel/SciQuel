"use client";

import StoryInfoForm from "@/components/EditorDashboard/StoryInfoForm";
import StoryPreview from "@/components/EditorDashboard/StoryPreview";
import React, { useState } from "react";

interface Props {
  story: {
    id?: string;
    title?: string;
    summary?: string;
    image?: string;
    caption?: string;
    date?: Date | null;
    body?: string;
  };
}

/**
 *
 * Client component that renders the StoryInfoForm and its corresponding StoryPreview.
 *
 * @param story – story props containing needed parameters (id, title, body, etc)
 * @returns a rendered component, with the form on the left and preview on the right.
 */
const StoryInfoEditorClient: React.FC<Props> = ({ story }) => {
  // states that are passed down to the left and right hand sides
  const [body, setBody] = useState(story.body || "");
  const [title, setTitle] = useState(story.title || "");
  // const [summary, setSummary] = useState(story.summary || "");
  // const [image, setImage] = useState(story.image || null);
  // const [caption, setCaption] = useState(story.caption || "");
  // const [date, setDate] = useState(story.date || null);
  // const [loading, setLoading] = useState(false);
  // const [dirty, setDirty] = useState(false);

  return (
    <div className="mx-32 mt-5 flex flex-col gap-5">
      {/* LEFT HAND SIDE */}
      <div className="flex gap-5">
        <div className="w-1/2">
          <h3 className="text-3xl font-semibold text-sciquelTeal">
            Story Info
          </h3>
          <StoryInfoForm
            id={story.id}
            title={title}
            setTitle={setTitle}
            body={body}
            setBody={setBody}
          />{" "}
          {/* article body */}
        </div>

        {/* RIGHT HAND SIDE */}
        <div className="w-1/2 bg-gray-100">
          <h3 className="text-3xl font-semibold text-sciquelTeal">
            Story Preview
          </h3>
          <StoryPreview article={{ title, body }} />{" "}
          {/* article body preview */}
        </div>
      </div>
    </div>
  );
};

export default StoryInfoEditorClient;
