import { type Contribution } from "@/app/editor/(full-page)/story/info/StoryInfoEditorPageClient";
import Form from "@/components/Form";
import { Popover, Transition } from "@headlessui/react";
import {
  PlusCircleIcon
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
import { useRouter } from "next/navigation";
import {
  Fragment,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react";

// Import custom form components
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
import { getData } from "./StoryFormFunc";
import Tags from "./Tags";

// Define the structure for a Section
interface Section {
  type: string;
  content: string;
}

// Define the Props interface for the StoryInfoForm component
interface Props {
  id?: string;
  title: string;
  setTitle: (value: string) => void;
  summary?: string;
  setSummary: (value: string) => void;
  image?: string;
  setImage: (value: string) => void;
  caption?: string;
  setCaption: (value: string) => void;
  slug?: string;
  setSlug: (value: string) => void;
  date?: Date | null;
  setDate: (value: Date) => void;
  body: string;
  setBody: (value: string) => void;
  titleColor?: string;
  setTitleColor: (value: string) => void;
  summaryColor?: string;
  setSummaryColor: (value: string) => void;
  topics: StoryTopic;
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

// StoryInfoForm component
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
  body,
  titleColor: initialTitleColor,
  setTitleColor: initialSetTitleColor,
  summaryColor: initialSummaryColor,
  setSummaryColor: initialSetSummaryColor,
  storyType: initialStoryType,
  setStoryType: initialSetStoryType,
  sections,
  onSectionChange,
  onAddSection,
  onDeleteSection,
  contributors = [],
  setContributors,
}: Props) {
  // Router to navigate
  const router = useRouter();

  // States to manage form data
  const [summary] = useState(initialSummary ?? "");
  const [image] = useState<File | string | null>(initialImage ?? null);
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [dirty, setDirty] = useState(false); // Track form dirty state
  const [loading, startTransition] = useTransition(); // Loading state for async actions

  // Set default values for storyType and category
  const [storyType, setStoryType] = useState<StoryType>("DIGEST");
  const [category, setCategory] = useState<Category>("ARTICLE");

  // Title and summary colors
  const [titleColor, setTitleColor] = useState(initialTitleColor ?? "");
  const [summaryColor, setSummaryColor] = useState(initialSummaryColor ?? "");

  // Slug
  const [slug, setSlug] = useState(initialSlug ?? "");

  // Queries for filtering topics, subtopics, and subjects
  const [topicQuery, setTopicQuery] = useState("");
  const [subtopicQuery, setSubtopicQuery] = useState("");
  const [subjectQuery, setSubjectQuery] = useState("");

  // Topic, subtopic, and subject states
  const [topics, setTopics] = useState<StoryTopic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [subjects, setSubjects] = useState<GeneralSubject[]>([]);

  // Fetch predefined data for topics, subtopics, and subjects
  const data = getData();
  const [topiclist, setTopicList] = useState(data.topics);
  const [subtopiclist, setSubtopicList] = useState(data.subtopics);
  const [subjectlist, setSubjectList] = useState(data.subjects);

  // Modals for adding new subtopics and subjects
  const [isCreateSubtopicModalOpen, setIsCreateSubtopicModalOpen] =
    useState(false);
  const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] =
    useState(false);

  // Filtered lists for topics, subtopics, and subjects based on queries
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
/**
 * Adds a topic tag to the selected list or removes it if already selected.
 * 
 * @param {any} id - The ID of the topic to be added or removed.
 * 
 * This function iterates through the `topiclist`, checking if the topic matches the given `id`.
 * If the topic is already selected (i.e., `checked === true`), it removes the tag by calling `removeTopicTag(id)`.
 * If the topic is not selected, it adds the topic to the `topics` array and updates its `checked` status to true in the `topiclist`.
 */
  const addTopic = (id: any) => {
    topiclist.forEach((item: any) => {
      if (item.data.id == id) {
        if (item.checked == true) {
          // if the topic is already checked, uncheck and remove it from the list of topic
          removeTopicTag(id);
        } else {
          setTopics((initialTop) => [...topics, item]);
          setTopicList(
            topiclist.map((item: any) =>
              item.data.id == id ? { ...item, checked: true } : item,
            ),
          );
        }
      }
    });
  };

/**
 * Adds a subtopic tag to the selected list or removes it if already selected.
 * 
 * @param {any} id - The ID of the subtopic to be added or removed.
 * 
 * Similar to the `addTopic` function, this iterates through `subtopiclist` to find the matching subtopic by ID.
 * If the subtopic is already selected (i.e., `checked === true`), it removes the tag by calling `removeSubtopicTag(id)`.
 * If not, it adds the subtopic to the `subtopics` array and updates its `checked` status to true in the `subtopiclist`.
 */
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

  /**
 * Adds a subject tag to the selected list or removes it if already selected.
 * 
 * @param {any} id - The ID of the subject to be added or removed.
 * 
 * This function works similarly to `addTopic` and `addSubtopic`. It checks whether the subject tag is already
 * selected. If it is, the subject is removed by calling `removeSubjectTag(id)`. If not, it adds the subject
 * to the `subjects` array and marks it as checked in the `subjectlist`.
 */
  const addSubject = (id: any) => {
    subjectlist.forEach((item: any) => {
      // If subtopic is already checked, uncheck and remove it
      if (item.id == id) {
        if (item.checked == true) {
          removeSubjectTag(id);
        } else {
          // Add subtopic and mark it as checked
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

/**
 * Removes a topic tag from the selected list and optionally removes all related subtopic and subject tags.
 * 
 * @param {number} id - The ID of the topic to be removed.
 * 
 * This function filters out the topic from the `topics` array based on the given `id`.
 * It also unchecks the topic in `topiclist` by setting `checked` to false. If all topics are removed (i.e., `topics.length === 1`),
 * the function resets all subtopic and subject tags to their initial state.
 */
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

      /**
     * Removes a tag from the subtopic list.
     * @param {number} id - The ID of the tag to be removed.
     */
    const removeSubtopicTag = (id: number) => {
      // Remove the selected subtopic from the list of current subtopics
      setSubtopics(subtopics.filter((item: any) => item.id != id));

      // Mark the removed subtopic as unchecked in the main subtopic list
      setSubtopicList(
        subtopiclist.map((item: any) =>
          item.id == id ? { ...item, checked: false } : item,  // Update the checked status
        ),
      );
    };

    /**
     * Removes a tag from the subject list.
     * @param {number} id - The ID of the tag to be removed.
     */
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



  // Div outlining what the left half of the page actually looks like
// Main form component for creating or editing an article
return (
  <div className="flex flex-col gap-2">
    {/* Contributor Search Component */}
    <ContributorSearch
      contributions={contributors}
      setContributions={setContributors}
      storyId={storyId ?? ""}
    />

    {/* Main Form Handling for Article */}
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          try {
            // Only submit if the form is dirty (changes have been made)
            if (dirty) {
              const formData = new FormData();

              // Add fields to formData for submission
              if (storyId) formData.append("id", storyId);
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

              // Handle image upload logic
              if (image !== null) {
                if (typeof image === "string") {
                  formData.append("imageUrl", image);
                } else {
                  const file = new File([image], image.name);
                  formData.append("image", file, file.name);
                }
              }

              // API call to submit story
              const story = await axios.put<{ id: string }>(
                "/api/stories",
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
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
      {/* Story Title Input */}
      <ArticleTitle
        value={initialTitle}
        onChange={initialSetTitle}
        indicateRequired
        required
        disabled={loading}
        setDirty={setDirty}
      />

      {/* Story Summary Input */}
      <ArticleSummary
        value={initialSummary}
        onChange={initialSetSummary}
        required
        indicateRequired
        disabled={loading}
        setDirty={setDirty}
      />

      {/* Publish Date Input */}
      <ArticleDate
        value={initialDate}
        onChange={initialSetDate}
        required
        indicateRequired
        disabled={loading}
        setDirty={setDirty}
      />

      {/* Title Color Input */}
      <ArticleTitleColor
        value={initialTitleColor}
        onChange={initialSetTitleColor}
        setDirty={setDirty}
      />

      {/* Summary Color Input */}
      <ArticleSummaryColor
        value={initialSummaryColor}
        onChange={initialSetSummaryColor}
        setDirty={setDirty}
      />

      {/* Article Content Sections (text/body) */}
      <ArticleContent
        sections={sections}
        onSectionChange={onSectionChange}
        onAddSection={onAddSection}
        onDeleteSection={onDeleteSection}
      />

      {/* Article Slug (URL path) */}
      <ArticleSlug
        value={initialSlug}
        onChange={initialSetSlug}
        required
        indicateRequired
        disabled={loading}
        setDirty={setDirty}
      />

      {/* Background Image & Caption Inputs */}
      <BackgroundImageForm
        image={initialImage}
        setImage={initialSetImage}
        caption={initialCaption}
        setCaption={initialSetCaption}
        loading={loading}
        setDirty={setDirty}
      />

      {/* Story Type Dropdown */}
      <ArticleType
        value={initialStoryType}
        onChange={initialSetStoryType}
        setDirty={setDirty}
      />

      {/* Category Dropdown */}
      <label className="my-5 block">
        Category
        <select
          className={clsx(
            `peer w-full rounded-md px-2 py-1 placeholder-transparent outline outline-1
            outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal focus:ring-0`,
            "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300"
          )}
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

      {/* Topic Selection with Popover & Checkbox */}
      <div className="grid w-1/3 grid-cols-1 gap-2">
        <div className="flex flex-row justify-items-center gap-4">
          <label>Select topic</label>
          <Popover className="relative">
            <Popover.Button>
              <PlusCircleIcon className="plus-circle-icon h-6" aria-hidden="true" />
            </Popover.Button>

            <Transition as={Fragment} leave="transition ease-in duration-100">
              <Popover.Panel className="absolute z-10 w-max">
                <div className="border-1 grid grid-cols-1 gap-1 rounded-md border bg-white px-1 py-1 shadow-lg">
                  <input
                    placeholder="Search a topic"
                    className="custom_input_sm"
                    onChange={(e) => setTopicQuery(e.target.value)}
                  />
                  <ul className="max-h-[170px] overflow-y-auto px-1">
                    {filteredTopicList.length === 0 && topicQuery !== "" ? (
                      <div className="py-2 text-center text-sm text-gray-700">
                        No results found.
                      </div>
                    ) : (
                      filteredTopicList.map((topic: any) => (
                        <li>
                          <div className="flex items-center py-2">
                            <input
                              type="checkbox"
                              defaultChecked={topic.checked}
                              onChange={() => addTopic(topic.data.id)}
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-900">
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

        {/* Display selected topics as tags */}
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

      {/* Subtopic Selection */}
      <div className="my-5 grid w-1/3 grid-cols-1 gap-2">
        <div className="flex flex-row justify-items-center gap-4">
          <label>Select subtopic</label>
          <Popover className="relative">
            <Popover.Button>
              <PlusCircleIcon className="plus-circle-icon h-6" aria-hidden="true" />
            </Popover.Button>

            <Transition as={Fragment} leave="transition ease-in duration-100">
              <Popover.Panel className="absolute z-10 w-max">
                <div className="border-1 grid grid-cols-1 gap-1 rounded-md border bg-white px-1 py-1 shadow-lg">
                  <input
                    placeholder="Search a subtopic"
                    className="custom_input_sm"
                    onChange={(e) => setSubtopicQuery(e.target.value)}
                  />
                  <ul className="max-h-[170px] overflow-y-auto px-1">
                    {filteredSubtopicList.length === 0 && subtopicQuery !== "" ? (
                      <div className="py-2 text-center text-sm">
                        <span className="block cursor-default pb-1 text-gray-700">
                          No results found.
                        </span>
                        <span
                          className="text-green-sheen block cursor-pointer underline"
                          onClick={() => setIsCreateSubtopicModalOpen(true)}
                        >
                          Create a subtopic tag
                        </span>
                      </div>
                    ) : (
                      filteredSubtopicList.map((subtopic: any) => (
                        <li>
                          <div className="flex flex-row items-center gap-2 py-2">
                            <input
                              type="checkbox"
                              defaultChecked={subtopic.checked}
                              onChange={() => addSubtopic(subtopic.id)}
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-900">
                              {subtopic.name}
                            </label>
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

        {/* Display selected subtopics as tags */}
        <div className="flex flex-row flex-wrap gap-3">
          {subtopics.map((subtopic: any) => (
            <Tags
              key={subtopic.id}
              id={subtopic.id}
              name={subtopic.name}
              color={subtopic.color}
              removeTag={removeSubtopicTag}
            />
          ))}
        </div>
      </div>
    </Form>
  </div>
);
}
