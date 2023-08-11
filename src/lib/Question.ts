/* one thing not yet in any of the question types: question stats!!
 *  currently the question stats ("x% of SciQuel users answered this question correctly")
 *  are just hardcoded values in the quizzes for now because I'm not sure how the backend will
 *  implement each quizzes stats (for each question)
 */

/* for MC & T/F Quizzes */
/* look at @/pages/quiz_mc and @/pages/quiz_tf for examples */
export class Question {
  questionText: string; // the question/problem (the large bold text)
  choices: string[]; // a list of the MC choices, or TF statements
  correctAnswer: string[]; // for MC: a list containing the text of the correct answer, for TF: a list of the correct T/F answers, in order
  answerExplanation: string[]; // a list of the answer explanation(s) (1 for each MC question, multiple for each statement in TF)

  constructor(
    questionText: string,
    choices: string[],
    correctAnswer: string[],
    answerExplanation: string[],
  ) {
    this.questionText = questionText;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
    this.answerExplanation = answerExplanation;
  }
}

/* for One-Match Quizzes */
/* look at @/pages/quiz_om for examples */
export class OneMatchQuestion extends Question {
  matchStatements: string[]; // a list containing the statements the user must match to

  constructor(
    questionText: string,
    choices: string[], // a list containing the match options that the user can drag
    correctAnswer: string[],
    answerExplanation: string[], // a list of the answer explanations, one for each match statement
    matchStatements: string[],
  ) {
    super(questionText, choices, correctAnswer, answerExplanation);
    this.matchStatements = matchStatements;
  }
}

/* for Multiple Match Quizzes */
/* look at @/pages/quiz_mm for examples */
export class MultipleMatchQuestion {
  questionText: string; // the question/problem (the large bold text)
  matchStatements: string[]; // a list containing the statements the user must match to
  choices: string[]; // a list containing the match options that the user can drag
  answerExplanation: string[]; // a list of the answer explanations, one for each match statement
  correctAnswerMap: Map<string, string[]>; // a mapping of match statements (key) to a list of the text of their correct match option choices

  constructor(
    questionText: string,
    matchStatements: string[],
    choices: string[],
    answerExplanation: string[],
    correctAnswerMap: Map<string, string[]>,
  ) {
    this.questionText = questionText;
    this.matchStatements = matchStatements;
    this.choices = choices;
    this.answerExplanation = answerExplanation;
    this.correctAnswerMap = correctAnswerMap;
  }
}
