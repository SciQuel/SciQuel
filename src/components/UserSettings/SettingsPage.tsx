"use client";

import { StoryTopic } from "@prisma/client";
import CeIcon from "/public/user-settings/setting-page/ce_icon.svg";
import ChemistryIcon from "/public/user-settings/setting-page/chemistry_icon.svg";
import CsIcon from "/public/user-settings/setting-page/cs_icon.svg";
import EeIcon from "/public/user-settings/setting-page/ee_icon.svg";
import EnvSciIcon from "/public/user-settings/setting-page/env_sci_icon.svg";
import InterestIcon from "/public/user-settings/setting-page/interest_icon.svg";
import MathIcon from "/public/user-settings/setting-page/math_icon.svg";
import MeIcon from "/public/user-settings/setting-page/me_icon.svg";
import MedicineIcon from "/public/user-settings/setting-page/medicine_icon.svg";
import PhysicsIcon from "/public/user-settings/setting-page/physics_icon.svg";
import PsyIcon from "/public/user-settings/setting-page/psy_icon.svg";
import SociologyIcon from "/public/user-settings/setting-page/sociology_icon.svg";
import TechIcon from "/public/user-settings/setting-page/tech_icon.svg";
import clsx from "clsx";
import { useState } from "react";

const iconMap: Record<StoryTopic, JSX.Element> = {
  CHEMISTRY: <ChemistryIcon className="w-6" />,
  CHEMICAL_ENGINEERING: <CeIcon className="w-6" />,
  MECHANICAL_ENGINEERING: <MeIcon className="w-6" />,
  MATHEMATICS: <MathIcon className="w-6" />,
  PHYSICS: <PhysicsIcon className="w-6" />,
  SOCIOLOGY: <SociologyIcon className="w-6" />,
  COMPUTER_SCIENCE: <CsIcon className="w-6" />,
  ELECTRICAL_ENGINEERING: <EeIcon className="w-6" />,
  ENVIRONMENTAL_SCIENCE: <EnvSciIcon className="w-6" />,
  MEDICINE: <MedicineIcon className="w-6" />,
  PSYCHOLOGY: <PsyIcon className="w-6" />,
  TECHNOLOGY: <TechIcon className="w-6" />,
  ASTRONOMY: <></>, // wait for the design team
  BIOLOGY: <></>, // wait for the design team
  GEOLOGY: <></>, // wait for the design team
};

interface FontSliderProps {
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

function FontSlider({ fontSize, setFontSize }: FontSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-4">
      <span style={{ fontSize: "20px" }}>A</span>
      <input
        type="range"
        min="20"
        max="40"
        step="1"
        defaultValue={fontSize}
        onChange={handleChange}
        className="mb-3 h-1 w-64 appearance-none rounded-full bg-[#D9D9D9] bg-gradient-to-r from-[#69A297] to-[#69A297] bg-no-repeat [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#69A297]"
      />
      <span style={{ fontSize: "40px" }}>A</span>
    </div>
  );
}

interface ToggleSwitchProps {
  id: string;
  isChecked?: boolean;
  onToggle?: (isChecked: boolean) => void;
}

function ToggleSwitch({ id, isChecked = false, onToggle }: ToggleSwitchProps) {
  const handleToggle = () => {
    const newState = !isChecked;
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <label
      htmlFor={id}
      className={clsx({
        "relative h-10 w-20 rounded-full": true,
        "bg-[#A6A6A6]": !isChecked,
        "bg-[#69A297]": isChecked,
      })}
    >
      <input
        type="checkbox"
        id={id}
        className="peer sr-only"
        onChange={handleToggle}
        checked={isChecked}
      />
      <span className="absolute left-11 top-1 h-4/5 w-2/5 rounded-full bg-white drop-shadow-lg transition-all duration-300 peer-checked:left-1"></span>
      <span className="absolute left-2.5 top-2 h-4/5 w-2/5 text-base text-white transition-all duration-300 peer-checked:opacity-0">
        OFF
      </span>
      <span className="absolute right-3.5 top-2 text-base text-white opacity-0 transition-all duration-300 peer-checked:opacity-100">
        ON
      </span>
    </label>
  );
}

