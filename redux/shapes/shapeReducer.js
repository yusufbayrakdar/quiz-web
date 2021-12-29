import * as $ from "../actionTypes";

const initialState = {
  shapes: [],
  totalShapes: 0,
  activeShape: null,
  shapesLoading: false,
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
        shapesLoading: false,
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
