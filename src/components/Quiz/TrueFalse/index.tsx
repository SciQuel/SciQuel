import { useEffect, useState } from "react";

interface Props {
  questions: string[];
  show: boolean;
  // disable: boolean;
  // updateUserAns: Function;
  // isCorrect: boolean;
  // exp: string;
  // selec: string;
}
export type resp = {
  subpartId: string;
  subpartUserAns: string[];
};
export default function TrueFalse({
  questions,
  show,
}: // disable,
// updateUserAns,
// isCorrect,
// exp,
// selec,
Props) {
  const [qsid, setQsid] = useState("" as string);
  const [qzid, setQzid] = useState("" as string | null);
  const [userAns, setUserAns] = useState([] as resp[]);
  const [numIndex, setNumIndex] = useState([] as string[]);
  // useEffect(() => {
  //   const userAnsInfo = {
  //     index: numIndex,
  //     quizType: "TRUE_FALSE",
  //     questionID: qsid,
  //     quizID: qzid,
  //     userAns: userAns,
  //   };
  //   updateUserAns(userAnsInfo);
  // }, [userAns]);
  // const handler = (
  //   ans: string,
  //   idx: number,
  //   t: string,
  //   id: string,
  //   qid: string | null,
  // ) => {
  //   // console.log("ans ", t);
  //   setNumIndex([(numIndex[idx] = t)]);
  //   setNumIndex([...numIndex]);
  //   // console.log("numIndex ", numIndex);
  //   // setUserAns([(userAns[idx] = ans)]);
  //   // setUserAns([...userAns]);
  //   // console.log("userAns ", userAns);
  //   const tmp = { subpartId: id, subpartUserAns: [ans] };
  //   setUserAns([(userAns[idx] = tmp)]);
  //   setUserAns([...userAns]);
  //   setQsid(id);
  //   setQzid(qid);
  // };
  // console.log("isCorrect ", isCorrect, "exp ", exp, "selec ", selec);
  return (
    <div style={{ display: show ? "block" : "none" }}>
      <div className="true-false-selection mb-3 flex flex-col items-start gap-3 text-black">
        <p className="mb-3 text-left">
          <strong className="font-quicksand mb-1 text-xl font-bold">
            Mark each statement as true or false.
          </strong>
        </p>
        <div className="true-false-letters mb-[-35px] mt-[-35px] flex h-[-100px] w-full flex-row items-center justify-center gap-6 md-qz:mt-0">
          <div className="blankspace flex aspect-[8/1] basis-[80%] items-center justify-between gap-5"></div>
          <div className="true-letter flex aspect-[1/1] basis-[10%] items-center justify-center text-lg font-bold">
            T
          </div>
          <div className="false-letter flex aspect-[1/1] basis-[10%] items-center justify-center text-lg font-bold">
            F
          </div>
        </div>

        {/* Map of true false questions */}

        {questions?.map((statement, index) => (
          <div className="true-false-container flex h-full w-full flex-row items-center justify-center gap-6">
            <div className="true-false-statement flex aspect-[8/1] basis-[80%] flex-row items-center justify-between gap-5 rounded-md border border-black p-5 text-base font-medium md-qz:p-0">
              <p>{statement}</p>
            </div>
            <button
              key={index + "T"}
              className="select-box-true flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300 "
              // onClick={() =>
              //   handler(
              //     "True",
              //     index,
              //     index + "T",
              //     statement.id,
              //     statement.quizQuestionId,
              //   )
              // }
              // disabled={disable}
              // style={{
              //   pointerEvents: disable ? "none" : "auto",

              //   backgroundColor:
              //     index + "T" == selec && isCorrect === true
              //       ? "#A3C9A8"
              //       : index + "T" == selec && isCorrect === false
              //       ? "#E79595"
              //       : "rgb(229 231 235)",
              // }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-auto w-auto"
                // style={{
                //   color: "#5F8E79",
                //   display: index + "T" === numIndex[index] ? "block" : "none",
                // }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </button>

            <button
              key={index + "F"}
              className="select-box-false flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300"
              // onClick={() =>
              //   handler(
              //     "False",
              //     index,
              //     index + "F",
              //     statement.id,
              //     statement.quizQuestionId,
              //   )
              // }
              // disabled={disable}
              // style={{
              //   pointerEvents: disable ? "none" : "auto",
              //   backgroundColor:
              //     index + "F" === selec && isCorrect === true
              //       ? "#A3C9A8"
              //       : index + "F" === selec && isCorrect === false
              //       ? "#E79595"
              //       : "rgb(229 231 235)",
              // }}
            >
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-auto w-auto"
                style={{
                  color: "#5F8E79",
                  display: index + "F" === numIndex[index] ? "block" : "none",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg> */}
            </button>
          </div>
        ))}
      </div>
      <div className="col my-2 text-center">
        {/* {isCorrect === true ? (
          <div className="modal-content border-light w-full border">
            <div
              className="modal-body"
              style={{
                background: "linear-gradient(to right,#A3C9A8 1%,#F8F8FF 1%)",
              }}
            >
              <p className="p-2 text-left" style={{ color: "#437E64" }}>
                Correct. {exp}
                <br />
                <p className="text-right text-sm" style={{ color: "#424242" }}>
                  You and 87.6% of SciQuel readers answered this question
                  correctly. Great job!
                </p>
              </p>
            </div>
          </div>
        ) : isCorrect === false ? (
          <div className="modal-content border-light w-full border ">
            <div
              className="modal-body "
              style={{
                background: "linear-gradient(to right,#E79595 1%,#F8F8FF 1%)",
              }}
            >
              <p className="p-2 text-left" style={{ color: "#D06363" }}>
                Incorrect. {exp}
                <br />
                <p className="text-right text-sm" style={{ color: "#424242" }}>
                  87.6% of SciQuel readers answered this question correctly.
                </p>
              </p>
            </div>
          </div>
        ) : null} */}
      </div>
    </div>
  );
}
