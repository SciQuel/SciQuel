import React, { useState } from "react";
import styles from "./article.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * ArticleBody Component
 *
 * This component allows users to input their article on the editor's dashboard.
 *
 * @param {string} value - The current value (string text) of the users' input.
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
          onChange={handleChange}
          placeholder="Write your article here..."
          className={`${styles.custom_textarea} mt-1`}
          rows={5}
        />
      </label>
    </div>
  );
}
