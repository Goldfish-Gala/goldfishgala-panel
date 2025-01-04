import api from '../api-config';

export const getUserRegAdminApi = async (cookie: string | undefined, page: number, limit: number) => {
    const query = `/user-regs?page=${page}&limit=${limit}`;
    try {
        const response = await api.get(query, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};
