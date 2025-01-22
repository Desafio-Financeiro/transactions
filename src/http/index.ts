import axios from "axios";

const http = axios.create({
  baseURL: "https://json-server-api-mu.vercel.app",
});

export default http;
