"use client";

import {
  ChevronUpDownIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import ArticlePreview from "./articlePreviewComponent/articlePreview";

// Creates article interface, containing everything an article contains to display.
interface Article {
  id?: string;
  title?: string;
  summary?: string;
  image?: string;
  caption?: string;
  date?: Date | null;
}
interface Props {
  article: Article;
}

/**
 * Creates a preview of the article on the right hand side
 * of the editor's dashboard.
 *
 * @param article - input representing the article to be shown.
 * @returns
 */
export default function StoryPreview({ article }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <ArticlePreview />
    </div>
  );
}
