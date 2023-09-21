import Axios from "axios";

const backendPort = process.env["BACKEND_PORT"] || 4000;

export const axios = Axios.create({
  baseURL: `http://localhost:${backendPort}`,
  validateStatus: null, // Don't throw errors on non-200 status codes
});
