export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface ShippingInfoPayload {
  courier?: string;
  localShipping?: string;
  expressShipping?: string;
  globalExport?: string;
}

export interface AdditionalInfoPayload {
  weight?: string;
  dimensions?: string;
  colorOptions?: string;
  warranty?: string;
  modelNumber?: string;
}

export interface ProductItem {
  id: number | string;
  sku: string;
  title: string;
  category: string;
  price: number;
  discount_price?: number;
  stock: number;
  low_stock_threshold?: number;
  weight?: number;
  materials?: string;
  brand?: string;
  short_description?: string;
  description?: string;
  image?: string;
  images?: string[];
  status?: "active" | "draft" | "archived" | string;
  is_featured: boolean;
  is_active: boolean;
  is_best_deal?: boolean;
  best_deal_started_at?: string | null;
  best_deal_expires_at?: string | null;
  best_deal_duration?: number;
  features?: string[];
  colors?: ColorOption[];
  shipping_info?: ShippingInfoPayload;
  additional_info?: AdditionalInfoPayload;
  specifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductPayload {
  sku?: string;
  title: string;
  category: string;
  price?: number;
  discount_price?: number;
  stock?: number;
  low_stock_threshold?: number;
  weight?: number;
  materials?: string;
  brand?: string;
  short_description?: string;
  description?: string;
  image?: string;
  images?: string[];
  status?: "active" | "draft" | "archived" | string;
  is_featured?: boolean;
  is_active?: boolean;
  is_best_deal?: boolean;
  best_deal_started_at?: string | null;
  best_deal_expires_at?: string | null;
  best_deal_duration?: number;
  features?: string[];
  colors?: ColorOption[];
  shipping_info?: ShippingInfoPayload;
  additional_info?: AdditionalInfoPayload;
  specifications?: Record<string, string>;
}
