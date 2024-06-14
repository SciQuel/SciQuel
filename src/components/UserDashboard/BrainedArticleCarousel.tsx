"use client";

import React from "react";
import ReadButton from "./ReadButton";

interface ArticleItem {
  title: string;
  description?: string;
  date: string;
  subtitle?: string;
  image: string;
  type: string;
  author?: string;
}

{
  /* User left in for when full backend implementation is done*/
}

export default function BrainedArticleCarousel({
  articles,
}: {
  articles: ArticleItem[];
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  {
    /*Move to the next item in carousel*/
  }
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  return (
    <section className="relative flex min-h-[240px] flex-wrap  overflow-hidden rounded-t-2xl bg-gradient-to-b from-sciquelTeal to-sciquelMuted2">
      {/* Dots */}
      <div className="absolute bottom-0 left-0 mb-4 flex w-full justify-center">
        <div className="dots-container flex justify-center">
          {articles.map((_, index) => (
            <span
              key={index}
              className={`dot mx-1 h-4 w-4 rounded-full ${
                index === currentIndex ? "bg-sciquelGreen" : "border bg-white"
              }`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div className="flex w-full items-center justify-center">
        <div className="relative flex h-[6.75rem] w-full flex-col items-end justify-center">
          <div className="text-container mb-4 mr-2 flex w-[47.5%] justify-end">
            <p className="text-0.9xl text-right text-black ">
              REVISIT YOUR FAVORITED ARTICLE
            </p>
          </div>
          <div className="text-container mb-2 mr-2 flex w-[47.5%] justify-end">
            <p className="truncate text-right text-4xl font-semibold text-white">
              {articles[currentIndex].title}
            </p>
          </div>
          <div className="text-container mb-4 mr-2 flex w-[47.5%] w-full justify-end">
            <p className="text-right text-sm text-xl text-white">
              by {articles[currentIndex].author}
            </p>
          </div>
          <div className="flex justify-end">
            <ReadButton />
          </div>
        </div>
        {/* Next Button */}
        <button
          className="rounded-full bg-transparent p-4 text-2xl font-semibold text-white focus:outline-none"
          onClick={nextSlide}
        >
          <span>&gt;</span>
        </button>
      </div>
    </section>
  );
}
