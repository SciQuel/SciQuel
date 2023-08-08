"use client"

import {PrintContext,  } from "./PrintContext";
import { useEffect, useRef, useState, useContext } from "react";

import { type PropsWithChildren } from "react";

export default function StoryH1({ children }: PropsWithChildren<unknown>) {
  const isPrintMode = useContext(PrintContext);


  return (
    <h1 className={`${isPrintMode ? "font-sourceSerif4 text-3xl" : "text-sciquelTeal text-4xl "} mx-auto w-full font-medium  md:w-[720px]`}>
      {children}
    </h1>
  );
}
