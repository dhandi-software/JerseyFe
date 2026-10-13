import { useState, useEffect, useCallback } from "react";
import { productApi } from "~/api/productApi";
import type { ProductItem } from "~/types/product";

export function useProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productApi.getAll();
      const list = Array.isArray(res?.data) ? res.data : [];
      setProducts(list);
    } catch (err: any) {
      console.error("Gagal mengambil data produk:", err);
      setError(err?.message || "Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
  };
}
