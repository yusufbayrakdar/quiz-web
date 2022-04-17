import * as $ from "../actionTypes";

const initialState = {
  shapes: [],
  totalShapes: 0,
  nextPageShapes: null,
  hasNextPageShapes: false,
  shapesLoading: false,
  searchShapes: false,
  dragItem: null,

  activeQuestion: {
    question: [],
    choices: [],
    correctAnswer: "",
  },

  questionList: [],
  totalQuestions: 0,
  questionsLoading: false,

  grades: [],
  durations: [],
  categories: [],

  questionSavingInProgress: false,
  questionDeleteInProgress: false,

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
        nextPageShapes: payload.nextPageShapes,
        hasNextPageShapes: payload.hasNextPageShapes,
        shapesLoading: false,
        searchShapes: true,
      };

    case $.ADD_SHAPES:
      return {
        ...state,
        shapes: [...state.shapes, ...payload.shapes],
        totalShapes: payload.totalShapes,
        nextPageShapes: payload.nextPageShapes,
        hasNextPageShapes: payload.hasNextPageShapes,
        shapesLoading: false,
        searchShapes: false,
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

    case $.UPDATE_QUESTION_REQUEST:
      return {
        ...state,
        questionSavingInProgress: true,
      };
    case $.UPDATE_QUESTION_FINISHED:
      return {
        ...state,
        questionSavingInProgress: false,
      };

    case $.ADD_SHAPE_TO_QUESTION:
      return {
        ...state,
        activeQuestion: {
          ...state.activeQuestion,
          question: [
            ...(state.activeQuestion?.question || []),
            {
              coordinate: payload,
              shape: {
                _id: state.dragItem?._id,
                imageUrl: state.dragItem?.imageUrl,
              },
            },
          ],
        },
      };
    case $.REMOVE_SHAPE_FROM_QUESTION:
      return {
        ...state,
        activeQuestion: {
          ...state.activeQuestion,
          question: state.activeQuestion?.question?.filter(
            (e) => e.coordinate !== payload
          ),
        },
      };

    case $.ADD_SHAPE_TO_CHOICES:
      return {
        ...state,
        activeQuestion: {
          ...state.activeQuestion,
          choices: [
            ...(state.activeQuestion?.choices || []),
            {
              coordinate: payload,
              shape: {
                _id: state.dragItem?._id,
                imageUrl: state.dragItem?.imageUrl,
              },
            },
          ],
        },
      };
    case $.REMOVE_SHAPE_TO_CHOICES:
      return {
        ...state,
        activeQuestion: {
          ...state.activeQuestion,
          choices: state.activeQuestion?.choices?.filter(
            (e) => e.coordinate !== payload
          ),
          correctAnswer:
            state.activeQuestion?.correctAnswer === payload
              ? ""
              : state.activeQuestion?.correctAnswer,
        },
      };

    case $.RESET_ACTIVE_QUESTION:
      return {
        ...state,
        activeQuestion: {
          question: [],
          choices: [],
          correctAnswer: "",
        },
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
    case $.QUESTION_FORM_RESET:
      return {
        ...state,
        activeQuestion: {
          question: [],
          choices: [],
          correctAnswer: "",
        },
        questionSavingInProgress: false,
        questionDeleteInProgress: false,
        resetForm: false,
      };

    case $.DELETE_QUESTION_REQUEST:
      return {
        ...state,
        questionDeleteInProgress: true,
      };
    case $.DELETE_QUESTION_FINISHED:
      return {
        ...state,
        questionDeleteInProgress: false,
      };

    case $.GET_QUESTION_DETAIL_FINISHED:
      return {
        ...state,
        activeQuestion: payload,
      };

    case $.SET_CORRECT_ANSWER:
      return {
        ...state,
        activeQuestion: { ...state.activeQuestion, correctAnswer: payload },
      };

    case $.SET_DRAG_ITEM:
      return {
        ...state,
        dragItem: payload,
      };

    default:
      return state;
  }
}
