import MarkdownEditorStoryInfo from "@/components/EditorDashboard/MarkdownEditorStoryInfo";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import React, { useState } from "react";

interface Section {
  type: string;
  content: string;
}

interface ArticleContentProps {
  sections: Section[];
  onSectionChange: (index: number, newContent: string) => void;
  onAddSection: (type: string) => void;
  onDeleteSection: (index: number) => void;
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  sections = [],
  onSectionChange,
  onAddSection,
  onDeleteSection,
}) => {
  const [isDropdown, setIsDropdown] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  const handleItemClick = (section: string) => {
    onAddSection(section);
    setIsDropdown(false);
  };

  const dropdownItems = ["Section Header", "Text", "Image", "Table/Graph"];

  return (
    <div className="relative flex flex-col gap-2 rounded-md border border-gray-300 bg-white p-4">
      <h2 className="text-lg font-semibold"> Article Content </h2>

      {sections.map((section, index) => (
        <div
          key={`${section.type}-${index}`}
          className="relative flex flex-col gap-2 rounded-md border border-gray-300 bg-white p-4"
        >
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">{section.type}</h3>
            <button
              type="button"
              className="text-red-500"
              onClick={() => onDeleteSection(index)}
            >
              🗑️
            </button>
          </div>

          {/* Using MarkdownEditorStoryInfo for all editable content */}
          <div className="h-[250px] w-full">
            <MarkdownEditorStoryInfo
              initialValue={section.content}
              onChange={(newContent) => onSectionChange(index, newContent)}
              id={`section-${index}`}
              style={{ height: "100%" }} // Ensure it has height styling
            />
          </div>
        </div>
      ))}

      <div className="relative mt-4 flex justify-center">
        <button
          type="button"
          className="w-24 rounded-md bg-teal-500 p-2 text-white"
          onClick={handleToggleDropdown}
        >
          +
        </button>
        {isDropdown && (
          <div className="absolute bottom-full z-10 mb-2 rounded-md border border-gray-300 bg-white p-2 shadow-lg">
            <ul>
              {dropdownItems.map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleContent;
