import { type GetStoriesResult } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import Avatar from "@/components/Avatar";
import FooterIcon from "@/components/Footer/FooterIcon";
import HomepageSection from "@/components/HomepageSection";
import ProfileButton from "@/components/ProfileButtons";
import Pagination from "@/components/StoriesList/Pagination";
import TopicTag from "@/components/TopicTag";
import env from "@/lib/env";
import prisma from "@/lib/prisma";
import NotFound from "../not-found";

interface Params {
  searchParams: { [key: string]: string };
  page_number: string;
}
/* Test: 
    ID with author role:  64ff8fa50d2710ca31d09555
    ID with out author role: 64cc4fefe601ab59588a9e0f
*/
export default async function ProfilePage({
  searchParams,
  page_number,
}: Params) {
  const { id, category } = searchParams;
  const params = {
    ...(id ? { id } : {}),
    ...(category ? { category } : {}),
    page: page_number || "1",
  };
  if (id == null) {
    return NotFound();
  }
  const authorsPromise = retrieveAuthors(id);
  const [authors, { stories, total_pages }] = await Promise.all([
    authorsPromise,
    getStories(params),
  ]);
  console.log(authors);
  if (!authors?.roles.includes("AUTHOR")) {
    console.log("Author: ", id);
    throw new Error("This person is not an author");
  }

  return (
    <>
      <div className="flex  flex-row">
        <div className="relative max-h-full  w-full ">
          <div className="relative h-full bg-white shadow">
            <div className="flex h-full w-full  justify-between">
              <div className="fixed flex h-full w-1/6 flex-col bg-[#84B59F] p-6 text-left">
                <div className="relative ">
                  <Avatar
                    imageUrl={"/example.png" ?? undefined}
                    label="Image"
                    size="6xl"
                    className="h-60 w-auto"
                  />
                </div>
                <div className="my-2 text-2xl">
                  {authors?.firstName} {authors?.lastName}
                </div>
                <div className="my-1.5 flex gap-2">
                  <TopicTag name="BIOLOGY"></TopicTag>
                  <TopicTag name="CHEMISTRY"></TopicTag>
                </div>
                <div className="my-2">
                  Short Author Bio Here. 1-3 Sentences. Fill text. Fill text.
                  Fill text. Fill text. Fill text. Fill text. Fill text. Fill
                  text. Fill text.Fill text. Fill text. Fill text. Fill text.
                  Fill text. Fill text. Fill text.Fill text.Fill text.Fill text.
                </div>
                <div className="mt-2.5 flex">
                  <FooterIcon type="instagram" />
                  <FooterIcon type="facebook" />
                </div>
              </div>
              <div className="w-1/6" />
              <div className="flex w-5/6 p-6 text-center">
                <div className="h-full">
                  <ProfileButton searchParams={searchParams} />
                  <div>
                    <div className="my-3 text-left">
                      <HomepageSection
                        heading={
                          category ? category + " Stories" : "Recent Stories"
                        }
                      />
                    </div>
                    <div className="my-3 text-left">
                      <ArticleList articles={stories} />
                    </div>
                    <div className="my-3 text-right">
                      <Pagination total_pages={total_pages} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

async function getStories(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const route = `/stories?${searchParams.toString()}&page_size=30`;

  const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api${route}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: GetStoriesResult = await res.json().then();

  data.stories = data.stories.map((story) => ({
    ...story,
    createdAt: new Date(story.createdAt),
    publishedAt: new Date(story.publishedAt),
    updatedAt: new Date(story.updatedAt),
  }));

  return data;
}

async function retrieveAuthors(id: string) {
  const authors = await prisma.user.findUnique({
    where: { id: id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      bio: true,
      roles: true,
    },
  });

  return authors;
}
