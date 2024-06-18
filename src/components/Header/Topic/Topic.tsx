import { useEffect, useRef, useState } from "react";
import TopicIcon from "./TopicIcon";

export default function Topic() {
  const topics = [
    {
      Topic: "Astronomy",
      Image: <TopicIcon type="Astronomy" />,
      Hover: <TopicIcon type="AstronomyAct" />,
    },
    {
      Topic: "Biology",
      Image: <TopicIcon type="Biology" />,
      Hover: <TopicIcon type="BiologyAct" />,
    },
    {
      Topic: "Chemistry",
      Image: <TopicIcon type="Chemistry" />,
      Hover: <TopicIcon type="ChemistryAct" />,
    },
    {
      Topic: "Computer Science",
      Image: <TopicIcon type="ComputerS" />,
      Hover: <TopicIcon type="ComputerSAct" />,
    },
    {
      Topic: "Chemical",
      Image: <TopicIcon type="Chemical" />,
      Hover: <TopicIcon type="ChemicalAct" />,
    },
    {
      Topic: "Electrical",
      Image: <TopicIcon type="Electrical" />,
      Hover: <TopicIcon type="ElectricalAct" />,
    },
    {
      Topic: "Environmental Science",
      Image: <TopicIcon type="Environmental" />,
      Hover: <TopicIcon type="EnvironmentalAct" />,
    },
    {
      Topic: "Geology",
      Image: <TopicIcon type="Geology" />,
      Hover: <TopicIcon type="GeologyAct" />,
    },
    {
      Topic: "Mathematics",
      Image: <TopicIcon type="Math" />,
      Hover: <TopicIcon type="MathAct" />,
    },
    {
      Topic: "Mechanical Engineering",
      Image: <TopicIcon type="Mechanical" />,
      Hover: <TopicIcon type="MechanicalAct" />,
    },
    {
      Topic: "Medicine",
      Image: <TopicIcon type="Medicine" />,
      Hover: <TopicIcon type="MedicineAct" />,
    },
    {
      Topic: "Physics",
      Image: <TopicIcon type="Physics" />,
      Hover: <TopicIcon type="PhysicsAct" />,
    },
    {
      Topic: "Psychology",
      Image: <TopicIcon type="Psychology" />,
      Hover: <TopicIcon type="PsychologyAct" />,
    },
    {
      Topic: "Sociology",
      Image: <TopicIcon type="Sociology" />,
      Hover: <TopicIcon type="SociologyAct" />,
    },
    {
      Topic: "Technology",
      Image: <TopicIcon type="Technology" />,
      Hover: <TopicIcon type="TechnologyAct" />,
    },
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
      <button onClick={() => setShowTopic((showTopic) => !showTopic)}>
        TOPIC
      </button>
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
                    <li key={index}>
                      <button
                        className="my-3 flex cursor-pointer items-center text-[#50808e]"
                        onMouseEnter={() => onMouseEnter(topic.Topic)}
                        style={{
                          color: currentTopic === topic.Topic ? "#ad2319" : "",
                        }}
                      >
                        {currentTopic === topic.Topic
                          ? topic.Hover
                          : topic.Image}

                        <span>{topic.Topic}</span>
                      </button>
                    </li>
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
