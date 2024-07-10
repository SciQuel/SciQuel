import { type GetStoryResult } from "@/app/api/stories/id/[id]/route";
import { generateMarkdown } from "@/lib/markdown";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Section {
  type: string;
  content: string;
}

interface Article {
  id?: string;
  title?: string;
  summary?: string;
  image?: string;
  caption?: string;
  date?: Date | null;
  body: string;
  sections?: Section[];
}

interface Props {
  article: Article;
  id: string;
}

const StoryPreview: React.FC<Props> = ({ article, id }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Display the image  */}
      <div className="relative">
        {article.image && (
          <Image
            src={article.image}
            className="h-auto w-full object-cover"
            alt={article.title || ""}
            width={1700}
            height={768}
          />
        )}

        {/* display title and summary */}
        <div className="absolute bottom-0 left-0 w-full px-12 py-10">
          <h1
            className="w-4/5 p-8 text-4xl font-bold sm:text-6xl"
            style={{ color: "white" }}
          >
            {article.title}
          </h1>
          <h2
            className="w-5/6 p-8 pt-0 text-3xl font-semibold"
            style={{ color: "white" }}
          >
            {article.summary}
          </h2>
        </div>
      </div>

      {/* Renders the article title at the top of the page */}
      <div className="mt-4">
        <div>
          <h2 className="text-center text-3xl font-semibold">
            {article.title}
          </h2>
        </div>

        {/* This article body stuff was from a previous iteration without
          the Article Content boxes. We should delete from all affected files to 
          clean the code up. */}
        <h2>Article Body</h2>
        <p>{article.body}</p>

        {/* This part renders the boxes updated live */}
        <div>
          {article.sections &&
            article.sections.map((section, index) => (
              <div key={index} className="mt-4">
                {(() => {
                  // if its a header use an h1 tag, otherwise just use a paragraph tag
                  if (section.type === "Section Header") {
                    return (
                      <h1 className="text-lg font-semibold">
                        {section.content}
                      </h1>
                    );
                  } else {
                    return <p>{section.content}</p>;
                  }
                })()}
              </div>
            ))}
        </div>

        {/* Renders article details? idk what this does */}
        <div className="">
          <ArticleDetail articleId={id} includeContent={true} />
        </div>
      </div>
    </div>
  );
};
export default StoryPreview;

// API FETCHING BELOW

async function fetchArticleById(id: string, includeContent: boolean = false) {
  const includeContentParam = includeContent ? "?include_content=true" : "";
  const response = await fetch(`/api/stories/id/${id}${includeContentParam}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.statusText}`);
  }

  const article = await response.json();
  return article;
}

interface ArticleDetailProps {
  articleId: string;
  includeContent?: boolean;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({
  articleId,
  includeContent = false,
}) => {
  const [article, setArticle] = useState<GetStoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storyContent, setStoryContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        const fetchedArticle = await fetchArticleById(
          articleId,
          includeContent,
        );
        setArticle(fetchedArticle);

        if (includeContent && fetchedArticle.storyContent.length > 0) {
          const { file } = await generateMarkdown(
            fetchedArticle.storyContent[0].content,
          );
          setStoryContent(file.result);
        }
      } catch (err: any) {
        setError(err.message);
      }
    }

    if (articleId) {
      loadArticle();
    }
  }, [articleId, includeContent]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>{includeContent && storyContent}</div>
    </div>
  );
};
