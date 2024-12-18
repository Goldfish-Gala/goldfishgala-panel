import api from '../api-config';

export const getAllEventPrice = async (token: string | undefined) => {
    try {
        const response = await api.get(`/event-prices`, {
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