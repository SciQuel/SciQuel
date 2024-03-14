import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import { type GetStoriesResult } from "@/app/api/stories/route";
import Dictionary from "@/components/story-components/dictionary/Dictionary";
import { DictionaryProvider } from "@/components/story-components/dictionary/DictionaryContext";
import DictionarySentence from "@/components/story-components/dictionary/DictionarySentence";
import DictionaryWord from "@/components/story-components/dictionary/DictionaryWord";
import TestImages from "@/components/story-components/imgTests";
import StoryParagraph from "@/components/story-components/markdown/StoryParagraph";
import { PrintModeProvider } from "@/components/story-components/PrintContext";
import { StoryScrollProvider } from "@/components/story-components/scroll/ScrollProvider";
import ShareLinks from "@/components/story-components/ShareLinks";
import StoryCredits from "@/components/story-components/StoryCredits";
import StoryFooter from "@/components/story-components/StoryFooter";
import { tagUser } from "@/lib/cache";
import env from "@/lib/env";
import { generateMarkdown } from "@/lib/markdown";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { type ReactNode } from "react";

interface Params {
  params: {
    year: string;
    month: string;
    day: string;
    slug: string;
  };
}

const testDictionary = {
  camouflage: {
    id: "123abc",
    definition:
      "concealment by some means that alters or obscures the appearance.",
    pronunciation: "cam·ou·flage \n/ˈkaməˌflä(d)ZH/",
    instances: [],
    inContext: [
      "This camouflage comes from a layer of densely packed, pigmented structures just below the skin’s surface.",
      "All modern, adult birds molt at least once a year to replace old, damaged feathers, or to exchange their bright summer colors for drab winter camouflage.",
    ],
    bookmarked: undefined,
    altSpellings: [],
  },

  enzyme: {
    id: "345abc",
    definition:
      "An enzyme is a biological catalyst and is almost always a protein. It speeds up the rate of a specific chemical reaction in the cell.",
    pronunciation: "en·zyme \n/ˈenˌzīm/",
    instances: [],
    inContext: [
      "A cell contains thousands of different types of enzyme molecules, each specific to a particular chemical reaction.",
    ],
    bookmarked: undefined,
    altSpellings: [],
  },

  lipopolysaccharide: {
    id: "678abc",
    definition:
      "lipopolysaccharides (LPS) are important outer membrane components of gram-negative bacteria. They typically consist of a lipid domain (hydrophobic) attached to a core oligosaccharide and a distal polysaccharide.",
    pronunciation:
      "lip·o·pol·y·sac·cha·ride \n/ˌlipōˌpälēˈsakəˌrīd,ˌlīpōˌpälēˈsakəˌrīd/",
    instances: [],
    inContext: [
      "The Gram-negative bacterial lipopolysaccharide (LPS) is a major component of the outer membrane that plays a key role in host–pathogen interactions with the innate immune system.",
    ],
    bookmarked: undefined,
    altSpellings: ["LPS"],
  },
};

const testDictList = [
  {
    id: "123abc",
    word: "camouflage",
    definition:
      "concealment by some means that alters or obscures the appearance.",
    instances: [],
    inContext: [
      "This camouflage comes from a layer of densely packed, pigmented structures just below the skin’s surface.",
      "All modern, adult birds molt at least once a year to replace old, damaged feathers, or to exchange their bright summer colors for drab winter camouflage.",
    ],
    bookmarked: undefined,
    altSpellings: [],
  },
  {
    id: "345abc",
    word: "enzyme",
    definition:
      "An enzyme is a biological catalyst and is almost always a protein. It speeds up the rate of a specific chemical reaction in the cell.",
    instances: [],
    inContext: [
      "A cell contains thousands of different types of enzyme molecules, each specific to a particular chemical reaction.",
    ],
    bookmarked: undefined,
    altSpellings: [],
  },
  {
    id: "678abc",
    word: "lipopolysaccharide",
    definition:
      "lipopolysaccharides (LPS) are important outer membrane components of gram-negative bacteria. They typically consist of a lipid domain (hydrophobic) attached to a core oligosaccharide and a distal polysaccharide.",
    pronunciation:
      "lip·o·pol·y·sac·cha·ride \n/ˌlipōˌpälēˈsakəˌrīd,ˌlīpōˌpälēˈsakəˌrīd/",
    instances: [],
    inContext: [
      "The Gram-negative bacterial lipopolysaccharide (LPS) is a major component of the outer membrane that plays a key role in host–pathogen interactions with the innate immune system.",
    ],
    bookmarked: undefined,
    altSpellings: ["LPS"],
  },
];

