"use client";

import { StoryTopic } from "@prisma/client";
import AccessibilityIcon from "/public/user-settings/setting-page/accessibility_icon.svg";
import CeIcon from "/public/user-settings/setting-page/ce_icon.svg";
import ChemistryIcon from "/public/user-settings/setting-page/chemistry_icon.svg";
import CsIcon from "/public/user-settings/setting-page/cs_icon.svg";
import EeIcon from "/public/user-settings/setting-page/ee_icon.svg";
import EnvSciIcon from "/public/user-settings/setting-page/env_sci_icon.svg";
import FeatureIcon from "/public/user-settings/setting-page/feature_icon.svg";
import InterestIcon from "/public/user-settings/setting-page/interest_icon.svg";
import MathIcon from "/public/user-settings/setting-page/math_icon.svg";
import MeIcon from "/public/user-settings/setting-page/me_icon.svg";
import MedicineIcon from "/public/user-settings/setting-page/medicine_icon.svg";
import NotificationIcon from "/public/user-settings/setting-page/notification_icon.svg";
import PhysicsIcon from "/public/user-settings/setting-page/physics_icon.svg";
import PsyIcon from "/public/user-settings/setting-page/psy_icon.svg";
import SecurityIcon from "/public/user-settings/setting-page/security_icon.svg";
import SociologyIcon from "/public/user-settings/setting-page/sociology_icon.svg";
import TechIcon from "/public/user-settings/setting-page/tech_icon.svg";
import clsx from "clsx";
import { useRef, useState } from "react";

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
  SCIQUEL_MATTERS: <></>, // confirm if same design?
  ASTRONOMY: <></>, // wait for the design team
  BIOLOGY: <></>, // wait for the design team
  GEOLOGY: <></>, // wait for the design team
};

function FontSlider() {
  const [fontSize, setFontSize] = useState(26);
  const ref = useRef(null);

  const getBackgroundSize = () => {
    return {
      backgroundSize: `${((fontSize - 20) * 100) / 20}% 100%`,
    };
  };

  return (
    <div className="flex items-end gap-4">
      <span>A</span>
      <label
        htmlFor="font-range"
        className={`absolute text-base font-thin`}
        style={{
          transform: `translateX(${(fontSize - 26) * 11.8 + 100
            }px) translateY(-24px)`,
        }}
      >
        {fontSize}
      </label>
      <input
        type="range"
        min="20"
        max="40"
        step="1"
        id="font-range"
        defaultValue="26"
        className="mb-3 h-1 w-64 appearance-none rounded-full bg-[#D9D9D9] bg-gradient-to-r from-[#69A297] to-[#69A297] bg-no-repeat [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#69A297]"
        style={getBackgroundSize()}
        ref={ref}
        onChange={(e) => {
          setFontSize(Number(e.target.value));
        }}
      />
      <span className="text-5xl">A</span>
    </div>
  );
}

function ToggleSwitch({ id }: { id: string }) {
  const [isChecked, setIsChecked] = useState(true);
  return (
    <label
      htmlFor={id}
      className={clsx({
        "relative h-10 w-20 rounded-full": true,
        "bg-[#A6A6A6]": isChecked,
        "bg-[#69A297]": !isChecked,
      })}
    >
      <input
        type="checkbox"
        id={id}
        className="peer sr-only"
        onChange={(e) => setIsChecked(e.target.checked ? false : true)}
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
  return (
    <div className="relative flex grow flex-col gap-8 py-6 md:pl-56">
      {/* Feature Section */}
      <section>
        <div className="flex items-center gap-1">
          <h3 className="text-xl font-semibold">FEATURES</h3>
          <FeatureIcon className="h-7 w-7" />
        </div>
        <p className="mb-4 text-lg text-stone-500">
          Toggle article features on and off
        </p>
        <ul className="divide-y rounded-md border bg-white px-4 text-xl font-semibold">
          <li className="flex h-16 items-center justify-between">
            Reading History
            <ToggleSwitch id="reading-history" />
          </li>
          <li className="flex h-16 items-center justify-between">
            Show quizzes on articles
            <ToggleSwitch id="show-quizzes" />
          </li>
          <li className="flex h-16 items-center justify-between">
            Show in-line comments
            <ToggleSwitch id="show-comments" />
          </li>
        </ul>
      </section>

      {/* Interests Section */}
      <section>
        <div className="flex items-center gap-1">
          <h3 className="text-xl font-semibold">INTERESTS</h3>
          <InterestIcon className="h-7 w-7" />
        </div>
        <p className="mb-4 text-lg text-stone-500">
          Pick the curated content you want to see most.
        </p>
        <div className="grid max-h-64 auto-rows-max grid-cols-1 gap-2 overflow-auto rounded-md border bg-white p-4 md:grid-cols-2">
          {Object.keys(StoryTopic).map((topic, idx) => (
            <div className="flex items-center gap-1" key={idx}>
              <input
                placeholder="topic"
                type="checkbox"
                value={topic}
                className="mr-2"
              />
              {iconMap[topic as keyof typeof StoryTopic]}
              {topic.charAt(0) +
                topic.slice(1).replace(/_/g, " ").toLowerCase()}
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section>
        <div className="flex items-center gap-1">
          <h3 className="text-xl font-semibold">SECURITY</h3>
          <SecurityIcon className="h-7 w-7" />
        </div>
        <p className="mb-4 text-lg text-stone-500">
          Protect your privacy and manage your account
        </p>
        <ul className="divide-y rounded-md border bg-white px-4 text-xl font-semibold">
          <li className="flex h-16 items-center justify-between">
            Change username or password
          </li>
          <li className="flex h-16 items-center justify-between">
            Change or add email
          </li>
          <li className="flex h-16 items-center justify-between">
            Auto logout
            <ToggleSwitch id="auto-logout-1" />
          </li>
        </ul>
      </section>

      {/* notifications Section */}
      <section>
        <div className="flex items-center gap-1">
          <h3 className="text-xl font-semibold">NOTIFICATIONS</h3>
          <NotificationIcon className="h-7 w-7" />
        </div>
        <p className="mb-4 text-lg text-stone-500">
          Manage your alerts and notifications{" "}
        </p>
        <ul className="divide-y rounded-md border bg-white px-4 text-xl font-semibold">
          <li className="flex h-16 items-center justify-between">
            Email me about new articles
          </li>
          <li className="flex h-16 items-center justify-between">
            Email me about new replies to my comments
          </li>
          <li className="flex h-16 items-center justify-between">
            Auto logout
            <ToggleSwitch id="auto-logout-2" />
          </li>
        </ul>
      </section>

      {/* Accessibility Section */}
      <section>
        <div className="flex items-center gap-1">
          <h3 className="text-xl font-semibold">ACCESSIBILITY</h3>

          <AccessibilityIcon className="h-7 w-7" />
        </div>
        <p className="mb-4 text-lg text-stone-500">
          Enable or disable accessibility features
        </p>
        <ul className="divide-y rounded-md border bg-white px-4 text-xl font-semibold">
          <li className="flex h-16 items-center justify-between">
            Dark mode <ToggleSwitch id="dark-mode" />
          </li>
          <li className="flex h-32 flex-col justify-between py-4">
            <p className="">Text size (px)</p>
            <FontSlider />
          </li>
          <li className="flex min-h-16 items-center justify-between">
            <span className="basis-3/4">
              Turn on automatic captions for audio and video content
            </span>
            <ToggleSwitch id="auto-caption" />
          </li>
        </ul>
      </section>
    </div>
  );
}
