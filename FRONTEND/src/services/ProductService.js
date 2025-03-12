import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

export const axiosJWT = axios.create();

export const getAllProduct = async (data) => {
  const res = await axios.get(`${apiUrl}/product/get-all`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await axios.post(`${apiUrl}/product/create`, data);
  return res.data;
};
