import { type resInfo } from "../index";

const Explanation = ({
  explanation,
  quizType,
  mmOnly,
}: {
  explanation: resInfo | null;
  quizType: string;
  mmOnly?: number[] | null;
}) => {
  const quizTypes = [
    "MULTIPLE_CHOICE",
    "TRUE_FALSE",
    "DIRECT_MATCHING",
    "COMPLEX_MATCHING",
    "SELECT_ALL",
  ];

  if (!quizTypes.includes(quizType)) return null;

  switch (quizType) {
    case "MULTIPLE_CHOICE":
      return (
        <div className="row">
          {explanation && (
            <div className="col my-2 text-center">
              {explanation.results[0]?.correct[0] === true ? (
                <div className="modal-content w-full border border-none">
                  <div
                    className="modal-body"
                    style={{
                      background:
                        "linear-gradient(to right,#A3C9A8 1%,white 1%)",
                    }}
                  >
                    <p
                      className="p-4 text-left font-bold"
                      style={{ color: "#437E64" }}
                    >
                      Correct.
                      <span className="font-normal text-black">
                        {explanation.results[0]?.explanation}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="modal-content w-full border border-none">
                  <div
                    className="modal-body"
                    style={{
                      background:
                        "linear-gradient(to right,#E79595 1%,white 1%)",
                    }}
                  >
                    <p
                      className="p-4 text-left font-bold"
                      style={{ color: "#D06363" }}
                    >
                      Incorrect.{" "}
                      <span className="font-normal text-black">
                        {explanation.results[0]?.explanation}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    case "TRUE_FALSE":
      return (
        <div className="col my-2 text-center">
          {explanation?.results?.map(
            (
              res: { correct: boolean[]; explanation?: string | null },
              idx: number,
            ) =>
              res.correct[0] === true ? (
                <div
                  className="modal-content my-2 w-full border border-none"
                  key={idx}
                >
                  <div
                    className="modal-body"
                    style={{
                      background:
                        "linear-gradient(to right,#A3C9A8 1%,white 1%)",
                    }}
                  >
                    <p
                      className="p-2 text-left font-bold"
                      style={{ color: "#437E64" }}
                    >
                      Correct.
                      <span className="font-normal " style={{ color: "black" }}>
                        {res.explanation}
                      </span>
                      <br />
                    </p>
                  </div>
                  <p
                    className="text-right text-sm"
                    style={{ color: "#424242" }}
                  >
                    You and 87.6% of SciQuel readers answered this question
                    correctly. Great job!
                  </p>
                </div>
              ) : res.correct[0] === false ? (
                <div
                  className="modal-content my-2 w-full  border border-none "
                  key={idx}
                >
                  <div
                    className="modal-body "
                    style={{
                      background:
                        "linear-gradient(to right,#E79595 1%,white 1%)",
                    }}
                  >
                    <p
                      className="p-2 text-left font-bold"
                      style={{ color: "#D06363" }}
                    >
                      Incorrect.
                      <span className="font-normal " style={{ color: "black" }}>
                        {res.explanation}
                      </span>
                      <br />
                    </p>
                  </div>
                  <p
                    className="text-right text-sm"
                    style={{ color: "#424242" }}
                  >
                    87.6% of SciQuel readers answered this question correctly.
                  </p>
                </div>
              ) : null,
          )}
        </div>
      );
    case "DIRECT_MATCHING":
      return (
        <div className="row">
          {explanation?.results?.map((res) => (
            <div className="col my-2 text-center">
              <div>
                {res.correct[0] === true ? (
                  <div className="modal-content w-full border border-none">
                    <div
                      className="modal-body"
                      style={{
                        background:
                          "linear-gradient(to right,#A3C9A8 1%,white 1%)",
                      }}
                    >
                      <p
                        className="p-4 text-left font-bold"
                        style={{ color: "#437E64" }}
                      >
                        Correct.{" "}
                        <span
                          className="font-normal "
                          style={{ color: "black" }}
                        >
                          {res.explanation}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : res.correct[0] === false ? (
                  <div className="modal-content w-full border border-none">
                    <div
                      className="modal-body"
                      style={{
                        background:
                          "linear-gradient(to right,#E79595 1%,white 1%)",
                      }}
                    >
                      <p
                        className="p-4 text-left font-bold "
                        style={{ color: "#D06363" }}
                      >
                        Incorrect.{" "}
                        <span
                          className="font-normal "
                          style={{ color: "black" }}
                        >
                          {res.explanation}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="p-4 text-left" style={{ color: "#437E64" }}>
                    {res.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    case "COMPLEX_MATCHING":
      return (
        <div className="row">
          {mmOnly &&
            explanation?.results?.map((res, index: number) => (
              <div className="col my-2 text-center">
                <div>
                  <div className="modal-content  w-full border border-none">
                    <div
                      className="modal-body"
                      style={{
                        background:
                          mmOnly[index] ===
                          (explanation.correct_option_counts?.[index] ?? 0)
                            ? "linear-gradient(to right,#A3C9A8 1%,white 1%)"
                            : mmOnly[index] === 0
                            ? "linear-gradient(to right,#E79595 1%,white 1%)"
                            : "linear-gradient(to right,#f2d49b 1%,white 1%)",
                      }}
                    >
                      <p className="p-4 text-left" style={{ color: "black" }}>
                        {res.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      );
    case "SELECT_ALL":
      return (
        <div className="col my-2 text-center">
          {explanation && explanation.score === 10 ? (
            <div>
              <div className="modal-content  w-full border border-none">
                <div
                  className="modal-body"
                  style={{
                    background: "linear-gradient(to right,#A3C9A8 1%,white 1%)",
                  }}
                >
                  <p
                    className="p-4 text-left font-bold"
                    style={{ color: "#437E64" }}
                  >
                    Correct.
                  </p>
                </div>
              </div>
              <p className="text-right text-sm" style={{ color: "#424242" }}>
                You and 87.6% of SciQuel readers answered this question
                correctly. Great job!
              </p>
            </div>
          ) : explanation && explanation.score === 0 ? (
            <div>
              <div className="modal-content  w-full border border-none">
                <div
                  className="modal-body"
                  style={{
                    background:
                      "linear-gradient(to right, #E79595 1%,white 1%)",
                  }}
                >
                  <p
                    className="p-4 text-left font-bold"
                    style={{ color: "#D06363" }}
                  >
                    Incorrect.
                  </p>
                </div>
              </div>
              <p className="text-right text-sm" style={{ color: "#424242" }}>
                87.6% of SciQuel readers answered this question correctly.
              </p>
            </div>
          ) : explanation && explanation.score > 0 && explanation.score < 10 ? (
            <div>
              <div className="modal-content  w-full border border-none">
                <div
                  className="modal-body"
                  style={{
                    background:
                      "linear-gradient(to right, #F2C705 1%,white 1%)",
                  }}
                >
                  <p
                    className="p-4 text-left font-bold"
                    style={{ color: "#F2C705" }}
                  >
                    Partially Correct.
                  </p>
                </div>
              </div>
              <p className="text-right text-sm" style={{ color: "#424242" }}>
                87.6% of SciQuel readers answered this question correctly.
              </p>
            </div>
          ) : null}
        </div>
      );
    default:
      return null;
  }
};

export default Explanation;
