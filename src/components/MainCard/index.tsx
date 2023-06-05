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
        className={`relative mx-auto h-[50vh] min-h-[350px] min-w-[300px] cursor-pointer
                  text-center transition-transform duration-[0.3s] hover:scale-[1.03]`}
      >
        <div
          className={`absolute right-0 top-0 z-0 h-full min-h-[19rem] w-8/12
                    justify-center bg-cover bg-center max-lg:w-full`}
        >
          <Image
            src={thumbnailUrl}
            fill={true}
            alt={title}
            className="rounded-md"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex h-full w-7/12 items-end p-10 max-lg:w-full max-lg:bg-white max-lg:p-5">
          <InnerCard
            title={title}
            subtitle={subtitle}
            author={author}
            date={date}
            mediaType={mediaType}
            tag={tag}
          />
        </div>
      </div>
    </Link>
  );
}
