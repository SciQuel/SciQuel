import React from "react";
import { type Question } from "./Trivia";

interface TrueOrFalseQuestionProps {
  question: Question;
  updateQuestion: (id: number, updatedQuestion: Partial<Question>) => void;
  addTrueOrFalseQuestion: (questionId: number) => void;
  deleteTrueOrFalseQuestion: (questionId: number, tfQuestionId: number) => void;
}

const TrueOrFalseQuestion: React.FC<TrueOrFalseQuestionProps> = ({
  question,
  updateQuestion,
  addTrueOrFalseQuestion,
  deleteTrueOrFalseQuestion,
}) => {
  const handleContentChange = (id: number, content: string) => {
    updateQuestion(question.id, {
      trueOrFalseQuestions: question.trueOrFalseQuestions?.map((tfQuestion) =>
        tfQuestion.id === id ? { ...tfQuestion, content } : tfQuestion,
      ),
    });
  };

  const handleIsTrueChange = (id: number, isTrue: boolean) => {
    updateQuestion(question.id, {
      trueOrFalseQuestions: question.trueOrFalseQuestions?.map((tfQuestion) =>
        tfQuestion.id === id ? { ...tfQuestion, isTrue } : tfQuestion,
      ),
    });
  };

  return (
    <div className="mt-2">
      {question.trueOrFalseQuestions?.map((tfQuestion) => (
        <div key={tfQuestion.id} className="mt-2 flex items-center">
          <input
            type="text"
            value={tfQuestion.content}
            onChange={(e) => handleContentChange(tfQuestion.id, e.target.value)}
            className="mr-2 w-full rounded border p-2"
            placeholder="Enter a true or false statement..."
          />
          <select
            value={tfQuestion.isTrue.toString()}
            onChange={(e) =>
              handleIsTrueChange(tfQuestion.id, e.target.value === "true")
            }
            className="mr-2 rounded border p-2"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <button
            onClick={() =>
              deleteTrueOrFalseQuestion(question.id, tfQuestion.id)
            }
            className="text-sciquelTeal"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        onClick={() => addTrueOrFalseQuestion(question.id)}
        className="mt-2 rounded bg-sciquelTeal px-2 py-1 text-sm text-white"
      >
        Add Statement
      </button>
    </div>
  );
};

export default TrueOrFalseQuestion;