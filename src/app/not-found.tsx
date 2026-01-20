"use client";

import { useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const backgroundImageArray = [
    `url(/assets/images/explore-articles-button.svg)`, 
    `url(/assets/images/contact-us-button.svg)`,
    `url(/assets/images/home-button.svg)`
  ];
  const [selected, setSelected] = useState(0);

  function renderContent() {
    switch (selected) {
      case 0:
        return <div className="flex flex-col justify-center items-center h-full w-full p-40 text-black font-black">
            <h1>Most Popular Articles</h1>
            <button>Sample</button>
            <button>Sample</button>
            <button>Sample</button>
            <span className="hover:cursor-pointer hover:underline">Explore More Articles</span>
          </div>
      case 1:
        return <div className="flex flex-col justify-center items-center h-full w-full p-40 gap-4">
          <p>Couldn't find what you were looking for? Let us know so we can fix it!</p>
          <form className="flex flex-col justify-center items-center gap-4">
            <div className="bg-white rounded-lg text-black flex flex-col items-center justify-center p-4 gap-2">
              <span className="">Describe what you were looking for.</span>
              <textarea className="bg-slate-300 rounded-lg w-full" style={{resize:"none"}}></textarea>
            </div>
            <button className="bg-white rounded-full text-black px-4">Submit</button>
          </form>
        </div>
      case 2:
        return <div className="flex justify-normal items-center h-full w-full p-40">
          <span>Loading...</span>
        </div>
    }
  }

  const stars = Array.from({ length: 100 });

  return (
    <div className="flex min-h-screen justify-evenly bg-[#0E3648] align-middle text-white">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden z-10">
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
      {/* Left */}
      <div id="not-found-left" className="flex flex-col justify-center items-center gap-10 flex-1 z-20">
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
          <Link href="/">
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
          </Link>
        </div>
      </div>

      {/* Right */}
      <div id="not-found-right" className="flex flex-col justify-center items-center flex-1 z-20">
        <div className="bg-cover aspect-square overflow-hidden"
          style={{ backgroundImage: backgroundImageArray[selected] }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
