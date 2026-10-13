import { client } from "./client";

export interface CategoryItem {
  id: number | string;
  name: string;
  slug?: string;
  image?: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 1, name: "Jersey Futsal & Bola", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Jersey Basket", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Jersey Running & Gowes", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Bahan Dryfit Milano", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=400&q=80" },
  { id: 5, name: "Bahan Dryfit Serena", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80" },
  { id: 6, name: "Bahan Paragon Tebal", image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80" },
  { id: 7, name: "Jaket & Windbreaker", image: "https://images.unsplash.com/photo-1551028719-03820e2bf210?auto=format&fit=crop&w=400&q=80" },
  { id: 8, name: "Polo & T-Shirt Custom", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" },
];

export const categoryApi = {
  async getAll(): Promise<{ total: number; data: CategoryItem[] }> {
    try {
      const res = await client.get<{ data: any[] }>("/category/");
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return {
          total: res.data.data.length,
          data: res.data.data.map((c, i) => ({
            id: c.id || i + 1,
            name: c.name || c.title || "Kategori",
            image: c.image || DEFAULT_CATEGORIES[i % DEFAULT_CATEGORIES.length].image,
          })),
        };
      }
    } catch (e) {
      // Fallback
    }

    return {
      total: DEFAULT_CATEGORIES.length,
      data: DEFAULT_CATEGORIES,
    };
  },

  async getCategories() {
    return this.getAll();
  }
};
