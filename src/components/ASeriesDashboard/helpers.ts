export interface Story {
  id: string;
  name: string;
  url: string;
  shortHeadline?: string;
}

export interface Series {
  id: string;
  name: string;
  stories: Story[];
}

const pad = (n: number) => String(n).padStart(2, "0");

export const buildStoryUrl = (story: {
  createdAt: string | Date;
  slug: string;
}) => {
  const d = new Date(story.createdAt);

  return `/stories/${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(
    d.getDate(),
  )}/${story.slug}`.toLowerCase();
};

export const normalizeSeriesList = (
  allSeries: Array<{
    id: string;
    title: string | null;
    storyinSeries?: Array<{
      storyId: string;
      order: number;
      story?: { title?: string | null } | null;
      storyShortHeadline?: string | null;
      storyURL?: string | null;
    }>;
  }>,
): Series[] =>
  (allSeries ?? []).map((series) => ({
    id: series.id,
    name: series.title || "Untitled Series",
    stories: (series.storyinSeries || [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((relation) => ({
        id: relation.storyId,
        name: relation.story?.title || relation.storyShortHeadline || "",
        url: relation.storyURL || "",
        shortHeadline: relation.storyShortHeadline || "",
      })),
  }));
