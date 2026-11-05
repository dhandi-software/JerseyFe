/**
 * FCSV Apparel — Official Social Media & Company Contact Configuration
 * Batch 2 Milestone M3 (R4 Social Media Integration)
 */

export const SOCIAL_LINKS = {
  instagram: {
    name: "Instagram",
    handle: "@fcsvapparel",
    url: "https://instagram.com/fcsvapparel",
    ariaLabel: "Ikuti FCSV Apparel di Instagram"
  },
  whatsapp: {
    name: "WhatsApp",
    handle: "+62 858-9272-0034",
    url: "https://wa.me/6285892720034",
    ariaLabel: "Hubungi Customer Service FCSV Apparel via WhatsApp"
  },
  tiktok: {
    name: "TikTok",
    handle: "@fcsvapparel",
    url: "https://tiktok.com/@fcsvapparel",
    ariaLabel: "Lihat konten video jersey FCSV Apparel di TikTok"
  },
  facebook: {
    name: "Facebook",
    handle: "fcsvapparel",
    url: "https://facebook.com/fcsvapparel",
    ariaLabel: "Kunjungi halaman Facebook FCSV Apparel"
  },
  twitter: {
    name: "Twitter / X",
    handle: "@fcsvapparel",
    url: "https://x.com/fcsvapparel",
    ariaLabel: "Ikuti update FCSV Apparel di Twitter / X"
  }
} as const;

export const COMPANY_CONTACT = {
  phone: "+62 858-9272-0034",
  phoneFormatted: "0858-9272-0034",
  email: "support@fcsvjersey.id",
  address: "Jl. Raya Kampus Bayu No. 45, Jakarta, Indonesia",
  operatingHours: "Senin - Sabtu: 08:00 - 17:00 WIB",
  whatsappUrl: "https://wa.me/6285892720034"
} as const;
