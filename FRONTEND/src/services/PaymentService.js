import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL_BACKEND;
export const getConfig = async () => {
  const res = await axios.get(`${apiUrl}/payment/config`);
  return res.data;
};
