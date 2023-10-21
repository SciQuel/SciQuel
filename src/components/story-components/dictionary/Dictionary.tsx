"use client";

import Image from "next/image";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import audioIcon from "../../../../public/assets/images/audio.png";
import ArrowIcon from "../../../../public/assets/images/backArrow.svg";
import DictionaryIcon from "../../../../public/assets/images/book.svg";
import BookmarkIcon from "../../../../public/assets/images/bookmark-final.svg";
import closeButton from "../../../../public/assets/images/close.png";
import TriangleIcon from "../../../../public/assets/images/triangle.svg";
import {
  DictionaryContext,
  type SelectedDefinition,
} from "./DictionaryContext";

async function getBookmark(word: string) {
  //temp
  return false;
}

export default function Dictionary() {
  const fullDictionary = useContext(DictionaryContext);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [bookmark, setBookmark] = useState<boolean | undefined>(false);
  const keepOpen = useRef(10);

  const [top, setTop] = useState(16);

  useEffect(() => {
    if (fullDictionary?.word) {
      setBookmark(fullDictionary.word.bookmarked);
    } else {
      fullDictionary?.setSelectedInstance(null);
    }
  }, [fullDictionary?.word]);

  useEffect(() => {
    if (fullDictionary?.dictionary) {
      // check if bookmarks need to be grabbed?
      let copyDict = Object.assign({}, fullDictionary.dictionary);
      const words = Object.keys(copyDict);

      words.forEach((word, index) => {
        if (copyDict[word].bookmarked === undefined) {
          (async () => {
            copyDict[word].bookmarked = await getBookmark(word);
            if (index == words.length - 1) {
              //we got all the words fixed?
              console.log("bookmarked? : ", copyDict);
              fullDictionary.setDictionary(copyDict);
            }
          })();
        }
      });
    }

    if (sidebarRef.current) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("scroll", handleScroll);
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
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("scroll", handleScroll);
      headerObserver.disconnect();
    };
  }, []);

  function handleClick(e: MouseEvent) {
    if (!sidebarRef.current?.contains(e.target as Node)) {
      fullDictionary?.setOpen(false);
    }
  }

  function handleScroll(e: Event) {
    console.log("keep open is: ", keepOpen.current);
    if (keepOpen.current > 15) {
      fullDictionary?.setOpen(false);
    } else {
      keepOpen.current++;
    }
  }

  function scrollToInstance(instance: string) {
    keepOpen.current = 0;
    fullDictionary?.word?.instances[instance]?.scrollIntoView({
      behavior: "instant",
      block: "center",
    });
  }

  function toInstance(direction: "prev" | "next") {
    console.log("scroll to ", direction, " instance");
    console.log("current index is: ", fullDictionary?.selectedInstance?.index);
    if (fullDictionary?.word) {
      const instanceList = Object.keys(fullDictionary.word.instances);

      if (!fullDictionary.selectedInstance && instanceList) {
        // not in list yet, so start list?
        fullDictionary.setSelectedInstance({
          index: 0,
          instance: fullDictionary.word.instances[instanceList[0]],
        });
        scrollToInstance(instanceList[0]);
      } else if (typeof fullDictionary.selectedInstance?.index == "number") {
        const oldIndex = fullDictionary.selectedInstance.index;
        let newIndex;
        if (direction == "prev") {
          if (oldIndex > 0) {
            newIndex = oldIndex - 1;
          } else {
            newIndex = instanceList.length - 1;
          }
        } else if (direction == "next") {
          //  && oldIndex < instanceList.length - 1
          newIndex = (oldIndex + 1) % instanceList.length;
          // newIndex = oldIndex + 1;
        } else {
          newIndex = oldIndex;
        }
        console.log("setting instance index to: ", newIndex);
        fullDictionary.setSelectedInstance({
          index: newIndex,
          instance: fullDictionary.word.instances[instanceList[newIndex]],
        });
        scrollToInstance(instanceList[newIndex]);
      }
    }
  }

  if (fullDictionary) {
    return (
      <>
        <div
          tabIndex={1}
          ref={sidebarRef}
          className={`${
            fullDictionary.open ? " flex " : " hidden "
          } fixed inset-y-0 right-0 z-10 h-screen w-screen flex-col justify-between self-end border-sciquelTeal bg-sciquelCardBg md:w-96`}
        >
          {/* outer dictionary */}
          <div
            style={{
              paddingTop: `${top + 30}px`,
            }}
            className={`w-100 flex items-start justify-between px-4 pb-3`}
          >
            {/* header */}
            <div className="flex flex-row items-start">
              {fullDictionary.previousWords &&
              fullDictionary.previousWords.length > 0 ? (
                <button
                  type="button"
                  className="h-8 w-9 overflow-hidden"
                  onClick={() => {
                    let history = fullDictionary.previousWords
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
                bookmark ? (
                  <button
                    onClick={async () => {
                      console.log("removing bookmark");
                      let copyDict = Object.assign(
                        {},
                        fullDictionary.dictionary,
                      );
                      if (fullDictionary.word?.word) {
                        copyDict[fullDictionary.word.word].bookmarked = false;
                        fullDictionary.setDictionary(copyDict);
                        setBookmark(false);
                      }
                    }}
                    type="button"
                    className="mx-8 -mt-16 h-36 w-16"
                  >
                    <BookmarkIcon className="h-full w-full first:fill-sciquelTeal" />
                    <span className="sr-only">Remove bookmark</span>
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      console.log("adding bookmark");
                      let copyDict = Object.assign(
                        {},
                        fullDictionary.dictionary,
                      );
                      if (fullDictionary.word?.word) {
                        copyDict[fullDictionary.word.word].bookmarked = true;
                        fullDictionary.setDictionary(copyDict);
                        setBookmark(true);
                      }
                    }}
                    type="button"
                    className="mx-8 -mt-16 h-36 w-16"
                  >
                    <BookmarkIcon className="h-full w-full first:fill-transparent" />
                    <span className="sr-only">Bookmark this word</span>
                  </button>
                )
              ) : (
                <></>
              )}
            </div>

            <button
              className={`p-1.5`}
              type="button"
              onClick={() => {
                fullDictionary.setOpen(false);
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
          <div className="flex-1 overflow-y-scroll">
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
                  <p className="relative flex w-fit items-start pb-2 pt-3 text-start font-semibold">
                    {fullDictionary.word.word}
                  </p>
                  <div className="my-3 w-2/5 border-b-2 border-sciquelTeal" />

                  {/* <p className="whitespace-pre-line pb-4 text-center">
                    {fullDictionary.word.pronunciation}
                  </p> */}
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
                {Object.keys(fullDictionary.word.instances).map(
                  (item, index) => (
                    <button
                      type="button"
                      className="my-2 text-start"
                      key={item}
                      onClick={() => {
                        if (fullDictionary.word?.instances[item]) {
                          fullDictionary.setSelectedInstance({
                            index: index,
                            instance: fullDictionary.word.instances[item],
                          });
                          scrollToInstance(item);
                        }
                      }}
                    >
                      {item}
                    </button>
                  ),
                )}

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
              Object.keys(fullDictionary.dictionary).map((item, index) => {
                return (
                  <div
                    className="px-4 py-2 font-sourceSerif4"
                    key={`${item}-${index}`}
                  >
                    <p className="text-sciquelCitation">Term</p>
                    <button
                      type="button"
                      onClick={() => {
                        const copyWord = Object.assign(
                          {},
                          fullDictionary.dictionary[item],
                        ) as SelectedDefinition;
                        copyWord.word = item;

                        fullDictionary?.setWord(copyWord);

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
                      {item}
                    </button>

                    <div className="mb-2 mt-1 w-2/5 border-b-2 border-sciquelTeal" />
                    <p className="text-sciquelCitation">Definition</p>
                    <p className="border-b-2 border-sciquelTeal py-2">
                      {fullDictionary.dictionary[item].definition}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <button
          type="button"
          tabIndex={0}
          onClick={() => {
            fullDictionary.setOpen(true);
            fullDictionary.setWord(null);
            fullDictionary.setPreviousWords([]);
          }}
          className="fixed bottom-0 right-0 mx-10 my-8 flex h-fit w-fit flex-row items-center rounded-full border-4 border-sciquelTeal bg-sciquelCardBg px-5 py-2"
        >
          {/* "open dictionary" floater */}
          <span className="font- alegreyaSansSC text-xl font-bold text-sciquelTeal">
            Dictionary
          </span>{" "}
          <DictionaryIcon className="ms-2 h-8 w-8" />
        </button>
      </>
    );
  }

  return <></>;
}
