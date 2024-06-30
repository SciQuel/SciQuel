interface Props {
  current: string;
  numOfQues: number;
  answered: boolean[];
}
export default function ProgressBar({ current, numOfQues, answered }: Props) {
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
          {[...Array(numOfQues)].map((_, key) => (
            <li key={key} style={{ listStyle: "none" }}>
              <div
                className="absolute -translate-x-2 -translate-y-2 rounded-full"
                style={{
                  width: "0.75em",
                  height: "0.75em",
                  backgroundColor:
                    answered[key] === true ? "#5F8E79" : "#ACC6BA",
                  zIndex: "2",
                }}
              ></div>

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
