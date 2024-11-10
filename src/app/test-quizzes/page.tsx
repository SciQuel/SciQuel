"use client";

import { useState } from "react";
import "./test.css";
import axios from "axios";
import { signOut } from "next-auth/react";

const dummyDataCreate = [
  {
    question_type: "SELECT_ALL",
    max_score: 10,
    subpart: {
      question: "This is a question",
      content_category: ["Content category"],
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct_answers: [0, 1, 2],
      explanations: [
        "This is a explaination 1",
        "This is a explaination 2",
        "This is a explaination 3",
        "This is a explaination 4",
      ],
    },
    subheader: "This is a subheader",
  },
  {
    question_type: "COMPLEX_MATCHING",
    max_score: 10,
    subpart: {
      content_category: [
        "Content category 1",
        "Content category 2",
        "Content category 1",
      ],
      question: "This is a question",
      categories: ["Category 1", "Category 2", "Category 3"],
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct_answers: [[0], [1], [2]],
      explanations: [
        "This is a explaination 1",
        "This is a explaination 2",
        "This is a explaination 3",
        "This is a explaination for place holder",
      ],
    },
    subheader: "This is a subheader",
  },
  {
    question_type: "DIRECT_MATCHING",
    max_score: 10,
    subpart: {
      question: "This is a question",
      content_category: [
        "Content category 1",
        "Content category 2",
        "Content category 1",
      ],
      categories: ["Category 1", "Category 2", "Category 3"],
      options: ["Option 1", "Option 2", "Option 3"],
      correct_answers: [0, 1, 2],
      explanations: [
        "This is a explaination 1",
        "This is a explaination 2",
        "This is a explaination 3",
      ],
    },
    subheader: "This is a subheader",
  },
  {
    question_type: "TRUE_FALSE",
    max_score: 10,
    subpart: {
      content_category: [
        "Content category 1",
        "Content category 2",
        "Content category 1",
        "Content category 2",
      ],
      questions: [
        "This is a question 1",
        "This is a question 2",
        "This is a question 3",
        "This is a question 4",
      ],
      explanations: [
        "This is a explaination 1",
        "This is a explaination 2",
        "This is a explaination 3",
        "This is a explaination 4",
      ],
      correct_answers: [true, false, true, false],
    },
    subheader: "This is a subheader",
  },
  {
    question_type: "MULTIPLE_CHOICE",
    max_score: 10,
    subpart: {
      content_category: ["Content category"],
      question: "This is a question",
      options: [
        "This is option 1",
        "This is option 2",
        "This is option 3",
        "This is option 4",
      ],
      correct_answer: 1,
      explanations: [
        "This is a explaination 1",
        "This is a explaination 2",
        "This is a explaination 3",
        "This is a explaination 4",
      ],
    },
    subheader: "This is a subheader",
  },
];
const dummyDataUpdate = [
  {
    question_type: "SELECT_ALL",
    max_score: 10,
    subpart: {
      question: "This is an updated question",
      content_category: ["Content category"],
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct_answers: [0, 1, 2],
      explanations: [
        "This is an updated explaination 1",
        "This is an updated explaination 2",
        "This is an updated explaination 3",
        "This is an updated explaination 4",
        "This is a explaination for place holder",
      ],
    },
    subheader: "This is an updated subheader",
  },
  {
    question_type: "COMPLEX_MATCHING",
    max_score: 10,
    subpart: {
      question: "This is an updated question",
      content_category: [
        "Content category 1",
        "Content category 2",
        "Content category 1",
      ],
      categories: ["Category 1", "Category 2", "Category 3"],
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct_answers: [[0], [1], [2]],
      explanations: [
        "This is an updated explaination 1",
        "This is an updated explaination 2",
        "This is an updated explaination 3",
      ],
    },
    subheader: "This is an updated subheader",
  },
  {
    question_type: "DIRECT_MATCHING",
    max_score: 10,
    subpart: {
      question: "This is an updated question",
      content_category: [
        "Content category 1",
        "Content category 2",
        "Content category 1",
      ],
      categories: ["Category 1", "Category 2", "Category 3"],
      options: ["Option 1", "Option 2", "Option 3"],
      correct_answers: [0, 1, 2],
      explanations: [
        "This is an updated explaination 1",
        "This is an updated explaination 2",
        "This is an updated explaination 3",
      ],
    },
    subheader: "This is an updated subheader",
  },
  {
    question_type: "TRUE_FALSE",
    max_score: 10,
    subpart: {
      content_category: [
        "Content category 1",
        "Content category 2",
        "Content category 1",
        "Content category 2",
      ],
      explanations: [
        "This is a explaination 1",
        "This is a explaination 2",
        "This is a explaination 3",
        "This is a explaination 4",
      ],
      questions: [
        "This is an updated question 1",
        "This is an updated question 2",
        "This is an updated question 3",
        "This is an updated question 4",
      ],
      correct_answers: [true, false, true, false],
    },
    subheader: "This is an updated subheader",
  },
  {
    question_type: "MULTIPLE_CHOICE",
    max_score: 10,
    subpart: {
      content_category: ["Content category"],
      question: "This is an updated question",
      options: [
        "This is option 1",
        "This is option 2",
        "This is option 3",
        "This is option 4",
      ],
      correct_answer: 1,
      explanations: [
        "This is a explaination 1",
        "This is a explaination 2",
        "This is a explaination 3",
        "This is a explaination 4",
      ],
    },
    subheader: "This is an updated subheader",
  },
];
const dummyDataGrade = [
  {
    question_type: "SELECT_ALL CORRECT",
    answer: [0, 1, 2],
  },
  {
    question_type: "SELECT_ALL CORRECT FEW",
    answer: [0, 2],
  },
  {
    question_type: "SELECT_ALL EMPTY",
    answer: [],
  },
  {
    question_type: "COMPLEX_MATCHING CORRECT",
    answer: [[0], [1], [2]],
  },
  {
    question_type: "COMPLEX_MATCHING CORRECT FEW",
    answer: [[0], [1], []],
  },
  {
    question_type: "COMPLEX_MATCHING EMPTY",
    answer: [[], [], []],
  },
  {
    question_type: "DIRECT_MATCHING CORRECT",
    answer: [0, 1, 2],
  },
  {
    question_type: "DIRECT_MATCHING CORRECT FEW",
    answer: [0, 2, 1],
  },
  {
    question_type: "DIRECT_MATCHING EMPTY",
    answer: [-1, -1, -1],
  },
  {
    question_type: "TRUE_FALSE CORRECT",
    answer: [true, false, true, false],
  },
  {
    question_type: "TRUE_FALSE CORRECT FEW",
    answer: [true, true, true, true],
  },
  {
    question_type: "TRUE_FALSE EMPTY",
    answer: [],
  },
  {
    question_type: "MULTIPLE_CHOICE CORRECT",
    answer: 1,
  },
  {
    question_type: "MULTIPLE_CHOICE CORRECT FEW",
    answer: 0,
  },
  {
    question_type: "MULTIPLE_CHOICE EMPTY",
    answer: -1,
  },
];
const objectQuiz: { [key: string]: string } = {};
export default function TestBackEnd() {
  const [storyId, setStoryId] = useState("6488c6f6f5f617c772f6f61a");
  const [quizQuestionId, setQuizQuestionId] = useState("");
  const [indexQuizType, setIndexQuizType] = useState(0);

  const [indexQuizAnsType, setIndexQuizAnsType] = useState(0);
  const [quizRecordId, setQuizRecordId] = useState("");
  function getQuiz() {
    axios
      .get("/api/quizzes", {
        params: { quiz_type: "PRE_QUIZ", story_id: storyId },
      })
      .then((data) => {
        console.log(data.data);
        setQuizRecordId(data.data.quiz_record_id || "");
        data.data.quizzes.forEach(
          ({ quiz_question_id = "", question_type = "" }) => {
            objectQuiz[question_type as string] = quiz_question_id;
          },
        );
      });
  }
  function createQuiz() {
    axios
      .post("/api/quizzes/edit", {
        story_id: storyId,
        ...dummyDataCreate[indexQuizType],
      })
      .then((data) => console.log(data.data));
  }
  function createGroupQuiz() {
    for (let i = 0; i < dummyDataCreate.length; i++) {
      axios
        .post("/api/quizzes/edit", {
          story_id: storyId,
          ...dummyDataCreate[i],
        })
        .then((data) => console.log(data.data));
    }
  }
  function updateQuiz() {
    axios
      .patch(
        "/api/quizzes/edit",
        { story_id: storyId, ...dummyDataUpdate[indexQuizType] },
        {
          params: {
            quiz_question_id:
              objectQuiz[dummyDataCreate[indexQuizType].question_type],
          },
        },
      )
      .then((data) => console.log(data.data));
  }
  function deleteQuiz() {
    axios
      .delete("/api/quizzes/edit", {
        params: {
          quiz_question_id:
            objectQuiz[dummyDataCreate[indexQuizType].question_type],
        },
      })
      .then((data) => console.log(data.data));
  }
  function gradeQuiz() {
    axios
      .post("/api/grade", {
        quiz_question_id:
          objectQuiz[dummyDataCreate[indexQuizType].question_type],
        quiz_record_id: quizRecordId,
        answer: dummyDataGrade[indexQuizAnsType].answer,
      })
      .then((data) => console.log(data));
  }

  function getQuizResult() {
    axios
      .get("/api/quiz-result", { params: storyId ? { story_id: storyId } : {} })
      .then((data) => console.log(data));
  }
  return (
    <div className="testBox">
      <div className="quizBox">
        <div>
          <div
            style={{ textAlign: "center", fontWeight: "600", fontSize: "25px" }}
          >
            Quiz Route test
          </div>
          <label>
            Story Id
            <input
              className="inputTest"
              value={storyId}
              onChange={(e) => setStoryId(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Quiz Question Id:
            <input
              className="inputTest"
              value={quizQuestionId}
              onChange={(e) => setQuizQuestionId(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Quiz Type:
            <input
              disabled={true}
              style={{ textAlign: "center" }}
              className="inputTest"
              value={dummyDataCreate[indexQuizType].question_type}
            />
          </label>
        </div>
        <div className="buttonContainerTest">
          <button
            className="buttonQuizTest"
            disabled={indexQuizType === 0}
            onClick={() => setIndexQuizType((prev) => prev - 1)}
          >
            Prev type
          </button>{" "}
          <button
            className="buttonQuizTest"
            disabled={indexQuizType >= dummyDataCreate.length - 1}
            onClick={() => setIndexQuizType((prev) => prev + 1)}
          >
            Next type
          </button>
        </div>
        <div className="buttonContainerTest">
          <button className="buttonQuizTest" onClick={getQuiz}>
            Get quizzes
          </button>
        </div>
        <div className="buttonContainerTest">
          <button className="buttonQuizTest" onClick={createQuiz}>
            Create Quiz
          </button>
        </div>
        <div className="buttonContainerTest">
          <button className="buttonQuizTest" onClick={createGroupQuiz}>
            Create Group Quiz
          </button>
        </div>
        <div className="buttonContainerTest">
          <button className="buttonQuizTest" onClick={updateQuiz}>
            Update Quiz
          </button>
        </div>
        <div className="buttonContainerTest">
          <button className="buttonQuizTest" onClick={deleteQuiz}>
            Delete Quiz
          </button>
        </div>
      </div>
      <div className="gradeBox">
        <div>
          <div
            style={{ textAlign: "center", fontWeight: "600", fontSize: "25px" }}
          >
            Grade Route test
          </div>
        </div>
        <div>
          <label>
            Quiz Question Id:
            <input
              className="inputTest"
              onChange={(e) => setQuizQuestionId(e.target.value)}
              value={quizQuestionId}
            />
          </label>
        </div>
        <div>
          <label>
            Quiz Type:
            <input
              disabled={true}
              style={{ textAlign: "center", width: "300px" }}
              className="inputTest"
              value={dummyDataGrade[indexQuizAnsType].question_type}
            />
          </label>
        </div>
        <div className="buttonContainerTest">
          <button
            className="buttonQuizTest"
            disabled={indexQuizAnsType === 0}
            onClick={() => setIndexQuizAnsType((prev) => prev - 1)}
          >
            Prev type
          </button>{" "}
          <button
            className="buttonQuizTest"
            disabled={indexQuizAnsType >= dummyDataGrade.length - 1}
            onClick={() => setIndexQuizAnsType((prev) => prev + 1)}
          >
            Next type
          </button>
        </div>
        <div className="buttonContainerTest">
          <button className="buttonQuizTest" onClick={gradeQuiz}>
            Grade Quiz
          </button>
        </div>
        <div className="buttonContainerTest">
          <button className="buttonQuizTest" onClick={getQuizResult}>
            Get Quiz Result
          </button>
        </div>
        <div className="buttonContainerTest">
          <button className="buttonQuizTest" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
        <div className="buttonContainerTest">
          <button
            className="buttonQuizTest"
            onClick={() => (window.location.href = "/auth/login")}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}