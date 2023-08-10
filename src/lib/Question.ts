/* for MC & T/F Quizzes */
export class Question {
  questionNumber: string;
  questionText: string;
  choices: string[];
  correctAnswer: string[];
  answerExplanation: string[];

  constructor(
    questionNumber: string,
    questionText: string,
    choices: string[],
    correctAnswer: string[],
    answerExplanation: string[],
  ) {
    this.questionNumber = questionNumber;
    this.questionText = questionText;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
    this.answerExplanation = answerExplanation;
  }
}

/* for One-Match Quizzes */
export class OneMatchQuestion extends Question {
  matchStatements: string[];

  constructor(
    questionNumber: string,
    questionText: string,
    choices: string[],
    correctAnswer: string[],
    answerExplanation: string[],
    matchStatements: string[],
  ) {
    super(
      questionNumber,
      questionText,
      choices,
      correctAnswer,
      answerExplanation,
    );
    this.matchStatements = matchStatements;
  }
}

export class MultipleMatchQuestion {
  questionNumber: string;
  questionText: string;
  matchStatements: string[];
  choices: string[];
  answerExplanation: string[];
  correctAnswerMap: Map<string, string[]>;

  constructor(
    questionNumber: string,
    questionText: string,
    matchStatements: string[],
    choices: string[],
    answerExplanation: string[],
    correctAnswerMap: Map<string, string[]>,
  ) {
    this.questionNumber = questionNumber;
    this.questionText = questionText;
    this.matchStatements = matchStatements;
    this.choices = choices;
    this.answerExplanation = answerExplanation;
    this.correctAnswerMap = correctAnswerMap;
  }
}

// /* for One-Match or Multiple Match Quizzes */
// export class MultipleMatchQuestion extends OneMatchQuestion {
//   correctAnswerMap: Map<string, string[]>;

//   constructor(
//     questionNumber: string,
//     questionText: string,
//     matchStatements: string[];
//     choices: string[],
//     correctAnswer: string[],
//     answerExplanation: string[],
//     correctAnswerMap: Map<string, string[]>;
//   ) {
//     super(
//       questionNumber,
//       questionText,
//       matchStatements,
//       choices,
//       [],
//       answerExplanation,
//     );
//     this.correctAnswerMap = correctAnswerMap;
//   }
// }
