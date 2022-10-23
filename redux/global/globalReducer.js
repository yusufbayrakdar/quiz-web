import * as $ from "../actionTypes";

const initialState = {
  siderCollapsed: false,

  firebaseConfig: null,
};

export default function globalReducer(state = initialState, { type, payload }) {
  switch (type) {
    case $.COLLAPSE_SIDER:
      return {
        ...state,
        siderCollapsed: true,
      };
    case $.DECOLLAPSE_SIDER:
      return {
        ...state,
        siderCollapsed: false,
      };

    case $.GET_FIREBASE_CONFIG_FINISHED:
      return {
        ...state,
        firebaseConfig: payload,
      };

    default:
      return state;
  }
}
