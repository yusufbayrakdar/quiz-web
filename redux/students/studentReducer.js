import * as $ from "../actionTypes";

const initialState = {
  students: [],
  totalStudents: 0,
  studentsLoading: false,
  hasNextPage: false,
  nextPage: 0,
  resetForm: false,
};

export default function studentReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case $.GET_STUDENTS:
      return {
        ...state,
        studentsLoading: true,
      };
    case $.SET_STUDENTS:
      return {
        ...state,
        students: payload.students,
        totalStudents: payload.totalStudents,
        hasNextPage: payload.hasNextPage,
        nextPage: payload.nextPage,
        studentsLoading: false,
      };
    case $.ADD_STUDENTS:
      return {
        ...state,
        students: [...state.students, ...payload.students],
        totalStudents: payload.totalStudents,
        hasNextPage: payload.hasNextPage,
        nextPage: payload.nextPage,
        studentsLoading: false,
      };
    case $.CREATE_STUDENT_REQUEST:
      return {
        ...state,
        resetForm: false,
      };
    case $.CREATE_STUDENT_FINISHED:
      return {
        ...state,
        resetForm: true,
      };
    default:
      return state;
  }
}
