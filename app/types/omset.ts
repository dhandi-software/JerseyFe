export type TimeView = 'daily' | 'monthly' | 'yearly' | 'lifetime';

export interface SalesDataItem {
    name: string;
    pv: number;
    [key: string]: any;
}

export interface SalesDataMap {
    daily: SalesDataItem[];
    monthly: SalesDataItem[];
    yearly: SalesDataItem[];
    lifetime: SalesDataItem[];
}

export interface BestMonth {
    month: string;
    year: string;
    pv: number;
}

export interface BestYear {
    year: string;
    totalRevenue: number;
    totalQuantity: number;
}

export interface OmsetStatsData {
    totalCustomer: number;
    totalStaff: number;
    totalAdmin: number;
    totalRevenue: number;
    salesData: SalesDataMap;
    bestMonth: BestMonth;
    bestYear: BestYear;
}

export interface MonthOption {
    value: number;
    label: string;
}
