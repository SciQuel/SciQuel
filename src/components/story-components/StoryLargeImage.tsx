"use client";

import React, {
  MouseEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

function ExpandedImage({
  src,
  children,
  onOutsideClick,
}: PropsWithChildren<{ src: string; onOutsideClick: () => void }>) {
  const [zoomed, setZoomed] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleImageClick = (e: MouseEvent) => {
    e.stopPropagation();
    const img = imageRef.current;
    if (img) {
      const rect = img.getBoundingClientRect();
      const maxZoom = Math.min(
        img.naturalWidth / rect.width,
        img.naturalHeight / rect.height,
      );
      const { clientX: x, clientY: y } = e;
      img.style.transformOrigin = `${((x - rect.left) / rect.width) * 100}% ${
        ((y - rect.top) / rect.height) * 100
      }%`;

      img.style.transform = zoomed ? "scale(1)" : `scale(${maxZoom})`;
      setZoomed(!zoomed);
    }
  };

  const toggleCaption = (e: MouseEvent) => {
    e.stopPropagation();
    setIsCaptionExpanded(!isCaptionExpanded);
  };

  const renderCaption = () => {
    if (isCaptionExpanded) return children;

    const approximateLength = 150;

    let firstLine = "";
    let currentLength = 0;

    React.Children.forEach(children, (child) => {
      if (typeof child === "string" && currentLength < approximateLength) {
        for (let char of child) {
          if (currentLength < approximateLength) {
            firstLine += char;
            currentLength++;
          } else {
            break;
          }
        }
      }
    });

    if (firstLine.length < React.Children.toArray(children).join("").length) {
      firstLine += "...";
    }

    return firstLine;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-auto bg-white p-4"
      onClick={onOutsideClick}
    >
      {!zoomed && (
        <button
          className="absolute right-4 top-4 z-[101] flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-white focus:outline-none"
          onClick={onOutsideClick}
        >
          X
        </button>
      )}
      <div className="flex justify-center">
        <img
          ref={imageRef}
          src={src}
          className={`max-w-screen relative z-[10] max-h-[85vh] object-contain ${
            !zoomed ? "cursor-zoom-in" : " cursor-zoom-out"
          }`}
          onClick={handleImageClick}
        />
      </div>
      {!zoomed && (
        <figcaption
          className="absolute bottom-0 z-[20] mt-4 w-full cursor-pointer bg-white pb-4 text-center text-slate-800"
          onClick={toggleCaption}
        >
          {renderCaption()}
        </figcaption>
      )}
    </div>
  );
}

export default function StoryLargeImage({
  src,
  children,
}: PropsWithChildren<{ src: string }>) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex justify-center">
      <figure className="mx-auto table gap-2 p-8 lg:w-min lg:p-0">
        <img
          src={src}
          className="max-w-screen max-h-[900px] w-auto lg:max-w-[1000px]"
          onClick={() => setIsExpanded(true)}
        />
        <figcaption className="table-caption w-full caption-bottom px-8 lg:px-0">
          {children}
        </figcaption>
      </figure>
      {isExpanded && (
        <ExpandedImage src={src} onOutsideClick={() => setIsExpanded(false)}>
          {children}
        </ExpandedImage>
      )}
    </div>
  );
}
