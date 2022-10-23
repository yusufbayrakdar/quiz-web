import { put, call, takeEvery } from "redux-saga/effects";
import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A, showErrorMessage, showSuccessMessage } from "../../utils";

const tryGetShapesSaga = function* ({ payload }) {
  try {
    const putAction = payload.action;
    delete payload.action;
    const { data } = yield call(Api.getShapes, payload);
    const {
      docs: shapes,
      totalDocs: totalShapes,
      nextPage: nextPageShapes,
      hasNextPage: hasNextPageShapes,
    } = data;

    yield put(
      $A(putAction, {
        shapes,
        totalShapes,
        nextPageShapes,
        hasNextPageShapes,
      })
    );
  } catch (error) {
    yield put($A($.ADD_SHAPES, []));
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

const tryCreateShapeSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.createShape, payload);

    showSuccessMessage("Şekil başarıyla oluşturuldu");
    yield put($A($.CREATE_SHAPE_FINISHED));
  } catch (error) {
    showErrorMessage(error);
  }
};

const tryUpdateShapeSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.updateShape, payload);

    showSuccessMessage("Şekil başarıyla güncellendi");
    yield put($A($.UPDATE_SHAPE_FINISHED));
  } catch (error) {
    showErrorMessage(error);
  }
};

export default function* shapeSaga() {
  yield takeEvery($.GET_SHAPES, tryGetShapesSaga);
  yield takeEvery($.CREATE_SHAPE_REQUEST, tryCreateShapeSaga);
  yield takeEvery($.UPDATE_SHAPE_REQUEST, tryUpdateShapeSaga);
  yield takeEvery($.GET_SHAPE_DETAIL_REQUEST, tryGetShapeDetailSaga);
}
