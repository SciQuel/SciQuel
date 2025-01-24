"use client";

import { useEffect, useRef, useState, type PropsWithChildren } from "react";
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
  const captionRef = useRef<HTMLParagraphElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isSmallMargin, setSmallMargin] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the margin is small enough to open the popup
    const checkMargin = () => {
      if (!imageContainerRef.current?.parentElement) return;
      const parentElementStyle = window.getComputedStyle(
        imageContainerRef.current?.parentElement,
      );

      console.log(parentElementStyle);

      const marginLeft = parseInt(
        parentElementStyle.getPropertyValue("margin-left"),
        10,
      );
      const marginRight = parseInt(
        parentElementStyle.getPropertyValue("margin-right"),
        10,
      );

      console.log(marginLeft, marginRight);

      console.log(marginLeft <= 8 && marginLeft > 0);

      if (
        (marginLeft <= 8 && marginLeft > 0) ||
        (marginRight <= 8 && marginRight > 0)
      ) {
        setSmallMargin(true);
      } else {
        setSmallMargin(false);
      }
    };

    checkMargin();
    window.addEventListener("resize", checkMargin);

    return () => {
      window.removeEventListener("resize", checkMargin);
    };
  }, []);

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    setIsMobile(isMobile);
  }, []);

  /*Handling click on the popup div and the image div where image is on article page . If the div is clicked
  when the popup is up, it checks if it outisde the image, if it is it closes the popup, otherwise it will use handleImageClick defined
  in other file. When the popup is not already up, 
  it will only open the popup
*/
  const handleClick = () => {
    if (isSmallMargin) return;
    setIsClicked(!isClicked);
  };

  return (
    <>
      {isClicked && (
        <StoryImagePopup
          src={src}
          children={children}
          handleClick={handleClick}
          captionRef={captionRef}
          alt={alt}
          isClicked={isClicked}
          setIsClicked={setIsClicked}
          isMobile={isMobile}
          isSmallMargin={isSmallMargin}
        />
      )}
      <div
        className="flex justify-center hover:cursor-pointer"
        ref={imageContainerRef}
      >
        <figure className="mx-auto table gap-2 p-8 lg:w-min lg:p-0">
          <img
            src={src}
            className="max-w-screen max-h-[900px] w-auto lg:max-w-[1000px]"
            alt={alt}
            onClick={handleClick}
          />
          <figcaption className="table-caption w-full caption-bottom cursor-default px-8 lg:px-0">
            {children}
          </figcaption>
        </figure>
      </div>
    </>
  );
}
