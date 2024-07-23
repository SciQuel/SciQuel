import fsPromises from "fs/promises";
import path from "path";
import MarkdownEditorStoryInfo from "@/components/EditorDashboard/MarkdownEditorStoryInfo";
import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import FormSelect from "@/components/Form/FormSelect";
import MarkdownEditor from "@/components/MarkdownEditor";
import { Popover, Transition } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import {
  type Category,
  type GeneralSubject,
  type StoryTopic,
  type StoryType,
  type Subtopic,
} from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState, useTransition } from "react";
import ArticleBody from "./formComponents/articleBody";
import ArticleContent from "./formComponents/articleContent";
import ArticleDate from "./formComponents/articleDate";
import ArticleSlug from "./formComponents/articleSlug";
import ArticleSummary from "./formComponents/articleSummary";
import ArticleTitle from "./formComponents/articleTitle";
import BackgroundImageForm from "./formComponents/backgroundImageForm";
import NewContributor from "./formComponents/confirmNewContributer";
import NewSubject from "./formComponents/subjectComponents/newSubject";
import NewSubtopic from "./formComponents/subtopicComponents/newSubtopic";
import { getData, randomBackgroundColor, setTagsColor } from "./StoryFormFunc";
import Tags from "./Tags";
import { date } from "zod";

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
  image?: string;
  setImage: (value: string) => void;
  caption?: string;
  slug?: string;
  setSlug: (value: string) => void;
  date?: Date | null;
  setDate: (value: Date) => void;
  body: string;
  setBody: (value: string) => void;
  sections: Section[];
  onSectionChange: (index: number, newContent: string) => void;
  onAddSection: (type: string) => void;
  onDeleteSection: (index: number) => void;
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
  slug: initialSlug,
  setSlug: initialSetSlug,
  date: initialDate,
  setDate: initialSetDate,
  body: initialBody,
  setBody: initialSetBody,
  sections,
  onSectionChange,
  onAddSection,
  onDeleteSection,
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

  const [titleColor, setTitleColor] = useState("#000000");
  const [summaryColor, setSummaryColor] = useState("#000000");

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

  const [contributors, setContributors] = useState<string[]>([]);

  const [isCreateSubtopicModalOpen, setIsCreateSubtopicModalOpen] =
    useState(false);
  const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] =
    useState(false);

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
    topiclist.forEach((item: any) => {
      if (item.data.id == id) {
        if (item.checked == true) {
          // if the topic is already checked, uncheck and remove it from the list of topic
          removeTopicTag(id);
        } else {
          setTopics((topics) => [...topics, item]);
          setTopicList(
            topiclist.map((item: any) =>
              item.data.id == id ? { ...item, checked: true } : item,
            ),
          );
        }
      }
    });
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
    setTopics(topics.filter((item: any) => item.data.id != id));
    setTopicList(
      topiclist.map((item: any) =>
        item.data.id == id ? { ...item, checked: false } : item,
      ),
    );

    if (topics.length == 1) {
      //if user remove all topic tags, then remove all subtopic and subject tags as well
      setSubtopicList(data.subtopics);
      setSubjectList(data.subjects);
      setSubtopics([]);
      setSubjects([]);
    }
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

  // Function to add a new contributor to the list
  const addContributor = (contributor: string) => {
    setContributors([...contributors, contributor]);
  };

  // Div outlining what the left half of the page actually looks like
  return (
    <div className="flex flex-col gap-2">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            // creates a form component with all of the fields
            try {
              if (dirty) {
                const formData = new FormData();

                // adds all fields
                if (storyId) {
                  formData.append("id", storyId);
                }
                formData.append("title", title);
                formData.append("summary", summary);
                formData.append("body", body);
                formData.append("imageCaption", caption);
                formData.append("storyType", storyType);
                formData.append("category", "ARTICLE");
                formData.append("titleColor", titleColor);
                formData.append("summaryColor", summaryColor);
                formData.append("slug", slug);
                formData.append("topics", JSON.stringify(topics));
                formData.append("subtopics", "[]");
                formData.append("generalSubjects", "[]");
                formData.append("staffPicks", "false");
                formData.append("contributions", JSON.stringify(contributors));

                if (image === null) {
                  return;
                } else if (typeof image === "string") {
                  formData.append("imageUrl", image);
                } else {
                  const file = new File([image], image.name);
                  formData.append("image", file, file.name);
                }
                // wait for story API
                const story = await axios.put<{ id: string }>(
                  "/api/stories",
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  },
                );
                const nextPage = `/editor/story/contributors?id=${story.data.id}`;
                router.push(nextPage);
              } else {
                router.push(`/editor/story/contributors?id=${storyId}`);
              }
            } catch (err) {
              console.error(err);
            }
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
          value={initialSummary}
          onChange={initialSetSummary}
          required
          indicateRequired
          disabled={loading}
          setDirty={setDirty}
        />

        {/* PUBLISH DATE FORM */}
        <ArticleDate
          value={initialDate}
          onChange={initialSetDate}
          required
          indicateRequired
          disabled={loading}
          setDirty={setDirty}
        />

        {/* ARTICLE TEXT BODY INPUT */}
        {/* <ArticleBody
          value={initialBody}
          onChange={initialSetBody}
          setDirty={setDirty}
        /> */}

        {/* MARKDOWN EDITOR */}
        
        <div className="h-[250px]">
          Article Body
          <MarkdownEditorStoryInfo 
            initialValue={initialBody}
            id={storyId} 
            style={{
              height: "100%"
            }}>
              
          </MarkdownEditorStoryInfo>        
        </div>

        

        {/* TITLE COLOR INPUT */}
        <label className="my-5 flex flex-col">
          Title Color
          <input
            value={titleColor}
            type="color"
            onChange={(e) => {
              setDirty(true);
              setTitleColor(e.target.value);
            }}
          />
        </label>

        {/* SUMMARY COLOR INPUT */}
        <label className="my-5 flex flex-col ">
          Summary Color
          <input
            value={summaryColor}
            type="color"
            onChange={(e) => {
              setDirty(true);
              setSummaryColor(e.target.value);
            }}
          />
        </label>

        {/* ARTICLE CONTENT BOXES */}
        <ArticleContent
          sections={sections}
          onSectionChange={onSectionChange}
          onAddSection={onAddSection}
          onDeleteSection={onDeleteSection}
        />

        {/* ADDING CONTRIBUTORS FORM */}
        <NewContributor addContributor={addContributor} />
        <ul className="list-disc pl-5">
          {contributors.map((contributor, index) => (
            <li key={index}>{contributor}</li>
          ))}
        </ul>

        {/* SLUG FORM */}
        <ArticleSlug
          value={initialSlug}
          onChange={initialSetSlug}
          required
          indicateRequired
          disabled={loading}
          setDirty={setDirty}
        />

        {/* BACKGROUND IMAGE FORM */}
        <BackgroundImageForm
          image={initialImage}
          setImage={initialSetImage}
          caption={caption}
          setCaption={setCaption}
          loading={loading}
          setDirty={setDirty}
        />

        {/* STORY TYPE INPUT */}
        <label className="my-5 block">
          Story Type
          <select
            className={clsx(
              `peer w-full rounded-md px-2 py-1 placeholder-transparent outline outline-1
                outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal
                focus:ring-0`,
              "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
            )}
            placeholder="Select a story type"
            value={storyType}
            onChange={(e) => {
              setDirty(true);
              setStoryType(e.target.value as StoryType);
            }}
          >
            <option value="DIGEST">Digest</option>
            <option value="ESSAY">Essay</option>
          </select>
        </label>

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
            placeholder="Select a story type"
            value={category}
            onChange={(e) => {
              setDirty(true);
              setCategory(e.target.value as Category);
            }}
          >
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
                                defaultChecked={topic.checked}
                                onChange={(event) => addTopic(topic.data.id)}
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
        </div>
        <button
          type="submit"
          className="my-5 select-none rounded-md bg-teal-600 px-2 py-1 font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
          disabled={
            initialTitle.length ===
              0 /* WHEN UNCOMMENTED CODE BREAKS BECAUSE TITLE IS OUT OF SCOPE??? */ ||
            summary.length === 0 ||
            initialImage === null ||
            caption.length === 0 ||
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
