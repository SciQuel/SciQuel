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
  sections = [], // default as empty val
  onSectionChange,
  onAddSection,
  onDeleteSection,
}) => {
  const [isDropdown, setIsDropdown] = useState(false);

  // toggles dropdown menu visibility on click
  const handleToggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  // adds section from dropdown on the click
  const handleItemClick = (section: string) => {
    onAddSection(section);
    setIsDropdown(false);
  };

  const dropdownItems = ["Section Header", "Text", "Image", "Table/Graph"];

  return (
    <div className="relative flex flex-col gap-2 rounded-md border border-gray-300 bg-white p-4">
      <h2 className="text-lg font-semibold"> Article Content </h2>

      {/* Goes through each section to render them to the right side preview */}
      {sections.map((section, index) => (
        <div
          key={index}
          className="relative flex flex-col gap-2 rounded-md border border-gray-300 bg-white p-4"
        >
          <div className="flex justify-between">
            {/* Adds section type title in the box */}
            <h3 className="text-lg font-semibold">{section.type}</h3>
            {/* Adds button to delete the section */}
            <button
              type="button"
              className="text-red-500"
              onClick={() => onDeleteSection(index)}
            >
              🗑️
            </button>
          </div>

          {/* Renders selected section, making sure onChanges modify accordingly */}
          {section.type === "Section Header" && (
            <textarea
              className="h-32 w-full rounded-md border border-gray-300 p-2"
              placeholder="Section Header Content"
              value={section.content}
              onChange={(e) => onSectionChange(index, e.target.value)}
            />
          )}
          {section.type === "Text" && (
            <textarea
              className="h-32 w-full rounded-md border border-gray-300 p-2"
              placeholder="Text Content"
              value={section.content}
              onChange={(e) => onSectionChange(index, e.target.value)}
            />
          )}
          {section.type === "Image" && (
            <input // NEED TO FIX THIS TO ACTUALLY GRAB URL PATH
              type="text"
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Image URL"
              value={section.content}
              onChange={(e) => onSectionChange(index, e.target.value)}
            />
          )}
          {section.type === "Table/Graph" && (
            <textarea // THIS ONE IS ALSO A PLACEHOLDER
              className="h-32 w-full rounded-md border border-gray-300 p-2"
              placeholder="Table/Graph Content"
              value={section.content}
              onChange={(e) => onSectionChange(index, e.target.value)}
            />
          )}
        </div>
      ))}

      {/* Toggles dropdown when + is clicked to add a new section */}
      <div className="relative mt-4 flex justify-center">
        {/* Creates button with toggle function called onClick */}
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
              {/* Go through all section names and render them in the dropdown */}
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
