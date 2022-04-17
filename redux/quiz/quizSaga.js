import { put, call, takeLatest } from "redux-saga/effects";
import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A, showErrorMessage, showSuccessMessage } from "../../utils";

const tryCreateQuizSaga = function* ({ payload }) {
  try {
    const reset = payload.reset;
    delete payload.reset;
    yield call(Api.createQuiz, payload);

    yield put($A($.CREATE_QUIZ_FINISHED));
    yield put($A($.QUIZ_FORM_RESET));
    reset?.();
    showSuccessMessage("Soru başarıyla oluşturuldu");
  } catch (error) {
    yield put($A($.CREATE_QUIZ_FINISHED));
  }
};

const tryUpdateQuizSaga = function* ({ payload }) {
  try {
    yield call(Api.updateQuiz, payload);

    showSuccessMessage("Soru başarıyla güncellendi");
  } catch (error) {
    showErrorMessage("Güncellerken bir hata oluştu");
    console.log(error);
  }
};

const tryDeleteQuizSaga = function* ({ payload }) {
  try {
    yield call(Api.deleteQuiz, payload);

    yield put($A($.GET_QUIZ_LIST_REQUEST));
  } catch (error) {
    yield put($A($.GET_QUIZ_LIST_REQUEST));
  }
};

const tryGetQuizListSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getQuizList, payload);

    yield put(
      $A($.GET_QUIZ_LIST_FINISHED, {
        quizList: data.docs,
        totalQuizzes: data.totalDocs,
      })
    );
  } catch (error) {
    console.log("🤯 error", error);
  }
};

const tryGetQuizDetailSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getQuizDetail, payload);

    yield put($A($.GET_QUIZ_DETAIL_FINISHED, data));
  } catch (error) {
    console.log("🤯 error", error);
  }
};

export default function* quizSaga() {
  yield takeLatest($.CREATE_QUIZ_REQUEST, tryCreateQuizSaga);
  yield takeLatest($.UPDATE_QUIZ_REQUEST, tryUpdateQuizSaga);
  yield takeLatest($.GET_QUIZ_LIST_REQUEST, tryGetQuizListSaga);
  yield takeLatest($.DELETE_QUIZ_REQUEST, tryDeleteQuizSaga);
  yield takeLatest($.GET_QUIZ_DETAIL_REQUEST, tryGetQuizDetailSaga);
}
