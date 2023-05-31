import type Topic from "@/lib/topic";
import { TopicTag } from "../TopicTag/TopicTag";

interface Props {
  tag: (typeof Topic)[keyof typeof Topic];
  title: string;
  subtitle: string;
  author: string;
  date: string;
  mediaType: string;
}

export default function Card({
  tag,
  title,
  subtitle,
  author,
  date,
  mediaType,
}: Props) {
  // useEffect(() => {
  //   // Does the animation and changes the parameters of the main card depending on the size of the window
  //   window.addEventListener("resize", handleChange);
  //   function handleChange() {
  //     const screenWidth = window.screen.width;
  //     var info = document.querySelector(".subInfo");
  //     var main = document.querySelector(".maincard-card");
  //     var title = document.querySelector(".title");
  //     var content = document.querySelector(".subTitle");
  //     var articleText = document.querySelector(".article");

  //     if (window.innerWidth <= 600) {
  //       info.style.top = "80%";
  //       main.classList.add("smallest");
  //       main.style.width = "77.5%";
  //       main.classList.remove("small");
  //       main.classList.remove("big");
  //       title.style.color = "#1a6f8c";
  //       content.style.color = "#1a6f8c";
  //       articleText.style.display = "block";
  //     } else if (
  //       (window.innerWidth < (screenWidth.toFixed() * 8) / 10 ||
  //         window.innerWidth < 1000) &&
  //       window.innerWidth > 600
  //     ) {
  //       info.style.top = "80%";
  //       main.classList.add("small");
  //       main.style.width = "50%";
  //       main.classList.remove("smallest");
  //       main.classList.remove("big");
  //       title.style.color = "#1a6f8c";
  //       content.style.color = "#1a6f8c";
  //       articleText.style.display = "block";
  //     } else {
  //       info.style.top = "100%";
  //       main.classList.add("big");
  //       main.style.width = (screenWidth.toFixed() * 35) / 100 + "px";
  //       main.classList.remove("small");
  //       main.classList.remove("smallest");
  //       title.style.color = "white";
  //       content.style.color = "white";
  //       articleText.style.display = "none";
  //     }

  //     // Checks if card needs 2 or 3 lines depending on the title size
  //     if (title.offsetHeight > 40) {
  //       content.style.webkitLineClamp = "2";
  //     } else {
  //       content.style.webkitLineClamp = "3";
  //     }
  //   }

  //   handleChange();

  //   var info = document.querySelector(".subInfo");
  //   var main = document.querySelector(".maincard-card");
  //   var title = document.querySelector(".title");
  //   var content = document.querySelector(".subTitle");

  //   // Set timeout for the transition, in order not to trigger the animation
  //   setTimeout(function () {
  //     main.classList.add("animation");
  //     info.classList.add("subInfo-animation");
  //     title.classList.add("title-animation");
  //     content.classList.add("subTitle-animation");
  //   }, 100);

  //   // Add an event listener to check for the height of the div during the transition for smooth transition
  //   main.addEventListener("transitionstart", (event) => {
  //     if (event.target.classList.contains("animation")) {
  //       const animation = () => {
  //         if (title.offsetHeight > 40) {
  //           content.style.webkitLineClamp = "2";
  //         } else {
  //           content.style.webkitLineClamp = "3";
  //         }
  //         requestAnimationFrame(animation);
  //       };
  //       requestAnimationFrame(animation);
  //     }
  //   });
  // }, []);

  return (
    <div className="absolute bottom-[4.5rem] z-10 min-h-[150px] w-[500px] min-w-[150px] rounded bg-gradient-to-b from-[#196e8c] to-[#65a69e] p-5">
      <div className="flex items-start justify-between">
        <TopicTag name={tag} />
        <p className="m-0 hidden p-0 text-xs text-sciquelMuted">{mediaType}</p>
      </div>
      <h2 className="my-2 text-left font-alegreyaSansSC text-3xl text-white">
        {title}
      </h2>
      <h4 className="line-clamp-3 text-left text-xl text-white">{subtitle}</h4>
      <p className="absolute bottom-0 left-5 top-full my-3 font-sourceSerif4 text-xl font-[350] text-sciquelMuted">
        {author} | {date}
      </p>
    </div>
  );
}
