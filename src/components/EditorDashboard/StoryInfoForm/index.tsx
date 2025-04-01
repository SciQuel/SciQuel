"use client";

import { type Contribution } from "@/app/editor/(full-page)/story/info/StoryInfoEditorPageClient";
import MarkdownEditorStoryInfo from "@/components/EditorDashboard/MarkdownEditorStoryInfo";
import Trivia from "@/components/EditorDashboard/StoryInfoForm/formComponents/TriviaComponents/Trivia";
import Form from "@/components/Form";
import { Popover, Transition } from "@headlessui/react";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/20/solid";
import {
  StoryTopic,
  type Category,
  type GeneralSubject,
  type StoryType,
  type Subtopic,
} from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react";
import { updateWholeArticle } from "./actions/actions";
import ArticleContent from "./formComponents/articleContent";
import ArticleDate from "./formComponents/articleDate";
import ArticleSlug from "./formComponents/articleSlug";
import ArticleSummary from "./formComponents/articleSummary";
import ArticleSummaryColor from "./formComponents/articleSummaryColor";
import ArticleTitle from "./formComponents/articleTitle";
import ArticleTitleColor from "./formComponents/articleTitleColor";
import ArticleType from "./formComponents/articleType";
import BackgroundImageForm from "./formComponents/backgroundImageForm";
import ContributorSearch from "./formComponents/ContributorSearch/ContributorSearch";
import NewSubject from "./formComponents/subjectComponents/newSubject";
import NewSubtopic from "./formComponents/subtopicComponents/newSubtopic";
import { getData } from "./StoryFormFunc";
import Tags from "./Tags";

interface Section {
  type: string;
  content: string;
}

interface Props {
  id?: string;
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
  setTopics: (value: StoryTopic) => void;
  storyType: string;
  setStoryType: (value: string) => void;
  sections: Section[];
  onSectionChange: (index: number, newContent: string) => void;
  onAddSection: (type: string) => void;
  onDeleteSection: (index: number) => void;
  contributors: Contribution[];
  setContributors: Dispatch<SetStateAction<Contribution[]>>;
}

