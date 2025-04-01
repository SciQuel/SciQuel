import FormInput from "@/components/Form/FormInput";
import React from "react";
import styles from "./article.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  indicateRequired?: boolean;
  disabled?: boolean;
  setDirty: (value: boolean) => void;
};

/**
 * AriticleBody: Component that renders the article's main body text.
 *
 * @param prop.value - the body text represented as a string
 * @param prop.onChange - makes sure value is updated on user input
 * @returns A rendered component representing the article's main body text.
 */
const ArticleBody = ({ value, onChange }: Props) => {
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
};
export default ArticleBody;
