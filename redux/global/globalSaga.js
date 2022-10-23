import { put, call, takeLatest } from "redux-saga/effects";

import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A } from "../../utils";

const tryGetFirebaseConfigSaga = function* () {
  try {
    const { data } = yield call(Api.getFirebaseConfig);

    yield put($A($.GET_FIREBASE_CONFIG_FINISHED, data));
  } catch (error) {
    showErrorMessage(error);
  }
};

export default function* scoreSaga() {
  yield takeLatest($.GET_FIREBASE_CONFIG_REQUEST, tryGetFirebaseConfigSaga);
}
