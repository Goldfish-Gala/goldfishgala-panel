import { api } from './api-config';

export const getAllEventRegistered = async (cookie: string | undefined, userId: string | undefined) => {
    try {
        const response = await api.get(`/user-regs/user/${userId}`, {
            headers: {
                Cookie: `token=${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};
