import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import globalSaga from "./global/globalSaga";
import globalReducer from "./global/globalReducer";

import authReducer from "./auth/authReducer";
import authSaga from "./auth/authSaga";

import questionReducer from "./questions/questionReducer";
import questionSaga from "./questions/questionSaga";

import quizReducer from "./quiz/quizReducer";
import quizSaga from "./quiz/quizSaga";

import scoreReducer from "./score/scoreReducer";
import scoreSaga from "./score/scoreSaga";

import userReducer from "./users/userReducer";
import userSaga from "./users/userSaga";

import shapeReducer from "./shapes/shapeReducer";
import shapeSaga from "./shapes/shapeSaga";

const combinedSagas = function* () {
  yield all([
    globalSaga(),
    authSaga(),
    userSaga(),
    questionSaga(),
    quizSaga(),
    scoreSaga(),
    shapeSaga(),
  ]);
};

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  question: questionReducer,
  quiz: quizReducer,
  score: scoreReducer,
  global: globalReducer,
  shape: shapeReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).prepend(sagaMiddleware);
  },
});

sagaMiddleware.run(combinedSagas);

export default store;
