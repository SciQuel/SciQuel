import axios from "axios";
import { useEffect, useState } from "react";
import {
  buildStoryUrl,
  normalizeSeriesList,
  type Series,
  type Story,
} from "./helpers";

export type SearchResult = {
  id: string;
  title: string;
  createdAt: string | Date;
  slug: string;
};

export function useSeriesDashboard() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [draggedStory, setDraggedStory] = useState<{
    seriesId: string;
    storyId: string;
  } | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {},
  );
  const [searchResultsMap, setSearchResultsMap] = useState<
    Record<string, SearchResult[]>
  >({});
  const [searchingMap, setSearchingMap] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>(
    {},
  );
  const [updatingSeriesMap, setUpdatingSeriesMap] = useState<
    Record<string, boolean>
  >({});
  const [deletingSeriesMap, setDeletingSeriesMap] = useState<
    Record<string, boolean>
  >({});
  const [pendingAddStorySeriesId, setPendingAddStorySeriesId] = useState<
    string | null
  >(null);

  // Fetch all saved series from the backend and normalize them into the UI model.
  const loadExistingSeries = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const res = await axios.get("/api/series");
      const data = res.data as { allSeries?: Array<any> } | undefined;
      setSeriesList(
        normalizeSeriesList(
          Array.isArray(data?.allSeries) ? data.allSeries : [],
        ),
      );
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

  // Create a brand-new empty series so the user can fill in the title and add stories.
  const addSeries = () => {
    const tempSeriesId = `temp-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
    const newSeries: Series = { id: tempSeriesId, name: "", stories: [] };
    setSeriesList((prev) => [...prev, newSeries]);
    setExpandedSeries((prev) => ({ ...prev, [tempSeriesId]: true }));
    setPendingAddStorySeriesId(tempSeriesId);
    setSearchQueries((prev) => ({ ...prev, [`add-${tempSeriesId}`]: "" }));
    setSearchResultsMap((prev) => ({ ...prev, [`add-${tempSeriesId}`]: [] }));
  };

  // Expand or collapse the selected series card to show or hide its story content.
  const toggleSeriesExpanded = (seriesId: string) => {
    setExpandedSeries((prev) => ({ ...prev, [seriesId]: !prev[seriesId] }));
  };

  // Update a series title in local state while the user edits it.
  const updateSeriesName = (id: string, name: string) => {
    setSeriesList((prev) =>
      prev.map((series) => (series.id === id ? { ...series, name } : series)),
    );
  };

  // Update a story field such as the short headline, URL, or ID.
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

  // Remove a series from local state or from the API if it already exists on the server.
  const deleteSeries = async (id: string) => {
    if (!id || id.trim() === "" || id.startsWith("temp-")) {
      setSeriesList((prev) => prev.filter((series) => series.id !== id));
      setExpandedSeries((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setPendingAddStorySeriesId((current) =>
        current === id ? null : current,
      );
      setSearchQueries((prev) => {
        const next = { ...prev };
        delete next[`add-${id}`];
        return next;
      });
      setSearchResultsMap((prev) => {
        const next = { ...prev };
        delete next[`add-${id}`];
        return next;
      });
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

  // Save a series back to the backend. New series use POST, existing ones use PUT.
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

      const isNewSeries =
        !series.id || series.id.trim() === "" || series.id.startsWith("temp-");

      if (isNewSeries) {
        if (!series.name.trim() && series.stories.length === 0) {
          setSeriesList((prev) => prev.filter((item) => item.id !== series.id));
          setExpandedSeries((prev) => {
            const next = { ...prev };
            delete next[series.id];
            return next;
          });
          return;
        }

        const formData = new FormData();
        formData.append("title", series.name);
        formData.append("stories", JSON.stringify(stories));

        const res = await axios.post("/api/series", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newSeriesId = (res.data as { newSeries?: { id: string } })
          ?.newSeries?.id;
        setSeriesList((prev) =>
          prev.map((item) =>
            item.id === series.id ? { ...series, id: newSeriesId ?? "" } : item,
          ),
        );
      } else {
        const payload: {
          id: string;
          title: string;
          stories?: Array<{
            id: string;
            shortHeadline: string;
            storyURL: string;
          }>;
        } = { id: series.id, title: series.name };

        if (stories.length > 0) payload.stories = stories;

        await axios.put("/api/series", payload);
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

  // Open the add-story search panel for a specific series.
  const startAddStory = (seriesId: string) => {
    setPendingAddStorySeriesId(seriesId);
    setSearchQueries((prev) => ({ ...prev, [`add-${seriesId}`]: "" }));
    setSearchResultsMap((prev) => ({ ...prev, [`add-${seriesId}`]: [] }));
  };

  // Close the add-story search panel and clear its temporary search state.
  const cancelAddStory = (seriesId: string) => {
    setPendingAddStorySeriesId((current) =>
      current === seriesId ? null : current,
    );
    clearResults(`add-${seriesId}`);
  };

  // Attach a search result to a series as a new story entry.
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

  // Remove a single story from a series in local state.
  const deleteStory = (seriesId: string, storyId: string) => {
    setSeriesList((prev) =>
      prev.map((series) =>
        series.id === seriesId
          ? {
              ...series,
              stories: series.stories.filter((story) => story.id !== storyId),
            }
          : series,
      ),
    );
  };

  // Cache the story being dragged so the drop target knows which item is moving.
  const handleDragStart = (seriesId: string, storyId: string) => {
    setDraggedStory({ seriesId, storyId });
  };

  // Allow the dragged story to be dropped on a target card.
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.opacity = "0.8";
  };

  // Reset the visual state when the drag leaves a story card.
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = "1";
  };

  // Reorder stories inside the same series when a drag-and-drop completes.
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

    setSeriesList((prev) =>
      prev.map((series) => {
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

    setDraggedStory(null);
  };

  // Search the story API and return the matching stories for the current keyword.
  const searchStories = async (keyword: string): Promise<SearchResult[]> => {
    if (!keyword) return [];

    try {
      const res = await axios.get(
        `/api/stories?keyword=${encodeURIComponent(keyword)}&page_size=5`,
      );
      const data = res.data as { stories?: SearchResult[] } | undefined;
      return data?.stories || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Run a story search for a specific input key and store the result list.
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

  // Clear a specific search result set and reset its input value.
  const clearResults = (key: string) => {
    setSearchResultsMap((m) => ({ ...m, [key]: [] }));
    setSearchQueries((q) => ({ ...q, [key]: "" }));
  };

  return {
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
    setSearchResultsMap,
    setSeriesList,
  };
}
