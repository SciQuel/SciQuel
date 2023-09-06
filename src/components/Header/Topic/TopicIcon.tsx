"use client";

import AstronomyAct from "./TopicIcons/Astronomy_Active.svg";
import Astronomy from "./TopicIcons/Astronomy_Inactive.svg";
import BiologyAct from "./TopicIcons/Biology_Active.svg";
import Biology from "./TopicIcons/Biology_Inactive.svg";
import ChemicalAct from "./TopicIcons/Chemical_Active.svg";
import Chemical from "./TopicIcons/Chemical_Inactive.svg";
import ChemistryAct from "./TopicIcons/Chemistry_Active.svg";
import Chemistry from "./TopicIcons/Chemistry_Inactive.svg";
import ComputerSAct from "./TopicIcons/ComputerScience_Active.svg";
import ComputerS from "./TopicIcons/ComputerScience_Inactive.svg";
import ElectricalAct from "./TopicIcons/Electrical_Active.svg";
import Electrical from "./TopicIcons/Electrical_Inactive.svg";
import EnviroSAct from "./TopicIcons/Environmental_Active.svg";
import EnviroS from "./TopicIcons/Environmental_Inactive.svg";
import GeologyAct from "./TopicIcons/Geology_Active.svg";
import Geology from "./TopicIcons/Geology_Inactive.svg";
import MathAct from "./TopicIcons/Math_Active.svg";
import Math from "./TopicIcons/Math_Inactive.svg";
import MechEngAct from "./TopicIcons/Mechanical_Active.svg";
import MechEng from "./TopicIcons/Mechanical_Inactive.svg";
import MedicineAct from "./TopicIcons/Medicine_Active.svg";
import Medicine from "./TopicIcons/Medicine_Inactive.svg";
import PhysicsAct from "./TopicIcons/Physics_Active.svg";
import Physics from "./TopicIcons/Physics_Inactive.svg";
import PsychologyAct from "./TopicIcons/Psychology_Active.svg";
import Psychology from "./TopicIcons/Psychology_Inactive.svg";
import SociologyAct from "./TopicIcons/Sociology_Active.svg";
import Sociology from "./TopicIcons/Sociology_Inactive.svg";
import TechnologyAct from "./TopicIcons/Technology_Active.svg";
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
    | "Technology"
    | "AstronomyAct"
    | "BiologyAct"
    | "ChemicalAct"
    | "ChemistryAct"
    | "ComputerSAct"
    | "ElectricalAct"
    | "EnvironmentalAct"
    | "GeologyAct"
    | "MathAct"
    | "MechanicalAct"
    | "MedicineAct"
    | "PhysicsAct"
    | "PsychologyAct"
    | "SociologyAct"
    | "TechnologyAct";
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
    AstronomyAct: <AstronomyAct className="h-[2rem] w-auto" />,
    BiologyAct: <BiologyAct className="h-[2rem] w-auto" />,
    ChemicalAct: <ChemicalAct className="h-[2rem] w-auto" />,
    ChemistryAct: <ChemistryAct className="h-[2rem] w-auto" />,
    ComputerSAct: <ComputerSAct className="h-[2rem] w-auto" />,
    ElectricalAct: <ElectricalAct className="h-[2rem] w-auto" />,
    EnvironmentalAct: <EnviroSAct className="h-[2rem] w-auto" />,
    GeologyAct: <GeologyAct className="h-[2rem] w-auto" />,
    MathAct: <MathAct className="h-[2rem] w-auto" />,
    MechanicalAct: <MechEngAct className="h-[2rem] w-auto" />,
    MedicineAct: <MedicineAct className="h-[2rem] w-auto" />,
    PhysicsAct: <PhysicsAct className="h-[2rem] w-auto" />,
    PsychologyAct: <PsychologyAct className="h-[2rem] w-auto" />,
    SociologyAct: <SociologyAct className="h-[2rem] w-auto" />,
    TechnologyAct: <TechnologyAct className="h-[2rem] w-auto" />,
  };
  return iconMap[type];
}
