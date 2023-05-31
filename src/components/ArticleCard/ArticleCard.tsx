import React, { useEffect, useReducer, useRef, useState } from "react";
import "./ArticleCard.css";
import Topic from "@/lib/topic";
import Image from "next/image";
import Link from "next/link";
import { TopicTag } from "../TopicTag/TopicTag";

interface Props {
  href: string;
}

export default function ArticleCard({ href }: Props) {
  return (
    <Link href="#">
      <div
        className={`flex min-w-[300px] cursor-pointer flex-col gap-4 overflow-clip
        rounded-lg border border-sciquelCardBorder bg-sciquelCardBg`}
      >
        <div className="flex flex-col gap-4 p-5">
          {/* Article Card Header */}
          <div className="flex w-full flex-row">
            <TopicTag name={Topic.BIOLOGY} />
            <div className="grow text-right">
              <p className="m-0 text-[10px] text-sciquelMuted">ARTICLE</p>
            </div>
          </div>
          {/* Article Content */}
          <h1 className="font-alegreyaSansSC text-2xl font-medium">
            Lights. Camera. Action!
          </h1>
          <p className="line-clamp-2">
            How does the Hawaiian bobtail squid singly live with Vibrio
            fischeri? A look at the Special Relationship between an uncommon
            bacterium and a pocket-sized squid.
          </p>
          <div className="flex flex-row font-sourceSerif4 text-sm font-[350] text-sciquelMuted">
            <p className="grow">By Edward Chen</p>
            <p>May 20, 2022</p>
          </div>
        </div>
        <div className="relative h-44">
          <Image
            src="/assets/images/bobtail.png"
            fill={true}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </Link>
  );
}
