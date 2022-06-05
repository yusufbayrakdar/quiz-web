import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import authReducer from "./auth/authReducer";
import authSaga from "./auth/authSaga";

import studentReducer from "./students/studentReducer";
import studentSaga from "./students/studentSaga";

import questionReducer from "./questions/questionReducer";
import questionSaga from "./questions/questionSaga";

import quizReducer from "./quiz/quizReducer";
import quizSaga from "./quiz/quizSaga";

import scoreReducer from "./score/scoreReducer";
import scoreSaga from "./score/scoreSaga";

import globalReducer from "./global/globalReducer";

const combinedSagas = function* () {
  yield all([
    authSaga(),
    studentSaga(),
    questionSaga(),
    quizSaga(),
    scoreSaga(),
  ]);
};

const composeEnhancers = compose;
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth: authReducer,
  student: studentReducer,
  question: questionReducer,
  quiz: quizReducer,
  score: scoreReducer,
  global: globalReducer,
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(combinedSagas);
