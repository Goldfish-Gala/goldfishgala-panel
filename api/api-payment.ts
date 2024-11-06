import { api } from './api-config';

export const getAllPaymentRegisteredEvent = async (cookie: string | undefined, userId: string | undefined) => {
    try {
        const response = await api.get(`/user-regs/member?user_id=${userId}`, {
            headers: {
                Cookie: `token=${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getAllUserRegByStatus = async (
    cookie: string | undefined,
    userId: string | undefined,
    eventId?: string,
    code?: string
) => {
    let query = '';
    if (eventId && code) {
        query = `/user-regs/member?event_id=${eventId}&user_id=${userId}&user_reg_status_code=${code}`;
    } else if (eventId) {
        query = `/user-regs/member?event_id=${eventId}&user_id=${userId}`;
    } else {
        query = `/user-regs/member?user_id=${userId}&user_reg_status_code=${code}`;
    }
    try {
        const response = await api.get(query, {
            headers: {
                Cookie: `token=${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};