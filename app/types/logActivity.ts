export interface LogActivityUser {
    name: string;
    role: string;
    avatar?: string;
}

export interface LogActivity {
    id: string;
    user: LogActivityUser;
    activity: string;
    description: string;
    actionType: string;
    action: string;
    date: string;
    ipAddress: string;
    userAgent: string;
}

export interface LogActivityFilterParams {
    role?: string;
    action?: string;
    date?: number;
    page?: number;
    limit?: number;
}
