import * as $ from "../actionTypes";

const initialState = {
  scoreList: [],
  totalScores: 0,
  scoreListInProgress: false,

  activeScore: null,
  activeScoreInProgress: false,
};

export default function scoreReducer(state = initialState, { type, payload }) {
  switch (type) {
    case $.GET_SCORE_LIST_REQUEST:
      return {
        ...state,
        scoreListInProgress: true,
      };
    case $.GET_SCORE_LIST_FINISHED:
      return {
        ...state,
        scoreListInProgress: false,
        scoreList: payload.scoreList,
        totalScores: payload.totalScores,
      };

    default:
      return state;
  }
}
