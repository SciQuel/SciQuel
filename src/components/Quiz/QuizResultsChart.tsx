import * as d3 from "d3";
import React, { useEffect } from "react";

interface DonutChartProps {
  isPreQuiz: boolean;
  quizResults: (boolean | null)[];
  themeColor: string; // Theme color of the quiz (hex), matching with story topic tag color
}

interface DataItem {
  name: string;
  value: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  isPreQuiz,
  quizResults,
  themeColor,
}) => {
  const chartId = isPreQuiz ? "pre-quiz-donut-chart" : "post-quiz-donut-chart";

  useEffect(() => {
    const trueCount = quizResults.filter((result) => result === true).length;
    const falseCount = quizResults.filter((result) => result === false).length;
    const nullCount = quizResults.filter((result) => result === null).length;

    const data: DataItem[] = [
      { name: "Correct", value: trueCount },
      { name: "Incorrect", value: falseCount },
      { name: "Unanswered", value: nullCount },
    ];

    const height = 280;
    const width = 300;
    const score = `${trueCount}/${quizResults.length}`;
    const endAngle = 2 * Math.PI * (trueCount / quizResults.length);
    const svgEl = d3.select(`#${chartId}`);
    svgEl.selectAll("*").remove();

    const svg = d3
      .select(`#${chartId}`)
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
          outerRadius: 128,
          innerRadius: 104,
          cornerRadius: 0,
          startAngle: 0,
          endAngle: 2 * Math.PI,
        }),
      )
      .attr("fill", "#D9D9D9");
    // .attr("fill", "#e79595");

    svg
      .append("path")
      .attr(
        "d",
        arc({
          outerRadius: 128,
          innerRadius: 104,
          cornerRadius: 15,
          startAngle: 0,
          endAngle,
        }),
      )
      .attr("fill", () => {
        // if (trueCount / quizResults.length < 0.5) {
        //   return "#E79595";
        // } else if (trueCount / quizResults.length < 0.75) return "#D66300";
        // return "#a3c9a8";
        return themeColor;
      });
    svg
      .append("text")
      .text(score)
      .attr("x", 0)
      .attr("y", 30)
      .attr("text-anchor", "middle") // Center the text horizontally
      // .attr("dominant-baseline", "middle") // Center the text vertically
      .attr("font-size", "40px") // Adjust the font size as needed
      .attr("font-weight", "600"); // Add font-weight for emphasis;
    svg
      .append("text")
      .text(isPreQuiz ? "PRE-QUIZ" : "POST-QUIZ") // Conditionally set the text
      .attr("x", 0) // Adjust the positioning as needed
      .attr("y", -20)
      .attr("text-anchor", "middle") // Center the text horizontally
      // .attr("dominant-baseline", "middle") // Center the text vertically
      .attr("font-size", "22px") // Adjust the font size as needed
      .attr("font-weight", "600"); // Add font-weight for emphasis

    // const height = 400,
    //   width = 400,
    //   margin = 15;

    // const svg = d3
    //   .select(`#${chartId}`)
    //   .append("svg")
    //   .attr("width", width)
    //   .attr("height", height)
    //   .attr("id", "donutChart");

    // const radius = Math.min(width, height) / 2 - margin;

    // const g = svg
    //   .append("g")
    //   .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // const colors = ["#8CC0FF", "#C2DDFF", "#D6E9FF", "#EBF4FF"];

    // const pie = d3.pie<DataItem>().value((d) => d.value);

    // const path = d3.arc<DataItem>().outerRadius(radius).innerRadius(110);

    // const label = d3
    //   .arc<DataItem>()
    //   .outerRadius(radius)
    //   .innerRadius(radius - 75);

    // const pies = g
    //   .selectAll(".arc")
    //   .data(pie(data))
    //   .enter()
    //   .append("g")
    //   .attr("class", "arc");

    //   pies
    //   .append("path")
    //   .datum((d: any) => d.data)
    //   .attr("d", (d: any) => path(d) as string)
    //   .transition()
    //   .duration(500)
    //   .attr("fill", (d: any, i: number) => colors[i]);

    // pies
    //   .append("text")
    //   .attr("transform", function (d: any) {
    //     // Explicitly specify the type for 'd'
    //     return `translate(${label.centroid(d as any)})`; // Cast 'd' as 'any' to access properties
    //   })
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", "14px")
    //   .text((d: any) => d.data.name); // Cast 'd' as 'any' to access properties

    // g.append("text")
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", "18px")
    //   .attr("class", "centerWord")
    //   .text("Center Text"); // You can replace this with your desired text
  }, [quizResults]);

  return <figure id={chartId}></figure>;
};

export default DonutChart;
