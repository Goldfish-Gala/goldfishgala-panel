import api from '../api-config';

export const fishRegisterApi = async (data: FishRegisterType, cookie: string | undefined) => {
    try {
        const response = await api.post(`/fishes`, data, {
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

export const getFishTypeApi = async (code: string, cookie: string | undefined) => {
    try {
        const response = await api.get(`/fish-types/code/${code}`, {
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

export const fishImageApi = async (fileImage: File, cookie: string | undefined) => {
    try {
        const formData = new FormData();
        formData.append('fish_image', fileImage);

        const response = await api.post(`/fishes/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${cookie}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getFishDetailApi = async (fishId: string, cookie: string | undefined) => {
    try {
        const response = await api.get(`/fishes?fish_id=${fishId}`, {
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

export const updateFishUrlApi = async (fishId: string, body: FishUrlType, cookie: string | undefined) => {
    try {
        const response = await api.put(`/fishes/url/${fishId}`, body, {
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

export const getFishListAdminApi = async (cookie: string | undefined, page: number, limit: number, sort: string) => {
    try {
        const response = await api.get(`/fishes/all?page=${page}&limit=${limit}&sort=${sort}`, {
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
