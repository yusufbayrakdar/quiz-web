import * as $ from "../actionTypes";

const initialState = {
  siderCollapsed: false,
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

    default:
      return state;
  }
}
