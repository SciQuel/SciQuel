"use client";

import Astronomy from "./TopicIcons/Astronomy_Inactive.svg";
import Biology from "./TopicIcons/Biology_Inactive.svg";
import Chemical from "./TopicIcons/Chemical_Inactive.svg";
import Chemistry from "./TopicIcons/Chemistry_Inactive.svg";
import ComputerS from "./TopicIcons/ComputerScience_Inactive.svg";
import Electrical from "./TopicIcons/Electrical_Inactive.svg";
import EnviroS from "./TopicIcons/Environmental_Inactive.svg";
import Geology from "./TopicIcons/Geology_Inactive.svg";
import Math from "./TopicIcons/Math_Inactive.svg";
import MechEng from "./TopicIcons/Mechanical_Inactive.svg";
import Medicine from "./TopicIcons/Medicine_Inactive.svg";
import Physics from "./TopicIcons/Physics_Inactive.svg";
import Psychology from "./TopicIcons/Psychology_Inactive.svg";
import Sociology from "./TopicIcons/Sociology_Inactive.svg";
import Technology from "./TopicIcons/Technology_Inactive.svg";

interface Props {
  type:
    | "Astronomy"
    | "Biology"
    | "Chemical"
    | "Chemistry"
    | "ComputerS"
    | "Electrical"
    | "Environmental"
    | "Geology"
    | "Math"
    | "Mechanical"
    | "Medicine"
    | "Physics"
    | "Psychology"
    | "Sociology"
    | "Technology";
}

export default function TopicIcon({ type }: Props) {
  const iconMap: Record<typeof type, JSX.Element> = {
    Astronomy: <Astronomy className="h-[2rem] w-auto" />,
    Biology: <Biology className="h-[2rem] w-auto" />,
    Chemical: <Chemical className="h-[2rem] w-auto" />,
    Chemistry: <Chemistry className="h-[2rem] w-auto" />,
    ComputerS: <ComputerS className="h-[2rem] w-auto" />,
    Electrical: <Electrical className="h-[2rem] w-auto" />,
    Environmental: <EnviroS className="h-[2rem] w-auto" />,
    Geology: <Geology className="h-[2rem] w-auto" />,
    Math: <Math className="h-[2rem] w-auto" />,
    Mechanical: <MechEng className="h-[2rem] w-auto" />,
    Medicine: <Medicine className="h-[2rem] w-auto" />,
    Physics: <Physics className="h-[2rem] w-auto" />,
    Psychology: <Psychology className="h-[2rem] w-auto" />,
    Sociology: <Sociology className="h-[2rem] w-auto" />,
    Technology: <Technology className="h-[2rem] w-auto" />,
  };
  return iconMap[type];
}
