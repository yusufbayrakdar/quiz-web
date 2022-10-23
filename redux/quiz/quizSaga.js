import { put, call, takeLatest, select } from "redux-saga/effects";
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
    showErrorMessage(error);
    yield put($A($.CREATE_QUIZ_FINISHED));
  }
};

const tryUpdateQuizSaga = function* ({ payload }) {
  try {
    const refreshAction = payload.refreshAction;
    delete payload.refreshAction;
    yield call(Api.updateQuiz, payload);

    showSuccessMessage("Soru başarıyla güncellendi", 1.5);
    if (refreshAction) yield put(refreshAction);
  } catch (error) {
    showErrorMessage(error || "Güncellerken bir hata oluştu");
  }
  yield put($A($.UPDATE_QUIZ_FINISHED));
};

const tryAssignQuizToStudentSaga = function* ({ payload }) {
  try {
    const refreshAction = payload.refreshAction;
    delete payload.refreshAction;
    yield call(Api.assignQuizToStudent, payload);

    showSuccessMessage("Öğrenci listesi güncellendi", 1.5);
    if (refreshAction) yield put(refreshAction);
  } catch (error) {
    showErrorMessage(error);
  }
  yield put($A($.ASSIGN_QUIZ_TO_STUDENT_FINISHED));
};

const tryDeleteQuizSaga = function* ({ payload }) {
  try {
    yield call(Api.deleteQuiz, payload);

    yield put($A($.GET_QUIZ_LIST_REQUEST));
  } catch (error) {
    showErrorMessage(error);
  }
  yield put($A($.DELETE_QUIZ_FINISHED));
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
    showErrorMessage(error);
  }
};

const tryGetStudentsOfQuizByInstructorSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getStudentsOfQuizByInstructor, payload);

    yield put($A($.GET_STUDENTS_OF_QUIZ_BY_INSTRUCTOR_FINISHED, data));
  } catch (error) {
    showErrorMessage(error);
  }
};

const tryGetQuizDetailSaga = function* ({
  payload: { add = false, ...payload },
}) {
  try {
    const { data } = yield call(Api.getQuizDetail, payload);

    yield put($A($.GET_QUIZ_DETAIL_FINISHED, { ...data, add }));
  } catch (error) {
    showErrorMessage(error);
  }
};

const tryFinishQuizSaga = function* ({ payload: finishedAt }) {
  try {
    const payload = yield select((state) => state.quiz.quizSubmission);
    if (!payload?.quiz) return;
    const { data } = yield call(Api.finishQuiz, { ...payload, finishedAt });

    yield put($A($.FINISH_QUIZ_FINISHED, data));
  } catch (error) {
    showErrorMessage(error);
    yield put($A($.FINISH_QUIZ_FINISHED));
  }
};

export default function* quizSaga() {
  yield takeLatest($.CREATE_QUIZ_REQUEST, tryCreateQuizSaga);
  yield takeLatest($.UPDATE_QUIZ_REQUEST, tryUpdateQuizSaga);
  yield takeLatest(
    $.ASSIGN_QUIZ_TO_STUDENT_REQUEST,
    tryAssignQuizToStudentSaga
  );
  yield takeLatest($.GET_QUIZ_LIST_REQUEST, tryGetQuizListSaga);
  yield takeLatest(
    $.GET_STUDENTS_OF_QUIZ_BY_INSTRUCTOR_REQUEST,
    tryGetStudentsOfQuizByInstructorSaga
  );
  yield takeLatest($.DELETE_QUIZ_REQUEST, tryDeleteQuizSaga);
  yield takeLatest($.GET_QUIZ_DETAIL_REQUEST, tryGetQuizDetailSaga);
  yield takeLatest($.FINISH_QUIZ_REQUEST, tryFinishQuizSaga);
}
