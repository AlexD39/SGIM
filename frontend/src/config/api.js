// Debe coincidir con el puerto del backend (Docker compose usa 3001; sin Docker suele ser 3000 → usa .env)
export const API_BASE =
  (typeof process !== "undefined" && process.env.REACT_APP_API_URL) ||
  "http://localhost:3001";
