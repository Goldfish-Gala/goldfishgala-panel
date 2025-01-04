import api from '../api-config';

export const createInvoceApi = async (userRegId: string, cookie: string | undefined) => {
    const body = { user_reg_id: userRegId };
    try {
        const response = await api.post(`/invoices`, body, {
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

export const getInvoiceByCode = async (
    cookie: string | undefined,
    invoiceCode: string,
    user_id: string | undefined
) => {
    const query = `/invoices/guest?invoice_code=${invoiceCode}&user_id=${user_id}`;
    try {
        const response = await api.get(query, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getInvoiceByUserId = async (cookie: string | undefined) => {
    const query = `/invoices/guest`;
    try {
        const response = await api.get(query, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getInvoiceAdminApi = async (cookie: string | undefined, page: number, limit: number) => {
    const query = `/invoices?page=${page}&limit=${limit}`;
    try {
        const response = await api.get(query, {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};
