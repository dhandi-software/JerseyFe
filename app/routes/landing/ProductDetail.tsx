import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { ProductDetailDesktop, ProductDetailMobile } from "~/features/landing/product-detail/pages";

export function meta() {
  return [
    { title: "Detail Produk Jersey - FCSV Sportswear" },
    { name: "description", content: "Spesifikasi bahan kain jersey & apparel olahraga resmi FCSV" },
  ];
}

export default function ProductDetailRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <ProductDetailMobile /> : <ProductDetailDesktop />;
}
