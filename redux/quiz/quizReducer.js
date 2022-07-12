import { shuffle } from "../../utils";
import * as $ from "../actionTypes";

const initialState = {
  activeQuiz: {
    name: "",
    questionSet: new Set(),
    creator: "",
    duration: 0,
  },

  quizList: [],
  totalQuizzes: 0,
  quizListLoading: false,

  quizSavingInProgress: false,
  quizDeleteInProgress: false,

  resetForm: false,

  currentQuestion: null,
  finishQuizInProgress: false,
  quizSubmission: {
    quiz: null,
    answerList: [
      /*
        {
          questionId,
          answer
        }
      */
    ],
  },
  quizResult: null,
};

export default function quizReducer(state = initialState, { type, payload }) {
  switch (type) {
    case $.ADD_QUESTION_TO_QUIZ:
      state.activeQuiz.questionSet.add(payload);
      return {
        ...state,
        activeQuiz: {
          ...state.activeQuiz,
          questionSet: state.activeQuiz.questionSet,
        },
      };
    case $.REMOVE_QUESTION_FROM_QUIZ:
      state.activeQuiz.questionSet.delete(payload);
      return {
        ...state,
        activeQuiz: {
          ...state.activeQuiz,
          questionSet: state.activeQuiz.questionSet,
        },
      };

    case $.RESET_ACTIVE_QUIZ:
      return {
        ...state,
        activeQuiz: {
          name: "",
          questionSet: new Set(),
          creator: "",
          duration: 0,
        },
      };

    case $.CREATE_QUIZ_REQUEST:
      return {
        ...state,
        resetForm: false,
        quizSavingInProgress: true,
      };
    case $.CREATE_QUIZ_FINISHED:
      return {
        ...state,
        resetForm: true,
        quizSavingInProgress: false,
        activeQuiz: {
          name: "",
          questionSet: new Set(),
          creator: "",
          duration: 0,
        },
      };
    case $.UPDATE_QUIZ_REQUEST:
      return {
        ...state,
        quizSavingInProgress: true,
      };
    case $.UPDATE_QUIZ_FINISHED:
      return {
        ...state,
        quizSavingInProgress: false,
      };
    case $.QUIZ_FORM_RESET:
      return {
        ...state,
        activeQuiz: {
          name: "",
          questionSet: new Set(),
          creator: "",
          duration: 0,
        },
        quizSavingInProgress: false,
        quizDeleteInProgress: false,
        resetForm: false,
        currentQuestion: null,
        quizSubmission: {
          quiz: null,
          answerList: [],
        },
        quizResult: null,
      };

    case $.DELETE_QUIZ_REQUEST:
      return {
        ...state,
        quizDeleteInProgress: true,
      };
    case $.DELETE_QUIZ_FINISHED:
      return {
        ...state,
        quizDeleteInProgress: false,
      };

    case $.GET_QUIZ_DETAIL_REQUEST:
      return {
        ...state,
        quizSubmission: {
          ...state.quizSubmission,
          quiz: payload?._id,
        },
      };
    case $.GET_QUIZ_DETAIL_FINISHED:
      const add = payload.add;
      delete payload.add;
      const docs = add
        ? [
            ...(state?.activeQuiz?.questionList?.docs ||
              state?.activeQuiz?.questionList ||
              []),
            ...shuffle(payload.questionList?.docs || payload.questionList),
          ]
        : shuffle(payload.questionList?.docs || payload.questionList);

      const questionList = payload.questionList?.docs
        ? {
            ...payload.questionList,
            docs,
          }
        : docs;
      return {
        ...state,
        activeQuiz: {
          ...payload,
          questionList,
          questionSet: new Set(questionList?.docs || questionList),
        },
      };

    case $.GET_QUIZ_LIST_REQUEST:
      return {
        ...state,
        quizListLoading: true,
      };

    case $.GET_QUIZ_LIST_FINISHED:
      return {
        ...state,
        quizList: payload.quizList,
        totalQuizzes: payload.totalQuizzes,
        quizListLoading: false,
      };

    case $.ASSIGN_QUESTION_ID:
      return {
        ...state,
        currentQuestion: payload,
      };
    case $.SIGN_QUESTION:
      if (
        state.quizSubmission?.answerList?.length >=
        state.activeQuiz?.questionList?.totalDocs
      )
        return state;
      return {
        ...state,
        quizSubmission: {
          ...state.quizSubmission,
          answerList: [
            ...state.quizSubmission.answerList,
            { questionId: state.currentQuestion, answer: payload },
          ],
        },
      };

    case $.FINISH_QUIZ_REQUEST:
      return {
        ...state,
        finishQuizInProgress: true,
      };
    case $.FINISH_QUIZ_FINISHED:
      return {
        ...state,
        finishQuizInProgress: false,
        quizResult: payload,
      };

    default:
      return state;
  }
}
