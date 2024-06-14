import Image from "next/image";

interface ArticleItem {
  title: string;
  description?: string;
  date: string;
  subtitle?: string;
  image: string;
  type: string;
  author?: string;
}

function ListItem({ info }: { info: ArticleItem }) {
  return (
    <li className="p-1 py-2 dark:bg-sciquelMuted">
      <div className="flex items-start">
        <Image
          src={info.image}
          width={100}
          height={100}
          alt="article image"
          className="mr-3 h-12 w-12"
        />
        <div className="flex grow flex-col">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <h3 className="text-sm font-semibold">{info.title}</h3>
              <span className="text-sm font-thin">
                {info.type !== "articles" && info.type}
              </span>
            </div>
            <span className="ml-2 text-xs font-thin">
              {info.date + " days ago"}
            </span>
          </div>
          {info.author && (
            <p className="text-xs font-thin">{`by ${info.author}`}</p>
          )}
          {info.description && (
            <p className="line-clamp-2 text-xs font-thin">{info.description}</p>
          )}
        </div>
      </div>
    </li>
  );
}

export default function DashboardCard({
  targetType,
  articles,
  title,
}: {
  targetType: string;
  articles: ArticleItem[];
  title: string;
}) {
  // filter the array according to the targetType
  const items: ArticleItem[] = articles.filter(
    (a: ArticleItem) => a.type === targetType,
  );
  const capitalizedTargetType =
    targetType.charAt(0).toUpperCase() + targetType.slice(1);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            View All {capitalizedTargetType}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 stroke-current text-gray-500"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
      <div className="rounded-md border bg-white px-6 py-8 dark:bg-sciquelMuted">
        <div className="mb-4 flex items-center justify-between">
          <div className="mr-6 flex grow items-center rounded-full bg-gray-200 p-1 px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              className="w-full bg-transparent pl-2 placeholder:text-sm placeholder:font-thin placeholder:text-stone-500 focus:outline-none"
              placeholder="Search by article title, author, keywords"
            />
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-2 h-6 w-6 text-gray-300"
          >
            <path
              fillRule="evenodd"
              d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <ul className="divide-y">
          {items.map((entry: ArticleItem, idx: number) => (
            <ListItem info={entry} key={idx} />
          ))}
        </ul>
      </div>
    </div>
  );
}
