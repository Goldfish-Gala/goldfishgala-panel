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

interface ItemDetail {
    fish_size: string;
    fish_count: number;
    fish_ids: string[];
    fish_price: number;
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
    fish_name?: string;
    fish_submission_link?: string;
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

interface FishDetailAdminType {
    fish_id: string;
    user_id: string;
    fish_is_nominated: boolean;
    fish_submission_link: string;
    fish_created_date: string;
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

interface FishDetailAdminPaginationType {
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
    owner_name: string;
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

interface FishScore {
    fish_score_id: string;
    champion_category_id: string;
    champion_category_name: string;
    judge_user_id: string;
    fish_score: number | null;
}

interface FishScoresType {
    fish_id: string;
    user_id: string;
    event_price_id: string;
    fish_name: string;
    fish_size: string;
    fish_submission_link: string;
    fish_created_date: string;
    fish_updated_date: string;
    fish_owner_name: string;
    user_email: string;
    user_phone: string;
    fishscores: FishScore[];
}
interface FishScorePaginationType {
    success: boolean;
    message: string;
    data: FishScoreType[];
    pagination: {
        totalData: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

interface FishScoresModalType {
    fish_score_id: string;
    fish_id: string;
    champion_category_id: string;
    user_id: string;
    fish_score: number;
    fish_score_updated_at: string;
    fish_name: string;
    fish_size: string;
    fish_submission_link: string;
    champion_category_name: string;
    role_id: number;
    user_fname: string;
    user_lname: string;
}
