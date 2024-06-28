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
import ArticlePreview from "./articlePreviewComponent/articlePreview";
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
  date?: Date | null;
}

export default function StoryPreview({
  id: storyId,
  title: initialTitle,
  summary: initialSummary,
  image: initialImage,
  caption: initialCaption,
  date: initialDate,
}: Props) {
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

  return (
    <div className="flex flex-col gap-2">
      <ArticlePreview />
    </div>
  );
}
