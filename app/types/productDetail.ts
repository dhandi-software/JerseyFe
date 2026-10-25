export interface ProductColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface ProductShippingWarranty {
  courier?: string;
  deliveryTime?: string;
  guarantee?: string;
}

export interface ProductAdditionalInfo {
  weight?: string;
  dimensions?: string;
  colorOptions?: string;
  warranty?: string;
  modelNumber?: string;
}

export interface ProductDetailData {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  price: string;
  originalPrice?: string;
  rawPrice: number;
  rawOriginalPrice?: number;
  discountBadge?: string;
  rating: number;
  reviewsCount: number;
  availability: string;
  brand: string;
  sku: string;
  description: string;
  shortDescription?: string;
  features: string[];
  images: string[];
  colors: ProductColorOption[];
  sizes: string[];
  specs: Record<string, string>;
  stockKg?: number;
  additionalInfo?: ProductAdditionalInfo;
  shippingWarranty?: ProductShippingWarranty;
}

export type ProductDetailTabType = "description" | "specifications" | "care" | "guarantee";
