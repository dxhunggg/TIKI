import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  const res = await axios.post(`${apiUrl}/user/sign-in`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(`${apiUrl}/user/sign-up`, data);
  return res.data;
};

export const getDetailsUser = async (id, access_token) => {
  const res = await axios.get(`${apiUrl}/user/get-details/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const refreshToken = async () => {
  try {
    const res = await axios.post(
      `${apiUrl}/user/refresh-token`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.post(`${apiUrl}/user/log-out`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
