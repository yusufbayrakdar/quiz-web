import { put, call, takeLatest } from "redux-saga/effects";
import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A, showErrorMessage, showSuccessMessage } from "../../utils";

const tryGetStudentsSaga = function* ({ payload }) {
  try {
    const putAction = payload.action || $.SET_STUDENTS;
    delete payload.action;
    const { data } = yield call(Api.getStudents, payload);
    const {
      docs: students,
      totalDocs: totalStudents,
      hasNextPage,
      nextPage,
    } = data;

    yield put(
      $A(putAction, { students, totalStudents, hasNextPage, nextPage })
    );
  } catch (error) {
    yield put($A($.SET_STUDENTS, []));
    showErrorMessage("Could not get students");
  }
};

const tryCreateStudentSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.createStudent, payload);

    showSuccessMessage("Öğrenci kaydedildi");
    yield put($A($.CREATE_STUDENT_FINISHED));
  } catch (error) {
    showErrorMessage(error || "Öğrenci kaydedilemedi");
  }
};

const tryUpdateStudentSaga = function* ({ payload }) {
  try {
    const refreshAction = payload.refreshAction;
    delete payload.refreshAction;
    const { data } = yield call(Api.updateStudent, payload);

    showSuccessMessage("Öğrenci kaydedildi");
    yield put($A($.UPDATE_STUDENT_FINISHED));
    if (refreshAction) yield put(refreshAction);
  } catch (error) {
    showErrorMessage(error || "Öğrenci kaydedilemedi");
  }
};

const tryDeleteStudentSaga = function* ({ payload }) {
  try {
    const refreshAction = payload.refreshAction;
    delete payload.refreshAction;
    yield call(Api.deleteStudent, payload?._id);

    yield put($A($.DELETE_STUDENT_FINISHED));
    if (refreshAction) yield put(refreshAction);
  } catch (error) {
    showErrorMessage(error || "Öğrenci silinemedi");
  }
};

export default function* studentSaga() {
  yield takeLatest($.GET_STUDENTS, tryGetStudentsSaga);
  yield takeLatest($.CREATE_STUDENT_REQUEST, tryCreateStudentSaga);
  yield takeLatest($.UPDATE_STUDENT_REQUEST, tryUpdateStudentSaga);
  yield takeLatest($.DELETE_STUDENT_REQUEST, tryDeleteStudentSaga);
}
