import { put, call, takeLatest } from "redux-saga/effects";
import router from "next/router";

import * as $ from "../actionTypes";
import Api from "../../services/Api";
import {
  $A,
  BASE_ENDPOINT,
  showErrorMessage,
  showSuccessMessage,
  TOKEN,
} from "../../utils";

const tryLoginSaga = function* ({ payload }) {
  try {
    localStorage.setItem(TOKEN, "");
    const { data } = yield call(Api.login, payload);
    const { user, token } = data;

    localStorage.setItem(TOKEN, token);
    yield put($A($.LOGIN_SUCCESS, user));
    router.push(BASE_ENDPOINT.dashboard);
  } catch (error) {
    showErrorMessage("Hatalı Email/Şifre");
    yield put($A($.LOGIN_FAILURE));
  }
};

const tryAutoLoginSaga = function* () {
  try {
    const returnPage = ["/signin", "/signup", "/"].includes(router.pathname)
      ? router.pathname
      : "/";
    const token = localStorage.getItem(TOKEN);
    if (token) {
      const { data } = yield call(Api.autoLogin);

      yield put($A($.LOGIN_SUCCESS, data));
      yield put($A($.AUTO_LOGIN_SUCCESS));
      if (router.pathname === "/") router.push(BASE_ENDPOINT.dashboard);
    } else {
      router.push(returnPage);
      yield put($A($.AUTO_LOGIN_FAILURE));
    }
  } catch (error) {
    console.log("error", error);
    router.push("/");
    localStorage.setItem(TOKEN, "");
    yield put($A($.AUTO_LOGIN_FAILURE));
  }
};

const trySignupInstructorSaga = function* ({ payload }) {
  try {
    const { data } = yield call(Api.signupInstructor, payload);
    const { token, user } = data;

    localStorage.setItem(TOKEN, token);
    yield put($A($.LOGIN_SUCCESS, user));
    showSuccessMessage("Kayıt başarılı");
  } catch (error) {
    showErrorMessage(error || "Kaydolurken bir hata oluştu");
  }
};

const tryLogoutSaga = function* () {
  try {
    localStorage.setItem(TOKEN, "");
    router.push("/");
  } catch (error) {
    showErrorMessage(error);
  }
};

export default function* authSaga() {
  yield takeLatest($.LOGIN_REQUEST, tryLoginSaga);
  yield takeLatest($.AUTO_LOGIN_REQUEST, tryAutoLoginSaga);
  yield takeLatest($.LOGOUT_REQUEST, tryLogoutSaga);
  yield takeLatest($.SIGNUP_INSTRUCTOR_REQUEST, trySignupInstructorSaga);
}
