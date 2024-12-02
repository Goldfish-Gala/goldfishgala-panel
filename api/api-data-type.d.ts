interface User {
    user_id: string;
    role_id: number;
    user_fname: string;
    user_lname: string;
    user_email: string;
    user_phone: string;
    user_ig: string;
    user_address: string;
    user_avatar: string;
    user_is_first_login: boolean;
    user_is_active: boolean;
    user_last_active: string;
    user_created_date: string;
}

interface UpdateUserType {
    user_fname: string;
    user_lname?: string;
    user_ig: string;
    user_address?: string;
    user_phone: string;
}

interface OneOngoingEvent {
    event_id: string;
    event_reg_id: string;
    event_name: string;
    event_desc: string;
    event_is_active: boolean;
    event_start_date: string;
    event_end_date: string;
    event_created_date: string;
    event_reg_phase_id: string;
    event_reg_status_id: string;
    event_reg_period_id: string;
    event_reg_phase_code: string;
    event_reg_phase_name: string;
    event_reg_phase_desc: string;
    event_reg_status_code: string;
    event_reg_status_name: string;
    event_reg_status_desc: string;
    event_reg_start_date: string;
    event_reg_end_date: string;
    event_reg_created_date: string;
}

interface OngoingEvents {
    event_id: string;
    event_reg_id: string;
    event_name: string;
    event_desc: string;
    event_is_active: boolean;
    event_start_date: string;
    event_end_date: string;
    event_created_date: string;
    eventPrices: EventPrice[];
    eventReg: EventReg;
}

interface EventPrice {
    event_price_id: string;
    event_price_code: string;
    event_price_name: string;
    event_price_amount: number;
}

interface EventReg {
    event_reg_id: string;
    event_reg_phase_id: string;
    event_reg_status_id: string;
    event_reg_period_id: string;
    eventRegPhase: EventRegPhase;
    eventRegStatus: EventRegStatus;
    eventRegPeriod: EventRegPeriod;
}

interface EventRegPhase {
    event_reg_phase_id: string;
    event_reg_phase_code: string;
    event_reg_phase_name: string;
    event_reg_phase_desc: string;
}

interface EventRegStatus {
    event_reg_status_id: string;
    event_reg_status_code: string;
    event_reg_status_name: string;
    event_reg_status_desc: string;
}

interface EventRegPeriod {
    event_reg_period_id: string;
    event_reg_start_date: string;
    event_reg_end_date: string;
    event_reg_created_date: string;
}

interface EventPrice {
    event_price_id: string;
    event_price_code: string;
    event_price_name: string;
    event_price_amount: number;
}

interface FishRegisterType {
    event_price_id: string;
    fish_size: string;
    fish_name: string;
}

interface FishType {
    fish_type_id: string;
    fish_type_name: string;
    fish_type_code: string;
    fish_type_created_date: string;
}

interface FishDetailType {
    fish_id: string;
    user_id: string;
    event_price_id: string;
    fish_name: string;
    fish_size: string;
    fish_submission_link: string | null;
    fish_created_date: string;
    fish_updated_date: string;
    event_price_code: string;
    event_price_name: string;
    event_price_amount: number;
    user_reg_id: string;
    event_id: string;
    user_reg_status_id: string;
    user_reg_created_date: string;
    user_reg_status_code: string;
    user_reg_status_name: string;
    event_name: string;
    event_desc: string;
    event_start_date: string;
    event_end_date: string;
    event_created_date: string;
    event_reg_id: string;
    event_is_active: boolean;
    invoices: [
        {
            invoice_id: string;
            invoice_code: string;
            invoice_status: string;
            invoice_amount: number;
            invoice_due_date: string;
            invoice_created_date: string;
            invoice_checkout_url: string;
        }
    ];
}

interface FishJudgesType {
    fish_id: string;
    user_id: string;
    fish_name: string;
    fish_size: string;
    fish_is_nominated: boolean;
    fish_submission_link: string;
    event_price_id: string;
    event_price_code: string;
    event_price_name: string;
    event_price_amount: number;
    user_reg_id: string;
    event_id: string;
    user_reg_user_id: string;
    user_reg_status_id: string;
    user_reg_created_date: string;
    user_reg_status_code: string;
    user_reg_status_name: string;
    event_name: string;
    event_desc: string;
    event_start_date: string;
    event_end_date: string;
    event_created_date: string;
    event_reg_id: string;
    event_is_active: boolean;
    user_name: string;
    exiting?: boolean;
}

interface FishPaginationType {
    success: boolean;
    message: string;
    data: FishJudgesType[];
    pagination: {
        totalData: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

interface EventRegisterType {
    event_id: string;
    user_id: string | undefined;
    fish_id: string[];
}

interface FishType {
    event_price_amount: number;
    event_price_code: string;
    event_price_name: string;
    fish_updated_date: string;
    fish_id: string;
    fish_name: string;
    fish_size: string;
}

interface FishUrlType {
    fish_submission_link: string;
}

interface UserRegDetailType {
    user_reg_id: string;
    event_id: string;
    user_id: string;
    fishes: [
        {
            event_price_amount: number;
            event_price_code: string;
            event_price_name: string;
            fish_updated_date: string;
            fish_id: string;
            fish_name: string;
            fish_size: string;
        }
    ];
    user_reg_status_id: string;
    user_reg_created_date: string;
    event_name: string;
    event_desc: string;
    event_is_active: boolean;
    event_start_date: string;
    event_end_date: string;
    event_created_date: string;
    user_email: string;
    user_fname: string;
    user_lname: string;
    user_is_active: boolean;
    user_last_active: string;
    user_reg_status_code: string;
    user_reg_status_name: string;
    user_reg_status_desc: string;
    invoice_code: string;
    invoice_status: string;
    invoice_due_date: string;
    invoice_checkout_url: string;
}

interface ItemDetail {
    fish_size: string;
    fish_count: number;
    fish_ids: string[];
    fish_price: number;
}

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

interface FlattenedFishType extends UserRegDetailType {
    fish: {
        event_price_amount: number;
        event_price_code: string;
        event_price_name: string;
        fish_updated_date: string;
        fish_id: string;
        fish_name: string;
        fish_size: string;
    };
}
