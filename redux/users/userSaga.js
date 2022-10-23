import { put, call, takeEvery, select } from "redux-saga/effects";
import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A, ROLES, showErrorMessage, showSuccessMessage } from "../../utils";

const tryGetUsersSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getUsers, payload);
    const { docs: users, totalDocs: totalUsers } = data;

    yield put($A($.SET_USERS, { users, totalUsers }));
  } catch (error) {
    yield put($A($.SET_USERS, []));
    showErrorMessage(error || "Kullanıcılar listelenemedi");
  }
};

const tryGetUserDetailSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getUserDetail, payload);

    yield put($A($.SET_USER_DETAIL, data));
  } catch (error) {
    yield put($A($.SET_USER_DETAIL, null));
    showErrorMessage(error || "Kullanıcı bilgilerine ulaşılamadı");
  }
};

const tryConfirmInstructorSaga = function* ({ payload }) {
  try {
    const { _id, refreshActions } = payload;
    yield call(Api.confirmInstructor, _id);

    if (Array.isArray(refreshActions)) {
      for (let i = 0; i < refreshActions.length; i++) {
        yield put(refreshActions[i]);
      }
    }
  } catch (error) {
    showErrorMessage(error || "Eğitmen onaylanamadı");
  }
};

const tryCancelInstructorSaga = function* ({ payload }) {
  try {
    const { _id, refreshActions } = payload;
    yield call(Api.cancelInstructor, _id);

    if (Array.isArray(refreshActions)) {
      for (let i = 0; i < refreshActions.length; i++) {
        yield put(refreshActions[i]);
      }
    }
  } catch (error) {
    showErrorMessage(error || "Eğitmen iptal edilemedi");
  }
};

const tryCreateStudentSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.createStudent, payload);

    showSuccessMessage("Kallanıcı kaydedildi");
    yield put($A($.CREATE_STUDENT_FINISHED));
  } catch (error) {
    showErrorMessage(error || "Kullanıcı kaydedilemedi");
  }
};

const tryDeleteStudentSaga = function* ({ payload }) {
  try {
    const refreshAction = payload.refreshAction;
    const user = yield select((state) => state.auth.user);
    const deleteForAll =
      user.role === ROLES.ADMIN && refreshAction.payload.isOwner !== "true";
    delete payload.refreshAction;
    yield call(
      deleteForAll ? Api.deleteStudentForAll : Api.deleteStudent,
      payload?._id
    );

    yield put($A($.DELETE_STUDENT_FINISHED));
    if (refreshAction) yield put(refreshAction);
  } catch (error) {
    showErrorMessage(error || "Öğrenci silinemedi");
  }
};

const tryAddStudentSaga = function* ({ payload }) {
  try {
    const refreshAction = payload.refreshAction;
    delete payload.refreshAction;
    yield call(Api.addStudent, payload?._id);

    yield put($A($.ADD_STUDENT_FINISHED));
    if (refreshAction) yield put(refreshAction);
  } catch (error) {
    showErrorMessage(error || "Öğrenci eklenemedi");
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

const tryGetInstructorsOfStudentSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getInstructorsOfStudent, payload);
    if (!Array.isArray(data)) throw new Error("Eğitmen listesine ulaşılamadı");

    yield put($A($.GET_INSTRUCTORS_OF_STUDENT_FINISHED, data));
  } catch (error) {
    showErrorMessage(error);
  }
};

const tryAddStudentToInstructorsSaga = function* ({ payload }) {
  try {
    const refreshAction = payload.refreshAction;
    delete payload.refreshAction;
    const { data } = yield call(Api.addStudentToInstructors, payload);
    if (refreshAction) yield put(refreshAction);
  } catch (error) {
    showErrorMessage(error);
  }
};

const tryAddStudentsToInstructorSaga = function* ({ payload }) {
  try {
    const refreshAction = payload.refreshAction;
    delete payload.refreshAction;
    const { data } = yield call(Api.addStudentsToInstructor, payload);
    if (refreshAction) yield put(refreshAction);
  } catch (error) {
    showErrorMessage(error);
  }
};

const tryGetStudentsOfInstructorSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.getStudentsOfInstructor, payload);
    if (!Array.isArray(data)) throw new Error("Öğrenci listesine ulaşılamadı");

    yield put($A($.GET_STUDENTS_OF_INSTRUCTOR_FINISHED, data));
  } catch (error) {
    showErrorMessage(error);
  }
};

export default function* instructorSaga() {
  yield takeEvery($.CREATE_STUDENT_REQUEST, tryCreateStudentSaga);
  yield takeEvery($.UPDATE_STUDENT_REQUEST, tryUpdateStudentSaga);
  yield takeEvery($.GET_USERS, tryGetUsersSaga);
  yield takeEvery($.GET_USER_DETAIL, tryGetUserDetailSaga);
  yield takeEvery($.CONFIRM_INSTRUCTOR, tryConfirmInstructorSaga);
  yield takeEvery($.CANCEL_INSTRUCTOR, tryCancelInstructorSaga);
  yield takeEvery($.DELETE_STUDENT_REQUEST, tryDeleteStudentSaga);
  yield takeEvery($.ADD_STUDENT_REQUEST, tryAddStudentSaga);
  yield takeEvery(
    $.GET_INSTRUCTORS_OF_STUDENT_REQUEST,
    tryGetInstructorsOfStudentSaga
  );
  yield takeEvery(
    $.ADD_STUDENT_TO_INSTRUCTORS_REQUEST,
    tryAddStudentToInstructorsSaga
  );
  yield takeEvery(
    $.GET_STUDENTS_OF_INSTRUCTOR_REQUEST,
    tryGetStudentsOfInstructorSaga
  );
  yield takeEvery(
    $.ADD_STUDENTS_TO_INSTRUCTOR_REQUEST,
    tryAddStudentsToInstructorSaga
  );
}
