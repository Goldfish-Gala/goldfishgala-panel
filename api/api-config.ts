import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});
