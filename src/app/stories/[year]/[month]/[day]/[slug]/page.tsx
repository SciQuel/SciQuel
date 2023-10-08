import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import { type GetStoriesResult } from "@/app/api/stories/route";
import Dictionary from "@/components/story-components/dictionary/Dictionary";
import { DictionaryProvider } from "@/components/story-components/dictionary/DictionaryContext";
import DictionaryWord from "@/components/story-components/dictionary/DictionaryWord";
import { PrintModeProvider } from "@/components/story-components/PrintContext";
import StoryCredits from "@/components/story-components/StoryCredits";
import StoryFooter from "@/components/story-components/StoryFooter";
import { tagUser } from "@/lib/cache";
import env from "@/lib/env";
import { generateMarkdown } from "@/lib/markdown";
import { getServerSession } from "next-auth";
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
    definition:
      "concealment by some means that alters or obscures the appearance.",
    pronunciation: "cam·ou·flage \n/ˈkaməˌflä(d)ZH/",
    inContext: {},
  },

  enzymes: {
    definition:
      "An enzyme is a biological catalyst and is almost always a protein. It speeds up the rate of a specific chemical reaction in the cell.",
    pronunciation: "en·zyme \n/ˈenˌzīm/",
    inContext: {},
  },

  lipopolysaccharides: {
    definition:
      "Lipopolysaccharides (LPS) are important outer membrane components of gram-negative bacteria. They typically consist of a lipid domain (hydrophobic) attached to a core oligosaccharide and a distal polysaccharide.",
    pronunciation:
      "lip·o·pol·y·sac·cha·ride \n/ˌlipōˌpälēˈsakəˌrīd,ˌlīpōˌpälēˈsakəˌrīd/",
    inContext: {},
  },
};

