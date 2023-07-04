import { type StoryTopic, type StoryType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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
  return (
    <Link href={href}>
      <div
        className={`relative mx-auto h-[70vh] min-h-[300px] max-h-[500px] min-w-[300px] cursor-pointer
                  text-center transition-all duration-300 hover:scale-[1.03] lg:h-[70vh] h-[50vh] z-0`}
      >
        <div
          className={`absolute right-0 top-0 z-10 h-full w-full
                    justify-center bg-cover bg-center transition-all duration-300 lg:w-7/12 w-8/12`}
        >
          <Image
            src={thumbnailUrl}
            fill={true}
            alt={title}
            className="rounded-md"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="relative flex flex-col justify-end h-full w-full p-5 transition-all duration-300 lg:w-10/12 w-7/12">
          <InnerCard
            title={title}
            subtitle={subtitle}
            author={author}
            date={date}
            mediaType={mediaType}
            tag={tag}
          />
          <div className="absolute bottom-0 lg:block mx-5 my-3 text-left transition-all duration-300 z-10 bottom-[18%]">
            <p className="font-sourceSerif4 text-xl font-[350] text-sciquelMuted">
              {author} | {date}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}