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
            `/fish-nominations/judge/${user?.user_id}?page=${page}&limit=${limit}&sort=${sort}`,
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
