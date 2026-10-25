export interface ReturOrderDetail {
    id?: number;
    orderId?: number;
    productId: number;
    productTitle: string;
    [key: string]: any;
}

export interface ReturOrder {
    id: string;
    rawId: number;
    customer: string;
    product: string;
    qty: number;
    status: string;
    damagedPcs: number;
    date: string;
    dateTime: string;
    details: ReturOrderDetail[];
}

export interface DamageHistoryItem {
    id: number;
    orderId?: number;
    productId?: number;
    productTitle?: string;
    pcs: number;
    keterangan?: string;
    actor?: string;
    createdAt: string;
    updatedAt?: string;
    [key: string]: any;
}

export interface ReturBarangToast {
    title: string;
    variant: "success" | "destructive";
}

export type ReturBarangSortOption = "newest" | "oldest" | "damage-highest" | string;
