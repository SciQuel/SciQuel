"use client";

import StoryInfoForm from "@/components/EditorDashboard/StoryInfoForm";
import StoryPreview from "@/components/EditorDashboard/StoryPreview";
import React, { useState, useEffect } from "react";

import { type GetStoryResult } from "@/app/api/stories/id/[id]/route";
import { generateMarkdown } from "@/lib/markdown";

interface Section {
  type: string;
  content: string;
}

interface Props {
  story: {
    id?: string;
    title?: string;
    summary?: string;
    image?: string;
    caption?: string;
    slug?: string;
    date?: Date | null;
    body?: string;
  };
}

const StoryInfoEditorClient: React.FC<Props> = ({ story }) => {
  const [body, setBody] = useState(<ArticleDetail articleId={story.id} includeContent={true}></ArticleDetail> || "");
  const [title, setTitle] = useState(story.title || "");
  const [summary, setSummary] = useState(story.summary || "");
  const [image, setImage] = useState(story.image || null);
  const [slug, setSlug] = useState(story.slug || null);
  const [date, setDate] = useState<Date | null>(story.date ?? null);
  const [sections, setSections] = useState<Section[]>([]);

  // inserts newContent into the array at idx – basically anytime user inputs
  const handleSectionChange = (idx: number, newContent: string) => {
    const updatedSections = [...sections];
    updatedSections[idx].content = newContent;
    setSections(updatedSections);
  };

  // adds a section of {Type (header, text, etc) with no content initially}
  const handleAddSection = (type: string) => {
    setSections([...sections, { type, content: "" }]);
  };

  // copies array into new array except for the section at delIdx
  const handleDeleteSection = (delIdx: number) => {
    // will trigger when we press the trash icon
    const newArray = [];
    for (let i = 0; i < sections.length; i++) {
      if (i === delIdx) {
        continue;
      }
      newArray.push(sections[i]);
    }
    setSections(newArray);
  };

  console.log(story);

  return (
    <div className="mx-32 mt-5 flex flex-col gap-5">
      <div className="flex gap-5">
        {/* LEFT HAND SIDE */}
        <div className="w-1/3">
          <h3 className="text-3xl font-semibold text-sciquelTeal">
            Story Info
          </h3>
          <StoryInfoForm
            id={story.id}
            title={title}
            setTitle={setTitle}
            summary={summary}
            setSummary={setSummary}
            image={image}
            setImage={setImage}
            slug={slug}
            setSlug={setSlug}
            date={date}
            setDate={setDate}
            body={body} // should delete this body stuff
            setBody={setBody}
            // stuff we need for the article content entry boxes
            sections={sections}
            onSectionChange={handleSectionChange}
            onAddSection={handleAddSection}
            onDeleteSection={handleDeleteSection}
          />
        </div>

        {/* RIGHT HAND SIDE */}
        <div className="w-2/3 bg-white">
          <h3 className="text-3xl font-semibold text-sciquelTeal">
            Story Preview
          </h3>
          <StoryPreview article={{ title, summary, body, image, slug, date, sections }} id={story.id} />
        </div>
      </div>
    </div>
  );
};

export default StoryInfoEditorClient;

//API fetch below
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
    storyContent
  );
};
