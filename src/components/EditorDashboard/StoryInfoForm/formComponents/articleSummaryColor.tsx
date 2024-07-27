import React from "react";

interface ArticleSummaryColorProps {
  value: string;
  onChange: (color: string) => void;
}

const ArticleSummaryColor: React.FC<ArticleSummaryColorProps> = ({ value, onChange }) => {
  return (
    <label className="my-5 flex flex-col">
      Summary Color
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
};

export default ArticleSummaryColor;
