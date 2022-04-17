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

    case $.GET_QUIZ_DETAIL_FINISHED:
      return {
        ...state,
        activeQuiz: payload,
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

    default:
      return state;
  }
}
