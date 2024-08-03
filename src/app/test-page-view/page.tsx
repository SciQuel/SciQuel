"use client";

import { useState } from "react";
import "./test.css";
import axios from "axios";

export default function TestPage() {
  const [storyId, setStoryId] = useState("647ad74aa9efff3abe83045a");
  const [textConsole, setTextConsole] = useState("");
  function getPageViewByUserId() {
    axios.get("/api/user/page_views").then((data) => consoleOut(data.data));
  }
  function getPageViewByUserIdDistinct() {
    axios
      .get("/api/user/page_views", { params: { distinct: true } })
      .then((data) => consoleOut(data.data));
  }
  function getPageByStoryId() {
    axios
      .get("/api/stories/page_views", { params: { story_id: storyId } })
      .then((data) => consoleOut(data.data));
  }
  function getCalculateAvg() {
    axios
      .post("/api/stories/page_views", {
        start_date: new Date("2023-12-05T08:00:00.000+00:00").toISOString(),
        end_date: new Date().toISOString(),
        topic: "ASTRONOMY",
      })
      .then((data) => consoleOut(data.data));
  }
  function postPageView() {
    axios
      .post("/api/user/page_views", {
        story_id: storyId,
      })
      .then((data) => consoleOut(data.data));
  }
  function consoleOut(obj: any) {
    setTextConsole(JSON.stringify(obj || "", undefined, 2));
  }
  return (
    <div className="box">
      <h1 className="title">Page view Test</h1>
      <label>
        Story Id:{" "}
        <input
          className="textInput"
          type="text"
          onChange={(e) => setStoryId(e.target.value)}
          value={storyId}
        />
      </label>
      <label>
        Console output:
        <div className="box-console">
          <pre>{textConsole}</pre>
        </div>
      </label>
      <button>Post page view</button>
      <button onClick={getPageByStoryId}>Get page view by story id</button>
      <button onClick={getPageViewByUserId}>Get page view by user id</button>
      <button onClick={getPageViewByUserIdDistinct}>
        Get page view by user id distinct
      </button>
      <button onClick={getCalculateAvg}>Get calculate AVG</button>
      <button onClick={postPageView}>Post user reading history</button>
    </div>
  );
}
