import React from "react";

interface Props {
  id?: string;
  title?: string;
  summary?: string;
  image?: string;
  caption?: string;
  date?: Date | null;
}

const ArticlePreview: React.FC<Props> = ({
  id,
  title,
  summary,
  image,
  caption,
  date,
}) => {
  // Format the date
  const formattedDate = date
    ? `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
    : "";

  return (
    <div className="article-preview">
      {image && (
        <div className="image-container">
          <img
            src={typeof image === "string" ? image : URL.createObjectURL(image)}
            alt={caption}
          />
        </div>
      )}
      <div className="content">
        <h1>{title}</h1>
        <p>{summary}</p>
        {caption && <small>{caption}</small>}
        {formattedDate && <small>{formattedDate}</small>}
      </div>
    </div>
  );
};

export default ArticlePreview;
