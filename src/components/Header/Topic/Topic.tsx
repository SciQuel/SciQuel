import { type StoryTopic } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

export default function Topic() {
  const topics = [
    "Astronomy",
    "Biology",
    "Chemistry",
    "Computer Science",
    "Chemical",
    "Electrical",
    "Environmental Sciences",
    "Geology",
    "Mathematics",
    "Mechanical Engineering",
    "Medicine",
    "Physics",
    "Psychology",
    "Sociology",
    "Technology",
  ];
  const [showTopic, setShowTopic] = useState(false);
  const topicRef = useRef<HTMLDivElement>(null);
  const [currentTopic, setCurrentTopic] = useState("Astronomy");
  const onMouseEnter = (top: any) => {
    setCurrentTopic(top);
  };
  useEffect(() => {
    if (showTopic) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    let handler = (event: any) => {
      if (topicRef.current != null) {
        if (!topicRef.current.contains(event.target)) {
          setShowTopic(false);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div>
      <div onClick={() => setShowTopic((showTopic) => !showTopic)}>TOPIC</div>
      <div
        className="fixed left-0 right-0 z-50 mt-8 h-full cursor-default overflow-y-auto 
      overflow-x-hidden bg-black bg-opacity-40  "
        style={{ display: showTopic ? "block" : "none" }}
      >
        <div className="relative max-h-full w-full" ref={topicRef}>
          <div className="relative  bg-white shadow">
            <div className="flex w-full justify-between">
              <div className="w-[20%] p-6 text-left">
                <ul>
                  {topics.map((topic, index) => (
                    <>
                      <li
                        key={index}
                        className="hover: my-3 cursor-pointer text-[#50808e] "
                        onMouseEnter={() => onMouseEnter(topic)}
                        style={{
                          color: currentTopic === topic ? "#ad2319" : "",
                        }}
                      >
                        {topic}
                      </li>
                    </>
                  ))}
                </ul>
              </div>
              <div className="w-[80%] p-6 text-center">
                <div className="h-full">
                  <div className=" text-transform: h-[20%] text-left text-2xl uppercase text-[#ad2319]">
                    <p>THE LATEST FROM {currentTopic}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
