import { QuestionType, QuizType } from "@prisma/client";

export interface MultipleChoiceQuestionResponse {
  content_category: string[];
  max_score: number;
  options: string[];
  question: string;
  quiz_question_id: string;
  sub_header: string;
  question_type: QuestionType;
}

export interface TrueFalseQuestionResponse {
  content_category: string[];
  max_score: number;
  questions: string[];
  question_type: QuestionType;
  quiz_question_id: string;
  sub_header: string;
}

export interface DirectMatchingQuestionResponse {
  content_category: string[];
  max_score: number;
  options: string[];
  categories: string[];
  question: string;
  question_type: QuestionType;
  quiz_question_id: string;
  sub_header: string;
}

export interface ComplexMatchingQuestionResponse {
  content_category: string[];
  max_score: number;
  options: string[];
  categories: string[];
  question: string;
  question_type: QuestionType;
  quiz_question_id: string;
  sub_header: string;
}

export interface SelectAllQuestionResponse {
  content_category: string[];
  max_score: number;
  options: string[];
  question: string;
  question_type: QuestionType;
  quiz_question_id: string;
  sub_header: string;
}

export type AllQuestionResponses =
  | MultipleChoiceQuestionResponse
  | TrueFalseQuestionResponse
  | DirectMatchingQuestionResponse
  | ComplexMatchingQuestionResponse
  | SelectAllQuestionResponse;

export type MultipleChoiceQuestionEditorResponse =
  MultipleChoiceQuestionResponse & { correctAnswer: number };

export type TrueFalseQuestionEditorResponse = TrueFalseQuestionResponse & {
  correctAnswer: boolean[];
};

export type DirectMatchingQuestionEditorResponse =
  DirectMatchingQuestionResponse & {
    correctAnswer: number[];
  };

export type ComplexMatchingQuestionEditorResponse =
  ComplexMatchingQuestionResponse & { correctAnswer: number[][] };

export type SelectAllQuestionEditorResponse = SelectAllQuestionResponse & {
  correctAnswer: number[];
};

export type AllQuestionEditorResponses =
  | MultipleChoiceQuestionEditorResponse
  | TrueFalseQuestionEditorResponse
  | DirectMatchingQuestionEditorResponse
  | ComplexMatchingQuestionEditorResponse
  | SelectAllQuestionEditorResponse;
