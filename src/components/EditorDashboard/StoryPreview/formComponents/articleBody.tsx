import React from "react";
import styles from "./article.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function ArticleBody({ value, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
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
