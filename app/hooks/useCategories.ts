import { useState, useEffect, useCallback } from "react";
import type { ProductItem } from "~/types/product";
import { categoryApi } from "~/api/categoryApi";

const DEFAULT_CATEGORIES = [
  "Jersey Futsal & Bola",
  "Jersey Basket",
  "Jersey Running & Gowes",
  "Bahan Dryfit Milano",
  "Bahan Dryfit Serena",
  "Bahan Paragon Tebal",
];

export function useCategories(_products: ProductItem[] = []) {
  const [categories, setCategories] = useState<string[]>([]);

  const fetchBackendCategories = useCallback(async () => {
    try {
      const res = await categoryApi.getAll();
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      if (list.length > 0) {
        const backendCatNames = list
          .map((c: any) => c.name)
          .filter((name): name is string => Boolean(name && name.trim()));
        setCategories(backendCatNames);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (e) {
      console.warn("Gagal mengambil kategori:", e);
      setCategories((prev) => (prev.length > 0 ? prev : DEFAULT_CATEGORIES));
    }
  }, []);

  useEffect(() => {
    fetchBackendCategories();
  }, [fetchBackendCategories]);

  return {
    categories,
    fetchBackendCategories,
  };
}
