import { api } from './api-config';

export const getUser = async () => {
    try {
        const response = await api.get(`/users/profile`, {});
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUserApi = async (userId: string | undefined, data: UpdateUserType, cookie: string | undefined) => {
    const body = { ...data, user_is_first_login: false };
    try {
        const response = await api.put(`/users/${userId}`, body, {
            headers: {
                Cookie: `token=${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};
