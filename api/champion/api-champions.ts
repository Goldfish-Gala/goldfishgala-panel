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

export const getFinalFishByCategoryIdApi = async (token: string | undefined, categoryId: string) => {
    try {
        const response = await api.get(`/fish-finals?champion_category_id=${categoryId}`, {
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

export const createChampionApi = async (token: string | undefined, data: CreateChampionType) => {
    try {
        const response = await api.post(`/champions`, data, {
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

export const updateChampionApi = async (
    token: string | undefined,
    champion_id: string | undefined,
    data: CreateChampionType
) => {
    try {
        const response = await api.put(`/champions/${champion_id}`, data, {
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

export const deleteChampionApi = async (token: string | undefined, champion_id: string | undefined) => {
    try {
        const response = await api.delete(`/champions/${champion_id}`, {
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

export const getChampionAwardApi = async (token: string | undefined) => {
    try {
        const response = await api.get(`/champion-awards`, {
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

export const getBestAwardByEventPriceApi = async (token: string | undefined, eventPriceId: string) => {
    try {
        const response = await api.get(`/champions?limit=10&event_price_id=${eventPriceId}`, {
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

export const getGrandChampionCandidateApi = async (token: string | undefined) => {
    try {
        const response = await api.get(`/champions?limit=3`, {
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

export const getGrandChampionApi = async (token: string | undefined) => {
    try {
        const response = await api.get(`/champions?is_grand_champion=true`, {
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
