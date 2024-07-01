import { type Stories } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";

interface Props {
  articles1: Stories;
  articles2: Stories;
}

export default function MoreCard({ articles1, articles2 }: Props) {
  return (
    <div className="bg-white pb-5 pt-5">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:px-28">
        {articles1 && (
          <div className="justify-self-center lg:col-span-2 lg:w-full lg:justify-self-start lg:px-5">
            <div className="mb-8">
              <HomepageSection heading="More from SciQuel" />
            </div>
            <ArticleList articles={articles1.slice(0, 3)} mini={true} />
          </div>
        )}
        {articles2 && (
          <div className="max-w-xs justify-self-center">
            <div className="mb-8">
              <HomepageSection heading="Popular" />
            </div>
            <ArticleList
              articles={articles2.slice(0, 3)}
              mini={true}
              preferHorizontal={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
