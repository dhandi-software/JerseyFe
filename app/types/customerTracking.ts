/**
 * Customer Tracking & Repeat Order Types
 * FCSV Apparel — Batch 2 Milestone M4 (R4 Customer Repeat Order Tracking)
 */

export interface CustomerOrderHistoryItem {
  id?: number;
  orderId: string;
  totalAmount: number;
  paidAmount?: number;
  remainingAmount?: number;
  status: string;
  createdAt: string;
  materialName?: string | null;
  materialPrice?: number | null;
  itemCount?: number;
  itemsCount?: number;
  mockupUrl?: string | null;
  details?: any[];
  payments?: any[];
}

export interface CustomerOrderStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderDate?: string | null;
  lastOrderDate?: string | null;
  isRepeatCustomer: boolean;
  badge?: string;
  statusBreakdown?: Record<string, number>;
}

export interface CustomerSuggestion {
  customerName: string;
  customerPhone?: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  averageOrderValue?: number;
  isRepeatCustomer?: boolean;
  badge?: string;
  recentOrders?: CustomerOrderHistoryItem[];
}

export interface CustomerProfileSummary {
  customerName: string;
  customerPhone?: string | null;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderDate?: string | null;
  lastOrderDate?: string | null;
  statusBreakdown?: Record<string, number>;
}

export interface CustomerSearchQuery {
  q: string;
  limit?: number;
}

export interface CustomerTrackingResponse {
  success: boolean;
  customers: CustomerSuggestion[];
  total?: number;
}

export interface CustomerHistoryResponse {
  success: boolean;
  customer: CustomerProfileSummary | CustomerSuggestion;
  orders: CustomerOrderHistoryItem[];
  stats?: CustomerOrderStats;
}
