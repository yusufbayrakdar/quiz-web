import { put, call, takeEvery, takeLatest } from "redux-saga/effects";
import * as $ from "../actionTypes";
import Api from "../../services/Api";
import { $A, showErrorMessage, showSuccessMessage, TOKEN } from "../../utils";

const tryLoginSaga = function* ({ payload }) {
  try {
    localStorage.setItem(TOKEN, "");
    const { data } = yield call(Api.login, payload);
    const { token, student, instructor } = data;

    localStorage.setItem(TOKEN, token);
    if (instructor) yield put($A($.INSTRUCTOR_LOGIN_SUCCESS, instructor));
    else if (student) yield put($A($.STUDENT_LOGIN_SUCCESS, student));
    else throw new Error();
  } catch (error) {
    showErrorMessage("Hatalı Email/Şifre");
    yield put($A($.LOGIN_FAILURE));
  }
};

const tryAutoLoginSaga = function* () {
  try {
    const token = localStorage.getItem(TOKEN);
    if (token) {
      const { data } = yield call(Api.autoLogin);
      yield put($A($.AUTO_LOGIN_SUCCESS, data));
    } else {
      yield put($A($.AUTO_LOGIN_FAILURE));
    }
  } catch {
    yield put($A($.AUTO_LOGIN_FAILURE));
  }
};

const trySignupInstructorSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.signupInstructor, payload);
    const { token, student, instructor } = data;

    localStorage.setItem(TOKEN, token);
    if (instructor) yield put($A($.INSTRUCTOR_LOGIN_SUCCESS, instructor));
    else if (student) yield put($A($.STUDENT_LOGIN_SUCCESS, student));
    else throw new Error();
    showSuccessMessage("Kayıt başarılı");
  } catch {
    showErrorMessage("Kaydolurken bir hata oluştu");
  }
};

const tryEmailConfirmSaga = function* ({ payload }) {
  try {
    const {
      data: { emailConfirmed },
    } = yield call(Api.emailConfirm, payload);

    if (emailConfirmed) showSuccessMessage("Emailiniz doğrulandı");
    else throw new Error();
  } catch {
    showErrorMessage("Email doğrulanamadı");
  }
};

const tryLogoutSaga = function () {
  try {
    localStorage.setItem(TOKEN, "");
    window.location.href = "/";
  } catch {}
};

export default function* authSaga() {
  yield takeEvery($.LOGIN_REQUEST, tryLoginSaga);
  yield takeEvery($.AUTO_LOGIN_REQUEST, tryAutoLoginSaga);
  yield takeLatest($.LOGOUT_REQUEST, tryLogoutSaga);
  yield takeLatest($.SIGNUP_INSTRUCTOR_REQUEST, trySignupInstructorSaga);
  yield takeLatest($.EMAIL_CONFIRM, tryEmailConfirmSaga);
}
