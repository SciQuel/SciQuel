"use client";

import axios from "axios";
import { useState } from "react";

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
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [draggedStory, setDraggedStory] = useState<{
    seriesId: string;
    storyId: string;
  } | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {},
  );
  const [searchResultsMap, setSearchResultsMap] = useState<
    Record<string, any[]>
  >({});
  const [searchingMap, setSearchingMap] = useState<Record<string, boolean>>({});

  const addSeries = () => {
    const newSeries: Series = {
      id: Date.now().toString(),
      name: "New Series",
      stories: [{ id: "1", name: "Story 1", url: "", shortHeadline: "" }],
    };
    setSeriesList([...seriesList, newSeries]);
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
    field: "name" | "url" | "shortHeadline",
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

  const deleteSeries = (id: string) => {
    setSeriesList(seriesList.filter((series) => series.id !== id));
  };

  const addStory = (seriesId: string) => {
    const newStory: Story = {
      id: Date.now().toString(),
      name: "New Story",
      url: "",
      shortHeadline: "",
    };
    setSeriesList(
      seriesList.map((series) =>
        series.id === seriesId
          ? { ...series, stories: [...series.stories, newStory] }
          : series,
      ),
    );
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

  const handleDragStart = (seriesId: string, storyId: string) => {
    setDraggedStory({ seriesId, storyId });
  };

  /**
   * Handles the dragover event when the user drags a story over the story list area.
   *
   * @param {React.DragEvent} e - The dragover event.
   */
  const handleDragOver = (e: React.DragEvent) => {
    // Prevent the default dragover behavior (browser will try to open the dragged element)
    e.preventDefault();
    // Set the opacity of the target element to 0.8
    e.currentTarget.style.opacity = "0.8";
  };

  /**
   * Called when the user stops dragging a story over the story list area.
   *
   * @param {React.DragEvent} e - The dragleave event.
   */
  const handleDragLeave = (e: React.DragEvent) => {
    // Reset the opacity of the target element
    e.currentTarget.style.opacity = "1";
  };

  /**
   * Handles the drop event when the user stops dragging a story over the story list area.
   *
   * @param {React.DragEvent} e - The drop event.
   * @param {string} targetSeriesId - The id of the series that the user dropped the story into.
   * @param {string} targetStoryId - The id of the story that the user dropped the story into.
   */
  const handleDrop = (
    e: React.DragEvent,
    targetSeriesId: string,
    targetStoryId: string,
  ) => {
    e.preventDefault();
    e.currentTarget.style.opacity = "1";

    // If the user didn't drag a story, or if the user dropped the story into a different series, do nothing.
    if (!draggedStory || draggedStory.seriesId !== targetSeriesId) return;

    const draggedStoryId = draggedStory.storyId;

    // If the user dropped the story into the same position, do nothing.
    if (draggedStoryId === targetStoryId) return;

    // Update the series list by moving the dragged story item to the target position.
    setSeriesList(
      seriesList.map((series) => {
        if (series.id !== targetSeriesId) return series;

        const draggedIndex = series.stories.findIndex(
          (s) => s.id === draggedStoryId,
        );
        const targetIndex = series.stories.findIndex(
          (s) => s.id === targetStoryId,
        );

        // If the user didn't drag a story, or if the target story doesn't exist, do nothing.
        if (draggedIndex === -1 || targetIndex === -1) return series;

        const updatedStories = [...series.stories];
        const [draggedStoryItem] = updatedStories.splice(draggedIndex, 1);
        updatedStories.splice(targetIndex, 0, draggedStoryItem);

        return { ...series, stories: updatedStories };
      }),
    );

    // Reset the dragged story state.
    setDraggedStory(null);

    const pad = (n: number) => String(n).padStart(2, "0");
    const buildStoryUrl = (story: any) => {
      const d = new Date(story.createdAt);
      return `/stories/${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(
        d.getDate(),
      )}/${story.slug}`;
    };

    /**
     * Search for stories that contain the given keyword.
     *
     * @param {string} keyword - The keyword to search for.
     * @returns {Promise<Array<Story>>} - A list of stories that contain the keyword.
     */
    const searchStories = async (keyword: string) => {
      // If the keyword is empty, return an empty array.
      if (!keyword) return [];

      try {
        // Make a GET request to the stories API with the keyword as a query parameter.
        const res = await axios.get(
          `/api/stories?keyword=${encodeURIComponent(keyword)}&page_size=5`,
        );

        // If the response is successful and contains a list of stories, return the list.
        return (res.data && res.data.stories) || [];
      } catch (err) {
        // If the request fails, log the error to the console and return an empty array.
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
    const handleSearch = async (key: string) => {
      const searchQuery = searchQueries[key] || "";
      if (!searchQuery) return;

      // Show a loading indicator while the search is in progress.
      setSearchingMap((s) => ({ ...s, [key]: true }));

      try {
        // Search for stories that contain the search query.
        const results = await searchStories(searchQuery);
        // Update the search results map with the new results.
        setSearchResultsMap((m) => ({ ...m, [key]: results }));
      } catch (err) {
        // If the search fails, log the error to the console.
        console.error(err);
      } finally {
        // Hide the loading indicator when the search is complete.
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

        {/* Create Section */}
        <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
          <h4 className="mb-4 text-xl font-semibold">Create</h4>
          <button
            onClick={addSeries}
            className="rounded-md bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700"
          >
            + Add Series
          </button>
        </div>

        {/* Exists Section */}
        <div>
          <h4 className="mb-4 text-xl font-semibold">Exists</h4>
          <div className="flex flex-col gap-4">
            {seriesList.map((series) => (
              <div
                key={series.id}
                className="rounded-md border border-gray-300 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={series.name}
                      onChange={(e) =>
                        updateSeriesName(series.id, e.target.value)
                      }
                      className="mb-2 w-full rounded border px-2 py-1 text-2xl font-bold"
                      placeholder="Series Name"
                    />
                  </div>
                  <button
                    onClick={() => deleteSeries(series.id)}
                    className="ml-4 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {series.stories.map((story) => (
                    <div
                      key={story.id}
                      draggable
                      onDragStart={() => handleDragStart(series.id, story.id)}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, series.id, story.id)}
                      className="flex w-80 cursor-move flex-col gap-2 rounded border-2 border-gray-300 p-2 transition hover:border-teal-400"
                      style={{
                        opacity:
                          draggedStory?.seriesId === series.id &&
                          draggedStory?.storyId === story.id
                            ? 0.5
                            : 1,
                      }}
                    >
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
                      <div className="mt-2">
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
                      <div className="mt-2">
                        <div className="flex gap-2">
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
                            className="flex-1 rounded border px-2 py-1"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleSearch(`${series.id}_${story.id}`)
                            }
                            className="rounded-md bg-gray-200 px-3 py-1 text-sm font-semibold"
                          >
                            Search
                          </button>
                        </div>
                        {searchingMap[`${series.id}_${story.id}`] ? (
                          <p className="mt-2 text-sm italic">Searching...</p>
                        ) : (
                          (searchResultsMap[`${series.id}_${story.id}`] || [])
                            .length > 0 && (
                            <ul className="mt-2 max-h-40 overflow-y-auto rounded border bg-white text-sm">
                              {(
                                searchResultsMap[`${series.id}_${story.id}`] ||
                                []
                              ).map((s: any) => (
                                <li
                                  key={s.id}
                                  className="cursor-pointer px-2 py-1 hover:bg-gray-100"
                                  onClick={() => {
                                    updateStory(
                                      series.id,
                                      story.id,
                                      "name",
                                      s.title,
                                    );
                                    updateStory(
                                      series.id,
                                      story.id,
                                      "url",
                                      buildStoryUrl(s),
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
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => deleteStory(series.id, story.id)}
                          className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addStory(series.id)}
                  className="mt-3 rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  + Add Story
                </button>
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
  };
}
