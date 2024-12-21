import axios from "axios";
import { getToken } from "../Pages/AuthProvider/AuthProvider";

// Base URL from environment variables
const baseURL = process.env.REACT_APP_URL;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// Attach interceptors for token management
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken(); // Get the token dynamically
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// GET API
async function GetApi(url, cb) {
  try {
    const response = await axiosInstance.get(url);
    cb(null, response);
  } catch (err) {
    cb(err, null);
  }
}

// POST API
async function PostApi(url, data, cb, headers = {}) {
  try {
    const response = await axiosInstance.post(url, data, { headers });
    cb(null, response);
  } catch (err) {
    cb(err, null);
  }
}

// PUT API
async function PutApi(url, data, cb, headers = {}) {
  try {
    const response = await axiosInstance.put(url, data, { headers });
    cb(null, response);
  } catch (err) {
    cb(err, null);
  }
}

// DELETE API
async function deleteApi(url, data, cb, headers = {}) {
  try {
    const response = await axiosInstance.delete(url, { data, headers });
    cb(null, response);
  } catch (err) {
    cb(err, null);
  }
}

export { GetApi, PostApi, PutApi, deleteApi };
