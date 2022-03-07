import { put, call, takeLatest } from "redux-saga/effects";
import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A, showErrorMessage, showSuccessMessage } from "../../utils";

const tryGetShapesSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getShapes, payload);
    const {
      docs: shapes,
      totalDocs: totalShapes,
      nextPage: nextPageShapes,
      hasNextPage: hasNextPageShapes,
    } = data;

    yield put(
      $A($.SET_SHAPES, {
        shapes,
        totalShapes,
        nextPageShapes,
        hasNextPageShapes,
      })
    );
  } catch (error) {
    yield put($A($.SET_SHAPES, []));
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

const tryGetQuestionConfigsSaga = function* () {
  try {
    const { data } = yield call(Api.getQuestionConfigs);
    const { categories, durations, grades } = data;
    let payload = {};
    if (categories.length) payload = { categories };
    if (durations.length) payload = { ...payload, durations };
    if (grades.length) payload = { ...payload, grades };

    yield put($A($.GET_QUESTION_CONFIGS_FINISHED, payload));
  } catch (error) {}
};

const tryGetQuestionListSaga = function* () {
  try {
    const { data } = yield call(Api.getQuestionList);
    const { docs, totalDocs } = data;

    yield put(
      $A($.GET_QUESTION_LIST_FINISHED, {
        questionList: docs,
        totalQuestions: totalDocs,
      })
    );
  } catch (error) {
    yield put(
      $A($.GET_QUESTION_LIST_FINISHED, { questionList: [], totalQuestions: 0 })
    );
  }
};

const tryCreateQuestionSaga = function* ({ payload }) {
  try {
    yield call(Api.createQuestion, payload);

    yield put($A($.CREATE_QUESTION_FINISHED));
    showSuccessMessage("Soru başarıyla oluşturuldu");
  } catch (error) {
    yield put($A($.CREATE_QUESTION_FINISHED));
  }
};

const tryUpdateQuestionSaga = function* ({ payload }) {
  try {
    yield call(Api.updateQuestion, payload);

    yield put($A($.UPDATE_QUESTION_FINISHED));
    yield put($A($.GET_QUESTION_DETAIL_REQUEST, payload._id));
  } catch (error) {
    yield put($A($.UPDATE_QUESTION_FINISHED));
    showErrorMessage(error);
  }
};

const tryDeleteQuestionSaga = function* ({ payload }) {
  try {
    yield call(Api.deleteQuestion, payload);

    yield put($A($.GET_QUESTION_LIST_REQUEST));
    yield put($A($.DELETE_QUESTION_FINISHED));
  } catch (error) {
    yield put($A($.GET_QUESTION_LIST_REQUEST));
    yield put($A($.DELETE_QUESTION_FINISHED));
  }
};

const tryGetQuestionDetailSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getQuestionDetail, payload);
    yield put($A($.RESET_ACTIVE_QUESTION));

    yield put($A($.GET_QUESTION_DETAIL_FINISHED, data));
  } catch (error) {
    yield put($A($.GET_QUESTION_DETAIL_FINISHED, null));
  }
};

export default function* questionSaga() {
  yield takeLatest($.GET_SHAPES, tryGetShapesSaga);
  yield takeLatest($.GET_SHAPE_DETAIL_REQUEST, tryGetShapeDetailSaga);
  yield takeLatest($.GET_QUESTION_CONFIGS_REQUEST, tryGetQuestionConfigsSaga);
  yield takeLatest($.CREATE_QUESTION_REQUEST, tryCreateQuestionSaga);
  yield takeLatest($.GET_QUESTION_LIST_REQUEST, tryGetQuestionListSaga);
  yield takeLatest($.DELETE_QUESTION_REQUEST, tryDeleteQuestionSaga);
  yield takeLatest($.GET_QUESTION_DETAIL_REQUEST, tryGetQuestionDetailSaga);
  yield takeLatest($.UPDATE_QUESTION_REQUEST, tryUpdateQuestionSaga);
}
