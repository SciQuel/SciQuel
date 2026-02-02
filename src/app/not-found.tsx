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
        return (
          <div className="flex flex-col justify-center items-center text-black font-black gap-2 w-3/5 h-3/5">
            <h1>Most Popular Articles</h1>
            {Array.from({ length: 3 }).map((_, i) => {
              return <div key="i" className="bg-white w-full rounded-lg text-center p-6">[article card]</div>;
            })}
            <span className="hover:cursor-pointer hover:underline">Explore More Articles</span>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col justify-center items-center gap-4 w-3/5 h-3/5 text-center">
            <p className="mx-8">Couldn't find what you were looking for? Let us know so we can fix it!</p>
            <form className="flex flex-col justify-center items-center gap-4 w-full flex-1">
              <div className="bg-white rounded-lg text-black flex flex-col items-center justify-center p-4 gap-2 w-full flex-1">
                <span className="">Describe what you were looking for.</span>
                <textarea className="bg-slate-300 rounded-lg w-full p-4 flex-1" style={{resize:"none"}}></textarea>
              </div>
              <button className="bg-white rounded-full text-black px-4">Submit</button>
            </form>
          </div>
        );
      case 2:
        return <span>Loading...</span>;
    }
  }

  const stars = Array.from({ length: 100 });

  const buttons = [
    {
      label: (
        <>
          EXPLORE<br />ARTICLES
        </>
      ),
      bg: backgroundImageArray[0],
      href: null,
    },
    {
      label: (
        <>
          CONTACT<br />US
        </>
      ),
      bg: backgroundImageArray[1],
      href: null,
    },
    {
      label: (
        <>
          GO<br />HOME
        </>
      ),
      bg: backgroundImageArray[2],
      href: "/",
    },
  ];

  const baseButtonClasses = `
    relative w-32 h-32 rounded-full
    bg-no-repeat bg-center bg-cover
    flex items-center justify-center
    text-white font-medium
    outline outline-transparent hover:outline-4 hover:outline-yellow-400 hover:outline-offset-[-14px]
    transition-[outline-color,outline-width,outline-offset] duration-200
  `;

  const afterBaseClasses = `
    after:absolute after:inset-0 after:rounded-full after:-z-10
    after:transition-opacity after:duration-1000 after:scale-[0.8]
  `;

  const selectedShadow = `
    after:bg-black/30
    after:translate-x-2 after:translate-y-2
    after:opacity-100
  `;

  return (
    <div className="flex flex-col min-h-screen justify-evenly bg-[#0E3648] align-middle text-white md:flex-row">
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
      <div id="not-found-left" className="flex flex-col justify-center items-center gap-10 flex-1 z-10">
        <span className="text-[96px]">404</span>
        <div className="flex flex-col items-center">
          <p>We can't seem to find what you're looking for.</p>
          <p>Let's explore other ways to help.</p>
        </div>
        <div className="flex justify-evenly">
          {buttons.map((btn, index) => {
            const buttonElement = (
              <button
                key={index}
                className={`
                  ${baseButtonClasses}
                  ${afterBaseClasses}
                  ${selected === index ? selectedShadow : 'after:opacity-0'}
                `}
                style={{ backgroundImage: btn.bg }}
                onClick={() => setSelected(index)}
              >
                {btn.label}
              </button>
            );

            return btn.href ? (
              <Link href={btn.href} key={index}>
                {buttonElement}
              </Link>
            ) : (
              buttonElement
            );
          })}
        </div>
      </div>

      {/* Right */}
      <div id="not-found-right" className="flex flex-col justify-center items-center flex-1 z-10">
        <div className="bg-cover aspect-square overflow-hidden w-full flex justify-center items-center"
          style={{ backgroundImage: backgroundImageArray[selected] }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
