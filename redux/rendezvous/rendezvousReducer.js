import * as $ from "../actionTypes";

const initialState = {
  rendezvouses: null,
};

export default function rendezvousReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case $.SET_RENDEZVOUSES:
      return {
        ...state,
        rendezvouses: payload,
      };
    default:
      return state;
  }
}
