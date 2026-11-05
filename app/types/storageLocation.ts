/**
 * Storage Location Types
 * FCSV Apparel — Batch 2 Milestone M3 (R2 Storage Location Management)
 */

export interface StorageLocation {
  id: number;
  name: string;
  code: string;
  address?: string | null;
  notes?: string | null;
  orderCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StorageLocationDetail extends StorageLocation {
  orders?: Array<{
    id: number;
    orderId: string;
    customerName: string;
    customerPhone?: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export interface StorageLocationStats {
  totalLocations: number;
  activeLocations: number;
  totalAssignedOrders: number;
}

export interface CreateStorageLocationInput {
  name: string;
  code: string;
  address?: string;
  notes?: string;
}

export interface UpdateStorageLocationInput {
  name?: string;
  code?: string;
  address?: string;
  notes?: string;
}

export interface OrderStorageAssignmentInput {
  storageLocationId: number | null;
}

export interface StorageLocationFilter {
  search?: string;
  storageLocationId?: number | null;
  page?: number;
  limit?: number;
}
