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
        className={`relative z-0 mx-auto cursor-pointer text-center transition-all
                  duration-300 hover:scale-[1.03]
                   xs:min-w-[300px] md:h-[50vh] md:h-[70vh] lg:h-[70vh] xl:min-h-[300px]`}
      >
        <div
          className={`absolute right-0 top-0 z-10 h-full w-8/12
                    w-full justify-center bg-cover bg-center transition-all duration-300 lg:w-7/12`}
        >
          <Image
            src={thumbnailUrl}
            fill={true}
            alt={title}
            className="rounded-md"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="relative flex h-fit w-7/12 w-full flex-col justify-end p-5 transition-all duration-300 lg:h-full lg:w-10/12">
          <InnerCard
            title={title}
            subtitle={subtitle}
            author={author}
            date={date}
            mediaType={mediaType}
            tag={tag}
          />
          <div className="absolute bottom-0 bottom-[18%] z-10 mx-5 my-3 text-left transition-all duration-300 lg:block">
            <p className="font-sourceSerif4 text-xl font-[350] text-sciquelTeal">
              {author} | {date}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
