import { type EnumKey } from "@/lib/enums";
import type Topic from "@/lib/enums/Topic";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Card from "./Card";

interface Props {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  mediaType: string;
  tag: EnumKey<typeof Topic>;
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
        className={`relative mx-auto h-[40vh] min-h-[350px] min-w-[300px] cursor-pointer pl-5
                  text-center transition-transform duration-[0.3s] hover:scale-[1.05]`}
      >
        <div
          className={`absolute right-0 top-0 z-0 h-full min-h-[19rem] w-[44rem] min-w-[19rem]
                    justify-center bg-cover bg-center`}
        >
          <Image
            src={thumbnailUrl}
            fill={true}
            alt={title}
            className="rounded-md"
            style={{ objectFit: "cover" }}
          />
        </div>
        <Card
          title={title}
          subtitle={subtitle}
          author={author}
          date={date}
          mediaType={mediaType}
          tag={tag}
        />
      </div>
    </Link>
  );
}
