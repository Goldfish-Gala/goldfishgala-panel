import api from '../api-config';

export const getAllEventRegs = async (cookie: string | undefined) => {
    try {
        const response = await api.get(`/event-regs`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getAllEventStatuses = async (cookie: string | undefined) => {
    try {
        const response = await api.get(`/event-reg-statuses`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getOneEventStatus = async (event_reg_status_id: string, cookie: string | undefined) => {
    try {
        const response = await api.get(`/event-reg-statuses/${event_reg_status_id}`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const createEventStatus = async (data: EventRegStatusRegister, cookie: string | undefined) => {
    try {
        const response = await api.post(`/event-reg-statuses`, data, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateEventStatus = async (
    event_reg_status_id: string,
    data: EventRegStatusRegister,
    cookie: string | undefined
) => {
    try {
        const response = await api.patch(`/event-reg-statuses/${event_reg_status_id}`, data, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const deleteEventStatus = async (event_reg_status_id: string, cookie: string | undefined) => {
    try {
        const response = await api.delete(`/event-reg-statuses/${event_reg_status_id}`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getAllEventPhases = async (cookie: string | undefined) => {
    try {
        const response = await api.get(`/event-reg-phases`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getOneEventPhase = async (event_reg_phase_id: string, cookie: string | undefined) => {
    try {
        const response = await api.get(`/event-reg-phases/${event_reg_phase_id}`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const createEventPhase = async (data: EventRegPhaseRegister, cookie: string | undefined) => {
    try {
        const response = await api.post(`/event-reg-phases`, data, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateEventPhase = async (
    event_reg_phase_id: string,
    data: EventRegPhaseRegister,
    cookie: string | undefined
) => {
    try {
        const response = await api.patch(`/event-reg-phases/${event_reg_phase_id}`, data, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const deleteEventPhase = async (event_reg_phase_id: string, cookie: string | undefined) => {
    try {
        const response = await api.delete(`/event-reg-phases/${event_reg_phase_id}`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getAllEventPeriods = async (cookie: string | undefined) => {
    try {
        const response = await api.get(`/event-reg-periods`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getOneEventPeriod = async (event_reg_period_id: string, cookie: string | undefined) => {
    try {
        const response = await api.get(`/event-reg-periods/${event_reg_period_id}`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const createEventPeriod = async (data: EventRegPeriodRegister, cookie: string | undefined) => {
    try {
        const response = await api.post(`/event-reg-periods`, data, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateEventPeriod = async (
    event_reg_period_id: string,
    data: EventRegPeriodRegister,
    cookie: string | undefined
) => {
    try {
        const response = await api.patch(`/event-reg-periods/${event_reg_period_id}`, data, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const deleteEventPeriod = async (event_reg_period_id: string, cookie: string | undefined) => {
    try {
        const response = await api.delete(`/event-reg-periods/${event_reg_period_id}`, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};