import * as $ from "../actionTypes";

const initialState = {
  students: [],
  totalStudents: 0,
  studentsLoading: false,
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
