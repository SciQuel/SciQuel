"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface Story {
  id: string;
  name: string;
  url: string;
  shortHeadline?: string;
}

interface Series {
  id: string;
  name: string;
  stories: Story[];
}

export default function ASeriesDashboard() {
  // The list of series currently displayed in the dashboard.
  // Each series contains an ordered list of stories.
  const [seriesList, setSeriesList] = useState<Series[]>([]);

  // The story currently being dragged for reordering within a series.
  const [draggedStory, setDraggedStory] = useState<{
    seriesId: string;
    storyId: string;
  } | null>(null);

  // Current search input values keyed by a unique story field identifier.
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {},
  );

  // Search results keyed by the same unique identifier used in searchQueries.
  const [searchResultsMap, setSearchResultsMap] = useState<
    Record<
      string,
      Array<{
        id: string;
        title: string;
        createdAt: string | Date;
        slug: string;
      }>
    >
  >({});

  // Loading state for individual search boxes during async story lookup.
  const [searchingMap, setSearchingMap] = useState<Record<string, boolean>>({});

  // Global loading / error state for fetching series from the server.
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Tracks whether each series is expanded or collapsed in the UI.
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>(
    {},
  );

  // Tracks pending series updates so the UI can disable buttons while saving.
  const [updatingSeriesMap, setUpdatingSeriesMap] = useState<
    Record<string, boolean>
  >({});
  const [deletingSeriesMap, setDeletingSeriesMap] = useState<
    Record<string, boolean>
  >({});
  const [pendingAddStorySeriesId, setPendingAddStorySeriesId] = useState<
    string | null
  >(null);

  // Load saved series data from the backend and normalize it for local state.
  const loadExistingSeries = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const res = await axios.get("/api/series");
      type ApiResponse = {
        allSeries: Array<{
          id: string;
          title: string | null;
          storyinSeries: Array<{
            storyId: string;
            order: number;
            story?: { title: string };
            storyShortHeadline: string;
            storyURL: string;
          }>;
        }>;
      };
      const data = res.data as ApiResponse | undefined;
      const allSeries = data?.allSeries;
      const rawSeries = Array.isArray(allSeries) ? allSeries : [];

      // Convert normalized API payload into local state shape.
      const normalizedSeries: Series[] = rawSeries.map(
        (series: {
          id: string;
          title: string | null;
          storyinSeries: Array<{
            storyId: string;
            order: number;
            story?: { title: string };
            storyShortHeadline: string;
            storyURL: string;
          }>;
        }) => ({
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
        }),
      );
      setSeriesList(normalizedSeries);
    } catch (err) {
      console.error(err);
      setLoadError("Failed to load existing series.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadExistingSeries();
  }, []);

  const addSeries = () => {
    const newSeries: Series = {
      id: "",
      name: "",
      stories: [{ id: "1", name: "Story 1", url: "", shortHeadline: "" }],
    };
    setSeriesList([...seriesList, newSeries]);
    setExpandedSeries((prev) => ({ ...prev, [newSeries.id]: true }));
  };

  const toggleSeriesExpanded = (seriesId: string) => {
    setExpandedSeries((prev) => ({
      ...prev,
      [seriesId]: !prev[seriesId],
    }));
  };

  const updateSeriesName = (id: string, name: string) => {
    setSeriesList(
      seriesList.map((series) =>
        series.id === id ? { ...series, name } : series,
      ),
    );
  };

  const updateStory = (
    seriesId: string,
    storyId: string,
    field: "id" | "name" | "url" | "shortHeadline",
    value: string,
  ) => {
    setSeriesList((prev) =>
      prev.map((series) =>
        series.id === seriesId
          ? {
              ...series,
              stories: series.stories.map((story) =>
                story.id === storyId ? { ...story, [field]: value } : story,
              ),
            }
          : series,
      ),
    );
  };

  const deleteSeries = async (id: string) => {
    if (!id || id.trim() === "") {
      setSeriesList((prev) => prev.filter((series) => series.id !== id));
      return;
    }

    setDeletingSeriesMap((prev) => ({ ...prev, [id]: true }));
    setLoadError(null);

    try {
      await axios.delete("/api/series", { params: { id } });
      setSeriesList((prev) => prev.filter((series) => series.id !== id));
    } catch (err) {
      console.error(err);
      setLoadError("Failed to delete series.");
    } finally {
      setDeletingSeriesMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Save changes for a new or existing series to the backend.
  // For new series (empty ID), uses POST. For existing series, uses PUT.
  // The payload only includes story items if every story has a valid URL.
  const updateExistingSeries = async (series: Series) => {
    setUpdatingSeriesMap((prev) => ({ ...prev, [series.id]: true }));
    setLoadError(null);

    try {
      const allStoriesHaveUrl = series.stories.every(
        (story) => story.url.trim() !== "",
      );

      const stories =
        allStoriesHaveUrl && series.stories.length > 0
          ? series.stories.map((story) => ({
              id: story.id,
              shortHeadline: story.shortHeadline || "",
              storyURL: story.url,
            }))
          : [];

      // Check if this is a new series (empty ID)
      const isNewSeries = !series.id || series.id.trim() === "";

      if (isNewSeries) {
        // Create new series using POST
        const formData = new FormData();
        formData.append("title", series.name);
        formData.append("stories", JSON.stringify(stories));

        const res = await axios.post("/api/series", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Created new series with response:", res.data);
        // Update local state with the new series ID and data from the response
        const newSeriesId = (res.data as { newSeries?: { id: string } })
          ?.newSeries?.id;
        setSeriesList((prev) =>
          prev.map((item) =>
            item.id === series.id ? { ...series, id: newSeriesId ?? "" } : item,
          ),
        );
      } else {
        // Update existing series using PUT
        const payload: {
          id: string;
          title: string;
          stories?: Array<{
            id: string;
            shortHeadline: string;
            storyURL: string;
          }>;
        } = {
          id: series.id,
          title: series.name,
        };

        if (stories.length > 0) {
          payload.stories = stories;
        }

        await axios.put("/api/series", payload);

        // Reflect the saved changes in local state after successful update.
        setSeriesList((prev) =>
          prev.map((item) => (item.id === series.id ? series : item)),
        );
      }
    } catch (err) {
      console.error(err);
      setLoadError(`Failed to ${!series.id ? "create" : "update"} series.`);
    } finally {
      setUpdatingSeriesMap((prev) => ({ ...prev, [series.id]: false }));
    }
  };

  const startAddStory = (seriesId: string) => {
    setPendingAddStorySeriesId(seriesId);
    setSearchQueries((prev) => ({ ...prev, [`add-${seriesId}`]: "" }));
    setSearchResultsMap((prev) => ({ ...prev, [`add-${seriesId}`]: [] }));
  };

  const cancelAddStory = (seriesId: string) => {
    setPendingAddStorySeriesId((current) =>
      current === seriesId ? null : current,
    );
    clearResults(`add-${seriesId}`);
  };

  const addSelectedStoryToSeries = (
    seriesId: string,
    story: {
      id: string;
      title: string;
      createdAt: string | Date;
      slug: string;
    },
  ) => {
    setSeriesList((prev) =>
      prev.map((series) =>
        series.id === seriesId
          ? {
              ...series,
              stories: [
                ...series.stories,
                {
                  id: story.id,
                  name: story.title || "",
                  url: buildStoryUrl(story),
                  shortHeadline: "",
                },
              ],
            }
          : series,
      ),
    );
    cancelAddStory(seriesId);
  };

  const deleteStory = (seriesId: string, storyId: string) => {
    setSeriesList(
      seriesList.map((series) =>
        series.id === seriesId
          ? {
              ...series,
              stories: series.stories.filter((story) => story.id !== storyId),
            }
          : series,
      ),
    );
  };

  // Start a drag operation by remembering which story is being moved.
  const handleDragStart = (seriesId: string, storyId: string) => {
    setDraggedStory({ seriesId, storyId });
  };

  /**
   * Handles the dragover event when the user drags a story over the story list area. Keeping the
   * event prevented allows drop events to be fired.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.opacity = "0.8";
  };

  /**
   * Called when the user stops dragging a story over the story list area.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - The dragleave event.
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Reset the opacity of the target element
    e.currentTarget.style.opacity = "1";
  };

  /**
   * Handles the drop event when the user stops dragging a story over the story list area. The
   * dragged story is reordered within the same series.
   */
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetSeriesId: string,
    targetStoryId: string,
  ) => {
    e.preventDefault();
    e.currentTarget.style.opacity = "1";

    if (!draggedStory || draggedStory.seriesId !== targetSeriesId) return;

    const draggedStoryId = draggedStory.storyId;
    if (draggedStoryId === targetStoryId) return;

    setSeriesList(
      seriesList.map((series) => {
        if (series.id !== targetSeriesId) return series;

        const draggedIndex = series.stories.findIndex(
          (s) => s.id === draggedStoryId,
        );
        const targetIndex = series.stories.findIndex(
          (s) => s.id === targetStoryId,
        );

        if (draggedIndex === -1 || targetIndex === -1) return series;

        const updatedStories = [...series.stories];
        const [draggedStoryItem] = updatedStories.splice(draggedIndex, 1);
        updatedStories.splice(targetIndex, 0, draggedStoryItem);

        return { ...series, stories: updatedStories };
      }),
    );

    // Clear the drag state after reordering is complete.
    setDraggedStory(null);
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  // Build the public story URL from the story metadata returned by the API.
  const buildStoryUrl = (story: { createdAt: string | Date; slug: string }) => {
    const d = new Date(story.createdAt);
    return `/stories/${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(
      d.getDate(),
    )}/${story.slug}`.toLowerCase();
  };

  /**
   * Search for stories that contain the given keyword. This helper performs the API request and
   * returns matching story objects.
   */
  const searchStories = async (
    keyword: string,
  ): Promise<
    Array<{
      id: string;
      title: string;
      createdAt: string | Date;
      slug: string;
    }>
  > => {
    if (!keyword) return [];

    try {
      const res = await axios.get(
        `/api/stories?keyword=${encodeURIComponent(keyword)}&page_size=5`,
      );
      const resData = res.data as
        | {
            stories: Array<{
              id: string;
              title: string;
              createdAt: string | Date;
              slug: string;
            }>;
          }
        | undefined;
      return resData?.stories || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  /**
   * Handles searching for stories when the user types in a search box.
   *
   * @param {string} key - The key of the search box (e.g. "search-series").
   * @returns {Promise<void>} - A promise that resolves when the search is complete.
   */
  // Called when the user submits a search for an individual story slot.
  // This updates loading state and stores the results for that slot.
  const handleSearch = async (key: string) => {
    const searchQuery = searchQueries[key] || "";
    if (!searchQuery) return;

    setSearchingMap((s) => ({ ...s, [key]: true }));

    try {
      const results = await searchStories(searchQuery);
      setSearchResultsMap((m) => ({ ...m, [key]: results }));
    } catch (err) {
      console.error(err);
    } finally {
      setSearchingMap((s) => ({ ...s, [key]: false }));
    }
  };

  const clearResults = (key: string) => {
    setSearchResultsMap((m) => ({ ...m, [key]: [] }));
    setSearchQueries((q) => ({ ...q, [key]: "" }));
  };

  return (
    <div className="mx-32 mt-5 flex flex-col gap-5">
      <h3 className="text-3xl font-semibold text-sciquelTeal">
        Article Series Dashboard
      </h3>

      {/* Exists Section */}
      <div>
        {isLoading && (
          <div className="rounded-md border border-gray-300 bg-white p-4 text-sm text-slate-600">
            Loading existing series...
          </div>
        )}
        {loadError && (
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {loadError}
          </div>
        )}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-xl font-semibold">Exists</h4>
          <button
            onClick={addSeries}
            className="rounded-md bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700"
          >
            Add Series
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {seriesList.map((series) => (
            <div
              key={series.id}
              className="rounded-md border border-gray-300 p-4"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <label
                    className="sr-only"
                    htmlFor={`series-name-${series.id}`}
                  >
                    Series Name
                  </label>
                  <input
                    id={`series-name-${series.id}`}
                    type="text"
                    value={series.name}
                    onChange={(e) =>
                      updateSeriesName(series.id, e.target.value)
                    }
                    className="mb-2 w-full rounded border px-2 py-1 text-2xl font-bold"
                    placeholder="Series Name"
                  />
                  <p className="text-sm text-slate-600">
                    {series.stories.length} story
                    {series.stories.length === 1 ? "" : "ies"} in this series
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSeriesExpanded(series.id)}
                    className="rounded bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                  >
                    {expandedSeries[series.id] ? "Collapse" : "Expand"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateExistingSeries(series)}
                    className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                    disabled={updatingSeriesMap[series.id]}
                  >
                    {updatingSeriesMap[series.id] ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteSeries(series.id)}
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    disabled={deletingSeriesMap[series.id]}
                  >
                    {deletingSeriesMap[series.id] ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              {expandedSeries[series.id] && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {series.stories.map((story) => (
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
                            <label className="mb-1 block text-sm font-semibold">
                              Story URL
                            </label>
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
                                updateStory(
                                  series.id,
                                  story.id,
                                  "shortHeadline",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded border px-2 py-1"
                              placeholder="Short headline"
                            />
                          </div>
                          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                            <input
                              type="text"
                              placeholder="Search existing stories..."
                              value={
                                searchQueries[`${series.id}_${story.id}`] || ""
                              }
                              onChange={(e) =>
                                setSearchQueries((q) => ({
                                  ...q,
                                  [`${series.id}_${story.id}`]: e.target.value,
                                }))
                              }
                              className="rounded border px-2 py-1"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                void handleSearch(`${series.id}_${story.id}`)
                              }
                              className="rounded-md bg-gray-200 px-3 py-1 text-sm font-semibold"
                            >
                              Search
                            </button>
                          </div>
                          {searchingMap[`${series.id}_${story.id}`] ? (
                            <p className="text-sm italic">Searching...</p>
                          ) : (
                            (searchResultsMap[`${series.id}_${story.id}`] || [])
                              .length > 0 && (
                              <ul className="max-h-40 overflow-y-auto rounded border bg-white text-sm">
                                {(
                                  searchResultsMap[
                                    `${series.id}_${story.id}`
                                  ] || []
                                ).map((s) => (
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
                                      clearResults(`${series.id}_${story.id}`);
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
                              {updatingSeriesMap[series.id]
                                ? "Saving..."
                                : "Save"}
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
                    ))}
                  </div>
                  {pendingAddStorySeriesId === series.id && (
                    <div className="rounded-md border border-gray-300 bg-white p-4">
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                        <input
                          type="text"
                          placeholder="Search story to add..."
                          value={searchQueries[`add-${series.id}`] || ""}
                          onChange={(e) =>
                            setSearchQueries((q) => ({
                              ...q,
                              [`add-${series.id}`]: e.target.value,
                            }))
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                        <button
                          type="button"
                          onClick={() => void handleSearch(`add-${series.id}`)}
                          className="rounded-md bg-slate-200 px-3 py-1 text-sm font-semibold"
                        >
                          Search
                        </button>
                      </div>

                      {searchingMap[`add-${series.id}`] ? (
                        <p className="mt-2 text-sm italic">Searching...</p>
                      ) : (
                        (searchResultsMap[`add-${series.id}`] || []).length >
                          0 && (
                          <ul className="mt-2 max-h-52 overflow-y-auto rounded border bg-white text-sm">
                            {(searchResultsMap[`add-${series.id}`] || []).map(
                              (story: {
                                id: string;
                                title: string;
                                createdAt: string | Date;
                                slug: string;
                              }) => (
                                <li
                                  key={story.id}
                                  className="cursor-pointer border-b px-2 py-2 hover:bg-gray-100"
                                  onClick={() =>
                                    addSelectedStoryToSeries(series.id, story)
                                  }
                                >
                                  {story.title}
                                </li>
                              ),
                            )}
                          </ul>
                        )
                      )}

                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => cancelAddStory(series.id)}
                          className="rounded-md bg-gray-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => startAddStory(series.id)}
                    className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Add Story
                  </button>
                </div>
              )}
            </div>
          ))}

          {seriesList.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <p className="text-lg">No series created yet.</p>
              <p>Click "Add Series" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
