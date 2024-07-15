//TODO : Do Types, adjust image without messing up aspect ratio
//new to next.js, is it fine if i use client rendering instead to be able to access hooks and interactivity
"use client";

import { MouseEvent, useRef, useState, type PropsWithChildren } from "react";
import StoryImagePopup from "./StoryImagePopup";

interface Props {
  src: string;
  alt?: string;
}

export default function StoryLargeImage({
  src,
  alt,
  children,
}: PropsWithChildren<Props>) {
  const [isClicked, setIsClicked] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const divTarget = e.target as HTMLDivElement;
    if (isClicked) {
      console.log(e.target);
      if (imageRef.current && !imageRef.current.contains(divTarget) && captionRef.current && !captionRef.current.contains(divTarget)) {
        setIsClicked(false);
      }
    } else {
      setIsClicked(!isClicked);
    }
  };

  return (
    <>
      {isClicked ? (
        <StoryImagePopup
          src={src}
          children={children}
          handleClick={handleClick}
          imageRef={imageRef}
          captionRef = {captionRef}
          alt={alt}
        />
      ) : (
        <div className="flex justify-center hover:cursor-pointer">
          <figure className="mx-auto table gap-2 p-8 lg:w-min lg:p-0">
            <img
              src={src}
              className="max-w-screen max-h-[900px] w-auto lg:max-w-[1000px]"
              alt={alt}
              onClick={handleClick}
            />
            <figcaption className="table-caption w-full caption-bottom px-8 lg:px-0 cursor-default">
              {children}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
