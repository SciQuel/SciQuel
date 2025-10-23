declare global {
  namespace PrismaJson {
    interface MultipleChoiceQuestion {
      questionType: "MULTIPLE_CHOICE";
      options: string[];
      question: string;
      correctAnswer: number;
    }

    interface TrueFalseQuestion {
      questionType: "TRUE_FALSE";
      questions: string[];
      correctAnswer: boolean[];
    }

    interface DirectMatchingQuestion {
      questionType: "DIRECT_MATCHING";
      question: string;
      categories: string[];
      options: string[];
      correctAnswer: number[];
    }

    interface ComplexMatchingQuestion {
      questionType: "COMPLEX_MATCHING";
      question: string;
      categories: string[];
      options: string[];
      correctAnswer: number[][];
    }

    interface SelectAllQuestion {
      questionType: "SELECT_ALL";
      question: string;
      options: string[];
      correctAnswer: number[];
    }

    type QuestionJson =
      | MultipleChoiceQuestion
      | TrueFalseQuestion
      | DirectMatchingQuestion
      | ComplexMatchingQuestion
      | SelectAllQuestion;
  }
}

export {};
