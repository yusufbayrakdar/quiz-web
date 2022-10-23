import * as $ from "../actionTypes";

const initialState = {
  shapes: [],
  totalShapes: 0,
  nextPageShapes: null,
  hasNextPageShapes: false,
  shapesLoading: false,
  searchShapes: false,

  activeShape: null,
  resetForm: false,
};

export default function shapeReducer(state = initialState, { type, payload }) {
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

    case $.CREATE_SHAPE_REQUEST:
      return {
        ...state,
        resetForm: false,
      };
    case $.CREATE_SHAPE_FINISHED:
      return {
        ...state,
        resetForm: true,
      };

    case $.GET_SHAPE_DETAIL_FINISHED:
      return {
        ...state,
        activeShape: payload,
      };
    default:
      return state;
  }
}
