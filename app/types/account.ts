export interface CreateAccountFormData {
    email: string;
    name: string;
    password: string;
    role: string;
}

export interface EditAccountFormData {
    email: string;
    name: string;
    password?: string;
    role: string;
    customerId?: string;
    category?: string;
    memberSince?: string;
    phone?: string;
    address?: string;
    staffId?: string;
    position?: string;
}
