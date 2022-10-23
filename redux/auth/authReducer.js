import * as $ from "../actionTypes";

const initialState = {
  loggedIn: false,
  instructor: null,
  student: null,
  user: null,
  loginInProgress: false,
  autoLoginInLoading: false,
};

export default function authReducer(state = initialState, { type, payload }) {
  switch (type) {
    case $.LOGIN_REQUEST:
      return { ...state, loginInProgress: true };

    case $.LOGIN_SUCCESS:
      return {
        ...state,
        loginInProgress: false,
        user: payload,
        loggedIn: true,
      };

    case $.LOGIN_FAILURE:
      return { ...state, loginInProgress: false, loggedIn: false, user: null };

    case $.AUTO_LOGIN_REQUEST:
      return { ...state, autoLoginInLoading: true };

    case $.AUTO_LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        autoLoginInLoading: false,
      };

    case $.AUTO_LOGIN_FAILURE:
      return {
        ...state,
        autoLoginInLoading: false,
        loggedIn: false,
        user: null,
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
