export interface User {
    id: string;
    email: string;
    role: "admin" | "customer" | "desain" | "manager" | "gudang";
    token: string;
    name?: string;
    nama?: string;
    refresh_token?: string;
    last_login?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    message?: string;
    data: User;
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    error?: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: "admin" | "customer" | "desain";
}

export interface RegisterResponse {
    code: number;
    status: string;
    message: string;
    data?: any;
}

// Password Types

export interface ProfileData {
    user_id: string;
    email: string;
    role: "admin" | "customer" | "desain";
    name: string;
    username: string;
    photo: string;
    bio: string;
    created_at?: string;
    updated_at?: string;
}

export interface ProfileResponse {
    code: number;
    status: string;
    message: string;
    data: ProfileData;
}

export interface ProfileUpdateRequest {
    username?: string;
    bio?: string;
    photo?: string | File;
    name?: string;
    email?: string;
}

// Password Types
export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}

export interface ChangePasswordResponse {
    code: number;
    status: string;
    message: string;
    data?: any;
}

export interface UpdatePasswordRequest {
    current_password: string;
    new_password: string;
    confirm_password: string;
}
// User Management Types

// User Management Types
export interface UserAccount {
    id: string;
    email: string;
    name: string;
    role: "admin" | "customer" | "desain";
    created_at: string;
    updated_at: string;
    avatar?: string;
    handle?: string;
    username?: string;
    password?: string;
    bio?: string;
}

export interface UserAccountResponse {
    code: number;
    status: string;
    message: string;
    data: UserAccount[] | UserAccount;
}

export interface UpdateRoleRequest {
    role: string;
}

// Media Types
export interface ApiMediaItem {
    id: string;
    name: string;
    path: string;
    size?: number;
    mime_type?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PaginatedMediaData {
    items: ApiMediaItem[];
    page: number;
    limit: number;
    totalRows: number;
    totalPages: number;
}

export interface MediaResponse {
    code: number;
    status: string;
    message: string;
    data: any;
}

export interface UpdateMediaRequest {
    name?: string;
}

export interface DeleteMediaRequest {
    id?: string | string[];
    ids?: string[];
}

export interface LogActivityItem {
    id: number | string;
    user_name: string;
    role: string;
    action_type: string;
    description: string;
    created_at: string;
    ip_address: string;
    user_agent: string;
}

export interface NewsRequest {
    title: string;
    sub_heading: string;
    set_headline: boolean;
    media_id: string;
    image_caption: string;
    body: string;
    status: "draft" | "published";
    categories: number[];
    topics: string[];
    scheduled_at: string | null;
}

export interface NewsListItem {
    id: string | number;
    title: string;
    slug?: string;
    sub_heading?: string;
    body?: string;
    image?: string;
    image_url?: string;
    media?: any;
    categories?: any[];
    created_at?: string;
    updated_at?: string;
}

export interface ArticleDetail extends NewsListItem {
    content?: string;
    author?: string;
    views?: number;
}

export interface VideoListItem {
    id: string | number;
    title: string;
    url?: string;
    thumbnail?: string;
    created_at?: string;
}

export interface AdvertisementResponse {
    id: string | number;
    title?: string;
    image_url?: string;
    url?: string;
    type?: string;
}



