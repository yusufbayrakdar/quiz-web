import { message } from "antd";
import moment from "moment";

export const BRAND_NAME = "BilsemAI";

message.config({
  duration: 3,
  maxCount: 2,
});

export const TOKEN = "bilsemiq-token";

export const $A = (type, payload) => ({
  type,
  payload,
});

export const showErrorMessage = (
  error,
  fallbackMessage = "Something went wrong",
  messagePrefix = "",
  duration
) => {
  const msg =
    error && error.message ? error.message : error ? error : fallbackMessage;
  message.error(messagePrefix + msg, duration);
};

export const showWarningMessage = (text = "Something went wrong", duration) =>
  message.warning(text, duration);

export const showSuccessMessage = (text = "Success", duration) =>
  message.success(text, duration);

export const capitalizeFirstLetter = (sentence) =>
  sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const BASE_ENDPOINT = {
  instructor: "/instructors",
  student: "/students",
  question: "/questions",
  quiz: "/quizzes",
  score: "/scores",
  dashboard: "/dashboard",
  signin: "/signin",
  signup: "/signup",
  profile: "/profile",
};

export const updateQueryString = (key, value, customUrl) => {
  let url = customUrl || window.location.pathname + window.location.search;
  var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
    hash;

  if (re.test(url)) {
    if (typeof value !== "undefined" && value !== null) {
      return url.replace(re, "$1" + key + "=" + value + "$2$3");
    } else {
      hash = url.split("#");
      url = hash[0].replace(re, "$1$3").replace(/(&|\?)$/, "");
      if (typeof hash[1] !== "undefined" && hash[1] !== null) {
        url += "#" + hash[1];
      }
      return url;
    }
  } else {
    if (typeof value !== "undefined" && value !== null) {
      var separator = url.indexOf("?") !== -1 ? "&" : "?";
      hash = url.split("#");
      url = hash[0] + separator + key + "=" + value;
      if (typeof hash[1] !== "undefined" && hash[1] !== null) {
        url += "#" + hash[1];
      }
      return url;
    } else {
      return url;
    }
  }
};

export const displayFullName = (item) =>
  item
    ? `${item.firstName || ""}${item.lastName ? " " + item.lastName : ""}`
    : "";

export const displayDuration = (duration) => {
  const date = moment.utc(Number(duration) * 1000);
  return date?.isValid() ? date.format("mm:ss") : duration;
};

export const displayDate = (date) => {
  const momentDate = moment.utc(date);
  return momentDate?.isValid() ? momentDate.format("DD/MM/YYYY") : date;
};

export const shuffle = (array) => {
  if (!array) throw new Error("Invalid array");

  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
