import * as React from "react";
import { MainHeroBannerDesktop } from "~/features/landing/home/components/Home/HomeDesktop/MainHeroBannerDesktop";
import { ValuePropsSection } from "~/features/landing/home/components/Home/ValuePropsSection";
import { ShopByCategorySection } from "~/features/landing/home/components/Home/HomeDesktop/ShopByCategorySection";
import { FeaturedProductsSection } from "~/features/landing/home/components/Home/HomeDesktop/FeaturedProductsSection";
import { PromoBannersSection } from "~/features/landing/home/components/Home/HomeDesktop/PromoBannersSection";
import { ComputerAccessoriesSection as JerseyCollectionCatalogSection } from "~/features/landing/home/components/Home/HomeDesktop/ComputerAccessoriesSection";
import { MacbookBannerSection as JerseyFeaturedBannerSection } from "~/features/landing/home/components/Home/HomeDesktop/MacbookBannerSection";
import { CategorizedProductListsSection } from "~/features/landing/home/components/Home/HomeDesktop/CategorizedProductListsSection";
import { LatestNewsSection } from "~/features/landing/home/components/Home/HomeDesktop/LatestNewsSection";

export function HomeDesktop() {
    return (
        <main className="w-full bg-[url('/images/Background_Eccomerce.png')] bg-cover bg-top bg-no-repeat bg-fixed py-8 min-h-[calc(100vh-120px)] space-y-10">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl space-y-10">
                {/* 1. Main Hero Banner Section - Jersey Baju Unggulan */}
                <MainHeroBannerDesktop />

                {/* 2. 4-Feature Value Props Section */}
                <ValuePropsSection />

                {/* 3. Shop with Categorys Carousel Section - Kategori Baju Jersey */}
                <ShopByCategorySection />

                {/* 5. Featured Products Section - Produk Unggulan Baju Jersey */}
                <FeaturedProductsSection />

                {/* 6. Double Promo Banners Section - Promo Baju Jersey */}
                <PromoBannersSection />

                {/* 7. Catalog Section - Katalog Lengkap Baju Jersey FCSV */}
                <JerseyCollectionCatalogSection />

                {/* 8. Spotlight Banner Section - Rekomendasi Jersey FCSV */}
                <JerseyFeaturedBannerSection />

                {/* 9. Categorized Product Lists Section - Daftar Kategori Jersey */}
                <CategorizedProductListsSection />

                {/* 10. Latest News Section - Berita & Tips Jersey FCSV */}
                <LatestNewsSection />
            </div>
        </main>
    );
}
