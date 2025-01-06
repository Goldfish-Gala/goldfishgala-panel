import api from '../api-config';

export const getAllEventPrice = async (sort: string, token: string | undefined) => {
    try {
        const response = await api.get(`/event-prices?sort=${sort}`, {
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

export const getOneEventPrice = async (event_price_id: string, token: string | undefined) => {
    try {
        const response = await api.get(`/event-prices/${event_price_id}`, {
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

export const createEventPrice = async (data: EventPriceRegisterType, cookie: string | undefined) => {
    try {
        const response = await api.post(`/event-prices`, data, {
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

export const deleteEventPrice = async (event_price_id: string, cookie: string | undefined) => {
    try {
        const response = await api.delete(`/event-prices/${event_price_id}`,{
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

export const updateEventPrice = async (event_price_id: string, data: EventPriceRegisterType, cookie: string | undefined) => {
    try {
        const response = await api.patch(`/event-prices/${event_price_id}`, data, {
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