interface Props {
  current: string;
  numOfQues: number;
  answered: boolean[];
  setCurrent: (index: number) => void;
  progress: string;
  gap: number;
  setProgress: (progress: string) => void;
}
/**
 * A progress bar component that displays the current question number and the number of correct
 * answers.
 *
 * @param {Object} props The component props.
 * @param {string} props.current The current question number.
 * @param {number} props.numOfQues The total number of questions.
 * @param {boolean[]} props.answered An array of boolean values indicating whether each question has
 *        been answered correctly.
 * @param {Function} props.setCurrent A function to set the current question number.
 * @param {string} props.progress A string representing the progress of the quiz.
 * @param {number} props.gap The gap between each question in the progress bar.
 * @param {Function} props.setProgress A function to set the progress string.
 */
export default function ProgressBar({
  current,
  numOfQues,
  answered,
  setCurrent,
  progress,
  gap,
  setProgress,
}: Props) {
  // The next question number
  const nextQes = answered.filter(Boolean).length + 1;

  return (
    <div className="position-relative mt-5 ">
      {/* The progress bar */}
      <div className="progress h-2 bg-[#ACC6BA]">
        <div
          className="flex h-2 w-full  max-w-[100%] transform overflow-hidden rounded-full bg-gray-200 transition-all duration-500 dark:bg-gray-700"
          role="progress-bar"
          style={{
            // Set the width of the progress bar to the current progress
            width: current + "%",
            // Set the background color of the progress bar
            backgroundColor: "#5F8E79",
          }}
        ></div>
      </div>

      {/* The question numbers */}
      <div className="flex justify-around bg-[#F8F8FF]">
        {Array.from({ length: numOfQues }).map((_, key) => (
          <li key={key} style={{ listStyle: "none" }}>
            {/* The question number button */}
            <button
              className="absolute -translate-x-2 -translate-y-2 rounded-full"
              style={{
                // Set the width and height of the button
                width: "0.75em",
                height: "0.75em",
                // Set the background color of the button
                backgroundColor: answered[key] === true ? "#5F8E79" : "#ACC6BA",
                // Set the z-index of the button
                zIndex: "2",
              }}
              onClick={
                // If the next question number is equal to the current question number
                // or if the question has been answered correctly,
                // set the current question number and update the progress string
                Number(key + 1) == nextQes || answered[key] === true
                  ? () => {
                      setCurrent(key);
                      // Calculate the progress string
                      const progressString = Math.round(
                        (Number(key + 0.5) / numOfQues) * 100,
                      ).toString();
                      // Set the progress string
                      setProgress(progressString);
                      // Log the progress string to the console
                      console.log(`Progress set to ${progressString}%`);
                    }
                  : undefined
              }
            ></button>

            {/* The question number circle */}
            <div
              className="absolute  -translate-x-3 -translate-y-3 rounded-full"
              style={{
                // Set the width and height of the circle
                width: "1.25em",
                height: "1.25em",
                // Set the background color of the circle
                backgroundColor: "white",
                // Set the border of the circle
                border: "0.1em solid #5F8E79",
                // Set the z-index of the circle
                zIndex: "1",
              }}
            ></div>
          </li>
        ))}
      </div>
    </div>
  );
}
