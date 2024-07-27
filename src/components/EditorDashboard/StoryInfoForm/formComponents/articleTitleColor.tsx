import React from "react";

interface ArticleTitleColorProps {
  value: string;
  onChange: (color: string) => void;
}

const ArticleTitleColor: React.FC<ArticleTitleColorProps> = ({ value, onChange }) => {
  return (
    <label className="my-5 flex flex-col">
      Title Color
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
};

export default ArticleTitleColor;
