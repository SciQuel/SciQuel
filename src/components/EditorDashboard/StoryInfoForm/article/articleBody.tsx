import React, { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * ArticleBody Component
 *
 * This component allows users to input a large amount of text for the article body.
 *
 * @param {string} value - The current value of the text input.
 * @param {function} onChange - Function to handle the change in text input.
 * @returns The rendered body of text on the website.
 */
export default function ArticleBody({ value, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value); // Call the onChange function with the new value
  };

  return (
    <div className="my-5 flex flex-col">
      <label className="flex flex-col">
        Article Body
        <textarea
          value={value}
          onChange={handleChange} // Handle change events
          placeholder="Write your article here..."
          className="custom_textarea mt-1"
          rows={5} // Set the number of rows for the textarea
        />
      </label>
    </div>
  );
}
