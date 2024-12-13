interface InvoiceDetail {
    invoice_id: string;
    user_reg_id: string;
    user_id: string;
    invoice_code: string;
    invoice_status: string;
    invoice_amount: number;
    invoice_due_date: string;
    invoice_created_date: string;
    invoice_checkout_url: string;
    event_id: string;
    fish_details: ItemDetail[];
}
