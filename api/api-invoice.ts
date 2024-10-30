import { api } from './api-config';

export const createInvoceApi = async (userRegId: string, cookie: string | undefined) => {
    const body = { user_reg_id: userRegId };
    try {
        const response = await api.post(`/invoices`, body, {
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

export const getInvoiceByCode = async (cookie: string | undefined, invoiceCode?: string) => {
    const query = `/invoices/member?invoice_code=${invoiceCode}`;
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
