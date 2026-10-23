import type { BestMonth, BestYear, SalesDataMap } from "./omset";

export interface RecentCustomer {
    id: number;
    nama: string;
    email?: string;
    avatar?: string;
    lastMessageAt?: string;
    lastMessageContent?: string;
    category?: string;
    createdAt?: string;
    [key: string]: any;
}

export type DashboardRecentCustomer = RecentCustomer;

export interface RecentChat {
    id: number;
    senderName: string;
    senderRole?: string;
    partnerId?: number | string;
    content?: string;
    message?: string;
    createdAt?: string;
    isRead?: boolean;
    [key: string]: any;
}

export type DashboardRecentChat = RecentChat;

export interface TopBuyer {
    name: string;
    category: string;
    initial: string;
    [key: string]: any;
}

export interface DashboardNewOrder {
    name: string;
    [key: string]: any;
}

export interface ChartDataPoint {
    name: string;
    pv: number;
    [key: string]: any;
}

export interface DashboardStatsData {
    totalCustomer: number;
    totalStaff: number;
    totalAdmin: number;
    totalRevenue: number;
    salesData: SalesDataMap;
    recentCustomers: RecentCustomer[];
    recentChats: RecentChat[];
    totalUnreadChat: number;
    bestMonth: BestMonth;
    bestYear: BestYear;
    topBuyer: TopBuyer;
    newOrders: DashboardNewOrder[];
}
