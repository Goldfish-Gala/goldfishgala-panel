import api from '../api-config';

export const getUser = async (token: string | undefined) => {
    try {
        const response = await api.get(`/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
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
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getUserList = async (token: string | undefined, page: number, limit: number, sort: string) => {
    try {
        const response = await api.get(`/users?page=${page}&limit=${limit}&sort=${sort}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const blockUserApi = async (user: User | null, value: boolean, cookie: string | undefined) => {
    const body = { ...user, user_is_active: value };
    console.log('Request body:', body);
    try {
        const response = await api.put(`/users/admin/${user?.user_id}`, body, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};
