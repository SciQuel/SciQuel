"use client";

import StoryInfoForm from "@/components/EditorDashboard/StoryInfoForm";
import Trivia from "@/components/EditorDashboard/StoryInfoForm/formComponents/TriviaComponents/Trivia";
import StoryPreview from "@/components/EditorDashboard/StoryPreview";
import parseMarkdownToSections from "@/components/MarkdownEditor/parseMarkdown";
import {
  type Contributor,
  type StoryContribution,
  type StoryTopic,
} from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";

// Interface definitions for the component's data structures
interface Section {
  type: string;
  content: string;
}

export type Contribution = StoryContribution & {
  contributor: Contributor;
};

interface Props {
  contributions: Contribution[];
  story: {
    id?: string;
    title?: string;
    summary?: string;
    image?: string;
    caption?: string;
    slug?: string;
    date?: Date;
    body?: string;
    storyType?: string;
    topics?: StoryTopic[];
    titleColor: string;
    summaryColor: string;
    contributors?: string[];
  };

  content?: string;
}

// Main component: StoryInfoEditorClient
// This component manages the state and layout for editing a story
const StoryInfoEditorClient: React.FC<Props> = ({ story, contributions }) => {
  // State declarations for various story properties
  // Grouping related state variables into a single object could be beneficial
  const [body, setBody] = useState<string>("");
  const [title, setTitle] = useState<string>(story.title || "Untitled"); // Changed to default non-null
  const [summary, setSummary] = useState<string>(story.summary || ""); // Can remain empty but not null
  const [image, setImage] = useState<string>(story.image || ""); // Empty string instead of null
  const [caption, setCaption] = useState<string>(story.caption || ""); // Can remain empty but not null
  const [slug, setSlug] = useState<string>(story.slug || "default-slug"); // Default slug instead of null
  const [date, setDate] = useState<Date>(story.date || new Date()); // Initialize with current date if null
  const [storyType, setStoryType] = useState<string>(
    story.storyType || "defaultType",
  ); // Default type instead of null
  const [topics, setTopics] = useState<StoryTopic[]>(story.topics || []); //use storytopic instead of string
  const [titleColor, setTitleColor] = useState<string>(
    story.titleColor || "#000000",
  ); // Default color
  const [summaryColor, setSummaryColor] = useState<string>(
    story.summaryColor || "#000000",
  ); // Default color
  const [contributors, setContributors] =
    useState<Contribution[]>(contributions);

  // Function to format date for preview
  // Consider moving this to a utility file for reuse
  const formatPreviewDate = (date: string): string => {
    if (!date) return "";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return ""; // invalid date check

    const year = dateObj.getFullYear().toString();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const hour = dateObj.getHours();
    const formattedHour = hour % 12 || 12;
    const minutes = dateObj.getMinutes();
    const AMPM = hour < 12 ? "AM" : "PM";
    return `${month}-${day}-${year} ${formattedHour}:${minutes} ${AMPM} EDT`;
  };

  // Function to format contributors for display
  // TODO: This function is defined but never used in the component. Consider removing if unnecessary.

  // State for managing sections of the story
  const [sections, setSections] = useState<Section[]>([]);

  // Effect for logging sections state (for debugging)
  useEffect(() => {
    console.log("Sections state updated:", sections);
  }, [sections]);

  // Effect for fetching article content and initializing state
  useEffect(() => {
    async function loadArticle() {
      if (story.id) {
        try {
          const fetchedArticle = await fetchArticleById(story.id, true);
          if (fetchedArticle.storyContent.length > 0) {
            const storyContent = fetchedArticle.storyContent[0].content;
            setBody(storyContent);

            // Parse into sections (for editing purposes) but also keep the original content
            const parsedSections = parseMarkdownToSections(storyContent);
            setSections(parsedSections);
          }
        } catch (err: any) {
          console.error("Failed to fetch article:", err.message);
        }
      }
    }

    loadArticle();
  }, [story.id]);

  // Handler for markdown changes
  const handleMarkdownChange = (newMarkdown: string) => {
    setBody(newMarkdown);
    const parsedSections = parseMarkdownToSections(newMarkdown);
    setSections(parsedSections);
  };

  // Handler for section content changes
  const handleSectionChange = (idx: number, newContent: string) => {
    const updatedSections = [...sections];
    updatedSections[idx].content = newContent;
    setSections(updatedSections);
  };

  // Handler for adding a new section
  const handleAddSection = (type: string) => {
    setSections([...sections, { type, content: "" }]);
  };

  // Handler for deleting a section
  const handleDeleteSection = (delIdx: number) => {
    const newArray = sections.filter((_, index) => index !== delIdx);
    setSections(newArray);
  };

  // State and refs for managing the resizable layout
  const [leftWidth, setLeftWidth] = useState(40); // 40% as default
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handlers for the resizable divider
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
        setLeftWidth(newLeftWidth);
      }
    }
  };

  // Effect for managing event listeners for resizable layout
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

  // Component render
  return (
    <div
      className="mx-12 mt-5 flex flex-col gap-5"
      ref={containerRef}
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div className="flex gap-5" style={{ height: "100%", width: "100%" }}>
        {/* Left side: Article Builder */}
        <div
          className="relative flex h-full flex-col overflow-hidden pr-4"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="flex-grow overflow-y-auto">
            <div className="flex items-center justify-center py-5">
              <h3 className="text-3xl font-semibold text-sciquelTeal">
                Article Builder
              </h3>
            </div>
            <StoryInfoForm
              id={story.id}
              title={title}
              setTitle={setTitle}
              summary={summary}
              setSummary={setSummary}
              image={image}
              setImage={setImage}
              caption={caption}
              setCaption={setCaption}
              slug={slug}
              setSlug={setSlug}
              date={date}
              setDate={setDate}
              body={body}
              setBody={setBody}
              sections={sections}
              onSectionChange={handleSectionChange}
              onAddSection={handleAddSection}
              onDeleteSection={handleDeleteSection}
              storyType={storyType}
              setStoryType={setStoryType}
              topics={topics}
              setTopics={setTopics}
              titleColor={titleColor}
              setTitleColor={setTitleColor}
              summaryColor={summaryColor}
              setSummaryColor={setSummaryColor}
              contributors={contributors}
              setContributors={setContributors}
              //trivia={<Trivia />}
            />
            {/* <Trivia/> */}
          </div>

          {/* Resizable divider */}
          <div
            onMouseDown={handleDividorClick}
            className="absolute bottom-0 right-0 top-0 z-10 w-2 cursor-col-resize bg-sciquelTeal"
          ></div>
        </div>

        {/* Right side: Story Preview */}
        <div
          className="h-full overflow-y-auto bg-white"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <StoryPreview
            article={{
              title,
              summary,
              body,
              image,
              slug,
              date,
              sections,
              storyType,
              topics,
              titleColor,
              summaryColor,
            }}
            formattedDate={date?.toString() ?? ""}
            contributors={contributors}
            id={story.id}
          />
        </div>
      </div>
    </div>
  );
};

export default StoryInfoEditorClient;

// API fetch function
// TODO: Consider moving this to a separate API utility file
async function fetchArticleById(id: string, includeContent = false) {
  const includeContentParam = includeContent ? "?include_content=true" : "";
  const response = await fetch(`/api/stories/id/${id}${includeContentParam}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.statusText}`);
  }

  const article = await response.json();
  return article;
}
