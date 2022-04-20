import { TOKEN } from "../utils";
import _fetch from "./CustomHttpService";

class Api {
  // GET request
  _doGet = (endpoint) => {
    return _fetch({
      method: "GET",
      endpoint,
    });
  };

  _doGetWithAuth = (endpoint) => {
    return _fetch({
      method: "GET",
      endpoint,
      headers: { token: localStorage.getItem(TOKEN) },
    });
  };

  // POST request
  _doPost = (endpoint, body, isFormData = false) => {
    return _fetch({
      method: "POST",
      body,
      endpoint,
      isFormData,
    });
  };

  _doPostWithAuth = (endpoint, body, isFormData = false) => {
    return _fetch({
      method: "POST",
      body,
      endpoint,
      headers: { token: localStorage.getItem(TOKEN) },
      isFormData,
    });
  };

  // PUT request
  _doPut = (endpoint, body, isFormData = false) => {
    return _fetch({
      method: "PUT",
      body,
      endpoint,
      isFormData,
    });
  };

  _doPutWithAuth = (endpoint, body, isFormData = false) => {
    return _fetch({
      method: "PUT",
      body,
      endpoint,
      headers: { token: localStorage.getItem(TOKEN) },
      isFormData,
    });
  };

  // DELETE request
  _doDeleteWithAuth = (endpoint) => {
    return _fetch({
      method: "DELETE",
      endpoint,
      headers: { token: localStorage.getItem(TOKEN) },
    });
  };

  objectToQueryString(obj) {
    if (typeof obj !== "object") return "";

    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p) && obj[p]) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&") ? "?" + str.join("&") : "";
  }

  login = (payload) => {
    return this._doPost("/auth/login", payload);
  };

  signupInstructor = (payload) => {
    return this._doPost("/instructors", payload);
  };

  autoLogin = () => {
    return this._doGetWithAuth("/auth/profile");
  };

  getStudents = (payload) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/students${query}`);
  };

  createStudent = (payload) => {
    return this._doPostWithAuth(`/students`, payload);
  };

  getShapes = (payload) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/shapes${query}`);
  };

  getQuestionConfigs = () => {
    return this._doGetWithAuth(`/questions/configs`);
  };

  getQuestionList = (payload) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/searches${query}`);
  };

  createQuestion = (question) => {
    return this._doPostWithAuth(`/questions`, question);
  };

  updateQuestion = (question) => {
    return this._doPutWithAuth(`/questions`, question);
  };

  deleteQuestion = (_id) => {
    return this._doDeleteWithAuth(`/questions/${_id}`);
  };

  getQuestionDetail = (_id) => {
    return this._doGetWithAuth(`/searches/${_id}`);
  };

  createQuiz = (quiz) => {
    return this._doPostWithAuth(`/quizzes`, quiz);
  };

  updateQuiz = (quiz) => {
    return this._doPutWithAuth(`/quizzes`, quiz);
  };

  deleteQuiz = (_id) => {
    return this._doDeleteWithAuth(`/quizzes/${_id}`);
  };

  getQuizList = (payload) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/quizzes${query}`);
  };

  getQuizDetail = (_id) => {
    return this._doGetWithAuth(`/quizzes/${_id}`);
  };
}

export default new Api();