export default async function StoriesPage({ params }: Params) {
  const whatsNewArticles = await getWhatsNewArticles();
  const story = await retrieveStoryContent(params);

  const { file } = await generateMarkdown(story.storyContent[0].content);
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
      <DictionaryProvider dictionary={testDictionary}>
        <div className="flex w-screen flex-col overflow-x-hidden">
          <StoryCredits story={story} />

          <div className="mx-2 mt-2 flex flex-col items-center gap-5 md:mx-auto">
            {/* {testContent.file.result as ReactNode} */}
            <Dictionary />

            <p className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[720px]">
              Admotum in <DictionaryWord word="lipopolysaccharides" /> querno
              saxum genialis moriente tulit quoque quoque duxit de clarae regis,
              quo memor <DictionaryWord word="enzymes" /> tangit mea, qui. Qua
              semper nam retia favilla nomine dique, aris idque inter dantibus.
              Cythereia ortae <DictionaryWord word="camouflage" /> procumbit
              eodem, ut humumque noctisque proelia, sub nomen dixerat.
            </p>
            <p className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[720px]">
              <DictionaryWord word="camouflage">Camouflage</DictionaryWord> is a
              technique especially useful if the animal can change colour to
              match the background on which it is found, such as can some
              cephalopods (Hanlon & Messenger 1988) and chameleons (Stuart-Fox
              et al. 2008). Further remarkable examples include insects bearing
              an uncanny resemblance to bird droppings (Hebert 1974) or fish
              resembling fallen leaves on a stream bed (Sazima et al. 2006), to
              even making the body effectively transparent, as occurs in a range
              of, in particular, aquatic species (Johnsen 2001; Carvalho et al.
              2006). Examples such as leaf mimicry in butterflies helped
              convince Wallace (1889), for example, of the power of natural
              selection. Other strategies may even stretch to the use of
              bioluminescence to hide shadows generated in aquatic environments
              (Johnsen et al. 2004), and include ‘decorating’ the body with
              items from the general environment, such as do some crabs
              (Hultgren & Stachowicz 2008).
            </p>
            <p className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[720px]">
              A fundamental task of proteins is to act as{" "}
              <DictionaryWord word="enzymes" />
              —catalysts that increase the rate of virtually all the chemical
              reactions within cells. Although RNAs are capable of catalyzing
              some reactions, most biological reactions are catalyzed by
              proteins. In the absence of enzymatic catalysis, most biochemical
              reactions are so slow that they would not occur under the mild
              conditions of temperature and pressure that are compatible with
              life.
            </p>
            <p className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[720px]">
              One of the most studied bacterial surface molecules is the
              glycolipid known as{" "}
              <DictionaryWord word="lipopolysaccharides">
                lipopolysaccharide
              </DictionaryWord>{" "}
              (LPS), which is produced by most Gram-negative bacteria. Much of
              the initial attention LPS received in the early 1900s was owed to
              its ability to stimulate the immune system, for which the
              glycolipid was commonly known as endotoxin.
            </p>

            {file.result as ReactNode}
            {testContent.file.result as ReactNode}
            {testCode.file.result as ReactNode}
            {testCode2.file.result as ReactNode}
            {testDropdown.file.result as ReactNode}
            <p className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[720px]">
              <DictionaryWord word="lipopolysaccharides">
                Lipopolysaccharide
              </DictionaryWord>{" "}
              performs several functions in Gram-negative bacteria. The most
              fundamental function of LPS is to serve as a major structural
              component of the OM. Perhaps not surprisingly, LPS is an essential
              component of the cell envelope in most, though interestingly not
              all, Gram-negative bacteria (4). In addition, LPS molecules
              transform the OM into an effective permeability barrier against
              small, hydrophobic molecules that can otherwise cross phospholipid
              bilayers, making Gram-negative bacteria innately resistant to many
              antimicrobial compounds (5, 6). LPS can also play a crucial role
              in bacteria-host interactions by modulating responses by the host
              immune system.
            </p>
            <p className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[720px]">
              Like all other catalysts, <DictionaryWord word="enzymes" /> are
              characterized by two fundamental properties. First, they increase
              the rate of chemical reactions without themselves being consumed
              or permanently altered by the reaction. Second, they increase
              reaction rates without altering the chemical equilibrium between
              reactants and products.
            </p>
            <p className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[720px]">
              However, in spite of its long history and widespread occurrence,
              research on natural <DictionaryWord word="camouflage" /> has not
              progressed as rapidly as many other areas of adaptive coloration,
              especially in the last 60–70 years. There are several reasons for
              this, including that human perceptions have often been used to
              subjectively assess a range of protective markings, rather than
              working from the perspective of the correct receiver. In general,
              the mechanisms of
              <DictionaryWord word="camouflage" /> have often been erroneously
              regarded as intuitively obvious.
            </p>
            <p className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[720px]">
              Carinam pelagi se venit tantumne, neu fame res senilibus,
              populisque. <DictionaryWord word="enzymes" /> Has capiti fatis.
              Exemit puer sors esse, Pittheia nobis superfusis mihi Carpathius
              quoque libera oris, nec. Quae retinere{" "}
              <DictionaryWord word="lipopolysaccharides" /> ictus nam vultum
              sanguine precibus Delphosque mucrone. Pectore in inquit Aeacide
              illic sequar propositum ululasse cruentos aspergine aurea qui,
              esse <DictionaryWord word="camouflage" />.
            </p>
          </div>
          <p className="w-[calc( 100% - 1rem )] mx-2 my-5 border-t-2 border-[#616161]  text-sm text-[#616161] md:mx-auto md:w-[720px]">
            Animation provided by Source name 1. Sources provided by Source name
            2. We thank Funding 1 for their support, and Professor 2 for their
            guidance. Ex. Cover Image: “Hawaiian Bobtail Squid” is licensed
            under CC BY-NC 4.0.
          </p>
          <StoryFooter
            storyContributions={story.storyContributions}
            articles1={whatsNewArticles}
            articles2={whatsNewArticles}
          />
        </div>
      </DictionaryProvider>
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
