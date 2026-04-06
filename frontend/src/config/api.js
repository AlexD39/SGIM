export const API_BASE =
  (typeof process !== "undefined" && process.env.REACT_APP_API_URL) ||
  "http://localhost:3000";
