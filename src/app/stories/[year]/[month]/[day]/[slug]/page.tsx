import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import { type GetStoriesResult } from "@/app/api/stories/route";
// import Dictionary from "@/components/story-components/dictionary/Dictionary";
// import { DictionaryProvider } from "@/components/story-components/dictionary/DictionaryContext";
// import DictionarySentence from "@/components/story-components/dictionary/DictionarySentence";
// import DictionaryWord from "@/components/story-components/dictionary/DictionaryWord";
// import TestImages from "@/components/story-components/imgTests";
// import StoryParagraph from "@/components/story-components/markdown/StoryParagraph";
import { PrintModeProvider } from "@/components/story-components/PrintContext";
import { StoryScrollProvider } from "@/components/story-components/scroll/ScrollProvider";
// import ShareLinks from "@/components/story-components/ShareLinks";
import StoryCredits from "@/components/story-components/StoryCredits";
import StoryFooter from "@/components/story-components/StoryFooter";
import StoryLargeImage from "@/components/story-components/StoryLargeImage";
import { tagUser } from "@/lib/cache";
import env from "@/lib/env";
import { generateMarkdown } from "@/lib/markdown";
// import { getServerSession } from "next-auth";
// import Image from "next/image";
import { type ReactNode } from "react";

interface Params {
  params: {
    year: string;
    month: string;
    day: string;
    slug: string;
  };
}

// const testDictionary = {
//   camouflage: {
//     id: "123abc",
//     definition:
//       "concealment by some means that alters or obscures the appearance.",
//     pronunciation: "cam·ou·flage \n/ˈkaməˌflä(d)ZH/",
//     instances: [],
//     inContext: [
//       "This camouflage comes from a layer of densely packed, pigmented structures just below the skin’s surface.",
//       "All modern, adult birds molt at least once a year to replace old, damaged feathers, or to exchange their bright summer colors for drab winter camouflage.",
//     ],
//     bookmarked: undefined,
//     altSpellings: [],
//   },

//   enzyme: {
//     id: "345abc",
//     definition:
//       "An enzyme is a biological catalyst and is almost always a protein. It speeds up the rate of a specific chemical reaction in the cell.",
//     pronunciation: "en·zyme \n/ˈenˌzīm/",
//     instances: [],
//     inContext: [
//       "A cell contains thousands of different types of enzyme molecules, each specific to a particular chemical reaction.",
//     ],
//     bookmarked: undefined,
//     altSpellings: [],
//   },

//   lipopolysaccharide: {
//     id: "678abc",
//     definition:
//       "lipopolysaccharides (LPS) are important outer membrane components of gram-negative bacteria. They typically consist of a lipid domain (hydrophobic) attached to a core oligosaccharide and a distal polysaccharide.",
//     pronunciation:
//       "lip·o·pol·y·sac·cha·ride \n/ˌlipōˌpälēˈsakəˌrīd,ˌlīpōˌpälēˈsakəˌrīd/",
//     instances: [],
//     inContext: [
//       "The Gram-negative bacterial lipopolysaccharide (LPS) is a major component of the outer membrane that plays a key role in host–pathogen interactions with the innate immune system.",
//     ],
//     bookmarked: undefined,
//     altSpellings: ["LPS"],
//   },
// };

// const testDictList = [
//   {
//     id: "123abc",
//     word: "camouflage",
//     definition:
//       "concealment by some means that alters or obscures the appearance.",
//     instances: [],
//     inContext: [
//       "This camouflage comes from a layer of densely packed, pigmented structures just below the skin’s surface.",
//       "All modern, adult birds molt at least once a year to replace old, damaged feathers, or to exchange their bright summer colors for drab winter camouflage.",
//     ],
//     bookmarked: undefined,
//     altSpellings: [],
//   },
//   {
//     id: "345abc",
//     word: "enzyme",
//     definition:
//       "An enzyme is a biological catalyst and is almost always a protein. It speeds up the rate of a specific chemical reaction in the cell.",
//     instances: [],
//     inContext: [
//       "A cell contains thousands of different types of enzyme molecules, each specific to a particular chemical reaction.",
//     ],
//     bookmarked: undefined,
//     altSpellings: [],
//   },
//   {
//     id: "678abc",
//     word: "lipopolysaccharide",
//     definition:
//       "lipopolysaccharides (LPS) are important outer membrane components of gram-negative bacteria. They typically consist of a lipid domain (hydrophobic) attached to a core oligosaccharide and a distal polysaccharide.",
//     pronunciation:
//       "lip·o·pol·y·sac·cha·ride \n/ˌlipōˌpälēˈsakəˌrīd,ˌlīpōˌpälēˈsakəˌrīd/",
//     instances: [],
//     inContext: [
//       "The Gram-negative bacterial lipopolysaccharide (LPS) is a major component of the outer membrane that plays a key role in host–pathogen interactions with the innate immune system.",
//     ],
//     bookmarked: undefined,
//     altSpellings: ["LPS"],
//   },
// ];

export default async function StoriesPage({ params }: Params) {
  const whatsNewArticles = await getWhatsNewArticles();
  const story = await retrieveStoryContent(params);

  const { file } = await generateMarkdown(
    `${story.storyContent[0].content} :end-icon`,
  );

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

                {file.result as ReactNode}
                <StoryLargeImage
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMbhc_N3jzah8UJlH5VAdGQ0mGLO2x6v70SQ&s"
                  alt="small image"
                >
                  Some small caption with a sentence or two about a cell. Extra
                  text for testing purposes.
                </StoryLargeImage>
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
