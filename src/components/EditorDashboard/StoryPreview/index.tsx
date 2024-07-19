import { type GetStoryResult } from "@/app/api/stories/id/[id]/route";
import { generateMarkdown } from "@/lib/markdown";
import Image from "next/image";
import React from "react";

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
  markdown: string; // might need to change? 
  sections?: Section[];
}

interface Props {
  article: Article;
  formattedDate: string;
  id: string;
}

const StoryPreview: React.FC<Props> = ({ article, formattedDate, id }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Display the image  */}
      <div className="relative">
        {article.image && (
          <Image
            src={"/assets/images/bobtail.png"} //article.thumbnailURL}
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
            style={{ color: "black" }}
          >
            {article.title}
          </h1>
          <h2 // summary is here
            className="w-5/6 p-8 pt-0 font-alegreyaSansSC text-4xl font-semibold"
            style={{ color: "black" }}
          >
            {article.summary}
          </h2>
          <h3 // formatted date is here
            className="w-5/6 p-8 pt-0 font-alegreyaSansSC text-4xl font-semibold"
            style={{ color: "black" }}
          >
            {formattedDate}
          </h3>
        </div>
      </div>

      {/* MARKDOWN EDITOR should be here */}


      <div className="mt-4">
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

        {/* Displays story content using fetched article */}
        <div className="">
          {/* <ArticleDetail articleId={id} includeContent={true} /> */}
        </div>
      </div>
    </div>
  );
};

export default StoryPreview;
