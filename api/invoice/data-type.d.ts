interface InvoiceDetail {
    invoice_id: string;
    user_reg_id: string;
    user_id: string;
    user_name: string;
    invoice_code: string;
    invoice_status: string;
    invoice_amount: number;
    invoice_due_date: string;
    invoice_created_date: string;
    invoice_checkout_url: string;
    event_id: string;
    event_name: string;
    event_desc: string;
    fish_details: ItemDetail[];
}

interface InvoiceDetailPagination {
    success: boolean;
    message: string;
    data: InvoiceDetail[];
    pagination: {
        totalData: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
