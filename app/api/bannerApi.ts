import type { BannerItem } from "~/types/bannerTypes";

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 1,
    tagline: "FCSV AUTHENTIC APPAREL",
    title: "Custom Jersey Premium",
    subtitle: "Wujudkan jersey impian tim Anda dengan material dryfit berteknologi breathable dan cetak sublimasi full print tajam.",
    button_text: "PESAN SEKARANG",
    link_url: "/customer/custom-jersey",
    image: "/images/jersey_hero.webp",
    price_badge: "START 120K",
    is_active: true,
    sort_order: 1,
  },
  {
    id: 2,
    tagline: "SPORTS PERFORMANCE GEAR",
    title: "Bahan Dryfit Milano & Serena",
    subtitle: "Pilihan kain khusus olahraga dengan sirkulasi udara maksimal, cepat kering, dan sangat nyaman dipakai saat bertanding.",
    button_text: "LIHAT BAHAN",
    link_url: "/category",
    image: "/images/FCSV.webp",
    price_badge: "DISKON 15%",
    is_active: true,
    sort_order: 2,
  },
];

export const bannerApi = {
  async getAll(params?: { active?: boolean }): Promise<{ total: number; data: BannerItem[] }> {
    return {
      total: DEFAULT_BANNERS.length,
      data: DEFAULT_BANNERS,
    };
  },
};
