"use client";

import { StoryTopic, type User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from 'react';
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

{/* User left in for when full backend implementation is done*/ }

export default function BrainedArticleCarousel({
  user,
  articles,
}: {
  user: User;
  articles: ArticleItem[];
}) {
  const session = useSession();


  const [currentIndex, setCurrentIndex] = React.useState(0);

  {/*Move to the next item in carousel*/ }
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  return (
    <section className="flex min-h-[240px] flex-wrap overflow-hidden  bg-gradient-to-b from-sciquelTeal to-sciquelMuted2 relative rounded-t-2xl">
      {/* Dots */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center mb-4">
        <div className="dots-container flex justify-center">
          {articles.map((_, index) => (
            <span
              key={index}
              className={`dot w-4 h-4 rounded-full mx-1 ${index === currentIndex ? 'bg-sciquelGreen' : 'bg-white border'}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div className="flex items-center justify-center w-full">
        <div className="relative flex flex-col items-end justify-center h-[6.75rem] w-full">
          <div className="text-container mb-4 mr-2 w-[47.5%] flex justify-end">
            <p className="text-0.9xl text-black text-right ">REVISIT YOUR FAVORITED ARTICLE</p>
          </div>
          <div className="text-container mb-2 mr-2 w-[47.5%] flex justify-end">
            <p className="text-4xl font-semibold text-white text-right truncate">{articles[currentIndex].title}</p>
          </div>
          <div className="text-container w-full mb-4 mr-2 w-[47.5%] flex justify-end">
            <p className="text-sm text-white text-xl text-right">by {articles[currentIndex].author}</p>
          </div>
          <div className="flex justify-end">
            <ReadButton />
          </div>
        </div>
        {/* Next Button */}
        <button className="text-white text-2xl p-4 font-semibold rounded-full bg-transparent focus:outline-none" onClick={nextSlide}>
          <span>&gt;</span>
        </button>
      </div>
    </section>

  );
}



