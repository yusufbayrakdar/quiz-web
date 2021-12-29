import { put, call, takeEvery } from "redux-saga/effects";
import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A, showErrorMessage, showSuccessMessage } from "../../utils";

const tryGetShapesSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getShapes, payload);
    const { docs: shapes, totalDocs: totalShapes } = data;

    yield put($A($.SET_SHAPES, { shapes, totalShapes }));
  } catch (error) {
    yield put($A($.SET_SHAPES, []));
    showErrorMessage("Could not get shapes");
  }
};

const tryGetShapeDetailSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getShapeDetail, payload);

    yield put($A($.GET_SHAPE_DETAIL_FINISHED, data));
  } catch (error) {
    yield put($A($.GET_SHAPE_DETAIL_FINISHED, null));
    showErrorMessage(error);
  }
};

export default function* shapeSaga() {
  yield takeEvery($.GET_SHAPES, tryGetShapesSaga);
  yield takeEvery($.GET_SHAPE_DETAIL_REQUEST, tryGetShapeDetailSaga);
}
