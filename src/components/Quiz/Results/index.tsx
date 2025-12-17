import React from "react";

interface QuizBreakdown {
  question_type: string;
  question_text: string;
  correct: boolean;
  explanation: string;
}

interface Props {
  resultInfo: {
    results: { correct: boolean[]; explanation: string }[];
    correct_option_counts: number[] | null;
    score: number;
  }[];
  quizzes?: Array<{
    quiz_question_id: number;
    question_type: string;
    question?: string;
    options?: string[];
    categories?: string[];
    questions?: string[];
  }>;
}

/**
 * The Results component takes in a list of resultInfo and displays the total score the user got out
 * of the total number of quizzes, plus a detailed breakdown of each question.
 *
 * @param {Props} props The props for the Results component.
 * @return {JSX.Element} The rendered Results component.
 */
export default function Results({ resultInfo, quizzes }: Props): JSX.Element {
  // Calculate total score
  let score = 0;
  resultInfo.forEach((element) => {
    if (element.score >= 10) {
      score += 1;
    }
  });

  // Build breakdown data for each quiz
  const buildBreakdown = (): QuizBreakdown[] => {
    return resultInfo.map((result, index) => {
      const quiz = quizzes?.[index];
      const isCorrect = result.results[0]?.correct[0] ?? false;
      const explanation = result.results[0]?.explanation ?? "";

      return {
        question_type: quiz?.question_type ?? "UNKNOWN",
        question_text:
          quiz?.question ?? quiz?.questions?.[0] ?? "Question not available",
        correct: isCorrect,
        explanation,
      };
    });
  };

  const breakdown = buildBreakdown();

  // Group results by quiz type
  const groupedByType = breakdown.reduce((acc, item) => {
    if (!acc[item.question_type]) {
      acc[item.question_type] = [];
    }
    acc[item.question_type].push(item);
    return acc;
  }, {} as Record<string, QuizBreakdown[]>);

  return (
    <div className="text-black">
      <p className="mb-6 text-center">
        <strong className="font-quicksand mb-1 text-3xl font-bold">
          Score: <br /> {score} <br /> / <br /> {resultInfo.length}
        </strong>
      </p>

      {/* Content Breakdown Section */}
      <div className="mt-8 w-full">
        <h3 className="mb-6 text-center text-2xl font-bold">
          Content Breakdown
        </h3>

        {Object.entries(groupedByType).map(([quizType, questions]) => {
          const correctCount = questions.filter((q) => q.correct).length;
          const totalCount = questions.length;

          return (
            <div key={quizType} className="mb-8">
              <div className="mb-4 rounded-lg bg-gray-100 p-4">
                <h4 className="mb-2 text-lg font-semibold">
                  {formatQuizType(quizType)}
                </h4>
                <p className="text-sm text-gray-700">
                  {correctCount} out of {totalCount} correct
                </p>
              </div>

              <div className="space-y-3">
                {questions.map((question, idx) => (
                  <div
                    key={`${quizType}-${idx}`}
                    className={`rounded-lg border-l-4 p-4 ${
                      question.correct
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium">{question.question_text}</p>
                      <span
                        className={`text-sm font-bold ${
                          question.correct ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {question.correct ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {question.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Formats quiz type names to human-readable format */
function formatQuizType(type: string): string {
  const formatMap: Record<string, string> = {
    MULTIPLE_CHOICE: "Multiple Choice",
    TRUE_FALSE: "True or False",
    DIRECT_MATCHING: "Direct Matching",
    COMPLEX_MATCHING: "Complex Matching",
    SELECT_ALL: "Select All That Apply",
  };
  return formatMap[type] ?? type;
}
