import React, { useEffect, useRef } from "react";
import { type Choice, type Question } from "./Trivia";

interface MultipleChoiceQuestionProps {
  question: Question;
  updateQuestion: (id: number, updatedQuestion: Partial<Question>) => void;
  addChoice: (questionId: number) => void;
  deleteChoice: (questionId: number, choiceId: number) => void;
  updateChoice: (
    questionId: number,
    choiceId: number,
    updatedChoice: Partial<Choice>,
  ) => void;
}

// Reusable custom hook for auto-resizing textarea
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

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  updateQuestion,
  addChoice,
  deleteChoice,
  updateChoice,
}) => {
  const explanationTextareaRef = useAutoResizeTextarea(
    question.explanation || "",
  );

  const handleQuestionChange = (content: string) => {
    updateQuestion(question.id, { content });
  };

  const handleExplanationChange = (explanation: string) => {
    updateQuestion(question.id, { explanation });
  };

  const handleChoiceChange = (choiceId: number, content: string) => {
    updateChoice(question.id, choiceId, { content });
  };

  const handleChoiceCorrectChange = (choiceId: number, isCorrect: boolean) => {
    updateQuestion(question.id, {
      choices: question.choices?.map((choice) =>
        choice.id === choiceId
          ? { ...choice, isCorrect }
          : { ...choice, isCorrect: false },
      ),
    });
  };

  return (
    <div className="mt-2">
      <input
        type="text"
        value={question.content || ""}
        onChange={(e) => handleQuestionChange(e.target.value)}
        className="mb-2 w-full rounded border p-2"
        placeholder="Enter question..."
      />
      {question.choices?.map((choice) => (
        <div key={choice.id} className="mt-2 flex items-center">
          <input
            type="text"
            value={choice.content}
            onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
            className="mr-2 w-full rounded border p-2"
            placeholder="Enter choice..."
          />
          <input
            type="radio"
            checked={choice.isCorrect}
            onChange={() => handleChoiceCorrectChange(choice.id, true)}
            className="mr-2"
          />
          <button
            type="button"
            onClick={() => deleteChoice(question.id, choice.id)}
            className="text-sciquelTeal"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addChoice(question.id)}
        className="mt-2 rounded bg-sciquelTeal px-2 py-1 text-sm text-white"
      >
        Add Choice
      </button>
      {/* Explanation textarea with auto-resize */}
      <textarea
        ref={explanationTextareaRef}
        value={question.explanation || ""}
        onChange={(e) => handleExplanationChange(e.target.value)}
        className="mt-2 w-full resize-none overflow-hidden rounded border p-2"
        placeholder="Enter explanation..."
        rows={1}
      />
    </div>
  );
};

export default MultipleChoiceQuestion;
