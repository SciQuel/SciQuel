import TestStory from "@/components/testStoryPage";
import TopicTag from "@/components/TopicTag";
import { type StoryTopic } from "@prisma/client";

interface Params {
  slug: string;
  year: string;
  month: string;
  day: string;
}

// story is
// object with keys
//{id, storyType, title, titleColor,
//slug, summary, summaryColor, tags, published, staffPick, thumbnailUrl,
//createdAt, publishedAt, updatedAt, storyContributions}).

async function getStory(params: { params: Params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/stories/${params.year}/${params.month}/${params.day}/${params.slug}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json().then((value: any) => value);
}

export default async function Stories({
  params,
}: {
  params: { params: Params };
}) {
  const storyInfo = await getStory(params);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${storyInfo.thumbnailUrl})`,
        }}
        className="flex h-screen w-screen flex-col justify-end"
      >
        <h1
          className="p-8 font-alegreyaSansSC text-8xl"
          style={{ color: storyInfo.titleColor }}
        >
          {storyInfo.title}
        </h1>
        <h2
          className="p-8 pt-0 font-alegreyaSansSC text-5xl"
          style={{ color: storyInfo.summaryColor }}
        >
          {storyInfo.summary}
        </h2>
      </div>
      <div
        className="m-auto flex w-screen flex-col  md:w-[720px]"
        style={{ backgroundColor: "lime" }}
      >
        section for credits
        <div className="flex flex-row">
          <p className="mr-2 flex flex-row">
            {storyInfo.storyType.slice(0, 1) +
              storyInfo.storyType.slice(1).toLowerCase()}{" "}
            | we need to add article type |
          </p>{" "}
          {storyInfo.tags.map((item: StoryTopic, index: number) => {
            return <TopicTag name={item} key={item + index} />;
          })}
        </div>
        <div>
          {storyInfo.storyContributions.map((element, index) => {
            return (
              <span>
                {element.contributionType == "AUTHOR"
                  ? `by ${element.user.firstName} ${element.user.lastName}`
                  : `${element.contributionType} by ${element.user.firstName} ${element.user.lastName}`}
              </span>
            );
          })}
        </div>
      </div>
      <div>
        test route year is {params.year} <br /> month is {params.month} <br />{" "}
        day is {params.day} <br /> slug is {params.slug} <br />
        {storyInfo.storyType} {storyInfo.storyContributions.contributionType}
        <TestStory storyInfo={storyInfo}></TestStory>
      </div>
    </>
  );
}
