import { useEffect } from "react";

interface Props {
  categories: string[];
  options: string[];
  show: boolean;
}
// function getCurrentResults(node: Node) {
//   while (node.hasChildNodes) {
//     console.log("item", node?.getAttribute("option-key"));
//     node = node.nextSibling;
//   }
// }

export default function MultipleMatch({ categories, options, show }: Props) {
  let item: HTMLTextAreaElement;
  let current = 0;
  var array = [];
  //console.log(categories);
  //console.log(options);
  useEffect(() => {
    //dragstart event to initiate mouse dragging
    document.addEventListener(
      "dragstart",
      function (e) {
        //set the item reference to this element
        item = e.target as HTMLTextAreaElement;

        //we don't need the transfer data, but we have to define something
        //otherwise the drop action won't work at all in firefox
        //most browsers support the proper mime-type syntax, eg. "text/plain"
        //but we have to use this incorrect syntax for the benefit of IE10+
        e.dataTransfer?.setData("text", "");
      },
      false,
    );

    //dragover event to allow the drag by preventing its default
    //ie. the default action of an element is not to allow dragging
    document.addEventListener(
      "dragover",
      function (e) {
        if (item) {
          e.preventDefault();
        }
      },
      false,
    );

    //drop event to allow the element to be dropped into valid targets
    document.addEventListener(
      "drop",
      function (e) {
        //if this element is a drop target, move the item here
        //then prevent default to allow the action (same as dragover)
        const target = e.target as HTMLTextAreaElement;
        let tmp = item.innerHTML;
        if (target.getAttribute("data-draggable") == "target") {
          // console.log("cate", target.parentNode?.getAttribute("category-key"));
          // console.log("item", item?.getAttribute("option-key"));
          target.parentNode?.insertBefore(item, target);
          // console.log("nodes", item.parentNode?.);
          current = target.parentNode?.getAttribute("category-key");
          // console.log("category", categories[current]);

          e.preventDefault();
        } else if (target.getAttribute("data-draggable") == "answer") {
          if (target.parentElement != null && item != null) {
            item.innerHTML = target.parentElement?.innerHTML;
            target.parentElement.innerHTML = tmp;
          }

          e.preventDefault();
        }
        tmp = "";
      },
      false,
    );

    //dragend event to clean-up after drop or abort
    //which fires whether or not the drop target was valid
    document.addEventListener(
      "dragend",
      function () {
        item = null as unknown as HTMLTextAreaElement;
        const container = document.querySelector("#" + categories[current]);
        console.log("container", container);
        container
          ?.querySelectorAll("div[option-key]")
          .forEach((elem) =>  ));
        // console.log("matches", matches);
        //console.log(elem.getAttribute("option-key")
      },
      false,
    );
  });

  return (
    <div style={{ display: show ? "block" : "none" }}>
      <div className="multiple-match-selection mb-[20px] flex flex-col items-start">
        <p className="mb-3 text-left">
          <strong className="font-quicksand mb-1 text-xl font-bold">
            Match each word in the word bank to its category.
          </strong>
        </p>

        {/* <div className="multiple-match-drop-area flex w-full flex-row flex-wrap items-start justify-center gap-3 pb-3"></div> */}
        <div className="grid w-full  grid-cols-3 justify-stretch gap-4 ">
          {categories.map((cat, index) => (
            <div className="quiz-col  my-3.5 flex h-full  basis-[30%] flex-col gap-4 sm-mm:w-[120px] xsm-qz:w-[110px] xsm-mm:w-[100px]">
              <div className="multiple-match-statement flex  w-full flex-wrap items-center justify-center hyphens-auto break-words rounded-[4px] border border-black bg-white p-3 text-center text-[18px] xsm-qz:inline-block xsm-mm:text-[16px]">
                {cat}
              </div>
              <div id={cat} category-key={index} className="contents">
                <div
                  className="multiple-match-slot h-[50px] w-full rounded-[4px] border bg-gray-200 p-3 transition duration-300"
                  data-draggable="target"
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Choice Area */}

      <div className="multiple-match-answer-choice-area  w-full place-items-center gap-2 border-t-[1.75px] pt-6 ">
        <div className="grid  w-full grid-cols-3 justify-stretch gap-4">
          {options.map((Choice, index) => (
            <div
              className="multiple-match-answer-choice-holder min-w-100 relative box-border flex  w-full cursor-move items-center justify-end break-words rounded-[4px] border border-black bg-white text-center text-[18px] transition duration-300 ease-in-out "
              draggable="true"
              data-draggable="item"
              option-key={index}
            >
              <div className="image-holder absolute inset-0 flex h-full w-[35%] max-w-[50px] grow items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out">
                <span className="hamburger-menu flex h-4 w-6 flex-col justify-between rounded-[4px] border-none">
                  <span className="hamburger-line h-0.5 w-full bg-black"></span>
                  <span className="hamburger-line h-0.5 w-full bg-black"></span>
                  <span className="hamburger-line h-0.5 w-full bg-black"></span>
                </span>
              </div>
              <div
                className="match-text align-self-center justify-right m-auto flex w-[72%] max-w-full items-center justify-end justify-self-end hyphens-auto break-words p-3 md-qz:inline-block sm-mm:w-[65%] xsm-mm:w-[73%] xsm-mm:text-[16px]"
                data-draggable="answer"
              >
                {Choice}
              </div>
            </div>
          ))}

          <div
            className="multiple-match-slot h-[50px] w-full rounded-[4px] border-none bg-white p-3 transition duration-300"
            data-draggable="target"
          ></div>
        </div>
      </div>
    </div>
  );
}
