import API_PATH from "../config/env-config";
import { RequestDto } from "./dto/Request.dto";

const STATUS_UNAUTHORIZED = 401;
const STATUS_SERVER_ERROR = 500;
const STATUS_NOT_SUCCESS = (status: number) =>
  parseInt(String(status / 100), 10) !== 2;

const reject = (msg: string) => {
  throw new Error(msg);
};

export default async function customFetch({
  endpoint,
  isFormData,
  method = "GET",
  headers = {},
  body = {},
}: RequestDto) {
  let bodyObject: any = {};
  const fullApiPath = `${API_PATH}${endpoint}`;
  if (method === "POST" || method === "PUT") {
    bodyObject.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(fullApiPath, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...bodyObject,
  });
  const data = await res.json();
  if (res.status === STATUS_UNAUTHORIZED) {
    reject("Login again");
  } else if (STATUS_NOT_SUCCESS(res.status)) {
    if (res.status === STATUS_SERVER_ERROR) reject("Something went wrong!");
    else if (data) reject(data.message);
    else reject("Something went wrong!");
  } else return data;
}
