import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import { type GetStoriesResult } from "@/app/api/stories/route";
import { PrintModeProvider } from "@/components/story-components/PrintContext";
import { StoryScrollProvider } from "@/components/story-components/scroll/ScrollProvider";
import StoryCredits from "@/components/story-components/StoryCredits";
import StoryFooter from "@/components/story-components/StoryFooter";
import { tagUser } from "@/lib/cache";
import env from "@/lib/env";
import { generateMarkdown } from "@/lib/markdown";
import { type ReactNode } from "react";

interface Params {
  year: string;
  month: string;
  day: string;
  slug: string;
}

interface ParamsPromise {
  params: Promise<Params>;
}

export default async function StoriesPage(props: ParamsPromise) {
  const params = await props.params;
  const whatsNewArticles = await getWhatsNewArticles();
  const story = await retrieveStoryContent(params);

  const { file } = (await generateMarkdown(
    `${story.storyContent[0].content}:end-icon`,
  )) as { file: { result: ReactNode } };

  return (
    <PrintModeProvider>
      <StoryScrollProvider>
        {/* <DictionaryProvider dictionary={testDictList}> */}
        <div className="flex h-fit flex-col overflow-visible">
          <StoryCredits story={story} />{" "}
          <div className="mx-0 mt-0 grid grid-cols-[1fr_0px] gap-0 px-0 pt-0 lg:grid-cols-[1fr_768px_1fr]">
            <div className="pointer-events-none relative -mt-20 hidden flex-col items-end px-0 xl:flex">
              <div className="relative mt-1 flex h-full w-full flex-1 flex-col items-end gap-0 overflow-visible px-[1.5rem]">
                {/* <ShareLinks /> */}

                <div className="flex-1 self-stretch" />
              </div>
            </div>
            <div className="w-screen xl:w-full">
              <div className="mx-0 mt-2 flex w-screen flex-col items-center gap-4 px-2 sm:mx-auto md:w-[768px] md:px-0">
                {/* <Dictionary /> */}

                {file.result}
              </div>
              <div className="w-[calc( 100% - 1rem )] mx-2 mb-8 mt-8 border-t-2 border-[#616161] pt-1  md:mx-auto md:w-[768px] ">
                <p className=" mt-2 text-sm text-[#616161]">
                  {story.storyContent ? story.storyContent[0].footer ?? "" : ""}
                </p>
                {/* <p className=" mt-2 text-sm text-[#616161]">
                    <span className="font-semibold">Acknowledgements:</span>{" "}
                    Animation provided by Source name 1. Sources provided by
                    Source name 2. We thank Funding 1 for their support, and
                    Professor 2 for their guidance. Ex. Cover Image: “Hawaiian
                    Bobtail Squid” is licensed under CC BY-NC 4.0.
                  </p>
                  <p className=" mt-2 text-sm text-[#616161]">
                    <span className="font-semibold">Notes:</span> All crosses
                    were performed at 26ºC on standard molasses fly food. Males
                    were used for all experiments. Flies were transferred to
                    fresh food every 1‐2d. For Lst8 upregulation experiments,
                    food was prepared by adding 50 μl of 4mg/ml of RU468
                    dissolved in 100% EtOH or by adding 50 μl of 100% EtOH. DaGS
                    {`>`}Lst8 flies were put on either +RU486 or +Vehicle food
                    after eclosion.
                  </p>
                  <p className=" mt-2 text-sm font-semibold text-[#616161]">
                    References:
                  </p>
                  <p className=" mt-2 text-sm text-[#616161]">
                    Agarwal, V. (2018). Predicting microRNA targeting efficacy
                    in Drosophila. Genome Biology, 19, 152.
                    10.1186/s13059-018-1504-3{" "}
                  </p>
                  <p className=" mt-2 text-sm text-[#616161]">
                    Bilen, J. , Liu, N. , Burnett, B. G. , Pittman, R. N. , &
                    Bonini, N. M. (2006). MicroRNA pathways modulate
                    polyglutamine‐induced neurodegeneration. Molecular Cell,
                    24(1), 157–163. 10.1016/j.molcel.2006.07.030
                  </p>
                  <p className=" mt-2 text-sm text-[#616161]">
                    Liu, N. , Landreh, M. , Cao, K. , Abe, M. , Hendriks, G.‐J.
                    , Kennerdell, J. R. , Zhu, Y. , Wang, L.‐S. , & Bonini, N.
                    M. (2012). The microRNA miR‐34 modulates ageing and
                    neurodegeneration in Drosophila. Nature, 482(7386), 519–523.
                    10.1038/nature10810
                  </p> */}
              </div>
            </div>
          </div>
          <StoryFooter
            storyContributions={story.storyContributions}
            articles1={whatsNewArticles}
            articles2={whatsNewArticles}
          />
        </div>
        {/* </DictionaryProvider> */}
      </StoryScrollProvider>
    </PrintModeProvider>
  );
}

// async function retrieveUserInteractions(storyId: string) {
//   const userSession = await getServerSession();
//   if (userSession?.user.email) {
//     const bookmarked = false;
//     const brained = false;

//     const searchParams = new URLSearchParams({
//       story_id: storyId,
//       user_email: userSession.user.email,
//     });

//     console.log("search params are: ", searchParams.toString());

//     const bookmarkUrl = `${
//       env.NEXT_PUBLIC_SITE_URL
//     }/api/user/bookmark?${searchParams.toString()}`;
//     // const bookmarkUrl = `${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark?story_id=${storyId}&user_email=${userSession.user.email}}`;
//     const brainUrl = `${
//       env.NEXT_PUBLIC_SITE_URL
//     }/api/user/brains?${searchParams.toString()}`;

//     console.log("bookmark url: ", bookmarkUrl);
//     console.log("brain url: ", brainUrl);

//     const bookRes = await fetch(brainUrl, {
//       next: {
//         revalidate: 0,
//       },
//     });
//     console.log("bookres: ", bookRes);
//     const json = await bookRes.json();
//     console.log("bookres error: ", json);
//   }
// }

async function retrieveStoryContent({ year, day, month, slug }: Params) {
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
            tagUser(contribution.contributor.id),
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
