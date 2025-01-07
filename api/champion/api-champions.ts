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

export const getAllChampionCategory = async (token: string | undefined) => {
    try {
        const response = await api.get(`/champion-categories`, {
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

export const getOneChampionCategory = async (champion_category_id: string, token: string | undefined) => {
    try {
        const response = await api.get(`/champion-categories?champion_category_id=${champion_category_id}`, {
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

export const createChampionCategory = async (data: ChampionCategoryRegisterType, token: string | undefined) => {
    try {
        const response = await api.post(`/champion-categories`, data, {
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

export const updateChampionCategory = async (
    champion_category_id: string,
    data: ChampionCategoryRegisterType,
    token: string | undefined
) => {
    try {
        const response = await api.put(`/champion-categories/${champion_category_id}`, data, {
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

export const deleteChampionCategory = async (champion_category_id: string, token: string | undefined) => {
    try {
        const response = await api.delete(`/champion-categories/${champion_category_id}`, {
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

export const getChampionByEventPriceApi = async (token: string | undefined, eventPriceId: string) => {
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

export const getBestAwardApi = async (token: string | undefined) => {
    try {
        const response = await api.get(`/champions?is_best_award=true`, {
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
