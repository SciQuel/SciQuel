interface Props {
  current: string;
  numOfQues: number;
  answered: boolean[];
  setCurrent: (index: number) => void;
  progress: string;
  gap: number;
  setProgress: (progress: number) => void;
}
export default function ProgressBar({
  current,
  numOfQues,
  answered,
  setCurrent,
  setProgress,
}: Props) {
  const nextQes = answered.filter(Boolean).length + 1;
  return (
    <div className="position-relative mt-5 ">
      <div className="progress h-2 bg-[#ACC6BA]">
        <div
          className="flex h-2 w-full  max-w-[100%] transform overflow-hidden rounded-full bg-gray-200 transition-all duration-500 dark:bg-gray-700"
          role="progress-bar"
          style={{
            width: current + "%",
            backgroundColor: "#5F8E79",
          }}
        ></div>
      </div>

      <div className="flex justify-around bg-[#F8F8FF]">
        <>
          {Array.from({ length: numOfQues }).map((_, key) => (
            <li key={key} style={{ listStyle: "none" }}>
              <button
                className="absolute -translate-x-2 -translate-y-2 rounded-full"
                style={{
                  width: "0.75em",
                  height: "0.75em",
                  backgroundColor:
                    answered[key] === true ? "#5F8E79" : "#ACC6BA",
                  zIndex: "2",
                }}
                onClick={
                  Number(key + 1) == nextQes || answered[key] === true
                    ? () => {
                        setCurrent(key);
                        setProgress(
                          Math.round((Number(key + 0.5) / numOfQues) * 100),
                        );
                        console.log(
                          `Progress set to ${Math.round(
                            (Number(key + 0.5) / numOfQues) * 100,
                          )}%`,
                        );
                      }
                    : undefined
                }
              ></button>

              <div
                className="absolute  -translate-x-3 -translate-y-3 rounded-full"
                style={{
                  width: "1.25em",
                  height: "1.25em",
                  backgroundColor: "white",
                  border: "0.1em solid #5F8E79",
                  zIndex: "1",
                }}
              ></div>
            </li>
          ))}
        </>
      </div>
    </div>
  );
}
