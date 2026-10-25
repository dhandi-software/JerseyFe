export interface WishlistItem {
  id: string | number;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  image: string;
  stockStatus?: "IN STOCK" | "OUT OF STOCK" | string;
  category?: string;
}

export interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: {
    id: string | number;
    name: string;
    price: number | string;
    image: string;
    originalPrice?: number | string;
    stockStatus?: "IN STOCK" | "OUT OF STOCK" | string;
    category?: string;
  }) => void;
  removeItem: (id: string | number) => void;
  clearAll: () => void;
  isInWishlist: (id: string | number) => boolean;
  wishlistCount: number;
}
