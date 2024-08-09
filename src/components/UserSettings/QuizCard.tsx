"use client";

import { type QuizHistory } from "@/app/user-settings/actions/getQuizHistory";
import TopicTag from "@/components/TopicTag";
import * as d3 from "d3";
import { useEffect } from "react";

function createScoreDonut(quiz: QuizHistory, idx: number) {
  const selector = "#" + `quiz-history-item-${idx}`;
  const height = 120;
  const width = 115;
  const score = `${quiz.score}/${quiz.totalScore}`;
  const endAngle = 2 * Math.PI * (quiz.score / quiz.totalScore);
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
      if (quiz.score / quiz.totalScore < 0.5) {
        return "#E79595";
      } else if (quiz.score / quiz.totalScore < 0.75) return "#D66300";
      return "#A3C9A8";
    });
  svg.append("text").text(score).attr("x", -15).attr("y", 6);
}

export default function QuizCard({
  quiz,
  idx,
}: {
  quiz: QuizHistory;
  idx: number;
}) {
  const {
    quizType,
    date,
    story: { title, topics },
  } = quiz;

  const quizTypeMap = {
    POST_QUIZ: "Post-Quiz",
    PRE_QUIZ: "Pre-Quiz",
  };
  // render quiz score using d3 with useEffect
  useEffect(() => {
    createScoreDonut(quiz, idx);
  }, []);
  return (
    <div className="flex w-80 flex-none items-center justify-center gap-4 rounded-md border bg-white">
      <div
        className="text-xl font-semibold"
        id={`quiz-history-item-${idx}`}
      ></div>
      <div className="flex w-36 flex-col">
        <div className="line-clamp-2 text-lg font-semibold">{title}</div>
        <div className="text-xs font-thin text-gray-400">
          {quizTypeMap[quizType]}
        </div>
        <div className="my-2 flex">
          <TopicTag name={topics[0]} />
        </div>
        <div className="text-xs font-thin text-gray-400">
          {date?.toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
