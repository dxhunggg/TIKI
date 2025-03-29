import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

export const axiosJWT = axios.create();

export const getAllProduct = async (search, limit) => {
  try {
    let res = {};
    if (search?.length > 0) {
      res = await axios.get(
        `${apiUrl}/product/get-all?filter[field]=name&filter[value]=${search}&limit=${limit}`
      );
    } else {
      res = await axios.get(`${apiUrl}/product/get-all?limit=${limit}`);
    }
    return res.data;
  } catch (error) {
    console.error("❌ API Fetch Error:", error);
    return { status: "ERROR", data: [] };
  }
};

export const createProduct = async (data) => {
  const res = await axios.post(`${apiUrl}/product/create`, data);
  return res.data;
};

export const getDetailsProduct = async (id) => {
  const res = await axios.get(`${apiUrl}/product/get-details/${id}`);
  return res.data;
};

export const updateProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(`${apiUrl}/product/update/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(`${apiUrl}/product/delete/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteManyProducts = async (data, access_token) => {
  const res = await axiosJWT.post(`${apiUrl}/product/delete-many`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getAllTypeProduct = async () => {
  const res = await axios.get(`${apiUrl}/product/get-all-type`);
  return res.data;
};
