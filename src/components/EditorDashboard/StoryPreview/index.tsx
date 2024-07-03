// <<<<<<< Updated upstream
import React from "react";
import ArticleBody from "./formComponents/articleBody";
import { title } from "process";
import StoryPreviewFetch from "./StoryPreviewFetch";

interface Article {
// =======

// "use client";

// import fsPromises from "fs/promises";
// import path from "path";
// import Form from "@/components/Form";
// import FormInput from "@/components/Form/FormInput";
// import FormSelect from "@/components/Form/FormSelect";
// import { Popover, Transition } from "@headlessui/react";
// import {
//   ChevronUpDownIcon,
//   PlusCircleIcon,
//   PlusIcon,
//   TrashIcon,
// } from "@heroicons/react/20/solid";
// import {
//   type Category,
//   type GeneralSubject,
//   type StoryTopic,
//   type StoryType,
//   type Subtopic,
// } from "@prisma/client";
// import axios from "axios";
// import clsx from "clsx";
// import { useRouter } from "next/navigation";
// import { Fragment, ReactNode, useRef, useState, useTransition } from "react";
// import NewContributor from "./contributors/confirmNewContributer";
// import { getData, randomBackgroundColor, setTagsColor } from "./StoryFormFunc";
// import NewSubject from "./subjectComponents/newSubject";
// import NewSubtopic from "./subtopicComponents/newSubtopic";
// import Tags from "./Tags";
// import Image from "next/image";
// import ShareLinks from "@/components/story-components/ShareLinks";
// import TopicTag from "@/components/TopicTag";
// import { generateMarkdown } from "@/lib/markdown";
// import { type GetStoryResult } from "@/app/api/stories/id/[id]/route";
// import { useEffect } from "react";

// interface Props {
// >>>>>>> Stashed changes
  id?: string;
  title?: string;
  summary?: string;
  image?: string;
  caption?: string;
  date?: Date | null;
  body: string;
}

// <<<<<<< Updated upstream
interface Props {
  article: Article;
}

/**
 *
 * @param param0
 * @returns
 */


const StoryPreview: React.FC<Props> = ({ article }) => {
  StoryPreviewFetch(article)
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
// =======
// const StoryPreviewFetch({
//   id: storyId,
//   title: initialTitle,
//   summary: initialSummary,
//   image: initialImage,
//   caption: initialCaption,
//   date: initialDate,
// }: Props) {
//   const fileUploadRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   const [title, setTitle] = useState(initialTitle ?? "");
//   const [summary, setSummary] = useState(initialSummary ?? "");
//   const [image, setImage] = useState<File | string | null>(
//     initialImage ?? null
//   );
//   const [caption, setCaption] = useState(initialCaption ?? "");
//   const [date, setDate] = useState<Date | null>(initialDate ?? null);
//   const [dirty, setDirty] = useState(false);
//   const [loading, startTransition] = useTransition();

//   const [storyType, setStoryType] = useState<StoryType>("DIGEST");
//   const [category, setCategory] = useState<Category>("ARTICLE");

//   const [titleColor, setTitleColor] = useState("#000000");
//   const [summaryColor, setSummaryColor] = useState("#000000");

//   const [slug, setSlug] = useState("");

//   const [topicQuery, setTopicQuery] = useState("");
//   const [subtopicQuery, setSubtopicQuery] = useState("");
//   const [subjectQuery, setSubjectQuery] = useState("");

//   const [topics, setTopics] = useState<StoryTopic[]>([]);
//   const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
//   const [subjects, setSubjects] = useState<GeneralSubject[]>([]);

//   const data = getData();

//   const [topiclist, setTopicList] = useState(data.topics);
//   const [subtopiclist, setSubtopicList] = useState(data.subtopics);
//   const [subjectlist, setSubjectList] = useState(data.subjects);

//   const [contributors, setContributors] = useState<string[]>([]);

//   const [isCreateSubtopicModalOpen, setIsCreateSubtopicModalOpen] =
//     useState(false);
//   const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] =
//     useState(false);

//   async function fetchArticleById(id: string, includeContent: boolean = false) {
//     const includeContentParam = includeContent ? "?include_content=true" : "";
//     const response = await fetch(`/api/stories/id/${id}${includeContentParam}`);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch article: ${response.statusText}`);
//     }

//     const article = await response.json();
//     return article;
//   }

//   interface ArticleDetailProps {
//     articleId: string;
//     includeContent?: boolean;
//   }

//   const ArticleDetail: React.FC<ArticleDetailProps> = ({
//     articleId,
//     includeContent = false,
//   }) => {
//     const [article, setArticle] = useState<GetStoryResult | null>(null);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//       async function loadArticle() {
//         try {
//           const fetchedArticle = await fetchArticleById(articleId, includeContent);
//           setArticle(fetchedArticle);
//         } catch (err: any) {
//           setError(err.message);
//         }
//       }

//       if (articleId) {
//         loadArticle();
//       }
//     }, [articleId, includeContent]);

//     if (error) {
//       return <div>Error: {error}</div>;
//     }

//     if (!article) {
//       return <div>Loading...</div>;
//     }

    

//     return (
//       <div>
//         <div>
//           {includeContent && 
//           <div>
//             {article.storyContent[0].content}
//           </div>}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <div className="relative">
//         <Image
//           src={typeof image === "string" ? image : ""}
//           className="w-full h-auto object-cover"
//           alt={title}
//           width={1700}
//           height={768}
//         />
//         <div className="absolute bottom-0 left-0 w-full px-12 py-10">
//           <h1
//             className="w-4/5 p-8 font-alegreyaSansSC text-4xl font-bold sm:text-6xl"
//             style={{ color: titleColor }}
//           >
//             {title}
//           </h1>
//           <h2
//             className="w-5/6 p-8 pt-0 font-alegreyaSansSC text-3xl font-semibold"
//             style={{ color: summaryColor }}
//           >
//             {summary}
//           </h2>
//         </div>
//       </div>
//       <div className="relative mx-2 mt-5 flex md:mx-auto md:w-[720px]">
//         <div className="flex flex-1 flex-row justify-center xl:-left-24 xl:flex-col xl:pt-3">
//           <ShareLinks />
//         </div>
//         <div className="flex">
//           <p className="mr-2">
//             {storyType.slice(0, 1) + storyType.slice(1).toLowerCase()} | we
//             need to add article type |
//           </p>
//           {topics.map((item: StoryTopic, index: number) => {
//             return <TopicTag name={item.name} key={`${item.id}-${index}`} />;
//           })}
//         </div>
        
//       </div>

//       <div className="">
//           <ArticleDetail articleId={storyId} includeContent={true} />
//       </div>

//     </div>
//   );
//   export default StoryPreviewFetch;
// }
// >>>>>>> Stashed changes
