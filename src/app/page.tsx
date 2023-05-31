"use client";

import ArticleCard from "@/components/ArticleCard/ArticleCard";
import MainCard from "@/components/MainCard/MainCard";
import MediaCard from "@/components/MediaCard/MediaCard";
import WhatsNewSection from "@/components/WhatsNewSection";
import API from "@/lib/api";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Home.module.css";

export default function Home() {
  const [podcastIndex, setPodcastIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(3);
  const [windowWidth, setWindowWidth] = useState(0);
  const touchStart = useRef([null, null]);
  const touchEnd = useRef([null, null]);

  const [staffPicksList, setStaffPicksList] = useState<any[]>([]);
  const [articleCardList, setArticleCardList] = useState<any[]>([]);
  const api = useMemo(() => new API(), []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("inside test useeffect");

    (async () => {
      try {
        const latestArticlesResponse = await api.getLatestArticles();
        if (
          latestArticlesResponse.status === 200 &&
          Array.isArray(latestArticlesResponse.data) &&
          latestArticlesResponse.data.length > 0
        ) {
          console.log("latest article list is: ", latestArticlesResponse.data);
          const tempLatestList = [];
          let numRecentArticles = 0;

          latestArticlesResponse.data.forEach((item, index) => {
            if (item.StoryType === "Article" && numRecentArticles < 6) {
              //PublishedDate is in format like:
              // "2022-11-01T13:00:00.000Z"

              numRecentArticles++;
              console.log("found ", numRecentArticles, " articles so far");

              const articleDate = new Date(item.PublishedDate);
              let articleDay = articleDate.getDate().toString();
              const articleMonth = articleDate.getMonth() + 1;
              const articleFullYear = articleDate.getFullYear();

              if (articleDate.getDate() < 10) {
                articleDay = "0" + articleDate.getDate();
              }

              tempLatestList.push({
                topic: item.Tags[0],
                title: item.StoryTitle,
                subtitle: item.StorySummary,
                author: item.AuthorName,
                date: `${articleMonth}/${articleDay}/${articleFullYear
                  .toString()
                  .slice(2, 4)}`,
                src: item.StoryCoverImg,
                href: `/stories/${articleFullYear}/${articleMonth}/${articleDay}/${item.StoryLink}`,
                mediaType: item.StoryType,
                style: { margin: "20px 10px 0 10px", minWidth: "auto" },
                key: item.StoryID,
              });
            }
          });

          setArticleCardList(tempLatestList);
        } else {
          setArticleCardList([]);
        }
      } catch (err) {
        setArticleCardList([]);
      }

      try {
        const staffPicksResponse = await api.getStaffPicks();
        console.log("staff picks list is: ", staffPicksResponse.data);
        if (
          staffPicksResponse.status === 200 &&
          Array.isArray(staffPicksResponse.data) &&
          staffPicksResponse.data.length > 0
        ) {
          const tempStaffPicksList = [];

          for (let i = 0; i < staffPicksResponse.data.length && i < 3; i++) {
            const item = staffPicksResponse.data[i];

            const articleDate = new Date(item.PublishedDate);
            let articleDay = articleDate.getDate().toString();
            const articleMonth = articleDate.getMonth() + 1;
            const articleFullYear = articleDate.getFullYear();

            if (articleDate.getDate() < 10) {
              articleDay = "0" + articleDate.getDate();
            }

            tempStaffPicksList.push({
              topic: item.Tags[0],
              title: item.StoryTitle,
              subtitle: item.StorySummary,
              author: item.AuthorName,
              date: `${articleMonth}/${articleDay}/${articleFullYear
                .toString()
                .slice(2, 4)}`,
              src: item.StoryCoverImg,
              link: `/stories/${articleFullYear}/${articleMonth}/${articleDay}/${item.StoryLink}`,
              mediaType: item.StoryType,
              key: item.StoryID,
            });
          }

          setStaffPicksList(tempStaffPicksList);
        } else {
          setStaffPicksList([]);
        }
      } catch (err) {
        setStaffPicksList([]);
      }
    })();
  }, [api]);

  // Get the windowWidth of the screen, this will determine how the carousel will look
  useEffect(() => {
    if (windowWidth <= 1023) {
      setCarouselIndex(1);
    } else {
      setPodcastIndex(Math.floor(podcastIndex / 3) * 3);
      setVideoIndex(Math.floor(videoIndex / 3) * 3);
      setCarouselIndex(3);
    }
  }, [windowWidth, podcastIndex, videoIndex]);

  // Temp articles list will need to be change
  const articles = [
    <ArticleCard
      key="article-card-1"
      topic="computer sci."
      title="Lights. Camera. Action! ASD ASD ASD ASD ASD ASD"
      subtitle="How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd
      asd asd asd asd asd asd asd asd asd asd asd asd asd "
      author="Edward Chen"
      date="05/27/21"
      thumbnailUrl="/assets/images/bobtail.png"
    />,
    <ArticleCard
      key="article-card-2"
      topic="astronomy"
      title="Lights. Camera. Action!"
      subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
      author="Edward Chen"
      date="05/27/21"
      thumbnailUrl="/assets/images/bobtail.png"
    />,
    <ArticleCard
      key="article-card-3"
      topic="astronomy"
      title="Lights. Camera. Action!"
      subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
      author="Edward Chen"
      date="05/27/21"
      thumbnailUrl="/assets/images/bobtail.png"
    />,
  ];

  // Temp podcasts list will need to be change
  const podcasts = [
    // <MediaCard
    //   key="media-card-1"
    //   topic="biology"
    //   title="Lights. Camera. Action! asd asd asd ASD ASD"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
    //   series="The Undercurrent"
    //   episode="3"
    //   media={require("./assets/placeholder-audio.mp3")}
    //   URL="#"
    //   id="audio1"
    // />,
    // <MediaCard
    //   key="media-card-2"
    //   topic="astronomy"
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd
    //   asd asd asd asd asd asd asd asd asd asd"
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/placeholder-audio.mp3")}
    //   URL="#"
    //   id="audio2"
    // />,
    // <MediaCard
    //   key="media-card-3"
    //   topic="environ. sci."
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/placeholder-audio.mp3")}
    //   URL="#"
    //   id="audio3"
    // />,
    // <MediaCard
    //   key="media-card-4"
    //   topic="mathematics"
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/placeholder-audio.mp3")}
    //   URL="#"
    //   id="audio4"
    // />,
    // <MediaCard
    //   key="media-card-5"
    //   topic="technology"
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/placeholder-audio.mp3")}
    //   URL="#"
    //   id="audio5"
    // />,
    // <MediaCard
    //   key="media-card-6"
    //   topic="chemistry"
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/placeholder-audio.mp3")}
    //   URL="#"
    //   id="audio6"
    // />,
    // <MediaCard
    //   key="media-card-7"
    //   topic="psychology"
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/placeholder-audio.mp3")}
    //   URL="#"
    //   id="audio7"
    // />,
  ];

  // Temp videos list will need to be change
  const videos = [
    // <MediaCard
    //   key="media-card-8"
    //   topic="biology"
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd
    //   asd asd asd asd asd asd asd asd asd asd"
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/rickroll.mp4")}
    //   URL="#"
    //   id="video1"
    // />,
    // <MediaCard
    //   key="media-card-9"
    //   topic="mathematics"
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/rickroll.mp4")}
    //   URL="#"
    //   id="video2"
    // />,
    // <MediaCard
    //   key="media-card-10"
    //   topic="psychology"
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/rickroll.mp4")}
    //   URL="#"
    //   id="video3"
    // />,
    // <MediaCard
    //   key="media-card-11"
    //   topic="technology"
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/rickroll.mp4")}
    //   URL="#"
    //   id="video4"
    // />,
    // <MediaCard
    //   key="media-card-12"
    //   topic="geology"
    //   title="Lights. Camera. Action!"
    //   subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
    //   series="The Undercurrent"
    //   episode="3"
    //   date="05/27/21"
    //   media={require("./assets/rickroll.mp4")}
    //   URL="#"
    //   id="video5"
    // />,
  ];

  /**
   * Handle the position of initial touch on carousel
   *
   * @param {} event
   * @param {string} type, either podcast or video carousel
   */
  const handleTouchStart = (event, type) => {
    switch (type) {
      case "podcast":
        touchStart.current[0] = event.targetTouches[0].clientX;
        break;

      case "video":
        touchStart.current[1] = event.targetTouches[0].clientX;
        break;

      default:
        break;
    }
  };

  /**
   * Handle the move of touch on carousel
   *
   * @param {*} event
   * @param {*} type, either podcast or video carousel
   */
  const handleTouchMove = (event, type) => {
    switch (type) {
      case "podcast":
        touchEnd.current[0] = event.targetTouches[0].clientX;
        break;

      case "video":
        touchEnd.current[1] = event.targetTouches[0].clientX;
        break;

      default:
        break;
    }
  };

  /**
   * Handle the touch end on carousel, and call the correct function depending on distance from
   * touch start and touch end.
   *
   * @param {string} type, either podcast or video carousel
   */
  const handleTouchEnd = (type: string) => {
    let start;
    let end;
    switch (type) {
      case "podcast":
        start = touchStart.current[0];
        end = touchEnd.current[0];
        break;

      case "video":
        start = touchStart.current[1];
        end = touchEnd.current[1];
        break;

      default:
        break;
    }

    const touchDistance = end - start;

    if (touchDistance > 0) {
      handelPrevClick(type);
    } else {
      handleNextClick(type);
    }

    touchStart.current = [null, null];
    touchEnd.current = [null, null];
  };

  /**
   * Render the circles between the prev and next button
   *
   * @param {number} active, the circle that will be have slighter darker color
   * @param {number} n
   * @returns JSX
   */
  const renderCircles = (active: number, n: number) => {
    const content = [];
    for (let i = 0; i < n / carouselIndex; i++) {
      if (active / carouselIndex === i) {
        content.push(
          <dt>
            <div
              className={clsx(styles["circles"], styles["circles_active"])}
            ></div>
          </dt>,
        );
      } else {
        content.push(
          <dt>
            <div className={styles["circles"]}></div>
          </dt>,
        );
      }
    }

    return content;
  };

  /**
   * Handel the next click of the pagination
   *
   * @param {string} type
   */
  const handleNextClick = (type: string) => {
    let temp = 0;
    if (carouselIndex === 1) {
      temp = 1;
    }
    switch (type) {
      case "podcast":
        if (podcastIndex + carouselIndex + temp > podcasts.length) {
          setPodcastIndex(0);
        } else {
          setPodcastIndex(podcastIndex + carouselIndex);
        }
        break;

      case "video":
        if (videoIndex + carouselIndex + temp > videos.length) {
          setVideoIndex(0);
        } else {
          setVideoIndex(videoIndex + carouselIndex);
        }
        break;

      default:
        break;
    }
  };

  /**
   * Handle the prev click of the pagination. NOTE: There is a bug where prev click call messed up
   * some codes
   *
   * @param {string} type
   */
  const handelPrevClick = (type: string) => {
    let temp = 0;
    if (carouselIndex === 1) {
      temp = 1;
    }

    switch (type) {
      case "podcast":
        if (podcastIndex - carouselIndex < 0) {
          setPodcastIndex(
            Math.floor(podcasts.length / carouselIndex) * carouselIndex - temp,
          );
        } else {
          setPodcastIndex(podcastIndex - carouselIndex);
        }
        break;

      case "video":
        if (videoIndex - carouselIndex < 0) {
          setVideoIndex(
            Math.floor(videos.length / carouselIndex) * carouselIndex - temp,
          );
        } else {
          setVideoIndex(videoIndex - carouselIndex);
        }
        break;
      default:
        break;
    }
  };

  /**
   * Render the prev and next buttons along with the circles to indicate number of page
   *
   * @param {string} type
   * @param {string} url
   * @param {number} index
   * @param {number} length
   * @returns JSX
   */
  const renderMore = (
    type: string,
    more,
    url: string,
    index: number,
    length: number,
  ): JSX.Element => {
    let MediaCards = [];

    switch (type) {
      case "podcast":
        MediaCards = podcasts;
        break;
      case "video":
        MediaCards = videos;
        break;
      default:
        break;
    }

    return (
      <>
        <div className={styles["browse_container"]}>
          <div className={styles["pagination_circles"]}>
            {MediaCards.length > carouselIndex ? (
              <>
                <button
                  onClick={() => handelPrevClick(type)}
                  className={styles["home_next_prev_button"]}
                >
                  <img src="/assets/images/prev_button.png" alt="left_button" />
                </button>
                <dl>{renderCircles(index, length)}</dl>
                <button
                  onClick={() => handleNextClick(type)}
                  className={styles["home_next_prev_button"]}
                >
                  <img src="/assets/images/next_icon.png" alt="left_button" />
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <a href={url} className={styles["browse_more"]}>
            <p>{more}</p>
            <img
              src="assets/images/arrow-right-circle.png"
              alt="arrow right circle"
            />
          </a>
        </div>
      </>
    );
  };

  const ans = ["1", "2", "3"];
  const answer1 = ["1", "1"];
  const answer2 = ["2"];
  const answer3 = ["3", "3"];

  return (
    <>
      {/* Article cards */}
      <div className="mx-[10%] mt-10">
        <WhatsNewSection />
      </div>
      <div className="mx-[10%] mt-10 h-fit" id="read-new">
        <p className={styles["home_new_section"]}>Read what&apos;s new</p>
        {/*Uncomment to see the quizes in homepage*/}
        {/*<MatchQuiz
        question ="???"
        answerOptions = {ans}
        answers1 = {answer1}
        answers2 = {answer2}
        answers3 = {answer3}
        />
        <OneMatchQuiz/>*/}
        <div className={styles["cards-container"]}>
          {articleCardList.length > 0 ? (
            <div className={styles["cards-list"]}>
              {articleCardList.map((item) => (
                <div
                  style={{ padding: 0 }}
                  className={styles["cards"]}
                  key={item.key}
                >
                  <ArticleCard
                    topic={item.topic}
                    title={item.title}
                    subtitle={item.subtitle}
                    author={item.author}
                    date={item.date}
                    src={item.src}
                    href={item.href}
                    mediaType={item.mediaType}
                    style={item.style}
                  ></ArticleCard>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
        {renderMore("article", "Read all recent", "#podcast", 0, 0)}
      </div>

      {/* Trending section */}
      <div className={styles["section"]} id="trending_section">
        <p className={styles["home_new_section"]}>Trending</p>
        <div className={styles["cards-container"]}>
          <div className={styles["cards-list"]} style={{ gap: "0" }}>
            {articles.map((article) => (
              <div style={{ padding: 0 }} className={styles["cards"]}>
                {article}
              </div>
            ))}
          </div>
          <div className={styles["cards-list"]}>
            <div className={styles["trending-col"]}>
              {/* <MediaCard
                style={{ marginBottom: 0 }}
                topic="chemistry"
                title="Lights. Camera. Action!"
                subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
                series="The Undercurrent"
                episode="3"
                date="05/27/21"
                media={require("./assets/placeholder-audio.mp3")}
                URL="#"
                id="trending-audio1"
              /> */}
              {/* <MediaCard
                style={{ marginBottom: 0 }}
                topic="psychology"
                title="Lights. Camera. Action!"
                subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
                series="The Undercurrent"
                episode="3"
                date="05/27/21"
                media={require("./assets/rickroll.mp4")}
                URL="#"
                id="trending-video1"
              /> */}
            </div>

            <div className={styles["trending-col"]}>
              {/* <MediaCard
                style={{ marginBottom: 0 }}
                topic="psychology"
                title="Lights. Camera. Action!"
                subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
                series="The Undercurrent"
                episode="3"
                date="05/27/21"
                media={require("./assets/rickroll.mp4")}
                URL="#"
                id="trending-video3"
              /> */}
              {/* <MediaCard
                style={{ marginBottom: 0 }}
                topic="chemistry"
                title="Lights. Camera. Action!"
                subtitle="How the Hawaiian bobtail squid brings a creative vision to its..."
                series="The Undercurrent"
                episode="3"
                date="05/27/21"
                media={require("./assets/placeholder-audio.mp3")}
                URL="#"
                id="trending-audio2"
              /> */}
            </div>
          </div>
        </div>
        {renderMore("Trending", "Browse all trending", "#trending", 0, 0)}
      </div>

      {/* Podcast cards*/}
      <div className={styles["section"]} id="new-podcasts">
        <p className={styles["home_new_section"]}>Listen what's new</p>
        <div className={styles["cards-container"]}>
          {/* <MediaMainCard
            title="What's Up Science"
            quote="We are the driver. Nowadays we have humans putting fire on everything."
            author="Edward Chen"
            media={require("./assets/placeholder-audio.mp3")}
            URL="#"
          /> */}
          <div
            className={styles["cards-list"]}
            onTouchStart={(e) => handleTouchStart(e, "podcast")}
            onTouchMove={(e) => handleTouchMove(e, "podcast")}
            onTouchEnd={() => handleTouchEnd("podcast")}
          >
            {podcasts
              .slice(podcastIndex, podcastIndex + carouselIndex)
              .map((podcast) => (
                <div className={styles["cards"]}>{podcast}</div>
              ))}
          </div>
          {renderMore(
            "podcast",
            "Browse podcasts",
            "#podcast",
            podcastIndex,
            podcasts.length,
          )}
        </div>
      </div>

      {/* <NewsletterSection></NewsletterSection> */}

      {/* Video section */}
      <div className={styles["section"]} id="new-videos">
        <p className={styles["home_new_section"]}>Watch what&apos;s new</p>
        <div className={styles["cards-container"]}>
          {/* <MediaMainCard
            title="What's Up Science"
            quote="We are the driver. Nowadays we have humans putting fire on everything."
            author="Edward Chen"
            media={require("./assets/rickroll.mp4")}
          /> */}
          <div
            onTouchStart={(e) => handleTouchStart(e, "video")}
            onTouchMove={(e) => handleTouchMove(e, "video")}
            onTouchEnd={() => handleTouchEnd("video")}
            className={styles["cards-list"]}
          >
            {videos
              .slice(videoIndex, videoIndex + carouselIndex)
              .map((video) => (
                <div className={styles["cards"]}>{video}</div>
              ))}
          </div>
          {renderMore(
            "video",
            "browse videos",
            "#video",
            videoIndex,
            videos.length,
          )}
        </div>
      </div>
      {/* Staff pick section */}
      {staffPicksList.length > 0 ? (
        <div className={styles["section"]} id="staff-picks">
          <p className={styles["home_new_section"]}>Read what's new</p>
          <div className={styles["cards-container"]}>
            {/* staff picks card list goes here  */}
            {staffPicksList.map((item, index) => {
              return (
                <StaffPicksCard
                  title={item.title}
                  subtitle={item.subtitle}
                  topic={item.topic}
                  author={item.author}
                  date={item.date}
                  src={item.src}
                  link={item.link}
                  mediaType={item.mediaType}
                  key={item.key}
                />
              );
            })}
          </div>

          <div
            style={{ width: "100%", display: "flex", justifyContent: "end" }}
          >
            <a
              href="#"
              className={styles["browse_more"]}
              style={{ marginRight: 0 }}
            >
              <p>Browse staff picks</p>
              <img
                src="/assets/images/arrow-right-circle.png"
                alt="arrow right circle"
              />
            </a>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
