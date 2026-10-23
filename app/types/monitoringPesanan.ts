export interface OrderMember {
    id?: number;
    playerName?: string;
    playerNumber?: string | number;
    playerSize?: string;
    productTitle?: string;
}

export interface PlayerInfoItem {
    name: string;
    number: string | number;
    size: string;
}

export interface MonitoringOrder {
    id: string;
    rawId: number;
    customer: string;
    designer: string;
    product: string;
    productId: number | null;
    recommendedBahanIds: number[];
    qty: number;
    status: string;
    queueNumber?: string | number;
    isWorking?: boolean;
    date: string;
    playerInfo: PlayerInfoItem[];
    designNote?: string;
    designUrl?: string;
    paymentProofUrl?: string;
    isAdminOrder: boolean;
    totalAmount: number;
    shippingMethod?: string;
    shippingAddress?: string;
    mockupUrl?: string;
    designStatus?: string;
    designFeedback?: string;
    layoutUrl?: string;
    layoutStatus?: string;
    layoutFeedback?: string;
    printUrl?: string;
    finishingUrl?: string;
    details: OrderMember[];
    dateTime: string;
}

export interface DesignerItem {
    id: number;
    nama: string;
    email: string;
}

export interface BahanItem {
    id: number;
    nama: string;
    harga?: number;
    status: string;
}

export interface ToastState {
    title: string;
    variant: "success" | "destructive";
}

export type MonitoringFilterTab = 
    | "ALL" 
    | "MENUNGGU" 
    | "DESAIN" 
    | "LAYOUT" 
    | "PRINT" 
    | "FINISHING" 
    | "SELESAI" 
    | "DITOLAK";

export type MonitoringSortOption = 
    | "newest" 
    | "oldest" 
    | "name-asc" 
    | "name-desc" 
    | "price-highest" 
    | "price-lowest" 
    | "qty-highest" 
    | "qty-lowest";
