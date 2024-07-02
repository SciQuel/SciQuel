import React from "react";
import ArticleBody from "./formComponents/articleBody";

interface Article {
  id?: string;
  title?: string;
  summary?: string;
  image?: string;
  caption?: string;
  date?: Date | null;
  body: string;
}

interface Props {
  article: Article;
}

/**
 *
 * @param param0
 * @returns
 */
const StoryPreview: React.FC<Props> = ({ article }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="mt-4">
        <div>
          <h1>Article Title</h1>
          <p> {article.title}</p>{" "}
        </div>
        <h2>Article Body</h2>
        <p>{article.body}</p>{" "}
        {/* only the body since we can't type in the preview*/}
      </div>
    </div>
  );
};

export default StoryPreview;
