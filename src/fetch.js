import axios from "axios";

const baseURL = "http://localhost:5143/api";

export const fetchData = async (url, method, data = {}) => {
  const response = await axios[method](`${baseURL}/${url}`, data);
  return response;
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
