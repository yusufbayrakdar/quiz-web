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

const combinedSagas = function* () {
  yield all([authSaga(), studentSaga(), questionSaga(), quizSaga()]);
};

const composeEnhancers = compose;
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth: authReducer,
  student: studentReducer,
  question: questionReducer,
  quiz: quizReducer,
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(combinedSagas);
