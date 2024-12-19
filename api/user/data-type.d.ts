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
    role_name: string;
}

interface AllUsersType {
    success: boolean;
    message: string;
    data: User[];
    pagination: {
        totalData: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

interface UpdateUserType {
    user_fname: string;
    user_lname?: string;
    user_ig: string;
    user_address?: string;
    user_phone: string;
}
