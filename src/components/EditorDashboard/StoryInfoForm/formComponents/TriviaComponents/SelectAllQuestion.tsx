import React, { useEffect, useRef } from "react";
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

// Custom hook for auto-resizing textarea
const useAutoResizeTextarea = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to get accurate scrollHeight
      textareaRef.current.style.height = "auto";
      // Set new height based on content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return textareaRef;
};

const SelectAllQuestion: React.FC<SelectAllQuestionProps> = ({
  question,
  updateQuestion,
  addOption,
  deleteOption,
  updateOption,
}) => {
  const textareaRef = useAutoResizeTextarea(question.explanation || "");

  const handleOptionChange = (optionId: number, content: string) => {
    updateOption(question.id, optionId, { content });
  };

  const handleCorrectAnswerChange = (optionId: number, isCorrect: boolean) => {
    const updatedCorrectAnswers = isCorrect
      ? [...(question.correct_answers || []), optionId]
      : (question.correct_answers || []).filter((id) => id !== optionId);
    updateQuestion(question.id, { correct_answers: updatedCorrectAnswers });
  };

  const handleExplanationChange = (explanation: string) => {
    updateQuestion(question.id, { explanation });
  };

  return (
    <div>
      {/* Question Input */}
      <input
        type="text"
        value={question.content}
        onChange={(e) =>
          updateQuestion(question.id, { content: e.target.value })
        }
        placeholder="Enter question"
        className="mb-2 w-full rounded border p-2"
      />

      {/* Options */}
      {question.options?.map((option, index) => (
        <div key={option.id} className="mb-2 flex items-center">
          <input
            type="text"
            value={option.content}
            onChange={(e) => handleOptionChange(option.id, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="mr-2 w-full rounded border p-2"
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

      {/* Add Option Button */}
      <button
        type="button"
        onClick={() => addOption(question.id)}
        className="mt-2 rounded bg-sciquelTeal p-2 text-white"
      >
        Add Option
      </button>

      {/* Auto-resizing Explanation Box */}
      <textarea
        ref={textareaRef}
        value={question.explanation || ""}
        onChange={(e) => handleExplanationChange(e.target.value)}
        placeholder="Enter explanation for this question..."
        className="mt-4 w-full resize-none overflow-hidden rounded border p-2"
        rows={1}
      />
    </div>
  );
};

export default SelectAllQuestion;
