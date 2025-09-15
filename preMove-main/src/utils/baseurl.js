  
import axios from "axios";
  
export const api = axios.create({
  baseURL: "http://192.168.0.155:5000/api/",
  // You can add other default configs here, like headers, timeout, etc.
  // headers: { "Authorization": "Bearer your_token" },
  // timeout: 1000,
});
