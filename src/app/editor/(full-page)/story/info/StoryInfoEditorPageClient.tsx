"use client";

import StoryInfoForm from "@/components/EditorDashboard/StoryInfoForm";
import Trivia from "@/components/EditorDashboard/StoryInfoForm/formComponents/Trivia";
import StoryPreview from "@/components/EditorDashboard/StoryPreview";
import React, { useState } from "react";

interface Section {
  type: string;
  content: string;
}

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

const StoryInfoEditorClient: React.FC<Props> = ({ story }) => {
  const [body, setBody] = useState(story.body || "");
  const [title, setTitle] = useState(story.title || "");
  const [image, setImage] = useState(story.image || null);
  const [sections, setSections] = useState<Section[]>([]);

  // inserts newContent into the array at idx – basically anytime user inputs
  const handleSectionChange = (idx: number, newContent: string) => {
    const updatedSections = [...sections];
    updatedSections[idx].content = newContent;
    setSections(updatedSections);
  };

  // adds a section of {Type (header, text, etc) with no content initially}
  const handleAddSection = (type: string) => {
    setSections([...sections, { type, content: "" }]);
  };

  // copies array into new array except for the section at delIdx
  const handleDeleteSection = (delIdx: number) => {
    // will trigger when we press the trash icon
    const newArray = [];
    for (let i = 0; i < sections.length; i++) {
      if (i === delIdx) {
        continue;
      }
      newArray.push(sections[i]);
    }
    setSections(newArray);
  };

  return (
    <div className="mx-32 mt-5 flex flex-col gap-5">
      <div className="flex gap-5">
        {/* LEFT HAND SIDE */}
        <div className="w-1/3">
          <h3 className="text-3xl font-semibold text-sciquelTeal">
            Story Info
          </h3>
          <StoryInfoForm
            id={story.id}
            title={title}
            setTitle={setTitle}
            body={body} // should delete this body stuff
            setBody={setBody}
            // stuff we need for the article content entry boxes
            sections={sections}
            onSectionChange={handleSectionChange}
            onAddSection={handleAddSection}
            onDeleteSection={handleDeleteSection}
          />
          <Trivia />
        </div>

        {/* RIGHT HAND SIDE */}
        <div className="w-2/3 bg-white">
          <h3 className="text-3xl font-semibold text-sciquelTeal">
            Story Preview
          </h3>
          {/* <StoryPreview article={{ title, body, sections }} id={story.id} /> (this is commentted
          to help test trivia section*/}
        </div>
      </div>
    </div>
  );
};

export default StoryInfoEditorClient;
