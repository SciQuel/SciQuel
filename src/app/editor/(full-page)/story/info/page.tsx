import {
  getSubpartById,
  getSubpartByQuizQuestion,
  getSubpartByQuizQuestionType,
} from "@/app/api/tools/SubpartQuiz";
import StoryInfoForm from "@/components/EditorDashboard/StoryInfoForm";
import prisma from "@/lib/prisma";
import {
  ComplexMatchingSubpart,
  DirectMatchingSubpart,
  MultipleChoiceSubpart,
  QuestionType,
  QuizQuestion,
  SelectAllSubpart,
  TrueFalseSubpart,
} from "@prisma/client";
import { redirect } from "next/navigation";
import StoryInfoEditorClient from "./StoryInfoEditorPageClient";

async function getSubparts(quizzes: QuizQuestion[]) {
  let index = 0;
  const allSubparts: getSubpartByQuizQuestionType[] = [];
  while (index < quizzes.length) {
    const subpart = await getSubpartByQuizQuestion(
      quizzes[index].id,
      true,
      true,
    );
    allSubparts.push(subpart);
    index++;
  }

  return allSubparts;
}

interface SearchParams {
  id?: string;
}

export default async function StoryInfoEditorPage({
  searchParams: { id },
}: {
  searchParams: SearchParams;
}) {
  const story = id
    ? await prisma.story.findUnique({
        where: { id },
        include: {
          triviaQuestions: true,
          quizQuestions: true,
          storyContributions: {
            include: {
              contributor: true,
            },
          },
          storyContent: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
          subtopics: {
            include: {
              subtopic: true,
            },
          },
          generalSubjects: {
            include: {
              subject: true,
            },
          },
        },
      })
    : null;
  if (!id || !story) {
    return redirect("/editor/dashboard");
  }

  const quizzes = await getSubparts(story.quizQuestions);

  return (
    <div className="mx-32 mt-5 flex flex-col gap-5">
      <h3 className="text-3xl font-semibold text-sciquelTeal">Story Info</h3>
      {/* <StoryInfoForm
        title={story.title}
        summary={story.summary}
        image={story.thumbnailUrl}
        id={story.id}
        caption={story.coverCaption}
        slug={story.slug}
        body={story.storyContent[0].content ?? ""}
        titleColor={story.titleColor}
        summaryColor={story.summaryColor}
        topics={story.topics}
        storyType={story.storyType}
        contributors={story.storyContributions}
      /> */}
      <StoryInfoEditorClient story={story} quizzes={quizzes} />
    </div>
  );
}
