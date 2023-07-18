import { useEffect, useRef, useState } from "react";
import TopicIcon from "./TopicIcon";

export default function Topic() {
  const topics = [
    { Topic: "Astronomy", Image: <TopicIcon type="Astronomy" /> },
    { Topic: "Biology", Image: <TopicIcon type="Biology" /> },
    { Topic: "Chemistry", Image: <TopicIcon type="Chemistry" /> },
    { Topic: "Computer Science", Image: <TopicIcon type="ComputerS" /> },
    { Topic: "Chemical", Image: <TopicIcon type="Chemical" /> },
    { Topic: "Electrical", Image: <TopicIcon type="Electrical" /> },
    {
      Topic: "Environmental Science",
      Image: <TopicIcon type="Environmental" />,
    },
    { Topic: "Geology", Image: <TopicIcon type="Geology" /> },
    { Topic: "Mathematics", Image: <TopicIcon type="Math" /> },
    { Topic: "Mechanical Engineering", Image: <TopicIcon type="Mechanical" /> },
    { Topic: "Medicine", Image: <TopicIcon type="Medicine" /> },
    { Topic: "Physics", Image: <TopicIcon type="Physics" /> },
    { Topic: "Psychology", Image: <TopicIcon type="Psychology" /> },
    { Topic: "Sociology", Image: <TopicIcon type="Sociology" /> },
    { Topic: "Technology", Image: <TopicIcon type="Technology" /> },
  ];
  const [showTopic, setShowTopic] = useState(false);
  const topicRef = useRef<HTMLDivElement>(null);
  const [currentTopic, setCurrentTopic] = useState("Astronomy");
  const onMouseEnter = (top: string) => {
    setCurrentTopic(top);
  };
  useEffect(() => {
    if (showTopic) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    const handler = (event: Event) => {
      if (topicRef.current != null) {
        if (!topicRef.current.contains(event.target as Node)) {
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
        className="fixed left-0 right-0 z-50 mt-2 h-full cursor-default overflow-y-auto 
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
                        className=" hover: my-3 flex cursor-pointer items-center text-[#50808e] "
                        onMouseEnter={() => onMouseEnter(topic.Topic)}
                        style={{
                          color: currentTopic === topic.Topic ? "#ad2319" : "",
                        }}
                      >
                        {topic.Image}
                        <span>{topic.Topic}</span>
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
