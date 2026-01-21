import axios from "axios";
import { encryptStorage } from "../utils/storage";

const api = axios.create({
  baseURL: "https://api.prizemedacademy.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
