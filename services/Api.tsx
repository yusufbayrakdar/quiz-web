import { TOKEN } from "../utils";
import _fetch from "./CustomHttpService";

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

  _doDeleteWithAuth = (endpoint: string) => {
    return _fetch({
      method: "DELETE",
      endpoint,
      headers: { token: localStorage.getItem(TOKEN) },
    });
  };

  getRendezvous = () => {
    return this._doGet("/rendezvous");
  };

  getRendezvousAdmin = () => {
    return this._doGetWithAuth("/rendezvous/admin");
  };

  takeRendezvous = (payload: object) => {
    return this._doPostWithAuth("/rendezvous", payload);
  };

  login = (payload: object) => {
    return this._doPost("/auth/login", payload);
  };

  signupInstructor = (payload: object) => {
    return this._doPost("/auth/register/instructor", payload);
  };

  autoLogin = () => {
    return this._doGetWithAuth("/instructors/profile");
  };

  emailConfirm = (userId: string) => {
    return this._doGetWithAuth(`/users/${userId}/confirm`);
  };
}

export default new Api();
