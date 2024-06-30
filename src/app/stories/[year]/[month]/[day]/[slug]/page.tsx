import { type Quizzes } from "@/app/api/quizzes/route";
import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import { type GetStoriesResult } from "@/app/api/stories/route";
import Avatar from "@/components/Avatar";
import MoreCard from "@/components/MoreCard";
import Quiz from "@/components/Quiz";
import PostQuiz from "@/components/quiz-components/PostQuiz";
import PreQuiz from "@/components/quiz-components/PreQuiz";
import QuizContainer from "@/components/quiz-components/QuizContainer";
import {
  QuizProvider as TestProvider,
  type AllQuestions,
  type MultipleChoiceQuestion,
} from "@/components/quiz-components/QuizContext";
import MultipChoice from "@/components/Quiz/MulitpleChoice";
import MultipMatch from "@/components/Quiz/MultipleMatch";
import OneMatch from "@/components/Quiz/OneMatch";
import TrueFalse from "@/components/Quiz/TrueFalse";
import FromThisSeries from "@/components/story-components/FromThisSeries";
import ShareLinks from "@/components/story-components/ShareLinks";
import TopicTag from "@/components/TopicTag";
import { tagUser } from "@/lib/cache";
import env from "@/lib/env";
import { generateMarkdown } from "@/lib/markdown";
import {
  type MultipleMatchQuestion,
  type OneMatchQuestion,
  type Question,
} from "@/lib/Question";
import { type StoryTopic } from "@prisma/client";
import { DateTime } from "luxon";
import Image from "next/image";
import React, { type ReactNode } from "react";

interface Params {
  params: {
    year: string;
    month: string;
    day: string;
    slug: string;
  };
}

// function useQuiz(id: string) {
function useQuiz(
  story: GetStoryResult,
  objective: string,
  questionType: string,
  questions: Question[] | MultipleMatchQuestion[] | MultipleMatchQuestion[],
) {
  const quizObjective = objective;
  const quizQuestionType = questionType;
  const questionList = questions;
  // const router = useRouter();
  // const { query } = router;

  // const preQuizComponent = (
  //   <Quiz
  //     isPreQuiz={true}
  //     shareLinkIdentifier={"query.uid"}
  //     topic={story.tags[0]}
  //     quizObjective={quizObjective}
  //     quizQuestionType={quizQuestionType}
  //     questionList={questionList}
  //   />
  // );

  // const postQuizComponent = (
  //   <Quiz
  //     isPreQuiz={false}
  //     shareLinkIdentifier={"query.uid"}
  //     topic={story.tags[0]}
  //     quizObjective={quizObjective}
  //     quizQuestionType={quizQuestionType}
  //     questionList={questionList}
  //   />
  // );

  // return [preQuizComponent, postQuizComponent];
}

const fakeQuestionList = [
  {
    questionType: "multiple choice",
    questionText:
      "Noggin binds with high affinity to which BMP? (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8965007/)",
    questionOptions: ["BMP6", "BMP2", "BMP10"],
    explanation:
      "Noggin binds with high affinity to BMPs such as BMP2, BMP4, BMP5, and BMP7; but cannot inhibit BMP6, BMP9, BMP10, and BMP11. Cerebrus also binds BMP2, BMP4, and BMP7 (Bond et al., 2012; Eixarch et al., 2018; Figure 1).",

    correctAnswersRatio: 0.56,

    categories: ["BMP Signalling"],

    answerIndex: 1,
  },

  {
    questionType: "multiple choice",
    questionText: "which of these statements about enhancers is INCORRECT",
    questionOptions: [
      "Enhancer sequences can be located upstream or downstream from an associated gene",
      "Enhancer sequences act upon genes on the same DNA molecule",
      "Enhancers are always located directly next to the gene they affect",
    ],
    explanation:
      "Enhancer sequences can be located thousands of base pairs away from the transcription start site of the gene being regulated. Because DNA is folded and coiled in the nucleus, the enhancer may actually be located near the transcription start site in the folded state. ",

    correctAnswersRatio: 0.235,

    categories: ["cis-regulatory elements"],

    answerIndex: 2,
  },

  {
    questionType: "true/false",
    questionText:
      "which of these statements about cis-regulatory elements are true?",
    questionOptions: [
      "Enhancer  sequences can be located upstream or downstream from an associated gene",
      "Cis-regulatory elements can be promoters, enhancers, or silencers",
      "Cis-regulatory elements are elements are genes or proteins that can regulate the expression of one or more target genes located on different DNA molecules",
    ],
    explanation:
      "Enhancers, promoters, and silencers are types of cis-regulatory elements, which reside on the same ",

    correctAnswersRatio: 0.33,

    categories: ["cis-regulatory elements"],

    answers: [true, true, false],
  },
] as AllQuestions;

