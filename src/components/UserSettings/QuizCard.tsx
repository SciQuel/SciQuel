"use client";

import TopicTag from "@/components/TopicTag";
import { type StoryTopic } from "@prisma/client";
import * as d3 from "d3";
import { useEffect } from "react";

interface QuizItem {
  title: string;
  topic: StoryTopic;
  date: string;
  type: string;
  total: number;
  score: number;
}

function createScoreDonut(quiz_obj: QuizItem, id_str: string) {
  const selector = "#" + id_str;
  const height = 120;
  const width = 115;
  const score = `${quiz_obj.score}/${quiz_obj.total}`;
  const endAngle = 2 * Math.PI * (quiz_obj.score / quiz_obj.total);
  const svgEl = d3.select(selector);
  svgEl.selectAll("*").remove();

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr(
      "transform",
      "translate(" + String(width / 2) + "," + String(height / 2) + ")",
    );

  interface ArcDatum extends d3.DefaultArcObject {
    cornerRadius: number;
  }

  const arc = d3.arc<ArcDatum>().cornerRadius(15);

  svg
    .append("path")
    .attr(
      "d",
      arc({
        outerRadius: 55,
        innerRadius: 40,
        cornerRadius: 0,
        startAngle: 0,
        endAngle: 2 * Math.PI,
      }),
    )
    .attr("fill", "#D9D9D9");

  svg
    .append("path")
    .attr(
      "d",
      arc({
        outerRadius: 55,
        innerRadius: 40,
        cornerRadius: 15,
        startAngle: 0,
        endAngle,
      }),
    )
    .attr("fill", () => {
      if (quiz_obj.score / quiz_obj.total < 0.5) {
        return "#E79595";
      } else if (quiz_obj.score / quiz_obj.total < 0.75) return "#D66300";
      return "#A3C9A8";
    });
  svg.append("text").text(score).attr("x", -15).attr("y", 6);
}

export default function QuizCard({
  idx,
  quizItem,
}: {
  idx: number;
  quizItem: QuizItem;
}) {
  // render quiz score using d3 with useEffect
  useEffect(() => {
    createScoreDonut(quizItem, `quiz-history-item-${idx}`);
  }, []);
  return (
    <div
      className="flex w-80 flex-none items-center justify-center gap-4 rounded-md border bg-white"
      key={idx}
    >
      <div
        className="text-xl font-semibold"
        id={`quiz-history-item-${idx}`}
      ></div>
      <div className="flex w-36 flex-col">
        <div className="line-clamp-2 text-lg font-semibold">
          {quizItem.title}
        </div>
        <div className="text-xs font-thin text-gray-400">{quizItem.type}</div>
        <div className="my-2 flex">
          <TopicTag name={quizItem.topic} />
        </div>
        <div className="text-xs font-thin text-gray-400">{quizItem.date}</div>
      </div>
    </div>
  );
}
