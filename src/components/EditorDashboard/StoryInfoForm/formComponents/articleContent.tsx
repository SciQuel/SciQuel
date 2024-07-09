import React, { useState } from "react";

const ArticleContent = ({}) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [sections, setSections] = useState<string[]>([]);

  const dropdownItems = ["Section Header", "Text", "Image", "Table/Graph"];

  const handleToggleDropdown = () => {
    setIsDropdown(!isDropdown); // toggles T/F for the dropdown
  };
  const handleItemClick = (section: string) => {
    setSections([...sections, section]); // append new section to new array when you click the option
    setIsDropdown(false); // closes dropdown
  };

  const handleDeleteSection = (delIdx: number) => {
    // creates new array with section we want to delete after clicking trash icon
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
    <div className="relative flex flex-col gap-2 rounded-md border border-gray-300 bg-white p-4">
      <h2 className="text-lg font-semibold">Article Content</h2>

      {sections.map((section, index) => (
        <div
          key={index}
          className="relative flex flex-col gap-2 rounded-md border border-gray-300 bg-white p-4"
        >
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">{section}</h3>
            <button
              type="button"
              className="text-red-500"
              onClick={() => handleDeleteSection(index)}
            >
              🗑️
            </button>
          </div>
          {section === "Section Header" && (
            <textarea
              className="h-32 w-full rounded-md border border-gray-300 p-2"
              placeholder="Section Header Content"
            />
          )}
          {section === "Text" && (
            <textarea
              className="h-32 w-full rounded-md border border-gray-300 p-2"
              placeholder="Text Content"
            />
          )}
          {section === "Image" && (
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Image URL"
            />
          )}
          {section === "Table/Graph" && (
            <textarea
              className="h-32 w-full rounded-md border border-gray-300 p-2"
              placeholder="Table/Graph Content"
            />
          )}
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
