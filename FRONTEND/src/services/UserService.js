import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL_BACKEND;    

export const loginUser = async (data) => {
    const res = await axios.post(`${apiUrl}/user/sign-in`, data)
    return res.data
}

export const signupUser = async (data) => {
    const res = await axios.post(`${apiUrl}/user/sign-up`, data)
    return res.data
}
