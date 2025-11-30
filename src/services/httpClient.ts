import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/api", // spring boot baseimiz
  withCredentials: false,
});

export default http;
