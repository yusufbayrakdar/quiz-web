import { put, call, takeLatest } from "redux-saga/effects";

import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A } from "../../utils";

const tryGetScoreListSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getScoreList, payload);

    yield put(
      $A($.GET_SCORE_LIST_FINISHED, {
        scoreList: data.docs,
        totalScores: data.totalDocs,
      })
    );
  } catch (error) {
    showErrorMessage(error);
  }
};

const tryGetScoreDetailSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getScoreDetail, payload);

    yield put($A($.GET_SCORE_DETAIL_FINISHED, data));
  } catch (error) {
    showErrorMessage(error);
  }
};

export default function* scoreSaga() {
  yield takeLatest($.GET_SCORE_LIST_REQUEST, tryGetScoreListSaga);
  yield takeLatest($.GET_SCORE_DETAIL_REQUEST, tryGetScoreDetailSaga);
}
