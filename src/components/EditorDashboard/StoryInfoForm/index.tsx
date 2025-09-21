"use client";

import MarkdownEditorStoryInfo from "@/components/EditorDashboard/MarkdownEditorStoryInfo";
import Trivia from "@/components/EditorDashboard/StoryInfoForm/formComponents/TriviaComponents/Trivia";
import Form from "@/components/Form";
import { Popover, Transition } from "@headlessui/react";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/20/solid";
import {
  Prisma,
  StoryTopic,
  type Category,
  type GeneralSubject,
  type StoryType,
} from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import {
  Fragment,
  useRef,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react";
import { updateWholeArticle } from "./actions/actions";
import ArticleSlug from "./formComponents/articleSlug";
import ArticleSummary from "./formComponents/articleSummary";
import ArticleSummaryColor from "./formComponents/articleSummaryColor";
import ArticleTitle from "./formComponents/articleTitle";
import ArticleTitleColor from "./formComponents/articleTitleColor";
import ArticleTopic from "./formComponents/articleTopic";
import ArticleType from "./formComponents/articleType";
import BackgroundImageForm from "./formComponents/backgroundImageForm";
import ContributorSearch from "./formComponents/ContributorSearch/ContributorSearch";
import ArticleSubjects from "./formComponents/subjectComponents/ArticleSubjects";
import ArticleSubtopics from "./formComponents/subtopicComponents/articleSubtopics";
import { getData } from "./StoryFormFunc";
import Tags from "./Tags";

interface Props {
  id?: string;
  subtopics: Prisma.SubtopicOnStoryGetPayload<{
    include: {
      subtopic: true;
    };
  }>[];
  subjects: Prisma.GeneralSubjectOnStoryGetPayload<{
    include: {
      subject: true;
    };
  }>[];
  title: string;
  setTitle: (value: string) => void;
  summary?: string;
  setSummary: (value: string) => void;
  image?: File | string | null; //add File | string | null;
  setImage: (image: File | string | null) => void; //add File | string | null
  caption?: string;
  setCaption: (value: string) => void;
  slug?: string | undefined;
  setSlug: (value: string) => void;
  date?: Date | null;
  setDate: (value: Date | null) => void;
  body: string;
  setBody: (value: string) => void;
  titleColor?: string;
  setTitleColor: (value: string) => void;
  summaryColor?: string;
  setSummaryColor: (value: string) => void;
  topics: StoryTopic[];
  setTopics: Dispatch<SetStateAction<StoryTopic[]>>;
  storyType: StoryType;
  setStoryType: (value: StoryType) => void;
  contributors: Prisma.StoryContributionGetPayload<{
    include: {
      contributor: true;
    };
  }>[];
  setContributors: Dispatch<
    SetStateAction<
      Prisma.StoryContributionGetPayload<{
        include: {
          contributor: true;
        };
      }>[]
    >
  >;
}

export default function StoryInfoForm({
  id: storyId,
  subtopics: originalSubtopics,
  subjects: originalSubjects,
  title: initialTitle,
  setTitle: initialSetTitle,
  summary,
  setSummary,
  image,
  setImage,
  caption: initialCaption,
  setCaption: initialSetCaption,
  slug: initialSlug,
  setSlug: initialSetSlug,
  date: initialDate,
  body: initialBody,
  setBody: initialSetBody,
  titleColor: initialTitleColor,
  setTitleColor: initialSetTitleColor,
  summaryColor: initialSummaryColor,
  setSummaryColor: initialSetSummaryColor,
  topics,
  setTopics,
  storyType,
  setStoryType,
  contributors = [],
}: Props) {
  const [dirty, setDirty] = useState(false);
  const [loading, startTransition] = useTransition();

  const [category, setCategory] = useState<Category>("ARTICLE");

  const [subjectQuery, setSubjectQuery] = useState("");

  const [subtopics, setSubtopics] = useState(
    originalSubtopics.map((subtopic) => subtopic.subtopic),
  );
  const [subjects, setSubjects] = useState<GeneralSubject[]>(
    originalSubjects.map((subjectLink) => subjectLink.subject),
  );

  const data = getData();

  const [subtopiclist, setSubtopicList] = useState(data.subtopics);
  const [subjectlist, setSubjectList] = useState(data.subjects);

  const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] =
    useState(false);

  const [success, setSuccess] = useState(false);

  const filteredSubjectList =
    subjectQuery === ""
      ? subjectlist
      : subjectlist.filter((item: any) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(subjectQuery.toLowerCase().replace(/\s+/g, "")),
        );

  // add a subject tag
  const addSubject = (id: any) => {
    subjectlist.forEach((item: any) => {
      if (item.id == id) {
        if (item.checked == true) {
          removeSubjectTag(id);
        } else {
          setSubjects((subjects) => [...subjects, item]);
          setSubjectList(
            subjectlist.map((item: any) =>
              item.id == id ? { ...item, checked: true } : item,
            ),
          );
        }
      }
    });
  };

  // remove a subject tag
  const removeSubjectTag = (id: number) => {
    setSubjects(subjects.filter((item: any) => item.id != id));
    setSubjectList(
      subjectlist.map((item: any) =>
        item.id == id ? { ...item, checked: false } : item,
      ),
    );
  };

  //create a subtopic tag
  const createSubtopic = (subtopic: string) => {
    const newSubtopic = {
      id: crypto.randomUUID(),
      name: subtopic,
      number_of_articles: 0,
      color: "bg-[#E8E8E8] text-black",
      checked: true,
    };

    setSubtopicList((subtopiclist: any) => [...subtopiclist, newSubtopic]);
    // setSubtopics((subtopics) => [...subtopics, newSubtopic]);
  };

  //create a subject tag
  const createSubject = (subject: string) => {
    const newSubject = {
      id: crypto.randomUUID(),
      name: subject,
      number_of_articles: 0,
      color: "bg-[#E8E8E8] text-black",
      checked: true,
    };

    setSubjectList((subjectlist: any) => [...subjectlist, newSubject]);
    // setSubjects((subjects) => [...subjects, newSubject]);
  };

  // Div outlining what the left half of the page actually looks like
  return (
    <div className="flex flex-col gap-2">
      {/* Success Popup */}
      {success && (
        <div className="fixed right-4 top-4 rounded bg-green-500 p-2 text-white shadow-lg">
          Update successful!
        </div>
      )}
      <ContributorSearch contributions={contributors} storyId={storyId ?? ""} />
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (!storyId) {
            return;
          }
          const form = new FormData();
          const topicNames = topics
            .map((topic) => {
              if (typeof topic === "string") {
                return topic.toUpperCase().replace(/ /g, "_");
                // Don't know why complier complain about....topic is array with data object.
                // 1/25/2025 complier got confuse on what type topic.data is
              } else if (
                topic &&
                typeof topic === "object" &&
                "data" in topic
              ) {
                const name = (topic as { data: { name: string } }).data.name;
                return name.toUpperCase().replace(/ /g, "_");
              } else {
                return null;
              }
            })
            .filter((name) => name !== null); // Filter out any invalid values

          // Convert to JSON string format
          const topicString = `[${topicNames
            .map((name) => `"${name}"`)
            .join(", ")}]`;

          form.append("id", storyId);
          form.append("summary", summary ?? "");
          if (image) {
            if (typeof image === "string") {
              form.append("imageUrl", image);
            } else if (image instanceof File) {
              form.append("image", image);
              form.append("newImageName", "test-image-name");
            }
          }

          form.append("imageCaption", initialCaption ?? "");

          form.append("storyType", storyType);

          form.append("category", category);
          form.append("title", initialTitle);
          form.append("titleColor", initialTitleColor ?? "#000000");
          form.append("summaryColor", initialSummaryColor ?? "#000000");
          form.append("slug", initialSlug ?? "");

          form.append("topics", topicString);

          if (typeof initialDate === "string") {
            form.append("publishDate", initialDate);
          } else if (initialDate instanceof Date) {
            form.append("publishDate", initialDate.toISOString());
          }

          form.append("content", initialBody);
          form.append("footer", "");

          updateWholeArticle(form)
            .then((result) => {
              setSuccess(true); // Show success popup
              // Hide success popup after 3 seconds
              window.location.reload();
              setTimeout(() => setSuccess(false), 3000);
            })

            .catch((err) => {
              console.error(err);
            });
        }}
      >
        {/* STORY TITLE FORM INPUT */}
        <ArticleTitle
          value={initialTitle}
          onChange={initialSetTitle}
          indicateRequired
          required
          disabled={loading}
          setDirty={setDirty}
        />

        {/* SUMMARY INPUT */}
        <ArticleSummary
          value={summary ?? ""}
          onChange={setSummary}
          required
          indicateRequired
          disabled={loading}
          setDirty={setDirty}
        />

        {/* PUBLISH DATE FORM */}
        {/* <ArticleDate
          value={initialDate ?? null}
          onChange={initialSetDate}
          required
          indicateRequired
          disabled={loading}
          setDirty={setDirty}
        /> */}

        {/* ARTICLE TEXT BODY INPUT */}
        <div className="h-[250px]">
          Article Body
          <MarkdownEditorStoryInfo
            initialValue={initialBody}
            onChange={initialSetBody}
            id={storyId ?? ""}
            style={{ height: "100%" }}
          />
        </div>

        <ArticleTitleColor
          value={initialTitleColor ?? ""} // Fallback to empty string if undefined}
          onChange={initialSetTitleColor}
          setDirty={setDirty}
          // value={initialSetTitleColor}
        ></ArticleTitleColor>

        <ArticleSummaryColor
          value={initialSummaryColor ?? ""} // Fallback to empty string if undefined}
          onChange={initialSetSummaryColor}
          setDirty={setDirty}
        ></ArticleSummaryColor>

        {/* ARTICLE CONTENT BOXES */}
        {/* <ArticleContent
          sections={sections}
          onSectionChange={onSectionChange}
          onAddSection={onAddSection}
          onDeleteSection={onDeleteSection}
        /> */}

        {/* ADDING CONTRIBUTORS FORM */}
        {/* <NewContributor addContributor={addContributor} />
        <ul className="list-disc pl-5">
          {contributors.map((contributor, index) => (
            <li key={index}>{contributor}</li>
          ))}
        </ul> */}

        {/* SLUG FORM */}
        <ArticleSlug
          value={initialSlug ?? ""} // Fallback to empty string if undefined}
          onChange={initialSetSlug}
          required
          indicateRequired
          disabled={loading}
          setDirty={setDirty}
        />

        {/* BACKGROUND IMAGE FORM */}
        <BackgroundImageForm
          image={image ?? null} // Handle undefined by defaulting to null}
          setImage={setImage}
          caption={initialCaption ?? ""} // Handle undefined by defaulting to an empty string}
          setCaption={initialSetCaption}
          loading={loading}
          setDirty={setDirty}
        />

        {/* STORY TYPE INPUT */}
        <ArticleType
          value={storyType}
          onChange={setStoryType}
          setDirty={setDirty}
        ></ArticleType>

        {/* CATEGORY DROPDOWN */}
        <label className="my-5 block">
          Category
          <select
            className={clsx(
              `peer w-full rounded-md px-2 py-1 placeholder-transparent outline outline-1
                outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal
                focus:ring-0`,
              "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
            )}
            value={category}
            onChange={(e) => {
              setDirty(true);
              setCategory(e.target.value as Category);
            }}
          >
            <option value="" disabled selected hidden>
              Select a story type
            </option>
            <option value="ARTICLE">Article</option>
            <option value="PODCAST">Podcast</option>
          </select>
        </label>
        <div>
          <ArticleTopic topics={topics} setTopics={setTopics} />
        </div>
        <ArticleSubtopics
          subtopics={subtopics}
          setSubtopics={setSubtopics}
          storyId={storyId}
        />

        <ArticleSubjects subjects={subjects} setSubjects={setSubjects} />

        {/* SELECT SUBJECT (+) BUTTON */}
        <div className={`grid w-1/3 grid-cols-1 gap-2`}>
          <div className="flex flex-row justify-items-center gap-4">
            <label>Select subject</label>

            <Popover className="relative">
              <Popover.Button>
                <PlusCircleIcon
                  className="plus-circle-icon h-6"
                  aria-hidden="true"
                />
              </Popover.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setSubjectQuery("")}
              >
                <Popover.Panel className="absolute z-10 w-max">
                  <div className="border-1 grid grid-cols-1 gap-1 rounded-md border bg-white px-1 py-1 shadow-lg shadow-gray-400">
                    <div className="flex flex-row gap-1">
                      <input
                        placeholder="Search a subject"
                        className="custom_input_sm grow"
                        onChange={(event) =>
                          setSubjectQuery(event.target.value)
                        }
                      />
                      <PlusIcon
                        className="plus-icon"
                        aria-hidden="true"
                        onClick={(event) => setIsCreateSubjectModalOpen(true)}
                      />
                    </div>
                    <ul className="max-h-[170px] overflow-y-auto px-1">
                      {filteredSubjectList.length === 0 &&
                      subjectQuery !== "" ? (
                        <div className="relative select-none py-2 text-center text-sm">
                          <span className="block cursor-default pb-1 text-gray-700">
                            No results found.
                          </span>
                          <span className="text-green-sheen block cursor-pointer underline">
                            Create a subject tag
                          </span>
                        </div>
                      ) : (
                        filteredSubjectList.map((subject: any) => (
                          <li>
                            <div className="flex flex-row items-center gap-2 py-2">
                              <div className="flex items-center ">
                                <input
                                  type="checkbox"
                                  defaultChecked={subject.checked}
                                  onChange={(event) => addSubject(subject.id)}
                                  className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                />
                                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                  {subject.name}
                                </label>
                              </div>

                              <span className="text-xs font-semibold text-[#0d6efd]">
                                ({subject.number_of_articles} article
                                {subject.number_of_articles > 1 ? "s" : ""})
                              </span>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
          <div className="flex flex-row flex-wrap gap-3">
            {subjects.map((subject: any) => (
              <Tags
                key={subject.id}
                id={subject.id}
                name={subject.name}
                color="bg-[#E8E8E8] text-black"
                removeTag={removeSubjectTag}
              />
            ))}
          </div>
          <Trivia />
        </div>
        {/* Real-time validation messages */}
        <div className="mb-3 text-sm text-red-500">
          {initialTitle.length === 0 && <p>Title is required.</p>}
          {/* {summary.length === 0 && <p>Summary is required.</p>}
          {initialImage === null && <p>An image is required.</p>} */}
          {loading && <p>Loading... Please wait.</p>}
        </div>
        <button
          type="submit"
          className="my-5 select-none rounded-md bg-teal-600 px-2 py-1 font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
          disabled={
            initialTitle.length === 0 ||
            // summary.length === 0 ||
            // initialImage === null ||
            loading
          }
        >
          Continue
        </button>
      </Form>
    </div>
  );
}