export default function Settings() {
  const [fontSize, setFontSize] = useState(26);
  const [darkMode, setDarkMode] = useState(false);
  {
    /*Dark mode works, needs to be implemented on backend. To see full dark mode change add dark to classname in settings layout for now */
  }
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`${darkMode && "dark"}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className="relative flex grow flex-col gap-8 py-6 md:pl-56 ">
        <section>
          <div className="flex items-center gap-1  dark:text-white">
            <h3 className="text-xl font-semibold">FEATURES</h3>
          </div>
          <p className="mb-4 text-lg text-stone-500 dark:text-sciquelMuted">
            Toggle article features on and off
          </p>
          <ul className="divide-y rounded-md border bg-white px-4 text-xl font-semibold dark:bg-sciquelMuted dark:text-white">
            <li
              className="flex h-16 items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              Reading History
              <ToggleSwitch id="reading-history" />
            </li>
            <li
              className="flex h-16 items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              Show quizzes on articles
              <ToggleSwitch id="show-quizzes" />
            </li>
            <li
              className="flex h-16 items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              Show in-line comments
              <ToggleSwitch id="show-comments" />
            </li>
          </ul>
        </section>

        <section>
          <div
            className="flex items-center gap-1 dark:text-white"
            style={{ fontSize: `${fontSize}px` }}
          >
            <h3 className="text-xl font-semibold">INTERESTS</h3>
            <InterestIcon className="h-7 w-7" />
          </div>
          <p className="dark:sciquelMuted mb-4 text-lg  text-stone-500">
            Pick the curated content you want to see most.
          </p>
          <div className="grid max-h-96 auto-rows-max grid-cols-1 gap-2 overflow-auto rounded-md border bg-white p-4 dark:bg-sciquelMuted dark:text-white md:grid-cols-2">
            {Object.keys(StoryTopic).map((topic, idx) => (
              <div className="flex items-center gap-1" key={idx}>
                <input
                  placeholder="topic"
                  type="checkbox"
                  value={topic}
                  className="mr-3 h-6 w-6"
                />
                {iconMap[topic as keyof typeof StoryTopic]}
                {topic.charAt(0) +
                  topic.slice(1).replace(/_/g, " ").toLowerCase()}
              </div>
            ))}
          </div>
        </section>

        <section className="" style={{ fontSize: `${fontSize}px` }}>
          <div className="flex items-center gap-1  dark:text-white">
            <h3
              className="text-xl font-semibold"
              style={{ fontSize: `${fontSize}px` }}
            >
              SECURITY
            </h3>
          </div>
          <p className="dark:sciquelMuted mb-4 text-lg  text-stone-500">
            Protect your privacy and manage your account
          </p>
          <ul className="divide-y rounded-md border bg-white px-4 text-xl font-semibold dark:bg-sciquelMuted dark:text-white">
            <li
              className="flex h-16 items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              Change username or password
            </li>
            <li
              className="flex h-16 items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              Change or add email
            </li>
            <li
              className="flex h-16 items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              Auto logout
              <ToggleSwitch id="auto-logout-1" />
            </li>
          </ul>
        </section>

        <section className="">
          <div className="flex items-center gap-1  dark:text-white">
            <h3 className="text-xl font-semibold">NOTIFICATIONS</h3>
          </div>
          <p className="dark:sciquelMuted mb-4 text-lg  text-stone-500">
            Manage your alerts and notifications{" "}
          </p>
          <ul className="divide-y rounded-md border bg-white px-4 text-xl font-semibold dark:bg-sciquelMuted dark:text-white">
            <li
              className="flex h-16 items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              Email me about new articles
            </li>
            <li
              className="flex h-16 items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              Email me about new replies to my comments
            </li>
            <li
              className="flex h-16 items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              Auto logout
              <ToggleSwitch id="auto-logout-2" />
            </li>
          </ul>
        </section>

        <section className="">
          <div className="flex items-center gap-1 dark:text-white">
            <h3 className="text-xl font-semibold">ACCESSIBILITY</h3>
          </div>
          <ul className="divide-y rounded-md border bg-white px-4 text-xl font-semibold dark:bg-sciquelMuted dark:text-white">
            <li
              className="flex h-16 items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              Dark mode{" "}
              <ToggleSwitch
                id="dark-mode"
                isChecked={darkMode}
                onToggle={toggleDarkMode}
              />
            </li>
            <li
              className="flex h-32 flex-col justify-between py-4"
              style={{ fontSize: `${fontSize}px` }}
            >
              <p className="">Text size</p>
              <FontSlider fontSize={fontSize} setFontSize={setFontSize} />
            </li>
            <li
              className="min-h-16 flex items-center justify-between"
              style={{ fontSize: `${fontSize}px` }}
            >
              <span className="basis-3/4">
                Turn on automatic captions for audio and video content
              </span>
              <ToggleSwitch id="auto-caption" />
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