const fakeQuizData = {
  questions: fakeQuestionList,

  objective: "test objective description",

  topic: "GEOLOGY" as StoryTopic,

  shareLinkId: "1234abc",
};

export default async function StoriesPage({ params }: Params) {
  const whatsNewArticles = await getWhatsNewArticles();
  const quizzes = await getQuiz();
  // const quziexample = Object.entries(quizzes);
  // quziexample.forEach(([key, value]) => {
  //   console.log("key", typeof key, key); // 'one'
  //   console.log("value", typeof value, value); // 1
  // });

  // console.log("Type: ", typeof quizzes, quizzes);
  const story = await retrieveStoryContent(params);
  const { file } = await generateMarkdown(story.storyContent[0].content);
  const questionList_MM1: MultipleMatchQuestion[] = [
    {
      questionText:
        "Match each word to its category. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      matchStatements: ["statement1", "statement2", "statement3"],
      choices: [
        "userAnswer1",
        "userAnswer2",
        "userAnswer3",
        "userAnswer4",
        "userAnswer5",
        "userAnswer6",
        "userAnswer7",
        "userAnswer8",
      ],
      // correctAnswer: ["userAnswer1", "userAnswer2", "userAnswer3"],
      correctAnswerMap: new Map([
        ["statement1", ["userAnswer1", "userAnswer5"]],
        ["statement2", ["userAnswer2", "userAnswer4", "userAnswer6"]],
        ["statement3", ["userAnswer3", "userAnswer7"]],
      ]),
      answerExplanation: [
        "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      ],
    },
    // {
    //   questionText:
    //     "Match each word to its category. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    //   matchStatements: ["statement1", "statement2", "statement3"],
    //   choices: [
    //     "userAnswer1",
    //     "userAnswer2",
    //     "userAnswer3",
    //     "userAnswer4",
    //     "userAnswer5",
    //     "userAnswer6",
    //     "userAnswer7",
    //     "userAnswer8",
    //   ],
    //   // correctAnswer: ["userAnswer1", "userAnswer2", "userAnswer3"],
    //   correctAnswerMap: new Map([
    //     ["statement1", ["userAnswer1", "userAnswer5"]],
    //     ["statement2", ["userAnswer2", "userAnswer4", "userAnswer6"]],
    //     ["statement3", ["userAnswer3", "userAnswer7"]],
    //   ]),
    //   answerExplanation: [
    //     "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    //     "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    //     "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    //   ],
    // },
    {
      questionText:
        "Match each word to its category. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      matchStatements: ["statement2-1", "statement2-2", "statement2-3"],
      choices: [
        "userAnswer2-1",
        "userAnswer2-2",
        "userAnswer2-3",
        "userAnswer2-4",
        "userAnswer2-5",
        "userAnswer2-6",
      ],
      // correctAnswer: ["userAnswer1", "userAnswer2", "userAnswer3"],
      correctAnswerMap: new Map([
        ["statement2-1", ["userAnswer2-1"]],
        ["statement2-2", ["userAnswer2-2", "userAnswer2-4", "userAnswer2-6"]],
        ["statement2-3", ["userAnswer2-3"]],
      ]),
      answerExplanation: [
        "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      ],
    },
    // {
    //   questionText: "Match each word to its category.",
    //   matchStatements: [
    //     "statement1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    //     "statement2",
    //     "statement3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    //   ],
    //   choices: [
    //     "userAnswer2-1",
    //     "userAnswer2-2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    //     "userAnswer2-3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    //   ],
    //   correctAnswerMap: new Map([
    //     [
    //       "statement1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    //       ["userAnswer2-1"],
    //     ],
    //     [
    //       "statement2",
    //       [
    //         "userAnswer2-2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    //       ],
    //     ],
    //     [
    //       "statement3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    //       [
    //         "userAnswer2-3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    //       ],
    //     ],
    //   ]),
    //   answerExplanation: [
    //     "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
    //     "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
    //     "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
    //   ],
    // },
    {
      questionText: "Match each word to its category.",
      matchStatements: ["statement3-1", "statement3-2", "statement3-3"],
      choices: ["userAnswer3-2", "userAnswer3-3", "userAnswer3-1"],
      correctAnswerMap: new Map([
        ["statement3-1", ["userAnswer3-1"]],
        ["statement3-2", ["userAnswer3-2"]],
        ["statement3-3", ["userAnswer3-3"]],
      ]),
      answerExplanation: [
        "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      ],
    },
  ];

  const questionList_OM2: OneMatchQuestion[] = [
    {
      questionText:
        "Match each word to its category. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      matchStatements: ["statement1", "statement2", "statement3"],
      choices: ["userAnswer1", "userAnswer2", "userAnswer3"],
      correctAnswer: ["userAnswer1", "userAnswer2", "userAnswer3"],
      answerExplanation: [
        "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      ],
    },
    {
      questionText: "Match each word to its category.",
      matchStatements: [
        "statement1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "statement2",
        "statement3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      ],
      choices: [
        "userAnswer2-1",
        "userAnswer2-2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "userAnswer2-3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      ],
      correctAnswer: [
        "userAnswer2-1",
        "userAnswer2-2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "userAnswer2-3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      ],
      answerExplanation: [
        "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
        "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
        "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
      ],
    },
    {
      questionText: "Match each word to its category.",
      matchStatements: [
        "statement1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "statement2",
        "statement3",
      ],
      choices: ["userAnswer3-2", "userAnswer3-3", "userAnswer3-1"],
      correctAnswer: ["userAnswer3-1", "userAnswer3-2", "userAnswer3-3"],
      answerExplanation: [
        "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      ],
    },
  ];

  const questionList_MC1: Question[] = [
    {
      questionText: "What are microglia? (this is question #1)",
      choices: [
        "The star-shaped cell that supports communication between neurons",
        "The smallest type of glial cell that makes up about 10% of all brain cells",
        "A type of neuroglia who speeds up the transmission of information",
      ],
      correctAnswer: [
        "The smallest type of glial cell that makes up about 10% of all brain cells",
      ],
      answerExplanation: [
        "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
      ],
    },
    {
      questionText: "This is an example question (this is question #2)",
      choices: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac sagittis tellus. Nam imperdiet, metus vel fringilla rhoncus, risus sapien mollis metus, ac lobortis velit velit vel magna. Quisque eget pretium nibh. Nulla facilisi. Aenean semper nunc id arcu molestie viverra.",
        "This is also an incorrect answer",
        "This is the correct answer",
      ],
      correctAnswer: ["This is the correct answer"],
      answerExplanation: ["[answer explanation here]"],
    },
    {
      questionText: "This is an example question (this is question #3)",
      choices: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac sagittis tellus. Nam imperdiet, metus vel fringilla rhoncus, risus sapien mollis metus, ac lobortis velit velit vel magna. Quisque eget pretium nibh. Nulla facilisi. Aenean semper nunc id arcu molestie viverra.",
        "This is also an incorrect answer",
        "This is the correct answer",
      ],
      correctAnswer: ["This is the correct answer"],
      answerExplanation: ["[answer explanation here]"],
    },
  ];

  const questionList_TF1: Question[] = [
    {
      questionText:
        "Mark each statement as true or false. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      choices: [
        "Statement 1: this should be true",
        "Statement 2: this should be false",
        "Statement 3: this should be false",
      ],
      correctAnswer: ["true", "false", "false"],
      answerExplanation: [
        "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      ],
    },
    {
      questionText: "Mark each statement as true or false.",
      choices: [
        "Statement 1: this should be false",
        "Statement 2: this should be true",
        "Statement 3: this should be true",
      ],
      correctAnswer: ["false", "true", "true"],
      answerExplanation: [
        "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
        "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
        "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
      ],
    },
    {
      questionText: "Mark each statement as true or false.",
      choices: [
        "Statement 1: this should be true",
        "Statement 2: this should be false",
        "Statement 3: this should be true",
      ],
      correctAnswer: ["true", "false", "true"],
      answerExplanation: [
        "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      ],
    },
  ];

  // const [preQuiz, postQuiz] = useQuiz(
  //   story,
  //   "How much do you know already know about microglia?",
  //   "True/False",
  //   questionList_TF1,
  // );

  return (
    <div className="flex flex-col">
      <div className="relative h-screen">
        <Image
          src={story.thumbnailUrl}
          className="-z-10 h-full object-cover"
          fill={true}
          alt={story.title}
        />
        <div className="relative flex h-full flex-col justify-end px-12 pb-24 pt-10">
          <h1
            className="w-4/5 p-8 font-alegreyaSansSC text-6xl font-bold sm:text-8xl"
            style={{ color: story.titleColor }}
          >
            {story.title}
          </h1>
          <h2
            className="w-5/6 p-8 pt-0 font-alegreyaSansSC text-4xl font-semibold"
            style={{ color: story.summaryColor }}
          >
            {story.summary}
          </h2>
        </div>
      </div>
      <div className="relative mx-2 mt-5 flex w-screen flex-col md:mx-auto md:w-[720px]">
        <div className="absolute right-0 top-0 flex flex-1 flex-row justify-center xl:-left-24  xl:flex-col xl:pt-3">
          <ShareLinks />
        </div>

        <div className="flex flex-row">
          <p className="mr-2">
            {story.storyType.slice(0, 1) +
              story.storyType.slice(1).toLowerCase()}{" "}
            | we need to add article type |
          </p>{" "}
          {story.tags.map((item: StoryTopic, index: number) => {
            return <TopicTag name={item} key={`${item}-${index}`} />;
          })}
        </div>
        <div>
          {story.storyContributions.map((element, index) => {
            return (
              <p key={`contributor-header-${index}`}>
                {element.contributionType == "AUTHOR"
                  ? `by ${element.user.firstName} ${element.user.lastName}`
                  : `${element.contributionType} by ${element.user.firstName} ${element.user.lastName}`}
              </p>
            );
          })}
        </div>
        <p>
          {DateTime.fromJSDate(story.publishedAt).toLocaleString({
            ...DateTime.DATETIME_MED,
            timeZoneName: "short",
          })}
          {story.updatedAt != story.publishedAt
            ? " | " +
              DateTime.fromJSDate(story.updatedAt).toLocaleString({
                ...DateTime.DATETIME_MED,
                timeZoneName: "short",
              })
            : ""}
        </p>
      </div>
      <div className="mx-2 mt-2 flex flex-col items-center gap-5 md:mx-auto">
        {/* <QuizProvider>
          <TestProvider quizInfo={fakeQuizData}>
            <PreQuiz />
            <PostQuiz />
            {preQuiz}
            {file.result as ReactNode}
            {postQuiz}{" "}
          </TestProvider>
        </QuizProvider> */}
        {/* {quizzes.quizzes.subparts.id} */}
        <Quiz Quizzes={quizzes} />
      </div>
      <p className="w-[calc( 100% - 1rem )] mx-2 my-5 border-t-2 border-[#616161]  text-sm text-[#616161] md:mx-auto md:w-[720px]">
        Animation provided by Source name 1. Sources provided by Source name 2.
        We thank Funding 1 for their support, and Professor 2 for their
        guidance. Ex. Cover Image: “Hawaiian Bobtail Squid” is licensed under CC
        BY-NC 4.0.
      </p>
      {story.storyContributions.map((element, index) => (
        <div
          key={`contributor-footer-${index}`}
          className="w-[calc( 100% - 1rem )] mx-2 mb-3 flex flex-row items-stretch rounded-2xl border border-sciquelCardBorder p-3 shadow-md md:mx-auto md:w-[720px]"
        >
          <Avatar
            imageUrl={element.user.avatarUrl ?? undefined}
            label={element.user.firstName[0]}
            className="m-5"
            size="4xl"
          />
          <div className="m-5 flex flex-[2.3] flex-col">
            <p className="font-alegreyaSansSC text-4xl font-medium text-sciquelTeal">
              {element.user.firstName} {element.user.lastName}
            </p>
            <p className="flex-1 font-sourceSerif4 text-xl">
              {element.user.bio}
            </p>
          </div>
        </div>
      ))}
      <FromThisSeries />
      <MoreCard articles1={whatsNewArticles} articles2={whatsNewArticles} />
    </div>
  );
}

async function retrieveStoryContent({
  year,
  day,
  month,
  slug,
}: Params["params"]) {
  const storyRoute = `/stories/${year}/${month}/${day}/${slug}`;
  const prefetchedMetadataRes = await fetch(
    `${env.NEXT_PUBLIC_SITE_URL}/api${storyRoute}`,
  );

  if (!prefetchedMetadataRes.ok) {
    throw new Error("Failed to fetch metadata");
  }

  const prefetchedMetadata =
    (await prefetchedMetadataRes.json()) as GetStoryResult;

  const res = await fetch(
    `${env.NEXT_PUBLIC_SITE_URL}/api${storyRoute}?include_content=true`,
    {
      next: {
        tags: [
          storyRoute,
          ...prefetchedMetadata.storyContributions.map((contribution) =>
            tagUser(contribution.user.id),
          ),
        ],
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const json = (await res.json()) as GetStoryResult;

  return {
    ...json,
    createdAt: new Date(json.createdAt),
    publishedAt: new Date(json.publishedAt),
    updatedAt: new Date(json.updatedAt),
  } as GetStoryResult;
}

/// temporary
async function getWhatsNewArticles() {
  const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api/stories`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json().then((value: GetStoriesResult) =>
    value.stories.map((story) => ({
      ...story,
      createdAt: new Date(story.createdAt),
      publishedAt: new Date(story.publishedAt),
      updatedAt: new Date(story.updatedAt),
    })),
  );
}

/// temporary
async function getQuiz() {
  const res = await fetch(
    `${env.NEXT_PUBLIC_SITE_URL}/api/quizzes?storyId=647ad74aa9efff3abe83045a`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
