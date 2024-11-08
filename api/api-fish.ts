import api from './api-config';

export const fishRegisterApi = async (data: FishRegisterType, cookie: string | undefined) => {
    try {
        const response = await api.post(`/fishes`, data, {
            headers: {
                Cookie: `token=${cookie}`,
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
                Cookie: `token=${cookie}`,
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
                Cookie: `token=${cookie}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};
