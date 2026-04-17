"use client";

import { type StoryTopic, type StoryType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import InnerCard from "./InnerCard";

interface Props {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  mediaType: StoryType;
  tag: StoryTopic;
  thumbnailUrl: string;
  href: string;
}

export default function MainCard({
  title,
  subtitle,
  author,
  date,
  mediaType,
  tag,
  thumbnailUrl,
  href,
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`
        relative z-0 mx-auto pt-12 text-center
        transition-all duration-300
        ${hovered ? "scale-[1.03]" : ""}
        xs:min-w-[300px] md:h-[70vh] md:pt-0 xl:min-h-[300px]
      `}
    >
      <Link
        href={href}
        className={`absolute right-0 top-0 z-10 h-full 
                    w-full justify-center bg-cover bg-center transition-all duration-300 lg:w-8/12`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={thumbnailUrl}
          fill={true}
          alt={title}
          className="rounded-md"
          style={{ objectFit: "cover" }}
        />
      </Link>
      <div className="relative flex h-full w-full flex-col justify-end p-5 transition-all duration-300 lg:w-3/5 lg:justify-center">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <InnerCard
            href={href}
            title={title}
            subtitle={subtitle}
            author={author}
            date={date}
            mediaType={mediaType}
            tag={tag}
          />
        </div>
        {/* <div className="z-10 mx-5 my-3 hidden text-left transition-all duration-300 lg:relative lg:top-16 lg:block">
          <p className="font-sourceSerif4 text-xl font-[350] text-sciquelTeal">
            {author} | {date}
          </p>
        </div> */}
      </div>
    </div>
  );
}
