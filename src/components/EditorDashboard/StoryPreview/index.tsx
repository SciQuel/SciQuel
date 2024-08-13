import { type GetStoryResult } from "@/app/api/stories/id/[id]/route";
import { type Contribution } from "@/app/editor/(full-page)/story/info/StoryInfoEditorPageClient";
import ShareLinks from "@/components/story-components/ShareLinks";
import TopicTag from "@/components/TopicTag";
import { generateMarkdown } from "@/lib/markdown";
import { type StoryTopic } from "@prisma/client";
import Image from "next/image";
import React, {
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

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
  slug?: string;
  date?: Date;
  body: string;
  markdown: string;
  sections?: Section[];
  storyType?: string;
  topics?: StoryTopic[];
  titleColor?: string;
  summaryColor?: string;
}

interface Props {
  article: Article;
  formattedDate: string;
  id: string;
  contributors: Contribution[]; // formatted string "by contributor 1 \n by contributor 2 . . ."
}

const StoryPreview: React.FC<Props> = ({
  article,
  formattedDate,
  id,
  contributors,
}) => {
  const [markdownContent, setMarkdownContent] = useState<ReactElement | null>(
    null,
  );
  const [renderedSections, setRenderedSections] = useState<
    Array<ReactElement | null>
  >([]);

  useEffect(() => {
    // Process the main body content of the article
    const processMarkdown = async () => {
      const result = await generateMarkdown(article.body);
      setMarkdownContent(result.file.result);
    };

    // Process each section's content
    const processSections = async () => {
      const newRenderedSections = await Promise.all(
        (article.sections ?? []).map(async (section) => {
          const result = await generateMarkdown(section.content);
          return result.file.result;
        }),
      );
      setRenderedSections(newRenderedSections);
    };

    processMarkdown();
    processSections();
  }, [article.body, article.sections]);

  return (
    <div className="flex flex-col">
      {/* Display the image  */}
      <div className="relative">
        {article.image && (
          <Image
            src={article.image}
            className="absolute inset-0 h-full w-full object-cover"
            alt={article.title || ""}
            width={1700}
            height={768}
          />
        )}

        {/* Display article title, summary and date here */}
        <div className="relative z-10 flex h-full flex-col justify-end px-12 pb-24 pt-10">
          <h1 // title is here
            className="w-4/5 p-8 font-alegreyaSansSC text-6xl font-bold sm:text-8xl"
            style={{ color: article.titleColor }}
          >
            {article.title}
          </h1>
          <h2 // summary is here
            className="w-5/6 p-8 pt-0 font-alegreyaSansSC text-4xl font-semibold"
            style={{ color: article.summaryColor }}
          >
            {article.summary}
          </h2>
        </div>
      </div>

      <div className="relative mx-2 mt-5 flex w-screen flex-col md:mx-auto md:w-[720px]">
        {/* Essay/Digest | article type | topic tag */}
        <div className="flex flex-row">
          <p className="mr-2">
            {(article.storyType ?? "").slice(0, 1) +
              (article.storyType ?? "").slice(1).toLowerCase()}{" "}
            | we need to add article type |
          </p>{" "}
          {(article.topics ?? []).map((item: StoryTopic, index: number) => {
            return <TopicTag name={item} key={`${item}-${index}`} />;
          })}
        </div>

        {/* Adding formatted contributors */}
        {/* <div>{contributors}</div> */}

        {/* Adding formatted dates (need to add time zone / fetching?) */}
        <div className="flex flex-row">
          <p className="mr-2">{formattedDate}</p>
        </div>
      </div>

      <div className="mt-4">
        {/* Article body is markdown text -- THIS WAS FROM THE ORIGINAL (non-boxes)*/}
        {/* <div className="mx-2 mt-2 flex flex-col items-center gap-5 md:mx-auto">
          {markdownContent as ReactNode}
        </div> */}

        {/* This part renders the boxes updated live */}
        <div className="mx-2 mt-2 flex flex-col items-center gap-5 md:mx-auto">
          {renderedSections &&
            renderedSections.map((markdownContent, index) => (
              <div key={index} className="mt-4">
                <div className="mx-2 mt-2 flex flex-col items-center gap-5 md:mx-auto">
                  {markdownContent}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StoryPreview;
