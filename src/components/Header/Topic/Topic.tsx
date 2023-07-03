import { type StoryTopic } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Astronomy from "./TopicIcons/Astronomy.png";
import Biology from "./TopicIcons/Biology.png";
import ChemEng from "./TopicIcons/ChemEng.png";
import Chemistry from "./TopicIcons/Chemistry.png";
import ComputerS from "./TopicIcons/ComputerS.png";
import ElectricEng from "./TopicIcons/ElectricEng.png";
import EnviroS from "./TopicIcons/EnviroS.png";
import Geology from "./TopicIcons/Geology.png";
import Math from "./TopicIcons/Math.png";
import MechEng from "./TopicIcons/MechEng.png";
import Medicine from "./TopicIcons/Medicine.png";
import Physics from "./TopicIcons/Physics.png";
import Psychology from "./TopicIcons/Psychology.png";
import Sociology from "./TopicIcons/Sociology.png";
import Technology from "./TopicIcons/Technology.png";

export default function Topic() {
  const topics = [
    { Topic: "Astronomy", Image: Astronomy },
    { Topic: "Biology", Image: Biology },
    { Topic: "Chemistry", Image: Chemistry },
    { Topic: "Computer Science", Image: ComputerS },
    { Topic: "Chemical", Image: ChemEng },
    { Topic: "Electrical", Image: ElectricEng },
    { Topic: "Environmental Science", Image: EnviroS },
    { Topic: "Geology", Image: Geology },
    { Topic: "Mathematics", Image: Math },
    { Topic: "Mechanical Engineering", Image: MechEng },
    { Topic: "Medicine", Image: Medicine },
    { Topic: "Physics", Image: Physics },
    { Topic: "Psychology", Image: Psychology },
    { Topic: "Sociology", Image: Sociology },
    { Topic: "Technology", Image: Technology },
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
                        className="hover: my-3 flex cursor-pointer text-[#50808e] "
                        onMouseEnter={() => onMouseEnter(topic.Topic)}
                        style={{
                          color: currentTopic === topic.Topic ? "#ad2319" : "",
                        }}
                      >
                        <Image
                          src={topic.Image}
                          className="h-[2rem] w-auto"
                          alt="SciQuel"
                        />
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
