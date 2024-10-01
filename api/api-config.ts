import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL!.toString();

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const getUser = async (cookie: string) => {
    try {
        const response = await api.get(`/users/profile`, {
            headers: {
                Cookie: cookie,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
