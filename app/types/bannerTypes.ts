export interface BannerItem {
  id: number | string;
  title: string;
  subtitle?: string;
  tagline?: string;
  image: string;
  price_badge?: string;
  link_url?: string;
  button_text?: string;
  bg_color?: string;
  is_active: boolean;
  sort_order: number;
}

export interface BannerPayload {
  title: string;
  subtitle?: string;
  tagline?: string;
  image: string;
  price_badge?: string;
  link_url?: string;
  button_text?: string;
  bg_color?: string;
  is_active?: boolean;
  sort_order?: number;
}
