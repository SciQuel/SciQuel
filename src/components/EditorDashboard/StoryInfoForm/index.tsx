"use client";

import fsPromises from "fs/promises";
import path from "path";
import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import FormSelect from "@/components/Form/FormSelect";
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
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState, useTransition } from "react";
import NewContributor from "./contributors/confirmNewContributer"; // Importing NewContributor component
import { getData, randomBackgroundColor, setTagsColor } from "./StoryFormFunc";
import NewSubject from "./subjectComponents/newSubject";
import NewSubtopic from "./subtopicComponents/newSubtopic";
import Tags from "./Tags";

interface Props {
  id?: string;
  title?: string;
  summary?: string;
  image?: string;
  caption?: string;
}

export default function StoryInfoForm({
  id: storyId,
  title: initialTitle,
  summary: initialSummary,
  image: initialImage,
  caption: initialCaption,
}: Props) {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle ?? "");
  const [summary, setSummary] = useState(initialSummary ?? "");
  const [image, setImage] = useState<File | string | null>(
    initialImage ?? null,
  );
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [dirty, setDirty] = useState(false);
  const [loading, startTransition] = useTransition();

  const [storyType, setStoryType] = useState<StoryType>("DIGEST");
  const [category, setCategory] = useState<Category>("ARTICLE");

  const [titleColor, setTitleColor] = useState("#000000");
  const [summaryColor, setSummaryColor] = useState("#000000");

  const [slug, setSlug] = useState("");

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

  const [contributors, setContributors] = useState<string[]>([]); // Holds list of contributors

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

  //add a subtopic tag
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

  //add a subject tag
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

  //remove a topic tag
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

  //remove a subtopic tag
  const removeSubtopicTag = (id: number) => {
    setSubtopics(subtopics.filter((item: any) => item.id != id));
    setSubtopicList(
      subtopiclist.map((item: any) =>
        item.id == id ? { ...item, checked: false } : item,
      ),
    );
  };

  //remove a subject tag
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

  return (
    <div className="flex flex-col gap-2">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            try {
              if (dirty) {
                const formData = new FormData();
                if (storyId) {
                  formData.append("id", storyId);
                }
                formData.append("title", title);
                formData.append("summary", summary);
                formData.append("imageCaption", caption);
                formData.append("storyType", storyType);
                formData.append("category", "ARTICLE");
                formData.append("titleColor", titleColor);
                formData.append("summaryColor", titleColor);
                formData.append("slug", slug);
                formData.append("topics", JSON.stringify(topics));
                formData.append("subtopics", "[]");
                formData.append("generalSubjects", "[]");

                formData.append("staffPicks", "false");

                // Add contributors to the formData
                formData.append("contributions", JSON.stringify(contributors));

                if (image === null) {
                  return;
                } else if (typeof image === "string") {
                  formData.append("imageUrl", image);
                } else {
                  const file = new File([image], image.name);
                  formData.append("image", file, file.name);
                }
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
        <FormInput
          title="Story Title"
          required
          indicateRequired
          value={title}
          onChange={(e) => {
            setDirty(true);
            setTitle(e.target.value);
          }}
          disabled={loading}
        />
        <FormInput
          title="Summary"
          required
          indicateRequired
          value={summary}
          onChange={(e) => {
            setDirty(true);
            setSummary(e.target.value);
          }}
          disabled={loading}
        />
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

        {/* Add the NewContributor component here */}
        <NewContributor addContributor={addContributor} />

        <ul className="list-disc pl-5">
          {contributors.map((contributor, index) => (
            <li key={index}>{contributor}</li>
          ))}
        </ul>

        <FormInput
          title="Slug"
          required
          indicateRequired
          value={slug}
          disabled={loading}
          onChange={(e) => {
            setDirty(true);
            setSlug(e.target.value);
          }}
        />
        <div className="mt-5">
          <h3 className="mb-2">Background Image</h3>
          <label
            className={clsx(
              "cursor-pointer select-none rounded-md bg-teal-600 px-2 py-1 font-semibold text-white hover:bg-teal-700",
              loading && "pointer-events-none opacity-50",
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fileUploadRef.current?.click();
              }
            }}
            tabIndex={loading ? undefined : 0}
          >
            <input
              type="file"
              className="hidden"
              ref={fileUploadRef}
              onChange={(e) => {
                setDirty(true);
                setImage(e.target.files?.[0] ?? null);
              }}
              accept="image/jpeg, image/png, image/gif"
            />
            Select file to upload
          </label>
          <div className="my-5 rounded-md border bg-white p-2">
            <h3 className="mb-3 text-xl font-semibold">Image Preview</h3>
            {image && typeof image !== "string" ? (
              <>
                <p>Uploaded file: {image.name}</p>
                <div className="h-96">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(image)}
                    className="h-full object-contain"
                  />
                </div>
              </>
            ) : typeof image === "string" ? (
              <>
                <p>Image URL: {image}</p>
                <div className="h-96">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} className="h-full object-contain" />
                </div>
              </>
            ) : (
              <p className="italic">No image uploaded</p>
            )}
          </div>
          <FormInput
            title="Image Caption"
            required
            indicateRequired
            value={caption}
            onChange={(e) => {
              setDirty(true);
              setCaption(e.target.value);
            }}
            disabled={loading}
          />
        </div>
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
        {/* <label className="my-5 block">
          Select Topic
          <select
            className={clsx(
              `peer w-full rounded-md px-2 py-1 placeholder-transparent outline outline-1
                outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal
                focus:ring-0`,
              "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
            )}
            placeholder="Select a story type"
            value={topics[0]}
            onChange={(e) => {
              setDirty(true);
              setTopics([e.target.value as StoryTopic]);
            }}
          >
            <option value="ASTRONOMY">Astronomy</option>
            <option value="BIOLOGY">Biology</option>
            <option value="CHEMICAL_ENGINEERING">Chemical Engineering</option>
            <option value="CHEMISTRY">Chemistry</option>
            <option value="COMPUTER_SCIENCE">Computer Science</option>
            <option value="ENVIRONMENTAL_SCIENCE">Environmental Science</option>
            <option value="ELECTRICAL_ENGINEERING">
              Electrical Engineering
            </option>
            <option value="GEOLOGY">Geology</option>
            <option value="MATHEMATICS">Mathematics</option>
            <option value="MECHANICAL_ENGINEERING">
              Mechanical Engineering
            </option>
            <option value="MEDICINE">Medicine</option>
            <option value="PHYSICS">Physics</option>
            <option value="PSYCHOLOGY">Psychology</option>
            <option value="SOCIOLOGY">Sociology</option>
            <option value="TECHNOLOGY">Technology</option>
          </select>
        </label> */}

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

        {/* <label className="my-5 block">
          Select Subtopic
          <select
            className={clsx(
              `peer w-full rounded-md px-2 py-1 placeholder-transparent outline outline-1
                outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal
                focus:ring-0`,
              "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
            )}
            placeholder="Select a story type"
            value={topics[0]}
            onChange={(e) => {
              setDirty(true);
              setTopics([e.target.value as StoryTopic]);
            }}
          >
            <option value="CARDIOLOGY">Cardiology</option>
            <option value="CHEMICAL_ENGINEERING">Chemical Engineering</option>
            <option value="GEOCHEMISTRY">Geochemistry</option>
            <option value="ONCOLOGY">Oncology</option>
            <option value="RHEUMATOLOGY">Rheumatology</option>
          </select>
        </label> */}

        <div
          className={`my-5 grid max-h-none w-1/3 grid-cols-1 gap-2 ${
            topics.length == 0 ? "hidden" : "visible"
          }`}
        >
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

        {/* <label className="my-5 block">
          Select Subject
          <select
            className={clsx(
              `peer w-full rounded-md px-2 py-1 placeholder-transparent outline outline-1
                outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal
                focus:ring-0`,
              "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
            )}
            placeholder="Select a story type"
            value={topics[0]}
            onChange={(e) => {
              setDirty(true);
              setTopics([e.target.value as StoryTopic]);
            }}
          >
            <option value="ANATOMY">Anatomy</option>
            <option value="BIOCHEMISTRY">Biochemistry</option>
            <option value="GEOCHEMISTRY">Geochemistry</option>
            <option value="GENETICS">Genetics</option>
            <option value="NUTRITION">Nutrition</option>
          </select>
        </label> */}

        <div
          className={`grid w-1/3 grid-cols-1 gap-2 ${
            topics.length == 0 ? "hidden" : "visible"
          }`}
        >
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

        <FormInput
          title="Publish Date"
          required
          indicateRequired
          value={caption}
          onChange={(e) => {
            setDirty(true);
            setCaption(e.target.value);
          }}
          disabled={loading}
        />

        <button
          type="submit"
          className="my-5 select-none rounded-md bg-teal-600 px-2 py-1 font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
          disabled={
            title.length === 0 ||
            summary.length === 0 ||
            image === null ||
            caption.length === 0 ||
            loading
          }
        >
          Continue
        </button>
      </Form>

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
