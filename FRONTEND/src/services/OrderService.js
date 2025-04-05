import { axiosJWT } from "./UserService";
const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

export const createOrder = async (data, access_token) => {
  // const res = await axiosJWT.post(`${apiUrl}/order/create/${data.user}`, data, {
  const res = await axiosJWT.post(`${apiUrl}/order/create`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

// export const getOrderByUserId = async (id, access_token) => {
//   const res = await axiosJWT.get(`${apiUrl}/order/get-all-order/${id}`, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     },
//   });
//   return res.data;
// };

// export const getDetailsOrder = async (id, access_token) => {
//   const res = await axiosJWT.get(`${apiUrl}/order/get-details-order/${id}`, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     },
//   });
//   return res.data;
// };

// export const cancelOrder = async (id, access_token, orderItems, userId) => {
//   const data = { orderItems, orderId: id };
//   const res = await axiosJWT.delete(
//     `${apiUrl}/order/cancel-order/${userId}`,
//     { data },
//     {
//       headers: {
//         token: `Bearer ${access_token}`,
//       },
//     }
//   );
//   return res.data;
// };

// export const getAllOrder = async (access_token) => {
//   const res = await axiosJWT.get(`${apiUrl}/order/get-all-order`, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     },
//   });
//   return res.data;
// };
