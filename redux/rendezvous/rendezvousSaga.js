import { put, call, takeEvery, takeLatest } from "redux-saga/effects";
import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A, showErrorMessage, showSuccessMessage } from "../../utils";

const tryTakeRendezvousSaga = function* ({ payload }) {
  try {
    yield call(Api.takeRendezvous, payload);

    yield put($A($.GET_RENDEZVOUSES));
    showSuccessMessage("Randevu başarıyla alındı");
  } catch (error) {
    yield put($A($.GET_RENDEZVOUSES));
    showErrorMessage(error);
  }
};

const tryGetRendezvousesSaga = function* () {
  try {
    const { data } = yield call(Api.getRendezvous);

    yield put($A($.SET_RENDEZVOUSES, data));
  } catch (error) {
    yield put($A($.TAKE_RENDEZVOUS_FAILURE));
  }
};

export default function* authSaga() {
  yield takeEvery($.TAKE_RENDEZVOUS_REQUEST, tryTakeRendezvousSaga);
  yield takeEvery($.GET_RENDEZVOUSES, tryGetRendezvousesSaga);
}
