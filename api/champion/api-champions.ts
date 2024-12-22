import api from '../api-config';

export const getAllChampions = async (token: string | undefined) => {
    try {
        const response = await api.get(`/champions`, {
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

export const getAllCategoryByEventPriceApi = async (token: string | undefined, eventPriceId: string) => {
    try {
        const response = await api.get(`/champion-categories?event_price_id=${eventPriceId}`, {
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

export const getAllChampionByCategoryIdApi = async (token: string | undefined, categoryId: string) => {
    try {
        const response = await api.get(`/champions/category/${categoryId}`, {
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
