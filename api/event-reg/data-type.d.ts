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

interface EventRegisterType {
    event_id: string;
    user_id: string | undefined;
    fish_id: string[];
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

interface EventRegister {
    event_name: string;
    event_desc: string;
    event_start_date: string;
    event_end_date: string;
    event_price_ids: string[],
    event_reg_id: string
  }

interface AllEvents extends EventRegister {
    event_id: string;
    event_is_active: boolean;
    event_created_date: string;
    event_reg_status_id: string;
    event_reg_status_code: string;
    event_reg_status_name: string;
    event_reg_status_desc: string;
    event_reg_phase_id: string;
    event_reg_phase_code: string;
    event_reg_phase_name: string;
    event_reg_phase_desc: string;
    event_reg_period_id: string;
    event_reg_start_date: string;
    event_reg_end_date: string;
    event_reg_created_date: string;
    event_prices: EventPrice[]
}

interface EventPrice {
    event_price_id: string;
    event_price_code: string;
    event_price_name: string;
    event_price_amount: number;
}

interface EventRegRegister {
    event_reg_status_id: string;
    event_reg_phase_id: string;
    event_reg_period_id: string;
  }

interface EventReg extends EventRegRegister {
    event_reg_id: string;
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

interface EventRegAdminPaginationType {
    success: boolean;
    message: string;
    data: EventReg[];
    pagination: {
        totalData: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

interface EventRegPhaseRegister {
    event_reg_phase_code: string;
    event_reg_phase_name: string;
    event_reg_phase_desc: string;
}

interface EventRegPhase extends EventRegPhaseRegister {
    event_reg_phase_id: string;
}

interface EventRegStatusRegister {
    event_reg_status_code: string;
    event_reg_status_name: string;
    event_reg_status_desc: string;
}

interface EventRegStatus extends EventRegStatusRegister {
    event_reg_status_id: string;
}

interface EventRegPeriodRegister {
    event_reg_start_date: string | undefined;
    event_reg_end_date: string | undefined;
}

interface EventRegPeriod extends EventRegPeriodRegister {
    event_reg_period_id: string;
    event_reg_created_date: string;
}

interface EventPrice {
    event_price_id: string;
    event_price_code: string;
    event_price_name: string;
    event_price_amount: number;
}
