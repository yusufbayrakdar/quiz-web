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
    const endpoint = "login";
    return this._doPost("/auth/" + endpoint, payload);
  };

  signupInstructor = (payload) => {
    return this._doPost("/users/instructor", payload);
  };

  getUsers = (payload) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/users${query}`);
  };

  getUserDetail = (payload) => {
    return this._doGetWithAuth(`/users/${payload}`);
  };

  confirmInstructor = (_id) => {
    return this._doGetWithAuth(`/users/${_id}/confirm-instructor`);
  };

  cancelInstructor = (_id) => {
    return this._doGetWithAuth(`/users/${_id}/cancel-confirmation`);
  };

  autoLogin = () => {
    return this._doGetWithAuth("/auth/profile");
  };

  createStudent = (payload) => {
    return this._doPostWithAuth(`/users/student`, payload);
  };

  updateStudent = (payload) => {
    return this._doPutWithAuth(`/users/student`, payload);
  };

  getInstructorsOfStudent = (student) => {
    return this._doGetWithAuth(`/users/instructors?student=${student}`);
  };

  addStudentToInstructors = (payload) => {
    return this._doPostWithAuth(`/users/add-student-to-instructors`, payload);
  };

  getStudentsOfInstructor = (instructor) => {
    return this._doGetWithAuth(`/users/students?instructor=${instructor}`);
  };

  addStudentsToInstructor = (payload) => {
    return this._doPostWithAuth(`/users/add-students-to-instructor`, payload);
  };

  deleteStudent = (_id) => {
    return this._doDeleteWithAuth(`/users/student/${_id}`);
  };

  addStudent = (_id) => {
    return this._doGetWithAuth(`/users/add-student/${_id}`);
  };

  deleteStudentForAll = (_id) => {
    return this._doDeleteWithAuth(`/users/student/${_id}/delete-for-all`);
  };

  getShapes = (payload) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/shapes${query}`);
  };

  getShapeDetail = (_id) => {
    return this._doGetWithAuth(`/shapes/${_id}`);
  };

  createShape = (payload) => {
    return this._doPostWithAuth("/shapes", payload);
  };

  updateShape = (payload) => {
    return this._doPutWithAuth("/shapes", payload);
  };

  getQuestionConfigs = () => {
    return this._doGetWithAuth(`/questions/configs`);
  };

  getFirebaseConfig = () => {
    return this._doGetWithAuth("/configs/firebase");
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

  assignQuizToStudent = (quiz) => {
    return this._doPostWithAuth(`/quizzes/${quiz._id}/assign`, {
      students: quiz.students,
    });
  };

  deleteQuiz = (_id) => {
    return this._doDeleteWithAuth(`/quizzes/${_id}`);
  };

  getQuizList = (payload) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/quizzes${query}`);
  };

  getStudentsOfQuizByInstructor = (_id) => {
    return this._doGetWithAuth(`/quizzes/${_id}/students`);
  };

  getQuizDetail = ({ _id, ...queryObject }) => {
    const query = this.objectToQueryString(queryObject);
    return this._doGetWithAuth(`/quizzes/${_id}${query}`);
  };

  finishQuiz = (payload) => {
    return this._doPostWithAuth("/quizzes/finish", payload);
  };

  getScoreList = (payload) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/scores${query}`);
  };

  getScoreDetail = (_id) => {
    return this._doGetWithAuth(`/scores/${_id}`);
  };
}

export default new Api();
