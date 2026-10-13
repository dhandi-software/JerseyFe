import * as React from "react";
import { MainHeroBannerMobile } from "~/features/landing/home/components/Home/HomeMobile/MainHeroBannerMobile";
import { ValuePropsSection } from "~/features/landing/home/components/Home/ValuePropsSection";
import { ShopByCategorySection } from "~/features/landing/home/components/Home/HomeDesktop/ShopByCategorySection";
import { FeaturedProductsSectionMobile } from "~/features/landing/home/components/Home/HomeMobile/FeaturedProductsSectionMobile";
import { PromoBannersSectionMobile } from "~/features/landing/home/components/Home/HomeMobile/PromoBannersSectionMobile";
import { ComputerAccessoriesSectionMobile as JerseyCollectionCatalogSectionMobile } from "~/features/landing/home/components/Home/HomeMobile/ComputerAccessoriesSectionMobile";
import { MacbookBannerSectionMobile as JerseyFeaturedBannerSectionMobile } from "~/features/landing/home/components/Home/HomeMobile/MacbookBannerSectionMobile";
import { CategorizedProductListsSectionMobile } from "~/features/landing/home/components/Home/HomeMobile/CategorizedProductListsSectionMobile";
import { LatestNewsSectionMobile } from "~/features/landing/home/components/Home/HomeMobile/LatestNewsSectionMobile";

export function HomeMobile() {
    return (
        <main className="w-full bg-[url('/images/Background_Mobile.png')] bg-cover bg-top bg-no-repeat bg-fixed min-h-screen p-4 space-y-6">
            {/* 1. Mobile Hero Banner - Jersey Baju Unggulan */}
            <MainHeroBannerMobile />

            {/* 2. Value Props Section */}
            <ValuePropsSection />

            {/* 3. Shop with Categorys Carousel Section - Kategori Baju Jersey */}
            <ShopByCategorySection />

            {/* 5. Mobile Featured Products Section - Produk Baju Jersey Unggulan */}
            <FeaturedProductsSectionMobile />

            {/* 6. Mobile Double Promo Banners Section - Promo Baju Jersey */}
            <PromoBannersSectionMobile />

            {/* 7. Catalog Section - Katalog Lengkap Baju Jersey */}
            <JerseyCollectionCatalogSectionMobile />

            {/* 8. Spotlight Banner Section - Rekomendasi Baju Jersey */}
            <JerseyFeaturedBannerSectionMobile />

            {/* 9. Mobile Categorized Product Lists Section */}
            <CategorizedProductListsSectionMobile />

            {/* 10. Mobile Latest News Section */}
            <LatestNewsSectionMobile />
        </main>
    );
}
