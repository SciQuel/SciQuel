"use client";

import { useState } from "react";

export default function NotFound() {
  const backgroundImageArray = [
    `url(/assets/images/explore-articles-button.svg)`, 
    `url(/assets/images/contact-us-button.svg)`,
    `url(/assets/images/home-button.svg)`
  ];
  const [selected, setSelected] = useState(0);

  const stars = Array.from({ length: 100 });

  return (
    <div className="flex min-h-screen justify-evenly bg-[#0E3648] align-middle text-white">
      <div className="absolute inset-0 overflow-hidden">
      {stars.map((_, i) => {
        const size = Math.random() * 2 + 1;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: size,
              height: size,
              backgroundColor: "white",
              borderRadius: "50%",
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        );
      })}
    </div>
      <div id="not-found-left" className="flex flex-col justify-center items-center gap-10 flex-1">
        <span className="text-[96px]">404</span>
        <div className="flex flex-col items-center">
          <p>We can't seem to find what you're looking for.</p>
          <p>Let's explore other ways to help.</p>
        </div>
        <div className="flex justify-evenly">
          <button
            className="w-32 h-32
              rounded-full
              bg-[url('/assets/images/home-button.svg')]
              bg-no-repeat bg-center bg-cover
              flex items-center justify-center
              text-white font-medium"
            style={{ backgroundImage: backgroundImageArray[0] }}
            onClick={() => setSelected(0)}
          >
            EXPLORE<br/>
            ARTICLES
          </button>
          <button
            className="w-32 h-32
              rounded-full
              bg-[url('/assets/images/home-button.svg')]
              bg-no-repeat bg-center bg-cover
              flex items-center justify-center
              text-white font-medium"
            style={{ backgroundImage: backgroundImageArray[1] }}
            onClick={() => setSelected(1)}
          >
            CONTACT
            <br/>
            US
          </button>
          <button
            className="w-32 h-32
              rounded-full
              bg-[url('/assets/images/home-button.svg')]
              bg-no-repeat bg-center bg-cover
              flex items-center justify-center
              text-white font-medium"
            style={{ backgroundImage: backgroundImageArray[2] }}
            onClick={() => setSelected(2)}
          >
            GO<br/>
            HOME
          </button>
        </div>
      </div>

      <div id="not-found-right" className="flex flex-col justify-center items-center flex-1">
        <div className="bg-cover aspect-square overflow-hidden"
          style={{ backgroundImage: backgroundImageArray[selected] }}>
          <div className="flex flex-col justify-center items-center h-full w-full p-40 text-black font-black">
            <h1>Most Popular Articles</h1>
            <button>Sample</button>
            <button>Sample</button>
            <button>Sample</button>
            <span className="hover:cursor-pointer hover:underline">Explore More Articles</span>
          </div>
        </div>
      </div>
    </div>
  );
}
