import { axiosJWT } from "./UserService";
const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

export const createOrder = async (data, access_token) => {
  try {
    const res = await axiosJWT.post(`${apiUrl}/order/create`, data, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderByUserId = async (id, access_token) => {
  const res = await axiosJWT.get(`${apiUrl}/order/get-all-order/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getDetailsOrder = async (id, access_token) => {
  const res = await axiosJWT.get(`${apiUrl}/order/get-details-order/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const cancelOrder = async (id, access_token) => {
  const res = await axiosJWT.delete(`${apiUrl}/order/cancel-order/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getAllOrder = async (access_token) => {
  const res = await axiosJWT.get(`${apiUrl}/order/get-all-order`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};
