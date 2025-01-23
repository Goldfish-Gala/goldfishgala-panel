import api from '../api-config';

export const createCommunityApi = async (cookie: string | undefined, data: CreateCommunityType) => {
    try {
        const response = await api.post(`/group-communities`, data, {
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

export const updateCommunityApi = async (
    cookie: string | undefined,
    id: string | undefined,
    data: CreateCommunityType
) => {
    try {
        const response = await api.patch(`/group-communities/${id}`, data, {
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

export const getCummunityList = async (token: string | undefined) => {
    try {
        const response = await api.get(`/group-communities`, {
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

export const getCummunityByEventId = async (token: string | undefined, id: string | null) => {
    try {
        const response = await api.get(`/group-communities?event_id=${id}`, {
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

export const deleteCommunityApi = async (cookie: string | undefined, id: string | null) => {
    try {
        const response = await api.delete(`/group-communities/${id}`, {
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
