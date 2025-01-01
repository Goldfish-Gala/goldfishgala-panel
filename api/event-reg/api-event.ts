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

export const getOneEvent = async (event_id: string, cookie: string | undefined) => {
    try {
        const response = await api.get(`/events/${event_id}`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getOneEventDetail = async (cookie: string | undefined, event_id: string) => {
    try {
        const response = await api.get(`/events/detailed/${event_id}`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getAllEvent = async (cookie: string | undefined) => {
    try {
        const response = await api.get(`/events`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const createEvent = async (data: EventRegister, cookie: string | undefined) => {
    try {
        const response = await api.post(`/events`, data, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateEvent = async (event_id: string, data: EventRegister, cookie: string | undefined) => {
    try {
        const response = await api.patch(`/events/${event_id}`, data, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateEventIsActive = async ( eventId: string, cookie: string | undefined) => {
    try {
        const response = await api.put(`/events/${eventId}`, {}, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};


export const deleteEvent = async ( eventId: string, cookie: string | undefined) => {
    try {
        const response = await api.delete(`/events/${eventId}`, {
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
