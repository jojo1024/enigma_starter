export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
export const BASE_URL_PROD: string = window.location.origin;

export const BASE_URL: string = isDev ? "http://127.0.0.1:50013" : BASE_URL_PROD;
