import { api } from './api-config';

export const getAllevent = async (cookie: string | undefined) => {
    console.log('cookie ', cookie);
    try {
        const response = await api.get(`/events`, {
            headers: {
                Cookie: `token=${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getOneEvent = async (cookie: string | undefined, eventId: string) => {
    try {
        const response = await api.get(`/events/${eventId}`, {
            headers: {
                Cookie: `token=${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const eventRegisterApi = async (data: EventRegisterType, cookie: string | undefined) => {
    try {
        const response = await api.post(`/user-regs`, data, {
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
