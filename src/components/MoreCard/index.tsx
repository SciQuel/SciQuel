import { type Stories } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";

interface Props {
  articles1: Stories;
  articles2: Stories;
}

export default function MoreCard({ articles1, articles2 }: Props) {
  return (
    <div className="flex w-full justify-center bg-white">
      <div className="grid max-w-screen-xl grid-cols-1 gap-36 md:grid-cols-2">
        {articles1 && (
          <div>
            <div className="mb-10">
              <HomepageSection heading="More from SciQuel" />
            </div>
            <ArticleList articles={articles1.slice(0, 3)} mini={true} />
          </div>
        )}
        {articles2 && (
          <div>
            <div className="ml-72">
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
