import { useState, useEffect, useCallback } from "react";
import { productApi } from "~/api/productApi";
import type { ProductItem } from "~/types/product";

export interface FormattedDealProduct {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  rawProduct: ProductItem;
  badge?: {
    text: string;
    variant: "hot" | "sold-out" | "discount" | "sale";
  };
}

export function formatTimeRemaining(expiryTime: string | number | null | undefined): string {
  if (!expiryTime) return "00d : 00h : 00m : 00s";
  const target = new Date(expiryTime).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) return "00d : 00h : 00m : 00s";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
}

export function useBestDeals() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll();
      const list: ProductItem[] = Array.isArray(res?.data) ? res.data : [];
      
      const currentTime = Date.now();
      const defaultPromoExpiry = new Date(currentTime + 24 * 3600 * 1000).toISOString();

      const activeDeals = list.filter((p) => {
        if (p.is_active === false) return false;
        if (!p.is_best_deal) return false;
        if (p.best_deal_expires_at) {
          const expTime = new Date(p.best_deal_expires_at).getTime();
          if (expTime <= currentTime) return false;
        }
        return true;
      }).map((p) => ({
        ...p,
        best_deal_expires_at: p.best_deal_expires_at || defaultPromoExpiry,
      }));

      setProducts(activeDeals);
    } catch (e) {
      console.warn("Gagal mengambil data Best Deals:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeProducts = products.filter((p) => {
    if (!p.best_deal_expires_at) return true;
    return new Date(p.best_deal_expires_at).getTime() > now;
  });

  let targetExpiry = 0;
  if (activeProducts.length > 0) {
    const validExpiries = activeProducts
      .map((p) => (p.best_deal_expires_at ? new Date(p.best_deal_expires_at).getTime() : null))
      .filter((exp): exp is number => exp !== null && exp > now);

    if (validExpiries.length > 0) {
      targetExpiry = Math.min(...validExpiries);
    } else {
      targetExpiry = now + 6 * 3600 * 1000;
    }
  }

  const timeRemainingString = formatTimeRemaining(targetExpiry);

  const formattedDeals: FormattedDealProduct[] = activeProducts.map((p) => {
    const normPrice = p.price || 0;
    const discPrice = p.discount_price && p.discount_price > 0 ? p.discount_price : 0;
    
    let badgeText = "BEST DEAL";
    let badgeVariant: "hot" | "sold-out" | "discount" | "sale" = "discount";

    if (p.stock <= 0) {
      badgeText = "HABIS";
      badgeVariant = "sold-out";
    } else if (discPrice > 0 && normPrice > discPrice) {
      const pct = Math.round(((normPrice - discPrice) / normPrice) * 100);
      badgeText = `${pct}% OFF`;
      badgeVariant = "discount";
    } else if (p.is_featured) {
      badgeText = "HOT";
      badgeVariant = "hot";
    }

    const priceFormatted = `Rp ${(discPrice > 0 ? discPrice : normPrice).toLocaleString("id-ID")}`;
    const origPriceFormatted = discPrice > 0 ? `Rp ${normPrice.toLocaleString("id-ID")}` : undefined;

    return {
      id: String(p.id),
      title: p.title,
      price: priceFormatted,
      originalPrice: origPriceFormatted,
      rating: 5,
      reviewsCount: 48,
      image: p.image || "/images/Image.png",
      description: p.short_description || p.description || "",
      badge: { text: badgeText, variant: badgeVariant },
      rawProduct: p,
    };
  });

  const featuredDeal = formattedDeals[0] || null;
  const gridDeals = formattedDeals.slice(1, 9);

  return {
    bestDeals: formattedDeals,
    featuredDeal,
    gridDeals,
    timeRemainingString,
    loading,
    refetch: fetchDeals,
  };
}
