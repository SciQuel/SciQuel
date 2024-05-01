"use client";

import env from "@/lib/env";
import axios from "axios";
import { FunctionComponent, useState } from "react";

interface TestStaffPickProps {}

const TestStaffPick: FunctionComponent<TestStaffPickProps> = () => {
  const [storyId, setStoryId] = useState("");
  const [staffPickId, setStaffPickId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoad] = useState(false);
  const markStory = async () => {
    setLoad(true);
    const { status, request, data } = await axios.post(
      `${env.NEXT_PUBLIC_SITE_URL}/api/staff/mark-story`,
      {
        story_id: storyId,
        description,
      },
    );
    console.log(data);
    setLoad(false);
  };
  const getRecord = async () => {
    setLoad(true);
    const { status, request, data } = await axios.get(
      `${env.NEXT_PUBLIC_SITE_URL}/api/staff/mark-record/story/${storyId}`,
    );
    console.log(data);
    setLoad(false);
  };
  const getStory = async () => {
    setLoad(true);
    const { status, request, data } = await axios.get(
      `${env.NEXT_PUBLIC_SITE_URL}/api/stories/id/${storyId}`,
    );
    setLoad(false);
    console.log(data);
    if (data.staffPick) {
      setStaffPickId(data.staffPick?.id);
    }
  };
  const updateMark = async () => {
    setLoad(true);
    const { status, request, data } = await axios.patch(
      `${env.NEXT_PUBLIC_SITE_URL}/api/staff/mark-story/${staffPickId}`,
      {
        description,
      },
    );
    if (status >= 200 && status < 300) console.log("Update Successful");
    else console.log("Update Unsuccessful");
    console.log(data);
    setLoad(false);
  };
  const deleteMark = async () => {
    setLoad(true);
    const { status, request, data } = await axios.delete(
      `${env.NEXT_PUBLIC_SITE_URL}/api/staff/mark-story/${staffPickId}`,
    );
    setLoad(false);
    if (status >= 200 && status < 300) console.log("Delete Successful");
    else console.log("Delete Unsuccessful");
  };
  return (
    <div
      style={{
        backgroundColor: "lightgray",
        width: "250px",
        padding: "10px",
        margin: "auto",
      }}
    >
      <div style={{ margin: "10px", marginLeft: "0px" }}>
        <label htmlFor="storyId">Story id:</label>
        <input
          type="text"
          id="storyId"
          name="storyId"
          value={storyId}
          onChange={(e) => setStoryId(e.target.value)}
          required
          style={{
            borderColor: "black",
            borderWidth: "1px",
          }}
        />
      </div>
      <div style={{ margin: "10px", marginLeft: "0px" }}>
        <label htmlFor="staffPickId">Staff pick id:</label>
        <input
          type="text"
          id="staffPickId"
          name="staffPickId"
          value={staffPickId}
          onChange={(e) => setStaffPickId(e.target.value)}
          required
          style={{
            borderColor: "black",
            borderWidth: "1px",
          }}
        />
      </div>
      <div>
        <label htmlFor="desciption">Desciption:</label>
        <input
          type="text"
          id="desciption"
          name="desciption"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            borderColor: "black",
            borderWidth: "1px",
          }}
        />
      </div>
      <div style={{ marginLeft: "120px" }}>
        <button
          disabled={loading}
          className={`mt-6 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90 disabled:bg-gray-300 disabled:hover:brightness-100`}
          onClick={markStory}
        >
          Mark
        </button>
      </div>
      <div style={{ marginLeft: "120px" }}>
        <button
          onClick={updateMark}
          disabled={loading}
          className={`mt-6 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90 disabled:bg-gray-300 disabled:hover:brightness-100`}
        >
          Update
        </button>
      </div>
      <div style={{ marginLeft: "120px" }}>
        <button
          onClick={deleteMark}
          disabled={loading}
          className={`mt-6 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90 disabled:bg-gray-300 disabled:hover:brightness-100`}
        >
          Delete
        </button>
      </div>
      <div style={{ marginLeft: "120px" }}>
        <button
          onClick={getStory}
          disabled={loading}
          className={`mt-6 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90 disabled:bg-gray-300 disabled:hover:brightness-100`}
        >
          Get story
        </button>
      </div>
      <div style={{ marginLeft: "120px" }}>
        <button
          onClick={getRecord}
          disabled={loading}
          className={`mt-6 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90 disabled:bg-gray-300 disabled:hover:brightness-100`}
        >
          Get Record
        </button>
      </div>
    </div>
  );
};

export default TestStaffPick;
