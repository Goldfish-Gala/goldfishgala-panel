interface PaymentDetail {
    payment_id: string;
    invoice_id: string;
    payment_method: string;
    payment_channel: string;
    payment_amount: number;
    payment_status: string;
    payment_paid_at: string;
    invoice_code: string;
}

interface PaymentDetailPagination {
    success: boolean;
    message: string;
    data: PaymentDetail[];
    pagination: {
        totalData: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
