import { message } from "antd";

message.config({
  duration: 3,
  maxCount: 2,
});

export const TOKEN = "bilsemiq-token";

export const $A = (type: string, payload: any) => ({
  type,
  payload,
});

export const showErrorMessage = (
  error: { message: string },
  fallbackMessage = "Something went wrong",
  messagePrefix = "",
  duration: number
) => {
  const msg =
    error && error.message ? error.message : error ? error : fallbackMessage;
  message.error(messagePrefix + msg, duration);
};

export const showWarningMessage = (
  text = "Something went wrong",
  duration?: number
) => message.warning(text, duration);

export const showSuccessMessage = (text = "Success", duration: number) =>
  message.success(text, duration);

export const capitalizeFirstLetter = (sentence: string) =>
  sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export class Route {
  path: string;
  title: string;
  order: number;
}

export const routes = {
  "/": {
    title: "ANA SAYFA",
    order: 1,
  },
  "/rendezvouses": {
    title: "RANDEVU",
    order: 2,
  },
  "/signup": {
    title: "KAYDOL",
    order: 3,
  },
  "/signin": {
    title: "GİRİŞ YAP",
    order: 4,
  },
};
