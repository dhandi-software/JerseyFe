import React, { createContext, useContext, useState, useEffect } from "react";
import type { WishlistItem, WishlistContextType } from "~/types/wishlist";
import { parseNumericPrice } from "~/lib/utils";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "fcsv_wishlist";
const LEGACY_IDS_KEY = "wishlist_ids";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (err) {
        console.error("Gagal memuat data wishlist dari localStorage:", err);
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      const numericIds = items.map((i) => Number(i.id)).filter((id) => !isNaN(id));
      localStorage.setItem(LEGACY_IDS_KEY, JSON.stringify(numericIds));
      window.dispatchEvent(new CustomEvent("wishlist_updated", { detail: items }));
    } catch (err) {
      console.error("Gagal menyimpan data wishlist ke localStorage:", err);
    }
  }, [items]);

  const addToWishlist = (product: {
    id: string | number;
    name: string;
    price: number | string;
    image: string;
    originalPrice?: number | string;
    stockStatus?: "IN STOCK" | "OUT OF STOCK" | string;
    category?: string;
  }) => {
    const prodId = String(product.id);
    const parsedPrice = parseNumericPrice(product.price);
    const parsedOrigPrice = product.originalPrice ? parseNumericPrice(product.originalPrice) : undefined;

    setItems((prev) => {
      const exists = prev.some((item) => String(item.id) === prodId);
      if (exists) {
        return prev.filter((item) => String(item.id) !== prodId);
      }
      return [
        ...prev,
        {
          id: prodId,
          name: product.name,
          price: parsedPrice,
          originalPrice: parsedOrigPrice,
          image: product.image || "/images/jersey_hero.webp",
          stockStatus: product.stockStatus || "IN STOCK",
          category: product.category || "Bahan Baju",
        },
      ];
    });
  };

  const removeItem = (id: string | number) => {
    const prodId = String(id);
    setItems((prev) => prev.filter((item) => String(item.id) !== prodId));
  };

  const clearAll = () => {
    setItems([]);
  };

  const isInWishlist = (id: string | number) => {
    const prodId = String(id);
    return items.some((item) => String(item.id) === prodId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeItem,
        clearAll,
        isInWishlist,
        wishlistCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      items: [],
      addToWishlist: () => {},
      removeItem: () => {},
      clearAll: () => {},
      isInWishlist: () => false,
      wishlistCount: 0,
    };
  }
  return context;
}
