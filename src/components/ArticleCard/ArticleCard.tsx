import React, { useEffect, useReducer, useRef, useState } from "react";
import "./ArticleCard.css";
import { TopicTag } from "../TopicTag/TopicTag";

const ArticleCard = (props) => {
  const [titleHeight, setTitleHeight] = useState(90);

  const [titleLineClamp, setTitleLineClamp] = useState(3);

  //if I recall, this is in a useReducer because it needs access to
  //current titleHeight
  //and we don't want to rerun the useEffect with the listener every time titleHeight changes
  const [subtitleLineClamp, dispatchSubtitleLineClamp] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "middle resize":
          // console.log(
          //   "space left in middle is ",
          //   action.newHeight - titleHeight
          // );

          const spaceLeft = action.newHeight - titleHeight - 3;
          // the 3px is for the margin between title and subtitle

          const numSubtitleLines = Math.floor(spaceLeft / 20);
          return numSubtitleLines;

        case "direct update":
          return action.newValue;

        default:
          console.error(
            "unknown action type in subtitlelineclamp usereducer!!!!",
          );
          return state;
      }
    },
    null,
  );

  const titleRef = useRef(null);
  const middleRef = useRef(null);
  const middleHeightRef = useRef(0);
  const middleWidthRef = useRef(0);
  const [imgCanExpand, setImgCanExpand] = useState(false);
  const [imgHeight, setImgHeight] = useState(null);

  useEffect(() => {
    //we can see how big the title is
    //one line should be height 30 always
    //so num lines are height of title/30

    //using this resizeObserver to grab title height
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setTitleHeight(entry.contentRect.height);
        }
      }
    });
    resizeObserver.observe(titleRef.current);

    //this grabs middleContent div's height
    const resizeObserverMiddle = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          middleHeightRef.current = entry.contentRect.height;
          middleWidthRef.current = entry.contentRect.width;
          setImgHeight(entry.contentRect.width / 3);

          if (entry.contentRect.width >= 420) {
            setImgCanExpand(true);
          } else {
            setImgCanExpand(false);
          }

          if (entry.contentRect.height < 60) {
            //if middle can't fit two lines,
            //give title one line
            //console.log("we have space for only one line");
            setTitleLineClamp(1);
          } else if (entry.contentRect.height < 91) {
            //if middle can't fit 3 lines
            //give title two lines
            // console.log("We have space for 2 lines");
            setTitleLineClamp(2);
          } else if (entry.contentRect.height >= 91) {
            //lastly, if we have space, give title 3 lines
            // console.log("we have space for 3 lines");
            setTitleLineClamp(3);
          }

          dispatchSubtitleLineClamp({
            type: "middle resize",
            newHeight: entry.contentRect.height,
          });
        }
      }
    });
    resizeObserverMiddle.observe(middleRef.current);

    return () => {
      resizeObserver.disconnect();
      resizeObserverMiddle.disconnect();
    };
  }, []);

  useEffect(() => {
    //updates subtitle when title changes

    const spaceLeft = middleHeightRef.current - titleHeight - 3;
    // the 3px is for the margin between title and subtitle

    const numSubtitleLines = Math.floor(spaceLeft / 20);

    dispatchSubtitleLineClamp({
      type: "direct update",
      newValue: numSubtitleLines,
    });
  }, [titleHeight]);

  return (
    <a
      className="article-card-outer"
      href={props.href}
      style={{
        height: `calc( 2.5rem + ${middleWidthRef.current} )`,
        ...props.style,
      }}
      //
    >
      <div
        className="article-card-content"
        style={imgCanExpand ? { height: "280px" } : { flex: 1, minHeight: 0 }}
      >
        <div className="article-card-top-section">
          <TopicTag name={props.topic} />
          <p className="article-card-articleSignifier">
            {props.mediaType ? props.mediaType.toUpperCase() : "ARTICLE"}
          </p>
        </div>
        <div
          className="article-card-middle-content"
          ref={middleRef}
          // style={{ backgroundColor: "lime" }}
        >
          <div
            className="article-card-articleTitleContent"
            style={{ height: titleHeight }}
          >
            <h1
              className="article-card-articleTitle"
              style={{
                WebkitLineClamp: titleLineClamp,
                lineClamp: titleLineClamp,
              }}
              ref={titleRef}
            >
              {props.title}
            </h1>
          </div>
          <div className="article-card-articleSubTitleContent">
            {subtitleLineClamp ? (
              <p
                className="article-card-articleSubtitle"
                style={{
                  WebkitLineClamp: subtitleLineClamp,
                  lineClamp: subtitleLineClamp,
                  maxHeight: `calc( 20px * ${subtitleLineClamp} + ( 1.25rem - 1em ) )`,
                }}
              >
                {props.subtitle}
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>
        <p className="article-card-authorDate">
          By {props.author}
          <span style={{ float: "right" }}>{props.date}</span>
        </p>
      </div>
      <img
        style={
          imgCanExpand
            ? { width: "100%", height: `calc( 100% - 280px )` }
            : imgHeight
            ? { width: "100%", height: imgHeight }
            : { width: "100%", aspectRatio: "3/1" }
        }
        className="article-card-img"
        src={props.src}
        alt=""
      ></img>
    </a>
  );
};

export default ArticleCard;
