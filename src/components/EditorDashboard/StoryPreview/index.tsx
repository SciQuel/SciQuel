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
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle ?? "");
  const [summary, setSummary] = useState(initialSummary ?? "");
  const [image, setImage] = useState<File | string | null>(
    initialImage ?? null,
  );
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [date, setDate] = useState<Date | null>(initialDate ?? null);
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

  //format date
  const year = date?.getFullYear()
  const month = (date?.getMonth() + 1).toString().padStart(2, "0")
  const day = date?.getDate().toString().padStart(2, "0")
  
  return (
    <div className="flex flex-col gap-2">
      
    </div>
    
  );
}
