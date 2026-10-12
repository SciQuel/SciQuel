"use client";

import { StoryCard } from "./StoryCard";
import { useSeriesDashboard } from "./useSeriesDashboard";

export default function ASeriesDashboard() {
  const {
    seriesList,
    draggedStory,
    searchQueries,
    searchResultsMap,
    searchingMap,
    isLoading,
    loadError,
    expandedSeries,
    updatingSeriesMap,
    deletingSeriesMap,
    pendingAddStorySeriesId,
    addSeries,
    toggleSeriesExpanded,
    updateSeriesName,
    updateStory,
    deleteSeries,
    updateExistingSeries,
    startAddStory,
    cancelAddStory,
    addSelectedStoryToSeries,
    deleteStory,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSearch,
    clearResults,
    setSearchQueries,
    setSeriesList,
  } = useSeriesDashboard();

  return (
    <div className="mx-32 mb-16 mt-5 flex flex-col gap-5">
      <h3 className="text-3xl font-semibold text-sciquelTeal">
        Article Series Dashboard
      </h3>
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
                      <StoryCard
                        key={story.id}
                        series={series}
                        story={story}
                        draggedStory={draggedStory}
                        searchQueries={searchQueries}
                        searchResultsMap={searchResultsMap}
                        searchingMap={searchingMap}
                        updatingSeriesMap={updatingSeriesMap}
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleDragLeave={handleDragLeave}
                        handleDrop={handleDrop}
                        handleSearch={handleSearch}
                        clearResults={clearResults}
                        updateStory={updateStory}
                        updateExistingSeries={updateExistingSeries}
                        deleteStory={deleteStory}
                        setSeriesList={setSeriesList}
                      />
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
