"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import ShareIcon from "../../../../public/assets/images/story-share.png";
import { StoryScrollContext } from "../scroll/ScrollProvider";
import { DictionaryContext } from "./DictionaryContext";

interface Props {
  observe: boolean;
}

export default function DictionaryButton({ observe }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const Dictionary = useContext(DictionaryContext);
  const ScrollList = useContext(StoryScrollContext);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (buttonRef.current && observe) {
      console.log("dict button top is: ", buttonRef.current.offsetTop);
      document.addEventListener("scroll", onScroll);
      ScrollList?.setDictButtonTop(
        buttonRef.current.getBoundingClientRect().top,
      );
    }

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (observe) {
      // console.warn("scroll list updated: ", ScrollList?.inViewElements);
      if (ScrollList && ScrollList.inViewElements.length > 0) {
        let maxOverflow = 0;
        ScrollList.inViewElements.forEach((item) => {
          if (item.maxOffset > maxOverflow) {
            maxOverflow = item.maxOffset;
          }
        });
        if (maxOverflow != offset) {
          setOffset(maxOverflow);
        }
      } else {
        setOffset(0);
      }
    }
  }, [ScrollList, offset]);

  // useEffect(() => {
  //   console.log("scroll list updated! ", ScrollList?.inViewElements);
  // }, [ScrollList]);

  function onScroll() {
    if (buttonRef.current) {
      ScrollList?.setDictButtonTop(
        buttonRef.current.getBoundingClientRect().top,
      );
      ScrollList?.setDictButtonHeight(
        buttonRef.current.getBoundingClientRect().height,
      );
    }
  }

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={() => {
        if (Dictionary) {
          Dictionary?.setOpen(true);
          Dictionary.setWord(null);
          Dictionary.setCloseFocus(buttonRef.current);
          Dictionary.setPreviousWords([]);
        }
      }}
      style={{
        transform: `translateX(${offset * -1}px)`,
      }}
      className="pointer-events-auto relative  block h-fit w-fit rounded-full px-3 py-0.5 xl:sticky xl:top-28"
    >
      <Image src={ShareIcon} alt={"open dictionary"} width={45} height={45} />
    </button>
  );
}
