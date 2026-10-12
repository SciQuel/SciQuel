import { buildStoryUrl, type Series, type Story } from "./helpers";

type SearchResult = {
  id: string;
  title: string;
  createdAt: string | Date;
  slug: string;
};

type StoryCardProps = {
  series: Series;
  story: Story;
  draggedStory: { seriesId: string; storyId: string } | null;
  searchQueries: Record<string, string>;
  searchResultsMap: Record<string, SearchResult[]>;
  searchingMap: Record<string, boolean>;
  updatingSeriesMap: Record<string, boolean>;
  handleDragStart: (seriesId: string, storyId: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    targetSeriesId: string,
    targetStoryId: string,
  ) => void;
  handleSearch: (key: string) => Promise<void>;
  clearResults: (key: string) => void;
  updateStory: (
    seriesId: string,
    storyId: string,
    field: "id" | "name" | "url" | "shortHeadline",
    value: string,
  ) => void;
  updateExistingSeries: (series: Series) => Promise<void>;
  deleteStory: (seriesId: string, storyId: string) => void;
  setSeriesList: React.Dispatch<React.SetStateAction<Series[]>>;
};

export function StoryCard({
  series,
  story,
  draggedStory,
  searchQueries,
  searchResultsMap,
  searchingMap,
  updatingSeriesMap,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleSearch,
  clearResults,
  updateStory,
  updateExistingSeries,
  deleteStory,
  setSeriesList,
}: StoryCardProps) {
  const key = `${series.id}_${story.id}`;

  return (
    <div
      key={story.id}
      draggable
      onDragStart={() => handleDragStart(series.id, story.id)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, series.id, story.id)}
      className="min-w-0 rounded border border-gray-300 p-3"
      style={{
        opacity:
          draggedStory?.seriesId === series.id &&
          draggedStory?.storyId === story.id
            ? 0.5
            : 1,
      }}
    >
      <div className="grid gap-3">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Story Headline
          </label>
          <input
            type="text"
            value={story.name}
            readOnly
            className="w-full cursor-not-allowed rounded border bg-gray-100 px-2 py-1"
            placeholder="Story Headline"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Story URL</label>
          <input
            type="text"
            value={story.url}
            readOnly
            className="w-full cursor-not-allowed rounded border bg-gray-100 px-2 py-1"
            placeholder="Story URL"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            Story Short Headline
          </label>
          <input
            type="text"
            value={story.shortHeadline || ""}
            onChange={(e) =>
              updateStory(series.id, story.id, "shortHeadline", e.target.value)
            }
            className="w-full rounded border px-2 py-1"
            placeholder="Short headline"
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            placeholder="Search existing stories..."
            value={searchQueries[key] || ""}
            onChange={() =>
              setSeriesList((prev) =>
                prev.map((ser) =>
                  ser.id === series.id
                    ? {
                        ...ser,
                        stories: ser.stories.map((st) =>
                          st.id === story.id ? { ...st, name: st.name } : st,
                        ),
                      }
                    : ser,
                ),
              )
            }
            className="rounded border px-2 py-1"
          />
          <button
            type="button"
            onClick={() => void handleSearch(key)}
            className="rounded-md bg-gray-200 px-3 py-1 text-sm font-semibold"
          >
            Search
          </button>
        </div>

        {searchingMap[key] ? (
          <p className="text-sm italic">Searching...</p>
        ) : (
          (searchResultsMap[key] || []).length > 0 && (
            <ul className="max-h-40 overflow-y-auto rounded border bg-white text-sm">
              {(searchResultsMap[key] || []).map((s) => (
                <li
                  key={s.id}
                  className="cursor-pointer px-2 py-1 hover:bg-gray-100"
                  onClick={() => {
                    setSeriesList((prev) =>
                      prev.map((ser) =>
                        ser.id === series.id
                          ? {
                              ...ser,
                              stories: ser.stories.map((st) =>
                                st.id === story.id
                                  ? {
                                      ...st,
                                      id: s.id,
                                      name: s.title,
                                      url: buildStoryUrl(s),
                                    }
                                  : st,
                              ),
                            }
                          : ser,
                      ),
                    );
                    clearResults(key);
                  }}
                >
                  {s.title}
                </li>
              ))}
            </ul>
          )
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              const updatedSeries = {
                ...series,
                stories: series.stories.map((s) =>
                  s.id === story.id ? story : s,
                ),
              };
              void updateExistingSeries(updatedSeries);
            }}
            className="rounded-md bg-green-600 px-3 py-1 text-sm font-semibold text-white hover:bg-green-700"
            disabled={updatingSeriesMap[series.id]}
          >
            {updatingSeriesMap[series.id] ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => deleteStory(series.id, story.id)}
            className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
