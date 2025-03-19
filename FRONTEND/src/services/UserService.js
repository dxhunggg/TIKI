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
  const res = await axiosJWT.get(`${apiUrl}/user/get-details/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getAllUser = async (access_token) => {
  const res = await axiosJWT.get(`${apiUrl}/user/get-all`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteUser = async (id, access_token, data) => {
  const res = await axiosJWT.delete(`${apiUrl}/user/delete-user/${id}`, data, {
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

export const updateUser = async (id, access_token, data) => {
  try {
    const res = await axiosJWT.put(`${apiUrl}/user/update-user/${id}`, data, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
