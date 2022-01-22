import * as $ from "../actionTypes";

const initialState = {
  activeShape: null,

  shapes: [],
  totalShapes: 0,
  shapesLoading: false,

  questionList: [],
  totalQuestions: 0,
  questionsLoading: false,

  grades: [],
  durations: [],
  categories: [],

  questionSavingInProgress: false,

  resetForm: false,
};

export default function questionReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case $.GET_SHAPES:
      return {
        ...state,
        shapesLoading: true,
      };
    case $.SET_SHAPES:
      return {
        ...state,
        shapes: payload.shapes,
        totalShapes: payload.totalShapes,
        shapesLoading: false,
      };

    case $.GET_QUESTION_LIST_REQUEST:
      return {
        ...state,
        questionsLoading: true,
      };
    case $.GET_QUESTION_LIST_FINISHED:
      return {
        ...state,
        questionList: payload.questionList,
        totalQuestions: payload.totalQuestions,
        questionsLoading: false,
      };

    case $.GET_QUESTION_CONFIGS_FINISHED:
      return {
        ...state,
        categories: payload.categories,
        durations: payload.durations,
        grades: payload.grades,
      };

    case $.GET_SHAPE_DETAIL_FINISHED:
      return {
        ...state,
        activeShape: payload,
      };

    case $.CREATE_QUESTION_REQUEST:
      return {
        ...state,
        resetForm: false,
        questionSavingInProgress: true,
      };
    case $.CREATE_QUESTION_FINISHED:
      return {
        ...state,
        resetForm: true,
        questionSavingInProgress: false,
      };
    default:
      return state;
  }
}
