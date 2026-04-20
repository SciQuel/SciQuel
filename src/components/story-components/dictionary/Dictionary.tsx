"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import audioIcon from "../../../../public/assets/images/audio.png";
import ArrowIcon from "../../../../public/assets/images/backArrow.svg";
import BookmarkIcon from "../../../../public/assets/images/bookmark-final.svg";
import closeButton from "../../../../public/assets/images/close.png";
import TriangleIcon from "../../../../public/assets/images/triangle.svg";
import { deepCloneDict, DictionaryContext } from "./DictionaryContext";

// async function getBookmark() {
//   //temp
//   return false;
// }

export default function Dictionary() {
  const fullDictionary = useContext(DictionaryContext);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const bookmarkRef = useRef<HTMLButtonElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);
  const [bookmark, setBookmark] = useState<boolean | undefined>(false);
  const keepOpen = useRef(10);

  const [top, setTop] = useState(16);

  useEffect(() => {
    if (fullDictionary?.open) {
      if (bookmarkRef.current) {
        bookmarkRef.current.focus();
      } else if (exitRef.current) {
        exitRef.current.focus();
      }
    } else {
      fullDictionary?.setSelectedInstance(null);
    }
  }, [fullDictionary?.open]);

  useEffect(() => {
    if (fullDictionary?.word) {
      setBookmark(fullDictionary.word.bookmarked);
    } else {
      fullDictionary?.setSelectedInstance(null);
    }
  }, [fullDictionary?.word]);

  useEffect(() => {
    console.log(sidebarRef.current);
    if (sidebarRef.current) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [sidebarRef.current]);

  useEffect(() => {
    if (fullDictionary?.dictionary) {
      // check if bookmarks need to be grabbed?
      const copyDict = deepCloneDict(fullDictionary.dictionary);

      copyDict.forEach((entry) => {
        if (entry.bookmarked === undefined) {
          entry.bookmarked = false;
        }
      });

      fullDictionary.setDictionary(copyDict);
    }

    const header = document.getElementById("outer-header");
    const headerObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          setTop(entry.contentRect.height);
        }
      }
    });
    if (header) {
      headerObserver.observe(header);
    }

    return () => {
      headerObserver.disconnect();
    };
  }, []);

  function handleClick(e: MouseEvent) {
    if (!sidebarRef.current?.contains(e.target as Node)) {
      fullDictionary?.setOpen(false);
    }
  }

  function handleScroll(e: Event) {
    if (keepOpen.current > 15) {
      fullDictionary?.setOpen(false);
    } else {
      keepOpen.current++;
      e.stopPropagation();
    }
  }

  function scrollToInstance(index: number) {
    keepOpen.current = 0;
    if (fullDictionary?.word?.instances[index]?.elementRef) {
      const elementRef = fullDictionary.word.instances[index].elementRef;

      elementRef.scrollIntoView({
        behavior: "instant",
        block: "center",
      });

      fullDictionary.setCloseFocus(elementRef);
    }
  }

  function toInstance(direction: "prev" | "next") {
    console.log("scroll to ", direction, " instance");
    console.log("current index is: ", fullDictionary?.selectedInstance?.index);

    if (fullDictionary?.word) {
      if (!fullDictionary.selectedInstance) {
        fullDictionary.setSelectedInstance({
          index: 0,
          instance: fullDictionary.word.instances[0].elementRef,
        });
        scrollToInstance(0);
      } else {
        const oldIndex = fullDictionary.selectedInstance.index;
        let newIndex;
        if (direction == "prev") {
          if (oldIndex > 0) {
            newIndex = oldIndex - 1;
          } else {
            newIndex = fullDictionary.word.instances.length - 1;
          }
        } else if (direction == "next") {
          newIndex = (oldIndex + 1) % fullDictionary.word.instances.length;
        } else {
          newIndex = oldIndex;
        }
        console.log("setting instance index to: ", newIndex);
        fullDictionary.setSelectedInstance({
          index: newIndex,
          instance: fullDictionary.word.instances[newIndex].elementRef,
        });
        scrollToInstance(newIndex);
      }
    }
  }

  if (fullDictionary) {
    return (
      <div
        tabIndex={1}
        ref={sidebarRef}
        className={`${
          fullDictionary?.open ? " flex " : " hidden "
        } fixed inset-y-0 right-0 z-10 h-screen w-screen flex-col justify-between self-end bg-sciquelCardBg md:w-96`}
      >
        {/* outer dictionary */}
        <div
          style={{
            paddingTop: `${top + 15}px`,
          }}
          className={`w-100 flex items-start justify-between px-4 pb-3`}
        >
          {/* header */}

          <div className="flex flex-row">
            {fullDictionary.previousWords &&
            fullDictionary.previousWords.length > 0 ? (
              <button
                type="button"
                className="h-8 w-9 overflow-hidden"
                onClick={() => {
                  const history = fullDictionary.previousWords
                    ? [...fullDictionary.previousWords]
                    : [];
                  if (history.length > 0) {
                    if (history[history.length - 1] == "fullDict") {
                      history.pop();
                      fullDictionary.setPreviousWords(history);
                      fullDictionary.setWord(null);
                    } else {
                      const next = history.pop();
                      if (typeof next == "object") {
                        fullDictionary.setWord(next);
                      } else {
                        fullDictionary.setWord(null);
                      }

                      fullDictionary.setPreviousWords(history);
                    }
                  } else {
                    fullDictionary.setPreviousWords(history);
                  }
                }}
              >
                <ArrowIcon className="h-full w-full object-fill" />{" "}
                <span className="sr-only">Go Back</span>
              </button>
            ) : (
              <></>
            )}

            {fullDictionary.word ? (
              <button
                ref={bookmarkRef}
                onClick={() => {
                  const copyDict = deepCloneDict(fullDictionary.dictionary);
                  if (fullDictionary.word?.id) {
                    if (bookmark) {
                      copyDict.forEach((entry) => {
                        if (entry.id == fullDictionary.word?.id) {
                          entry.bookmarked = false;
                        }
                      });

                      fullDictionary.setDictionary(copyDict);
                      setBookmark(false);
                    } else {
                      copyDict.forEach((entry) => {
                        if (entry.id == fullDictionary.word?.id) {
                          entry.bookmarked = true;
                        }
                      });
                      fullDictionary.setDictionary(copyDict);
                      setBookmark(true);
                    }
                  }
                }}
                type="button"
                className="-mt-5 me-auto ms-5 h-14 w-14"
              >
                <BookmarkIcon
                  className={`h-full w-full ${
                    bookmark
                      ? "first:fill-sciquelTeal"
                      : "first:fill-sciquelCardBg"
                  }`}
                />
                <span className="sr-only">
                  {bookmark
                    ? "remove bookmark from this definition"
                    : "bookmark this definition"}
                </span>
              </button>
            ) : (
              <></>
            )}
          </div>

          <button
            ref={exitRef}
            className={`p-1.5`}
            type="button"
            onClick={() => {
              if (fullDictionary.closeFocusElement) {
                fullDictionary.closeFocusElement.focus();
                fullDictionary.setCloseFocus(null);
              }
              console.log(fullDictionary.closeFocusElement);
              fullDictionary?.setOpen(false);
            }}
          >
            <Image
              className="opacity-75 hover:opacity-100"
              alt="close dictionary"
              src={closeButton}
              width={20}
              height={20}
            />
          </button>
        </div>
        <div className="flex-1 overflow-y-scroll overscroll-contain">
          {fullDictionary.word?.word ? (
            <div className="px-4 py-2 font-sourceSerif4">
              <div className="mb-3">
                {/*  border-b-2 border-sciquelTeal pb-3 */}
                <p className="text-sciquelCitation ">
                  Term{" "}
                  <button
                    type="button"
                    className="relative left-2 top-0.5 opacity-50"
                  >
                    <Image
                      width={15}
                      height={15}
                      src={audioIcon}
                      alt="listen to definition"
                    />
                  </button>
                </p>
                <p className="relative flex w-fit items-start pb-2 pt-0 text-start font-semibold">
                  {fullDictionary.word.word}
                </p>
                <div className="mb-3 mt-2 w-2/5 border-b-2 border-sciquelTeal" />
              </div>
              <p className="mt-2 text-sciquelCitation">
                Definition
                <button
                  type="button"
                  className="relative left-2 top-0.5 opacity-50"
                >
                  <Image
                    width={15}
                    height={15}
                    src={audioIcon}
                    alt="listen to definition"
                  />
                </button>
              </p>

              <p>{fullDictionary.word.definition}</p>

              <div className="my-3 w-1/4 border-b-2 border-sciquelTeal" />

              <p className="mt-2 text-sciquelCitation">
                In Context{" "}
                <button
                  type="button"
                  className="relative left-2 top-0.5 opacity-50"
                >
                  <Image
                    width={15}
                    height={15}
                    src={audioIcon}
                    alt="listen to definition"
                  />
                </button>
              </p>

              {fullDictionary.word.inContext.map((item, index) => (
                <div className="my-2 flex flex-row" key={`${item}-${index}`}>
                  <p className="my-0 flex-1">{item}</p>
                  {/* <button type="button" className="w-fit px-2">
                      <Image
                        width={15}
                        height={15}
                        src={audioIcon}
                        alt="listen to sentence"
                      />
                    </button> */}
                </div>
              ))}
              <div className="my-3 w-1/4 border-b-2 border-sciquelTeal" />
              <p className="text-sciquelCitation">
                Instances
                <button
                  type="button"
                  className="  ms-1 h-6 w-8 overflow-hidden p-0 align-middle"
                  onClick={() => {
                    toInstance("prev");
                  }}
                >
                  <TriangleIcon className="h-full w-full rotate-90" />
                  <span className="sr-only">
                    Scroll to previous instance of word
                  </span>
                </button>
                <button
                  type="button"
                  className="  ms-1 h-6 w-8 overflow-hidden p-0 align-middle"
                  onClick={() => {
                    toInstance("next");
                  }}
                >
                  <TriangleIcon className="h-full w-full -rotate-90" />
                  <span className="sr-only">
                    Scroll to next instance of word
                  </span>
                </button>
              </p>
              <p className="text-sm text-sciquelTeal">
                {fullDictionary.selectedInstance?.index
                  ? fullDictionary.selectedInstance.index + 1
                  : 1}{" "}
                of {fullDictionary.word.instances.length}
              </p>
              {fullDictionary.word.instances.map((item, index) => (
                <button
                  type="button"
                  className="my-2 text-start"
                  key={`${item.sentence}-${index}`}
                  onClick={() => {
                    if (fullDictionary.word?.instances) {
                      fullDictionary.setSelectedInstance({
                        index: index,
                        instance:
                          fullDictionary.word.instances[index].elementRef,
                      });
                      scrollToInstance(index);
                    }
                  }}
                >
                  {item.sentence}
                </button>
              ))}

              <div className="mx-auto my-2 w-1/5 border-b-2 border-sciquelTeal" />
              <button
                type="button"
                onClick={() => {
                  if (fullDictionary.word) {
                    if (fullDictionary.previousWords) {
                      fullDictionary.setPreviousWords([
                        ...fullDictionary.previousWords,
                        fullDictionary.word,
                      ]);
                    } else {
                      fullDictionary.setPreviousWords([fullDictionary.word]);
                    }
                  }

                  fullDictionary?.setWord(null);
                }}
                className="flex w-full items-center justify-center text-center font-sourceSerif4 text-sciquelCitation"
              >
                See more definitions {">"}
              </button>
            </div>
          ) : (
            <div className="mt-1">
              {" "}
              {fullDictionary.dictionary.map((item, index) => {
                return (
                  <div
                    className="px-4 py-2 font-sourceSerif4"
                    key={`${item.id}-${index}`}
                  >
                    <p className="text-sciquelCitation">Term</p>
                    <button
                      type="button"
                      onClick={() => {
                        fullDictionary?.setWord(item);

                        if (fullDictionary.previousWords) {
                          fullDictionary.setPreviousWords([
                            ...fullDictionary.previousWords,
                            "fullDict",
                          ]);
                        } else {
                          fullDictionary.setPreviousWords(["fullDict"]);
                        }
                      }}
                    >
                      {item.word}
                    </button>

                    <div className="mb-3 mt-4 w-1/4 border-b-2 border-sciquelTeal" />
                    <p className="text-sciquelCitation">Definition</p>
                    <p className="border-b-2 border-sciquelTeal pb-4">
                      {item.definition}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <></>;
}
