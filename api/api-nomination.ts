import api from './api-config';

export const selectFishNominateApi = async (fishId: string, cookie: string | undefined) => {
    const body = { fish_id: fishId };
    try {
        const response = await api.post(`/fish-nominations`, body, {
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

export const cancelFishNomineesApi = async (fishId: string, cookie: string | undefined) => {
    try {
        const response = await api.delete(`/fish-nominations/${fishId}`, {
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

export const getAllFishCandidateApi = async (page: number, limit: number, sort: string, cookie: string | undefined) => {
    try {
        const response = await api.get(`/fishes?page=${page}&limit=${limit}&sort=${sort}`, {
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

export const getAllSelectedFishApi = async (
    user: User | null,
    page: number,
    limit: number,
    sort: string,
    cookie: string | undefined
) => {
    try {
        const response = await api.get(
            `/fish-nominations?user_id=${user?.user_id}&page=${page}&limit=${limit}&sort=${sort}`,
            {
                headers: {
                    Authorization: `Bearer ${cookie}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAllFishNominatedApi = async (page: number, limit: number, sort: string, cookie: string | undefined) => {
    try {
        const response = await api.get(`/fish-nominated/judge?page=${page}&limit=${limit}&sort=${sort}`, {
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

export const getFishScoreByFishIdApi = async (fishId: string | undefined, cookie: string | undefined) => {
    try {
        const response = await api.get(`/fish-scores/judges?fish_id=${fishId}`, {
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

export const updateScoreApi = async (
    payload: { fish_score_id: string; fish_score: number }[],
    cookie: string | undefined
) => {
    try {
        const response = await api.put(`/fish-scores`, payload, {
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
