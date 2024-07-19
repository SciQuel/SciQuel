"use client";

import { type GetStoryResult } from "@/app/api/stories/id/[id]/route";
import StoryInfoForm from "@/components/EditorDashboard/StoryInfoForm";
import StoryPreview from "@/components/EditorDashboard/StoryPreview";
import { generateMarkdown } from "@/lib/markdown";
import React, { useEffect, useRef, useState } from "react";

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
    date?: Date;
    body?: string;
  };
}

const StoryInfoEditorClient: React.FC<Props> = ({ story }) => {
  // sets the initial body by fetching the article through its ID
  const [body, setBody] = useState(
    (
      // TO DO: get it to actually load instead of showing as "[object Object]"
      <ArticleDetail articleId={story.id} includeContent={true}></ArticleDetail>
    ) || "",
  );
  const [title, setTitle] = useState(story.title || "");
  const [summary, setSummary] = useState(story.summary || "");
  const [image, setImage] = useState(story.image || null);
  const [slug, setSlug] = useState(story.slug || null);
  const [date, setDate] = useState<Date | null>(story.date ?? null);
  const [sections, setSections] = useState<Section[]>([]);

  // formats the input string and gets is as MM/DD/YYYY for display
  const formatPreviewDate = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  };

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

  // for the divider we only need one width (going with left) to dynamically update
  const [leftWidth, setLeftWidth] = useState(40); // 40% as default
  const [isDragging, setIsDragging] = useState(false); // T/f if user is currently dragging
  const containerRef = useRef<HTMLDivElement>(null); // ref for the container

  // handles boolean logic for clicking the dividor
  const handleDividorClick = (click: React.MouseEvent) => {
    click.preventDefault();
    setIsDragging(true);
  };
  const handleDividorUnclick = () => {
    setIsDragging(false);
  };
  const handleDividorMove = (e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newLeftWidth > 10 && newLeftWidth < 90) {
        setLeftWidth(newLeftWidth); // make sure we are within bounds
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDividorMove);
      document.addEventListener("mouseup", handleDividorUnclick);
    } else {
      document.removeEventListener("mousemove", handleDividorMove);
      document.removeEventListener("mouseup", handleDividorUnclick);
    }
    return () => {
      document.removeEventListener("mousemove", handleDividorMove);
      document.removeEventListener("mouseup", handleDividorUnclick);
    };
  }, [isDragging]);

  return (
    <div
      className="mx-32 mt-5 flex flex-col gap-5"
      ref={containerRef}
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div className="flex gap-5" style={{ height: "100%", width: "100%" }}>
        {/* LEFT HAND SIDE */}
        <div
          style={{
            width: `${leftWidth}%`,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            paddingRight: "50px",
          }}
        >
          <div style={{ flexGrow: 1, overflowY: "auto" }}>
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
              sections={sections}
              onSectionChange={handleSectionChange}
              onAddSection={handleAddSection}
              onDeleteSection={handleDeleteSection}
            />
          </div>

          {/* DIVIDER */}
          <div
            onMouseDown={handleDividorClick}
            style={{
              width: "10px",
              cursor: "col-resize",
              backgroundColor: "teal",
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
          ></div>
        </div>

        {/* RIGHT HAND SIDE */}
        <div
          style={{
            width: `${100 - leftWidth}%`,
            overflowY: "auto",
            height: "100%",
          }}
          className="bg-white"
        >
          <h3 className="text-3xl font-semibold text-sciquelTeal">
            Story Preview
          </h3>
          <StoryPreview
            article={{ title, summary, body, image, slug, date, sections }}
            formattedDate={formatPreviewDate(date)}
            id={story.id}
          />
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

  return storyContent;
};
