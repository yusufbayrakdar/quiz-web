import { TOKEN } from "../utils";
import _fetch from "./CustomHttpService";

class Query {
  search: string;
  isActive: boolean;
  page: string;
  limit: string;
}

class Api {
  // GET request
  _doGet = (endpoint: string) => {
    return _fetch({
      method: "GET",
      endpoint,
    });
  };

  _doGetWithAuth = (endpoint: string) => {
    return _fetch({
      method: "GET",
      endpoint,
      headers: { token: localStorage.getItem(TOKEN) },
    });
  };

  // POST request
  _doPost = (endpoint: string, body: object, isFormData = false) => {
    return _fetch({
      method: "POST",
      body,
      endpoint,
      isFormData,
    });
  };

  _doPostWithAuth = (endpoint: string, body: object, isFormData = false) => {
    return _fetch({
      method: "POST",
      body,
      endpoint,
      headers: { token: localStorage.getItem(TOKEN) },
      isFormData,
    });
  };

  // PUT request
  _doPut = (endpoint: string, body: object, isFormData = false) => {
    return _fetch({
      method: "PUT",
      body,
      endpoint,
      isFormData,
    });
  };

  _doPutWithAuth = (endpoint: string, body: object, isFormData = false) => {
    return _fetch({
      method: "PUT",
      body,
      endpoint,
      headers: { token: localStorage.getItem(TOKEN) },
      isFormData,
    });
  };

  // DELETE request
  _doDeleteWithAuth = (endpoint: string) => {
    return _fetch({
      method: "DELETE",
      endpoint,
      headers: { token: localStorage.getItem(TOKEN) },
    });
  };

  objectToQueryString(obj: any) {
    if (typeof obj !== "object") return "";

    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p) && obj[p]) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&") ? "?" + str.join("&") : "";
  }

  login = (payload: object) => {
    return this._doPost("/auth/login", payload);
  };

  signupInstructor = (payload: object) => {
    return this._doPost("/instructors", payload);
  };

  autoLogin = () => {
    return this._doGetWithAuth("/auth/profile");
  };

  getStudents = (payload: Query) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/students${query}`);
  };

  createStudent = (payload: object) => {
    return this._doPostWithAuth(`/students`, payload);
  };

  getShapes = (payload: Query) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/shapes${query}`);
  };

  getQuestionConfigs = () => {
    return this._doGetWithAuth(`/questions/configs`);
  };

  getQuestionList = (payload: Query) => {
    const query = this.objectToQueryString(payload);
    return this._doGetWithAuth(`/searches${query}`);
  };

  createQuestion = (question: object) => {
    return this._doPostWithAuth(`/questions`, question);
  };

  updateQuestion = (question: object) => {
    return this._doPutWithAuth(`/questions`, question);
  };

  deleteQuestion = (_id: object) => {
    return this._doDeleteWithAuth(`/questions/${_id}`);
  };

  getQuestionDetail = (_id: object) => {
    return this._doGetWithAuth(`/searches/${_id}`);
  };
}

export default new Api();
