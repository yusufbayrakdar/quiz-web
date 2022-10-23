import * as $ from "../actionTypes";

const initialState = {
  activeUser: null,
  activeUserLoading: false,

  users: [],
  totalUsers: 0,
  usersLoading: false,

  instructorsOfStudent: [],
  instructorsOfStudentLoading: false,

  studentsOfInstructor: [],
  studentsOfInstructorLoading: false,

  resetForm: false,
};

export default function userReducer(state = initialState, { type, payload }) {
  switch (type) {
    case $.GET_USERS:
      return {
        ...state,
        usersLoading: true,
      };
    case $.SET_USERS:
      return {
        ...state,
        users: payload.users,
        totalUsers: payload.totalUsers,
        usersLoading: false,
      };

    case $.GET_USER_DETAIL:
      return {
        ...state,
        activeUserLoading: true,
      };
    case $.SET_USER_DETAIL:
      return {
        ...state,
        activeUser: payload,
        activeUserLoading: false,
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

    case $.UPDATE_STUDENT_FINISHED:
      return {
        ...state,
        resetForm: true,
      };
    case $.RESET_USER_RESET:
      return {
        ...state,
        resetForm: false,
      };
    case $.GET_INSTRUCTORS_OF_STUDENT_REQUEST:
      return {
        ...state,
        instructorsOfStudentLoading: true,
      };
    case $.GET_INSTRUCTORS_OF_STUDENT_FINISHED:
      return {
        ...state,
        instructorsOfStudent: payload,
        instructorsOfStudentLoading: false,
      };
    case $.GET_STUDENTS_OF_INSTRUCTOR_FINISHED:
      return {
        ...state,
        studentsOfInstructor: payload,
        studentsOfInstructorLoading: false,
      };

    default:
      return state;
  }
}
