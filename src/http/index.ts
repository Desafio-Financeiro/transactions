import axios from "axios";

const http = axios.create({
  baseURL: process.env.PUBLIC_BASE_URL,
});

export default http;