export default function StoryInfoForm({
  id: storyId,
  title: initialTitle,
  setTitle: initialSetTitle,
  summary: initialSummary,
  setSummary: initialSetSummary,
  image: initialImage,
  setImage: initialSetImage,
  caption: initialCaption,
  setCaption: initialSetCaption,
  slug: initialSlug,
  setSlug: initialSetSlug,
  date: initialDate,
  setDate: initialSetDate,
  body: initialBody,
  setBody: initialSetBody,
  titleColor: initialTitleColor,
  setTitleColor: initialSetTitleColor,
  summaryColor: initialSummaryColor,
  setSummaryColor: initialSetSummaryColor,
  topics: initialTopics,
  setTopics: initialSetTopics,
  storyType: initialStoryType,
  setStoryType: initialSetStoryType,
  sections,
  onSectionChange,
  onAddSection,
  onDeleteSection,
  contributors = [],
  setContributors,
}: Props) {
  // Creating states
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [summary, setSummary] = useState(initialSummary ?? "");
  const [image, setImage] = useState<File | string | null>(
    initialImage ?? null,
  );

  const [caption, setCaption] = useState(initialCaption ?? "");
  // const [date, setDate] = useState<Date | null>(initialDate ?? null);
  const [dirty, setDirty] = useState(false);
  const [loading, startTransition] = useTransition();

  const [storyType, setStoryType] = useState<StoryType>("DIGEST");
  const [category, setCategory] = useState<Category>("ARTICLE");

  const [titleColor, setTitleColor] = useState(initialTitleColor ?? "");
  const [summaryColor, setSummaryColor] = useState(initialSummaryColor ?? "");

  // const [slug, setSlug] = useState(initialSlug ?? "");

  const [topicQuery, setTopicQuery] = useState("");
  const [subtopicQuery, setSubtopicQuery] = useState("");
  const [subjectQuery, setSubjectQuery] = useState("");

  const [topics, setTopics] = useState<StoryTopic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [subjects, setSubjects] = useState<GeneralSubject[]>([]);

  const data = getData();

  const [topiclist, setTopicList] = useState(data.topics);
  const [subtopiclist, setSubtopicList] = useState(data.subtopics);
  const [subjectlist, setSubjectList] = useState(data.subjects);

  const [isCreateSubtopicModalOpen, setIsCreateSubtopicModalOpen] =
    useState(false);
  const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] =
    useState(false);

  const [success, setSuccess] = useState(false);
  const filteredTopicList =
    topicQuery === ""
      ? topiclist
      : topiclist.filter((item: any) =>
          item.data.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(topicQuery.toLowerCase().replace(/\s+/g, "")),
        );

  const filteredSubtopicList =
    subtopicQuery === ""
      ? subtopiclist
      : subtopiclist.filter((item: any) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(subtopicQuery.toLowerCase().replace(/\s+/g, "")),
        );

  const filteredSubjectList =
    subjectQuery === ""
      ? subjectlist
      : subjectlist.filter((item: any) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(subjectQuery.toLowerCase().replace(/\s+/g, "")),
        );

  //add a topic tag
  const addTopic = (id: any) => {
    setTopicList((prevList) =>
      prevList.map((item: any) => {
        if (item.data.id === id) {
          if (item.checked) {
            // Uncheck and remove the topic
            removeTopicTag(id);
            return { ...item, checked: false };
          } else {
            // Check and add the topic only if it's not already in the topics state
            setTopics((prevTopics) => {
              const isAlreadyAdded = prevTopics.some(
                (topic) => topic.data.id === id,
              );
              if (!isAlreadyAdded) {
                return [...prevTopics, item];
              }
              return prevTopics;
            });
            return { ...item, checked: true };
          }
        }
        return item;
      }),
    );
  };

  // add a subtopic tag
  const addSubtopic = (id: any) => {
    subtopiclist.forEach((item: any) => {
      if (item.id == id) {
        if (item.checked == true) {
          removeSubtopicTag(id);
        } else {
          setSubtopics((subtopics) => [...subtopics, item]);
          setSubtopicList(
            subtopiclist.map((item: any) =>
              item.id == id ? { ...item, checked: true } : item,
            ),
          );
        }
      }
    });
  };

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

  // remove a topic tag
  const removeTopicTag = (id: number) => {
    setTopics((prevTopics) => {
      const updatedTopics = prevTopics.filter((item: any) => item.id !== id);

      // If no topics remain, reset subtopics and subjects
      if (updatedTopics.length === 0) {
        setSubtopicList(data.subtopics);
        setSubjectList(data.subjects);
        setSubtopics([]);
        setSubjects([]);
      }

      return updatedTopics;
    });

    setTopicList((prevList) =>
      prevList.map((item: any) =>
        item.id === id ? { ...item, checked: false } : item,
      ),
    );
  };

  // remove a subtopic tag
  const removeSubtopicTag = (id: number) => {
    setSubtopics(subtopics.filter((item: any) => item.id != id));
    setSubtopicList(
      subtopiclist.map((item: any) =>
        item.id == id ? { ...item, checked: false } : item,
      ),
    );
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
    setSubtopics((subtopics) => [...subtopics, newSubtopic]);
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
    setSubjects((subjects) => [...subjects, newSubject]);
  };

  useEffect(() => {
    let extractedTopics: string[] = [];

    // Extract every element in initialTopics
    initialTopics?.forEach((topic) => {
      extractedTopics.push(topic.toUpperCase()); // Convert to uppercase for case-insensitive matching
    });

    setTopicList((prevList) =>
      prevList.map((topic) => ({
        ...topic,
        checked: extractedTopics.includes(topic.data.name.toUpperCase()), // Compare correctly
        enabled: extractedTopics.includes(topic.data.name.toUpperCase()),
      })),
    );
  }, [initialTopics]); // Runs when `initialTopics` changes

  // Div outlining what the left half of the page actually looks like
  return (
    <div className="flex flex-col gap-2">
      {/* Success Popup */}
      {success && (
        <div className="fixed right-4 top-4 rounded bg-green-500 p-2 text-white shadow-lg">
          Update successful!
        </div>
      )}
      <ContributorSearch
        contributions={contributors}
        setContributions={setContributors}
        storyId={storyId ?? ""}
      />
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
          console.log("Final topic string:", topicString); // Debug log

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

          // form.append(
          //   "topics",
          //   `[${initialTopics
          //     .map(
          //       (topic, index) =>
          //         `"${topic}"${index < initialTopics.length - 1 ? ", " : ""}`
          //     )
          //     .toString()}]`
          // );
          console.log("topic", topics);

          if (typeof initialDate === "string") {
            form.append("publishDate", initialDate);
          } else if (initialDate instanceof Date) {
            form.append("publishDate", initialDate.toISOString());
          }

          form.append("content", initialBody);
          form.append("footer", "");

          updateWholeArticle(form)
            .then((result) => {
              console.log(result);
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
          value={initialSummary ?? ""}
          onChange={initialSetSummary}
          required
          indicateRequired
          disabled={loading}
          setDirty={setDirty}
        />

        {/* PUBLISH DATE FORM */}
        <ArticleDate
          value={initialDate ?? null}
          onChange={initialSetDate}
          required
          indicateRequired
          disabled={loading}
          setDirty={setDirty}
        />

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
        <ArticleContent
          sections={sections}
          onSectionChange={onSectionChange}
          onAddSection={onAddSection}
          onDeleteSection={onDeleteSection}
        />

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
          image={initialImage ?? null} // Handle undefined by defaulting to null}
          setImage={initialSetImage}
          caption={initialCaption ?? ""} // Handle undefined by defaulting to an empty string}
          setCaption={initialSetCaption}
          loading={loading}
          setDirty={setDirty}
        />

        {/* STORY TYPE INPUT */}
        <ArticleType
          value={initialStoryType}
          onChange={initialSetStoryType}
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

        {/* SELECT TOPIC (+) BUTTON */}
        <div className="grid w-1/3 grid-cols-1 gap-2">
          <div className="flex flex-row justify-items-center gap-4">
            <label>Select topic</label>
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
                afterLeave={() => setTopicQuery("")}
              >
                <Popover.Panel className="absolute z-10 w-max">
                  <div className="border-1 grid grid-cols-1 gap-1 rounded-md border bg-white px-1 py-1 shadow-lg shadow-gray-400">
                    <input
                      placeholder="Search a topic"
                      className="custom_input_sm"
                      onChange={(event) => setTopicQuery(event.target.value)}
                    />
                    <ul className="max-h-[170px] overflow-y-auto px-1">
                      {filteredTopicList.length === 0 && topicQuery !== "" ? (
                        <div className="relative cursor-default select-none py-2 text-center text-sm text-gray-700">
                          No results found.
                        </div>
                      ) : (
                        filteredTopicList.map((topic: any) => (
                          <li>
                            <div className="flex items-center py-2">
                              <input
                                type="checkbox"
                                checked={topic.checked} // Controlled by state updates
                                disabled={topic.disabled} // Dynamically control disabled state
                                onChange={(event) => {
                                  addTopic(topic.data.id);
                                }}
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                              />
                              <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {topic.data.name}
                              </label>
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
            {topics.map((topic: any) => (
              <Tags
                key={topic.data.id}
                id={topic.data.id}
                name={topic.data.name}
                color={topic.data.color}
                removeTag={removeTopicTag}
              />
            ))}
          </div>
        </div>

        {/* SELECT SUBTOPIC (+) BUTTON */}
        <div className={`my-5 grid max-h-none w-1/3 grid-cols-1 gap-2`}>
          <div className="flex flex-row justify-items-center gap-4">
            <label>Select subtopic</label>
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
                afterLeave={() => setSubtopicQuery("")}
              >
                <Popover.Panel className="absolute z-10 w-max">
                  <div className="border-1 grid grid-cols-1 gap-1 rounded-md border bg-white px-1 py-1 shadow-lg shadow-gray-400">
                    <div className="flex flex-row gap-1">
                      <input
                        placeholder="Search a subtopic"
                        className="custom_input_sm grow"
                        onChange={(event) =>
                          setSubtopicQuery(event.target.value)
                        }
                      />
                      <PlusIcon
                        className="plus-icon"
                        aria-hidden="true"
                        onClick={(event) => setIsCreateSubtopicModalOpen(true)}
                      />
                    </div>

                    <ul className="max-h-[170px] overflow-y-auto px-1">
                      {filteredSubtopicList.length === 0 &&
                      subtopicQuery !== "" ? (
                        <div className="relative  select-none py-2 text-center text-sm">
                          <span className="block cursor-default pb-1 text-gray-700">
                            No results found.
                          </span>
                          <span
                            className="text-green-sheen block cursor-pointer underline"
                            onClick={(event) =>
                              setIsCreateSubtopicModalOpen(true)
                            }
                          >
                            Create a subtopic tag
                          </span>
                        </div>
                      ) : (
                        filteredSubtopicList.map((subtopic: any) => (
                          <li>
                            <div className="flex flex-row items-center gap-2 py-2">
                              <div className="flex items-center ">
                                <input
                                  type="checkbox"
                                  defaultChecked={subtopic.checked}
                                  onChange={(event) => addSubtopic(subtopic.id)}
                                  className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                />
                                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                  {subtopic.name}
                                </label>
                              </div>

                              <span className="text-xs font-semibold text-[#0d6efd]">
                                ({subtopic.number_of_articles} article
                                {subtopic.number_of_articles > 1 ? "s" : ""})
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
            {subtopics.map((subtopic: any) => (
              <Tags
                key={subtopic.id}
                id={subtopic.id}
                name={subtopic.name}
                color="bg-[#E8E8E8] text-black"
                removeTag={removeSubtopicTag}
              />
            ))}
          </div>
        </div>

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
          {summary.length === 0 && <p>Summary is required.</p>}
          {initialImage === null && <p>An image is required.</p>}
          {loading && <p>Loading... Please wait.</p>}
        </div>
        <button
          type="submit"
          className="my-5 select-none rounded-md bg-teal-600 px-2 py-1 font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
          disabled={
            initialTitle.length === 0 ||
            summary.length === 0 ||
            initialImage === null ||
            loading
          }
        >
          Continue
        </button>
      </Form>

      {/* are these two used for anything? I deleted them 
        and nothing happened . . . */}
      <NewSubtopic
        isOpen={isCreateSubtopicModalOpen}
        setIsOpen={setIsCreateSubtopicModalOpen}
        topicList={topics}
        createSubtopic={createSubtopic}
      />

      <NewSubject
        isOpen={isCreateSubjectModalOpen}
        setIsOpen={setIsCreateSubjectModalOpen}
        topicList={topics}
        createSubject={createSubject}
      />
    </div>
  );
}
