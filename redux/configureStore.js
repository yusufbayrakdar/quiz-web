import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import authReducer from "./auth/authReducer";
import authSaga from "./auth/authSaga";

import studentReducer from "./students/studentReducer";
import studentSaga from "./students/studentSaga";

import questionReducer from "./questions/questionReducer";
import questionSaga from "./questions/questionSaga";

const combinedSagas = function* () {
  yield all([authSaga(), studentSaga(), questionSaga()]);
};

const composeEnhancers = compose;
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth: authReducer,
  student: studentReducer,
  question: questionReducer,
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(combinedSagas);