import * as $ from "../actionTypes";

const initialState = {
  loggedIn: false,
  instructor: null,
  student: null,
  loginInProgress: false,
  autoLoginInLoading: false,
  userInfoVisible: false,
};

export default function authReducer(state = initialState, { type, payload }) {
  switch (type) {
    case $.LOGIN_REQUEST:
      return { ...state, loginInProgress: true };

    case $.INSTRUCTOR_LOGIN_SUCCESS:
      return {
        ...state,
        loginInProgress: false,
        student: null,
        instructor: payload,
        loggedIn: true,
      };

    case $.STUDENT_LOGIN_SUCCESS:
      return {
        ...state,
        loginInProgress: false,
        instructor: null,
        student: payload,
        loggedIn: true,
      };

    case $.LOGIN_FAILURE:
      return { ...state, loginInProgress: false, loggedIn: false, user: null };

    case $.AUTO_LOGIN_REQUEST:
      return { ...state, autoLoginInLoading: true };

    case $.AUTO_LOGIN_SUCCESS:
      return {
        ...state,
        autoLoginInLoading: false,
      };

    case $.AUTO_LOGIN_FAILURE:
      return {
        ...state,
        autoLoginInLoading: false,
        loggedIn: false,
        user: null,
      };

    case $.TOGGLE_USER_INFO:
      return {
        ...state,
        userInfoVisible: payload || !state.userInfoVisible,
      };

    case $.LOGOUT_REQUEST:
      return {
        ...state,
        autoLoginInLoading: false,
        loggedIn: false,
        loginInProgress: false,
        user: null,
      };

    default:
      return state;
  }
}
