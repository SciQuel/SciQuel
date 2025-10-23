"use client";

import StoryInfoForm from "@/components/EditorDashboard/StoryInfoForm";
import Trivia from "@/components/EditorDashboard/StoryInfoForm/formComponents/TriviaComponents/Trivia";
import StoryPreview from "@/components/EditorDashboard/StoryPreview";
import parseMarkdownToSections from "@/components/MarkdownEditor/parseMarkdown";
import {
  Prisma,
  StoryType,
  SubtopicOnStory,
  type Contributor,
  type StoryContribution,
  type StoryTopic,
} from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { FullQuizSubpart } from "./page";

// Interface definitions for the component's data structures
interface Section {
  type: string;
  content: string;
}

export type Contribution = StoryContribution & {
  contributor: Contributor;
};

interface Props {
  story: Prisma.StoryGetPayload<{
    include: {
      storyContributions: {
        include: {
          contributor: true;
        };
      };
      storyContent: {
        orderBy: {
          createdAt: "desc";
        };
        take: 1;
      };
      quizQuestions: true;
      subtopics: {
        include: {
          subtopic: true;
        };
      };
      generalSubjects: {
        include: {
          subject: true;
        };
      };
    };
  }>;
  quizzes: FullQuizSubpart[];
}

// Main component: StoryInfoEditorClient
// This component manages the state and layout for editing a story
const StoryInfoEditorClient: React.FC<Props> = ({ story }) => {
  // State declarations for various story properties
  // Grouping related state variables into a single object could be beneficial
  const [body, setBody] = useState<string>(
    story.storyContent[0]?.content ?? "",
  );
  const [title, setTitle] = useState<string>(story.title || "Untitled"); // Changed to default non-null
  const [summary, setSummary] = useState<string>(story.summary || ""); // Can remain empty but not null
  const [image, setImage] = useState<File | string | null>(
    story.thumbnailUrl || "",
  ); // Empty string instead of null
  const [caption, setCaption] = useState<string>(story.coverCaption || ""); // Can remain empty but not null
  const [slug, setSlug] = useState<string>(story.slug || "default-slug"); // Default slug instead of null
  const [date, setDate] = useState<Date | null>(
    story.publishedAt || new Date(),
  ); // Initialize with current date if null
  const [storyType, setStoryType] = useState<StoryType>(
    story.storyType || "ESSAY",
  ); // Default type instead of null
  const [topics, setTopics] = useState<StoryTopic[]>(story.topics || []); //use storytopic instead of string

  const [titleColor, setTitleColor] = useState<string>(
    story.titleColor || "#000000",
  ); // Default color
  const [summaryColor, setSummaryColor] = useState<string>(
    story.summaryColor || "#000000",
  ); // Default color
  const [contributors, setContributors] = useState<
    Prisma.StoryContributionGetPayload<{
      include: {
        contributor: true;
      };
    }>[]
  >(story.storyContributions);

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
              subjects={story.generalSubjects}
              subtopics={story.subtopics}
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
          {/* <StoryPreview
            article={{
              title,
              summary,
              body,
              image,
              slug,
              date,
              storyType,
              topics,
              titleColor,
              summaryColor,
            }}
            formattedDate={date?.toString() ?? ""}
            contributors={contributors}
            id={story.id}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default StoryInfoEditorClient;
