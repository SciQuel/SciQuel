import StoryContributorForm from "@/components/EditorDashboard/StoryContributorForm";
import prisma from "@/lib/prisma";
import { type Story, type StoryContribution } from "@prisma/client";
import { redirect } from "next/navigation";

interface SearchParams {
  id?: string;
}

type FullStoryContribution = StoryContribution & {
  contributor: {
    firstName: string;
    lastName: string;
    email?: string;
    bio?: string;
  };
};

export default async function StoryContributorEditorPage({
  searchParams: { id },
}: {
  searchParams: SearchParams;
}) {
  const storyPromise = retrieveStory(id);
  const authorsPromise = retrieveAuthors();
  const [story, authors] = await Promise.all([storyPromise, authorsPromise]);

  if (story === null) {
    return redirect("/editor/dashboard");
  }

  return (
    <div className="mx-32 mt-5 flex flex-col gap-5">
      <h3 className="text-3xl font-semibold text-sciquelTeal">
        Story Contributors
      </h3>
      <StoryContributorForm
        id={story.id}
        contributors={story?.storyContributions}
        authorDirectory={authors}
      />
    </div>
  );
}

async function retrieveStory(id?: string) {
  if (id) {
    return (await prisma.story.findUnique({
      where: { id },
      include: {
        storyContributions: {
          include: {
            contributor: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                bio: true,
              },
            },
          },
        },
      },
    })) as Story & {
      storyContributions: FullStoryContribution[];
    };
  }
  return null;
}

async function retrieveAuthors() {
  const authors = await prisma.contributor.findMany({
    select: {
      firstName: true,
      lastName: true,
      email: true,
      bio: true,
    },
  });

  return authors;
}
