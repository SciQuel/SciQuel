import type Topic from "@/lib/topic";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import Card from "./Card";

interface Props {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  mediaType: string;
  tag: (typeof Topic)[keyof typeof Topic];
  thumbnailUrl: string;
  href: string;
}

const MainCard = ({
  title,
  subtitle,
  author,
  date,
  mediaType,
  tag,
  thumbnailUrl,
  href,
}: Props) => {
  // const api_url = "https://api.sciquel.org/latest";

  // const [title, setTitle] = useState("");
  // const [subTitle, setSubTitle] = useState("");
  // const [author, setAuthor] = useState("");
  // const [postDate, setPostDate] = useState("");
  // const [mediaType, setMediaType] = useState("");

  // const handleChange = useCallback(() => {
  //   const screenWidth = window.screen.width;
  //   var image = document.querySelector(".backImage");
  //   var main = document.querySelector(".maincard");

  //   if (!image || !main) return;

  //   console.log(screen);
  //   if (
  //     window.innerWidth < (screenWidth * 8) / 10 ||
  //     window.innerWidth < 1000
  //   ) {
  //     image.style.width = "100%";
  //     main.style.width = "calc(100% - 20px)";
  //   } else {
  //     image.style.width = (screenWidth * 45) / 100 + "px";
  //     main.style.width = "90%";
  //   }

  //   main.style.height = (screenWidth * 25) / 100 + "px";
  // }, []);

  // useEffect(() => {
  //   handleChange();

  //   var image = document.querySelector(".backImage");
  //   var main = document.querySelector(".maincard");

  //   // Sets timeout in order not to trigger the animation early
  //   setTimeout(function () {
  //     image.classList.add("animation");
  //     main.classList.add("maincard-animation");
  //   }, 10);
  // });

  // useEffect(() => {
  //   // Does the animation and changes the parameters of the image depending on the size of the window
  //   // window.addEventListener("resize", handleChange);

  //   fetch(api_url)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setTitle(data[0].StoryTitle);
  //       setSubTitle(data[0].StorySummary);
  //       setAuthor(data[0].AuthorName);
  //       let date = data[0].PublishedDate.split("T").shift().split("-");
  //       setPostDate(
  //         `${date[1]} ${new Date(2000, date[2] - 1).toLocaleString("default", {
  //           month: "long",
  //         })} ${date[0]}`
  //       );
  //       setMediaType(data[0].StoryType.toUpperCase());
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  return (
    <Link href={href}>
      <div
        className={`relative mx-auto my-8 h-[40vh] min-h-[350px] min-w-[300px] cursor-pointer pl-5
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
};

export default MainCard;
