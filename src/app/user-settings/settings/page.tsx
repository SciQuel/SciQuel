"use client";

import AccessibilityIcon from "/public/user-settings/setting-page/accessibility_icon.svg";
import CeIcon from "/public/user-settings/setting-page/ce_icon.svg";
import ChemistryIcon from "/public/user-settings/setting-page/chemistry_icon.svg";
import CsIcon from "/public/user-settings/setting-page/cs_icon.svg";
import EeIcon from "/public/user-settings/setting-page/ee_icon.svg";
import EnvSciIcon from "/public/user-settings/setting-page/env_sci_icon.svg";
import MathIcon from "/public/user-settings/setting-page/math_icon.svg";
import MeIcon from "/public/user-settings/setting-page/me_icon.svg";
import MedicineIcon from "/public/user-settings/setting-page/medicine_icon.svg";
import PhysicsIcon from "/public/user-settings/setting-page/physics_icon.svg";
import PsyIcon from "/public/user-settings/setting-page/psy_icon.svg";
import SociologyIcon from "/public/user-settings/setting-page/sociology_icon.svg";
import TechIcon from "/public/user-settings/setting-page/tech_icon.svg";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

function FontSlider() {
  const [fontSize, setFontSize] = useState(26);
  const [step, setStep] = useState(100);
  const ref = useRef(null);

  const getBackgroundSize = () => {
    return {
      backgroundSize: `${((fontSize - 20) * 100) / 20}% 100%`,
    };
  };
  useEffect(() => {
    setStep((fontSize - 26) * 11.8 + 100);
  });

  return (
    <div className="flex items-end gap-4">
      <span>A</span>
      <label
        htmlFor="font-range"
        className={`absolute text-base font-thin`}
        style={{
          transform: `translateX(${step}px) translateY(-24px)`,
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
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.8565 5.82866C15.8119 4.18211 18.1897 4.18212 19.1451 5.82866L22.0711 10.8711C22.3408 11.3359 22.8069 11.653 23.3382 11.7333L28.1969 12.4671C30.3148 12.787 31.0577 15.4611 29.4083 16.8276L25.8682 19.7605C25.3713 20.1722 25.1377 20.8216 25.2584 21.4554L26.25 26.6631C26.6385 28.703 24.497 30.2879 22.6596 29.3205L17.8259 26.7753C17.3094 26.5034 16.6922 26.5034 16.1758 26.7753L11.3421 29.3205C9.50464 30.2879 7.36317 28.703 7.75162 26.6631L8.74326 21.4554C8.86396 20.8216 8.63033 20.1722 8.13344 19.7605L4.59333 16.8276C2.94393 15.4611 3.68683 12.787 5.80474 12.4671L10.6634 11.7333C11.1947 11.653 11.6609 11.3359 11.9306 10.8711L14.8565 5.82866ZM17.3072 6.89517C17.1707 6.65994 16.831 6.65995 16.6945 6.89516L13.7686 11.9376C13.1753 12.9601 12.1497 13.6579 10.9808 13.8345L6.1221 14.5683C5.81954 14.614 5.71341 14.996 5.94904 15.1912L9.48915 18.1242C10.5823 19.0298 11.0963 20.4584 10.8308 21.8529L9.83911 27.0606C9.78362 27.352 10.0895 27.5784 10.352 27.4402L15.1857 24.895C16.3219 24.2968 17.6798 24.2968 18.8159 24.895L23.6496 27.4402C23.9121 27.5784 24.218 27.352 24.1625 27.0606L23.1709 21.8529C22.9054 20.4584 23.4194 19.0298 24.5125 18.1242L28.0526 15.1912C28.2882 14.996 28.1821 14.614 27.8796 14.5683L23.0209 13.8345C21.8519 13.6579 20.8264 12.9601 20.2331 11.9376L17.3072 6.89517Z"
              fill="#84B59F"
            />
          </svg>
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

          <svg
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
          >
            <mask
              id="path-1-outside-1_4216_4637"
              maskUnits="userSpaceOnUse"
              x="6.5"
              y="3.66699"
              width="21"
              height="28"
              fill="black"
            >
              <rect fill="white" x="6.5" y="3.66699" width="21" height="28" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M21.1435 21.9919C21.2483 21.7491 21.3007 21.6276 21.3878 21.5204C21.4749 21.4131 21.6141 21.3149 21.8926 21.1186C24.0747 19.58 25.5 17.0399 25.5 14.167C25.5 9.47257 21.6944 5.66699 17 5.66699C12.3056 5.66699 8.5 9.47257 8.5 14.167C8.5 17.0399 9.92531 19.58 12.1074 21.1186C12.3859 21.3149 12.5251 21.4131 12.6122 21.5204C12.6993 21.6276 12.7517 21.7491 12.8565 21.9919C13.5647 23.6326 13.9936 25.3818 14.1241 27.1669C14.1658 27.737 14.1866 28.0221 14.3055 28.2238C14.3263 28.2589 14.3445 28.2861 14.3691 28.3187C14.5103 28.5055 14.7439 28.6223 15.2111 28.8559C16.3373 29.419 17.6627 29.419 18.7889 28.8559C19.2561 28.6223 19.4897 28.5055 19.6309 28.3187C19.6555 28.2861 19.6737 28.2589 19.6945 28.2238C19.8134 28.0221 19.8342 27.737 19.8759 27.1669C20.0064 25.3818 20.4353 23.6326 21.1435 21.9919Z"
              />
            </mask>
            <path
              d="M19.6309 28.3187L21.2264 29.5246L19.6309 28.3187ZM19.8759 27.1669L17.8812 27.0211L19.8759 27.1669ZM19.6945 28.2238L21.4171 29.2398L19.6945 28.2238ZM14.1241 27.1669L12.1294 27.3127L14.1241 27.1669ZM14.3055 28.2238L12.5829 29.2398L14.3055 28.2238ZM14.3691 28.3187L15.9646 27.1128L14.3691 28.3187ZM12.1074 21.1186L10.9549 22.7531L12.1074 21.1186ZM12.8565 21.9919L14.6928 21.1994L12.8565 21.9919ZM12.6122 21.5204L11.0596 22.7811L12.6122 21.5204ZM21.8926 21.1186L20.7401 19.484L21.8926 21.1186ZM21.3878 21.5204L19.8352 20.2596L21.3878 21.5204ZM23.5 14.167C23.5 16.3623 22.4136 18.304 20.7401 19.484L23.0451 22.7531C25.7358 20.8559 27.5 17.7176 27.5 14.167H23.5ZM17 7.66699C20.5899 7.66699 23.5 10.5771 23.5 14.167H27.5C27.5 8.368 22.799 3.66699 17 3.66699V7.66699ZM10.5 14.167C10.5 10.5771 13.4101 7.66699 17 7.66699V3.66699C11.201 3.66699 6.5 8.368 6.5 14.167H10.5ZM13.2599 19.484C11.5864 18.304 10.5 16.3623 10.5 14.167H6.5C6.5 17.7176 8.2642 20.8559 10.9549 22.7531L13.2599 19.484ZM16.1188 27.0211C15.972 25.0129 15.4894 23.0451 14.6928 21.1994L11.0203 22.7845C11.6399 24.2201 12.0152 25.7507 12.1294 27.3127L16.1188 27.0211ZM17.8944 27.067C17.3314 27.3486 16.6686 27.3486 16.1056 27.067L14.3167 30.6448C16.0059 31.4893 17.9941 31.4893 19.6833 30.6448L17.8944 27.067ZM19.3072 21.1994C18.5106 23.0451 18.028 25.0129 17.8812 27.0211L21.8706 27.3127C21.9848 25.7507 22.3601 24.2201 22.9797 22.7845L19.3072 21.1994ZM19.6833 30.6448C19.8874 30.5427 20.1496 30.4133 20.3712 30.2786C20.6178 30.1287 20.9447 29.8974 21.2264 29.5246L18.0354 27.1128C18.1029 27.0234 18.1715 26.9568 18.2254 26.9119C18.2745 26.871 18.3047 26.8538 18.2931 26.8608C18.2804 26.8685 18.2473 26.8876 18.1747 26.9254C18.102 26.9632 18.0154 27.0066 17.8944 27.067L19.6833 30.6448ZM17.8812 27.0211C17.8705 27.1679 17.8625 27.2767 17.8544 27.3691C17.8462 27.4617 17.8403 27.5106 17.8365 27.5354C17.8328 27.56 17.8354 27.5321 17.8526 27.4754C17.8715 27.4128 17.9074 27.3169 17.9718 27.2077L21.4171 29.2398C21.6647 28.8201 21.7501 28.4083 21.7918 28.1316C21.8312 27.8702 21.852 27.5665 21.8706 27.3127L17.8812 27.0211ZM21.2264 29.5246C21.297 29.4312 21.3577 29.3406 21.4171 29.2398L17.9718 27.2077C17.9776 27.1979 17.9881 27.1806 18.0023 27.1594C18.0166 27.1381 18.0285 27.1218 18.0354 27.1128L21.2264 29.5246ZM12.1294 27.3127C12.148 27.5665 12.1688 27.8702 12.2082 28.1316C12.2499 28.4083 12.3353 28.8201 12.5829 29.2398L16.0282 27.2077C16.0926 27.3169 16.1285 27.4128 16.1474 27.4754C16.1646 27.5321 16.1672 27.56 16.1635 27.5354C16.1597 27.5106 16.1538 27.4617 16.1456 27.3691C16.1375 27.2767 16.1295 27.1679 16.1188 27.0211L12.1294 27.3127ZM16.1056 27.067C15.9846 27.0066 15.898 26.9632 15.8253 26.9254C15.7527 26.8876 15.7196 26.8685 15.7069 26.8608C15.6953 26.8538 15.7255 26.871 15.7746 26.9119C15.8285 26.9568 15.8971 27.0234 15.9646 27.1128L12.7736 29.5246C13.0553 29.8974 13.3822 30.1287 13.6288 30.2786C13.8504 30.4133 14.1126 30.5427 14.3167 30.6448L16.1056 27.067ZM12.5829 29.2398C12.6423 29.3406 12.703 29.4312 12.7736 29.5246L15.9646 27.1128C15.9715 27.1218 15.9834 27.1381 15.9977 27.1594C16.0119 27.1806 16.0224 27.1979 16.0282 27.2077L12.5829 29.2398ZM10.9549 22.7531C11.0266 22.8037 11.0796 22.8411 11.1245 22.8733C11.1694 22.9056 11.193 22.9233 11.2051 22.9327C11.2171 22.942 11.2046 22.933 11.1796 22.91C11.1527 22.8851 11.109 22.8419 11.0596 22.7811L14.1648 20.2596C13.8585 19.8824 13.4212 19.5978 13.2599 19.484L10.9549 22.7531ZM14.6928 21.1994C14.6266 21.0459 14.4643 20.6285 14.1648 20.2596L11.0596 22.7811C11.043 22.7607 11.0271 22.7397 11.0121 22.7186C10.9972 22.6976 10.9844 22.678 10.9735 22.6605C10.9521 22.6261 10.9405 22.6029 10.9392 22.6003C10.9385 22.5989 10.9397 22.6014 10.9433 22.609C10.9469 22.6167 10.952 22.628 10.9592 22.6442C10.9664 22.6604 10.9749 22.6796 10.9852 22.7035C10.9957 22.7275 11.0069 22.7536 11.0203 22.7845L14.6928 21.1994ZM20.7401 19.484C20.5788 19.5978 20.1415 19.8824 19.8352 20.2596L22.9404 22.7811C22.891 22.8419 22.8473 22.8851 22.8204 22.91C22.7954 22.933 22.7829 22.942 22.7949 22.9327C22.807 22.9233 22.8306 22.9056 22.8755 22.8733C22.9204 22.8411 22.9734 22.8037 23.0451 22.7531L20.7401 19.484ZM22.9797 22.7845C22.9931 22.7536 23.0043 22.7275 23.0148 22.7035C23.0251 22.6796 23.0336 22.6604 23.0408 22.6442C23.048 22.628 23.0531 22.6167 23.0567 22.609C23.0603 22.6014 23.0615 22.5989 23.0608 22.6003C23.0595 22.6029 23.0479 22.6261 23.0265 22.6605C23.0156 22.678 23.0028 22.6976 22.9879 22.7186C22.9729 22.7397 22.957 22.7607 22.9404 22.7811L19.8352 20.2596C19.5357 20.6285 19.3734 21.0459 19.3072 21.1994L22.9797 22.7845Z"
              fill="#69A297"
              mask="url(#path-1-outside-1_4216_4637)"
            />
            <path
              d="M20.5423 23.375V23.375C18.2688 24.2844 15.7325 24.2844 13.459 23.375V23.375"
              stroke="#69A297"
            />
          </svg>
        </div>
        <p className="mb-4 text-lg text-stone-500">
          Pick the curated content you want to see most.
        </p>
        <div className="grid max-h-64 auto-rows-max grid-cols-2 gap-2 overflow-auto rounded-md border bg-white p-4">
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <ChemistryIcon className="w-5" />
            Chemistry
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <CeIcon className="w-6" />
            Chemical Eng.
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <MeIcon className="w-6" />
            Mechanical Eng.
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <MathIcon className="w-6" />
            Mathematics
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <PhysicsIcon className="w-6" />
            Physics
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <SociologyIcon className="w-6" />
            Sociology
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <CsIcon className="w-6" />
            Comp Sci.
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <EeIcon className="w-6" />
            Electrical Eng.
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <EnvSciIcon className="w-6" />
            Envir. Science
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <MedicineIcon className="w-6" />
            Medicine
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <PsyIcon className="w-6" />
            Psychology
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" value="Chemistry" className="mr-2" />
            <TechIcon className="w-6" />
            Technology
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section>
        <div className="flex items-center gap-1">
          <h3 className="text-xl font-semibold">SECURITY</h3>

          <svg
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
          >
            <circle
              cx="17.8827"
              cy="21.6473"
              r="8.47059"
              stroke="#69A297"
              stroke-width="1.88235"
            />
            <path
              d="M21.6465 14.1176L27.2935 7.17547M30.1171 3.76465L27.2935 7.17547M27.2935 7.17547L31.9994 11.2941"
              stroke="#69A297"
              stroke-width="1.88235"
              stroke-linecap="round"
            />
          </svg>
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

          <svg
            viewBox="0 0 21 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
          >
            <mask id="path-1-inside-1_4216_4680" fill="white">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.1353 3.89493C14.1353 2.24325 12.7964 0.904297 11.1447 0.904297C9.493 0.904297 8.15404 2.24325 8.15404 3.89493C8.15404 4.25559 7.92722 4.57372 7.5996 4.7245C3.88054 6.43615 1.20213 11.2409 1.20213 16.9005C1.20213 17.4674 1.22901 18.0257 1.28111 18.5732C1.30137 18.7861 1.2885 19.0011 1.23726 19.2088L0.605549 21.7681C0.32551 22.9027 1.18422 23.9991 2.35286 23.9991H5.60721C6.40174 23.9991 7.07141 24.5456 7.51247 25.2065C8.23797 26.2935 9.41161 26.9997 10.736 26.9997C12.0604 26.9997 13.234 26.2935 13.9595 25.2065C14.4006 24.5456 15.0703 23.9991 15.8648 23.9991H19.1992C20.387 23.9991 21.249 22.8689 20.9349 21.7234L20.2764 19.3223C20.2137 19.0936 20.198 18.8548 20.2227 18.6189C20.2816 18.0568 20.3121 17.4832 20.3121 16.9005C20.3121 11.9679 18.127 7.68473 15.0504 5.53255C14.5082 5.15324 14.1353 4.55665 14.1353 3.89493Z"
              />
            </mask>
            <path
              d="M20.2764 19.3223L21.7258 18.9248L20.2764 19.3223ZM7.51247 25.2065L8.76255 24.3721L7.51247 25.2065ZM0.605549 21.7681L2.06469 22.1283L0.605549 21.7681ZM1.28111 18.5732L-0.215059 18.7156L1.28111 18.5732ZM1.23726 19.2088L2.69639 19.5689L1.23726 19.2088ZM11.1447 -0.598628C13.6264 -0.598628 15.6382 1.4132 15.6382 3.89493H12.6324C12.6324 3.07329 11.9663 2.40722 11.1447 2.40722V-0.598628ZM6.65112 3.89493C6.65112 1.41321 8.66296 -0.598628 11.1447 -0.598628V2.40722C10.323 2.40722 9.65697 3.07329 9.65697 3.89493H6.65112ZM-0.300793 16.9005C-0.300793 10.8531 2.55928 5.38978 6.97125 3.35923L8.22795 6.08977C5.20179 7.48252 2.70506 11.6286 2.70506 16.9005H-0.300793ZM-0.215059 18.7156C-0.271669 18.1207 -0.300793 17.5149 -0.300793 16.9005H2.70506C2.70506 17.4199 2.72968 17.9307 2.77727 18.4308L-0.215059 18.7156ZM-0.853586 21.408L-0.221882 18.8486L2.69639 19.5689L2.06469 22.1283L-0.853586 21.408ZM5.60721 25.5021H2.35286V22.4962H5.60721V25.5021ZM10.736 28.5027C8.85228 28.5027 7.23343 27.4957 6.26238 26.0408L8.76255 24.3721C9.24251 25.0913 9.97095 25.4968 10.736 25.4968V28.5027ZM15.2096 26.0408C14.2386 27.4957 12.6197 28.5027 10.736 28.5027V25.4968C11.5011 25.4968 12.2295 25.0913 12.7095 24.3721L15.2096 26.0408ZM19.1992 25.5021H15.8648V22.4962H19.1992V25.5021ZM21.7258 18.9248L22.3843 21.3259L19.4855 22.1209L18.827 19.7198L21.7258 18.9248ZM21.815 16.9005C21.815 17.5356 21.7818 18.1615 21.7175 18.7754L18.728 18.4624C18.7814 17.9521 18.8092 17.4307 18.8092 16.9005H21.815ZM15.9119 4.30104C19.4549 6.77954 21.815 11.5617 21.815 16.9005H18.8092C18.8092 12.3742 16.799 8.58991 14.1889 6.76406L15.9119 4.30104ZM14.1889 6.76406C13.3272 6.16119 12.6324 5.13989 12.6324 3.89493H15.6382C15.6382 3.97342 15.6893 4.14529 15.9119 4.30104L14.1889 6.76406ZM18.827 19.7198C18.7105 19.295 18.6856 18.8671 18.728 18.4624L21.7175 18.7754C21.7105 18.8425 21.7169 18.8922 21.7258 18.9248L18.827 19.7198ZM19.1992 22.4962C19.3951 22.4962 19.5373 22.3098 19.4855 22.1209L22.3843 21.3259C22.9608 23.4279 21.3789 25.5021 19.1992 25.5021V22.4962ZM12.7095 24.3721C13.2814 23.5151 14.35 22.4962 15.8648 22.4962V25.5021C15.8257 25.5021 15.7491 25.513 15.6257 25.5972C15.4954 25.6859 15.3467 25.8354 15.2096 26.0408L12.7095 24.3721ZM5.60721 22.4962C7.12198 22.4962 8.19057 23.5151 8.76255 24.3721L6.26238 26.0408C6.12529 25.8354 5.97662 25.6859 5.84635 25.5972C5.72286 25.513 5.6463 25.5021 5.60721 25.5021V22.4962ZM2.06469 22.1283C2.0185 22.3154 2.16012 22.4962 2.35286 22.4962V25.5021C0.208313 25.5021 -1.36748 23.49 -0.853586 21.408L2.06469 22.1283ZM2.77727 18.4308C2.81219 18.7977 2.7915 19.1836 2.69639 19.5689L-0.221882 18.8486C-0.214497 18.8187 -0.209454 18.7745 -0.215059 18.7156L2.77727 18.4308ZM9.65697 3.89493C9.65697 4.90744 9.02689 5.72206 8.22795 6.08977L6.97125 3.35923C6.82754 3.42537 6.65112 3.60374 6.65112 3.89493H9.65697Z"
              fill="#69A297"
              mask="url(#path-1-inside-1_4216_4680)"
            />
            <path
              d="M16.0059 23.2484L5.56251 23.248"
              stroke="#69A297"
              stroke-width="1.50293"
            />
          </svg>
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
          <li className="flex h-16 items-center justify-between">
            Turn on automatic captions for audio and video content
            <ToggleSwitch id="auto-caption" />
          </li>
        </ul>
      </section>
    </div>
  );
}