export default async function StoriesPage({ params }: Params) {
  const whatsNewArticles = await getWhatsNewArticles();
  const story = await retrieveStoryContent(params);

  const { file } = await generateMarkdown(
    `${story.storyContent[0].content} :end-icon`,
  );
  const testContent = await generateMarkdown(
    `>blockquote   "It’s really interesting for us because now we’re showing that not only the Northern Hemisphere was burning, but the Southern Hemisphere too,” he said. “It was global."`,
  );
  const testCode = await generateMarkdown(
    "a paragraph with a `code snippet` inside [and a link](https://www.google.com) :gray-text[test citation] :caption-citation[test citation 2]",
  );
  const testCode2 = await generateMarkdown(
    "```\n fenced code block \n //comment \n console.log('hello world');\n```",
  );

  const testDropdown = await generateMarkdown(
    ":::dropdown[**bolded test label stuff** :gray-text[grayed out stuff]]\ntest paragraph of text *inside the dropdown*\n:::",
  );

  return (
    <PrintModeProvider>
      <StoryScrollProvider>
        <DictionaryProvider dictionary={testDictList}>
          <div className="flex h-fit flex-col overflow-visible">
            <div className="mx-0 mt-0 grid grid-cols-[1fr_0px] gap-0 px-0 pt-0 lg:grid-cols-[1fr_768px_1fr]">
              <div className="pointer-events-none relative hidden flex-col items-end px-0 xl:flex">
                <div className="w-100 h-[calc(100vh_-_2rem)]" />
                <div className="relative flex h-full w-full flex-1 flex-col items-end gap-0 overflow-visible px-3">
                  <ShareLinks storyId={story.id} observe={true} />

                  <div className="flex-1 self-stretch" />
                </div>
              </div>
              <div className="  w-screen xl:w-full">
                <div className="mx-0 mt-2 flex w-screen flex-col items-center gap-4 px-2 sm:mx-auto md:w-[768px] md:px-0">
                  <StoryCredits story={story} />
                  <Dictionary />

                  <StoryParagraph>
                    <DictionarySentence>
                      {" "}
                      Admotum in <DictionaryWord word="lipopolysaccharide" />{" "}
                      querno saxum genialis moriente tulit quoque quoque duxit
                      de clarae regis, quo memor{" "}
                      <DictionaryWord word="enzyme" /> tangit mea, qui.
                    </DictionarySentence>{" "}
                    Qua semper nam retia favilla nomine dique, aris idque inter
                    dantibus.
                    <DictionarySentence>
                      Cythereia ortae <DictionaryWord word="camouflage" />{" "}
                      procumbit eodem, ut humumque noctisque proelia, sub nomen
                      dixerat.
                    </DictionarySentence>
                  </StoryParagraph>
                  <StoryParagraph>
                    <DictionarySentence>
                      <DictionaryWord word="camouflage">
                        Camouflage
                      </DictionaryWord>{" "}
                      is a technique especially useful if the animal can change
                      colour to match the background on which it is found, such
                      as can some cephalopods (Hanlon & Messenger 1988) and
                      chameleons (Stuart-Fox et al. 2008).
                    </DictionarySentence>{" "}
                    Further remarkable examples include insects bearing an
                    uncanny resemblance to bird droppings (Hebert 1974) or fish
                    resembling fallen leaves on a stream bed (Sazima et al.
                    2006), to even making the body effectively transparent, as
                    occurs in a range of, in particular, aquatic species
                    (Johnsen 2001; Carvalho et al. 2006). Examples such as leaf
                    mimicry in butterflies helped convince Wallace (1889), for
                    example, of the power of natural selection. Other strategies
                    may even stretch to the use of bioluminescence to hide
                    shadows generated in aquatic environments (Johnsen et al.
                    2004), and include ‘decorating’ the body with items from the
                    general environment, such as do some crabs (Hultgren &
                    Stachowicz 2008).
                  </StoryParagraph>
                  <StoryParagraph>
                    <DictionarySentence>
                      A fundamental task of proteins is to act as{" "}
                      <DictionaryWord word="enzyme">enzymes</DictionaryWord>
                      —catalysts that increase the rate of virtually all the
                      chemical reactions within cells.
                    </DictionarySentence>{" "}
                    Although RNAs are capable of catalyzing some reactions, most
                    biological reactions are catalyzed by proteins. In the
                    absence of enzymatic catalysis, most biochemical reactions
                    are so slow that they would not occur under the mild
                    conditions of temperature and pressure that are compatible
                    with life.
                  </StoryParagraph>
                  <StoryParagraph>
                    <DictionarySentence>
                      One of the most studied bacterial surface molecules is the
                      glycolipid known as{" "}
                      <DictionaryWord word="lipopolysaccharide">
                        lipopolysaccharide
                      </DictionaryWord>{" "}
                      (LPS), which is produced by most Gram-negative bacteria.
                    </DictionarySentence>{" "}
                    Much of the initial attention LPS received in the early
                    1900s was owed to its ability to stimulate the immune
                    system, for which the glycolipid was commonly known as
                    endotoxin.
                  </StoryParagraph>

                  {file.result as ReactNode}
                  {testContent.file.result as ReactNode}
                  {testCode.file.result as ReactNode}
                  {testCode2.file.result as ReactNode}
                  {testDropdown.file.result as ReactNode}
                  <TestImages />
                  <StoryParagraph>
                    <DictionarySentence>
                      lipopolysaccharide performs several functions in
                      Gram-negative bacteria.
                    </DictionarySentence>{" "}
                    The most fundamental function of LPS is to serve as a major
                    structural component of the OM. Perhaps not surprisingly,
                    LPS is an essential component of the cell envelope in most,
                    though interestingly not all, Gram-negative bacteria (4). In
                    addition, LPS molecules transform the OM into an effective
                    permeability barrier against small, hydrophobic molecules
                    that can otherwise cross phospholipid bilayers, making
                    Gram-negative bacteria innately resistant to many
                    antimicrobial compounds (5, 6). LPS can also play a crucial
                    role in bacteria-host interactions by modulating responses
                    by the host immune system.
                  </StoryParagraph>
                  <StoryParagraph>
                    <DictionarySentence>
                      Like all other catalysts, enzymes are characterized by two
                      fundamental properties.
                    </DictionarySentence>{" "}
                    First, they increase the rate of chemical reactions without
                    themselves being consumed or permanently altered by the
                    reaction. Second, they increase reaction rates without
                    altering the chemical equilibrium between reactants and
                    products.
                  </StoryParagraph>
                  <StoryParagraph>
                    <DictionarySentence>
                      However, in spite of its long history and widespread
                      occurrence, research on natural camouflage has not
                      progressed as rapidly as many other areas of adaptive
                      coloration, especially in the last 60–70 years.
                    </DictionarySentence>{" "}
                    There are several reasons for this, including that human
                    perceptions have often been used to subjectively assess a
                    range of protective markings, rather than working from the
                    perspective of the correct receiver.
                    <DictionarySentence>
                      {" "}
                      In general, the mechanisms of camouflage have often been
                      erroneously regarded as intuitively obvious.
                    </DictionarySentence>
                  </StoryParagraph>
                  <StoryParagraph>
                    Carinam pelagi se venit tantumne, neu fame res senilibus,
                    populisque.
                    <DictionarySentence>
                      {" "}
                      enzyme Has capiti fatis.
                    </DictionarySentence>
                    Exemit puer sors esse, Pittheia nobis superfusis mihi
                    Carpathius quoque libera oris, nec.
                    <DictionarySentence>
                      {" "}
                      Quae retinere lipopolysaccharide ictus nam vultum sanguine
                      precibus Delphosque mucrone.
                    </DictionarySentence>{" "}
                    <DictionarySentence>
                      {" "}
                      Pectore in inquit Aeacide illic sequar propositum ululasse
                      cruentos aspergine aurea qui, esse camouflage.
                    </DictionarySentence>
                  </StoryParagraph>
                </div>
                <div className="w-[calc( 100% - 1rem )] mx-2 mb-8 mt-8 border-t-2 border-[#616161] pt-1  md:mx-auto md:w-[768px] ">
                  <p className=" mt-2 text-sm text-[#616161]">
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
                  </p>
                </div>
              </div>
            </div>

            <StoryFooter
              storyContributions={story.storyContributions}
              articles1={whatsNewArticles}
              articles2={whatsNewArticles}
            />
          </div>
        </DictionaryProvider>
      </StoryScrollProvider>
    </PrintModeProvider>
  );
}

async function retrieveUserInteractions(storyId: string) {
  const userSession = await getServerSession();
  if (userSession?.user.email) {
    const bookmarked = false;
    const brained = false;

    const searchParams = new URLSearchParams({
      story_id: storyId,
      user_email: userSession.user.email,
    });

    console.log("search params are: ", searchParams.toString());

    const bookmarkUrl = `${
      env.NEXT_PUBLIC_SITE_URL
    }/api/user/bookmark?${searchParams.toString()}`;
    // const bookmarkUrl = `${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark?story_id=${storyId}&user_email=${userSession.user.email}}`;
    const brainUrl = `${
      env.NEXT_PUBLIC_SITE_URL
    }/api/user/brains?${searchParams.toString()}`;

    console.log("bookmark url: ", bookmarkUrl);
    console.log("brain url: ", brainUrl);

    const bookRes = await fetch(brainUrl, {
      next: {
        revalidate: 0,
      },
    });
    console.log("bookres: ", bookRes);
    const json = await bookRes.json();
    console.log("bookres error: ", json);
  }
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
