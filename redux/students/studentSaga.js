import { put, call, takeEvery } from "redux-saga/effects";
import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A, showErrorMessage, showSuccessMessage } from "../../utils";

const tryGetStudentsSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getStudents, payload);
    const { docs: students, totalDocs: totalStudents } = data;

    yield put($A($.SET_STUDENTS, { students, totalStudents }));
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

export default function* studentSaga() {
  yield takeEvery($.GET_STUDENTS, tryGetStudentsSaga);
  yield takeEvery($.CREATE_STUDENT_REQUEST, tryCreateStudentSaga);
}
