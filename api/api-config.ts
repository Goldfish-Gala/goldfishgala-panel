import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export default api;
