import React from "react";
import { type Choice, type Question } from "./Trivia";

interface SelectAllQuestionProps {
  question: Question;
  updateQuestion: (id: number, updatedQuestion: Partial<Question>) => void;
  addOption: (questionId: number) => void;
  deleteOption: (questionId: number, optionId: number) => void;
  updateOption: (
    questionId: number,
    optionId: number,
    updatedOption: Partial<Choice>,
  ) => void;
}

const SelectAllQuestion: React.FC<SelectAllQuestionProps> = ({
  question,
  updateQuestion,
  addOption,
  deleteOption,
  updateOption,
}) => {
  const handleOptionChange = (optionId: number, content: string) => {
    updateOption(question.id, optionId, { content });
  };

  const handleCorrectAnswerChange = (optionId: number, isCorrect: boolean) => {
    const updatedCorrectAnswers = isCorrect
      ? [...(question.correct_answers || []), optionId]
      : (question.correct_answers || []).filter((id) => id !== optionId);
    updateQuestion(question.id, { correct_answers: updatedCorrectAnswers });
  };

  return (
    <div>
      <input
        type="text"
        value={question.content}
        onChange={(e) =>
          updateQuestion(question.id, { content: e.target.value })
        }
        placeholder="Enter question"
        className="mb-2 rounded border p-2"
      />
      {question.options?.map((option, index) => (
        <div key={option.id} className="mb-2">
          <input
            type="text"
            value={option.content}
            onChange={(e) => handleOptionChange(option.id, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="mr-2 rounded border p-2"
          />
          <input
            type="checkbox"
            checked={question.correct_answers?.includes(option.id)}
            onChange={(e) =>
              handleCorrectAnswerChange(option.id, e.target.checked)
            }
            className="mr-2"
          />
          <button
            type="button"
            onClick={() => deleteOption(question.id, option.id)}
            className="px-2 py-1 text-black"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addOption(question.id)}
        className="mt-2 rounded bg-sciquelTeal p-2 text-white"
      >
        Add Option
      </button>
    </div>
  );
};

export default SelectAllQuestion;
