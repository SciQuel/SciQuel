"use client";

import { useState } from "react";
import "./test.css";
import axios from "axios";

export default function TestPage() {
  const [storyId, setStoryId] = useState("647ad74aa9efff3abe83045a");
  const [textConsole, setTextConsole] = useState("");
  function getPageViewByUserId() {
    console.log("fetching view page by user id");
    axios.get("/api/user/page_views").then((data) => consoleOut(data.data));
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
      <button>Get page view by story id</button>
      <button onClick={getPageViewByUserId}>Get page view by user id</button>
    </div>
  );
}
