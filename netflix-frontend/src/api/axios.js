// axios instance for talking to OUR backend (login/signup/mylist)
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

const api = axios.create({
  baseURL: `${backendUrl}/api`,
});

export default api;
