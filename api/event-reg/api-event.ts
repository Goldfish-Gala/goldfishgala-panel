import api from '../api-config';

export const getAllOngoingEvents = async (cookie: string | undefined) => {
    try {
        const response = await api.get(`/events/detailed`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
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
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getOneEventDetail = async (cookie: string | undefined, eventId: string) => {
    try {
        const response = await api.get(`/events/detailed/${eventId}`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
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
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getEventPricesApi = async (eventId: string, cookie: string | undefined) => {
    try {
        const response = await api.get(`/event-prices/event/${eventId}`, {
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
