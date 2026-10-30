import {
    Search,
    SlidersHorizontal,
    RotateCcw,
    AlertCircle,
    PackageSearch,
    ChevronDown,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useHomeCatalog } from "~/hooks";
import {
    HomeHeroBannerSection,
    HomeCompanyProfileBanner,
    HomeCategoryStripSection,
    HomeCatalogFilterSidebar,
    HomeCatalogProductCard,
} from "~/features/landing/home/components/Home/CatalogHome";

export function HomeMobile() {
    const {
        companyProfile,
        categoriesStrip,
        categoryFilterOptions,
        materialFilterOptions,
        allCatalogItems,
        filteredCatalogItems,
        loading,
        error,
        activeCategoryStrip,
        selectedCategories,
        selectedMaterials,
        onlyAvailable,
        onlyFeatured,
        bulkOrderReady,
        searchQuery,
        minPriceInput,
        maxPriceInput,
        mobileFilterOpen,
        addedCartIds,
        setSearchQuery,
        setMinPriceInput,
        setMaxPriceInput,
        setOnlyAvailable,
        setOnlyFeatured,
        setBulkOrderReady,
        setMobileFilterOpen,
        handleSelectCategoryStrip,
        handleToggleCategoryCheckbox,
        handleToggleMaterialCheckbox,
        handleResetFilters,
        handleAddToCart,
        handleToggleWishlist,
        isProductInWishlist,
        fetchProducts,
    } = useHomeCatalog();

    const scrollToCatalog = () => {
        const el = document.getElementById("katalog-produk");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="w-full bg-[#F8F9FB] min-h-screen px-4 py-5 space-y-6 font-sans">
            <HomeHeroBannerSection
                companyProfile={companyProfile}
                totalProducts={allCatalogItems.length}
                variant="mobile"
                onScrollToCatalog={scrollToCatalog}
            />

            <HomeCompanyProfileBanner
                companyProfile={companyProfile}
                variant="mobile"
            />

            <HomeCategoryStripSection
                categories={categoriesStrip}
                activeCategoryId={activeCategoryStrip}
                onSelectCategory={handleSelectCategoryStrip}
                variant="mobile"
            />

            <section
                id="katalog-produk"
                aria-label="Katalog Produk FCSV"
                className="space-y-4"
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                            Total Katalog Produk
                        </h2>
                        <span className="text-xl font-bold text-slate-400">
                            {allCatalogItems.length}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileFilterOpen((prev) => !prev)}
                        className="min-h-[44px] px-3.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                        <SlidersHorizontal className="w-4 h-4 text-[#5B1D99]" />
                        <span>Filter</span>
                        <ChevronDown
                            className={cn(
                                "w-4 h-4 transition-transform",
                                mobileFilterOpen && "rotate-180",
                            )}
                        />
                    </button>
                </div>

                <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari bahan atau model jersey..."
                        className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#5B1D99]"
                    />
                </div>

                {mobileFilterOpen && (
                    <HomeCatalogFilterSidebar
                        totalMatched={filteredCatalogItems.length}
                        onlyAvailable={onlyAvailable}
                        onToggleOnlyAvailable={() =>
                            setOnlyAvailable((prev) => !prev)
                        }
                        onlyFeatured={onlyFeatured}
                        onToggleOnlyFeatured={() =>
                            setOnlyFeatured((prev) => !prev)
                        }
                        bulkOrderReady={bulkOrderReady}
                        onToggleBulkOrderReady={() =>
                            setBulkOrderReady((prev) => !prev)
                        }
                        categoryOptions={categoryFilterOptions}
                        selectedCategories={selectedCategories}
                        onToggleCategory={handleToggleCategoryCheckbox}
                        materialOptions={materialFilterOptions}
                        selectedMaterials={selectedMaterials}
                        onToggleMaterial={handleToggleMaterialCheckbox}
                        minPriceInput={minPriceInput}
                        maxPriceInput={maxPriceInput}
                        onMinPriceChange={setMinPriceInput}
                        onMaxPriceChange={setMaxPriceInput}
                        onResetFilters={handleResetFilters}
                        variant="mobile"
                    />
                )}

                {loading ? (
                    <div className="space-y-3">
                        <p className="text-xs font-medium text-slate-500">
                            Memuat daftar produk katalog yang diunggah admin...
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                            {[1, 2, 3].map((n) => (
                                <div
                                    key={n}
                                    className="h-[320px] rounded-3xl bg-white border border-slate-200/70 p-5 flex flex-col justify-between animate-pulse"
                                >
                                    <div className="flex justify-between gap-3">
                                        <div className="space-y-2.5 flex-1">
                                            <div className="h-4 w-24 bg-slate-200 rounded" />
                                            <div className="h-5 w-40 bg-slate-200 rounded" />
                                            <div className="h-3 w-28 bg-slate-100 rounded" />
                                        </div>
                                        <div className="w-20 h-20 rounded-2xl bg-slate-200 shrink-0" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="h-12 bg-slate-200 rounded-xl" />
                                        <div className="h-12 bg-slate-200 rounded-xl" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-white border border-rose-200 rounded-3xl p-6 text-center space-y-3">
                        <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                            Gagal Memuat Katalog Produk
                        </h3>
                        <p className="text-xs text-slate-600">
                            {error}. Silakan coba muat ulang.
                        </p>
                        <button
                            type="button"
                            onClick={fetchProducts}
                            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#240B36] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Muat Ulang</span>
                        </button>
                    </div>
                ) : filteredCatalogItems.length === 0 ? (
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-center space-y-3">
                        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5B1D99] flex items-center justify-center mx-auto">
                            <PackageSearch className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                            Tidak Ada Produk yang Sesuai Filter
                        </h3>
                        <p className="text-xs text-slate-600">
                            Coba ubah kata kunci pencarian atau reset filter untuk melihat seluruh koleksi.
                        </p>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#240B36] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Reset Semua Filter</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredCatalogItems.map((item) => (
                            <HomeCatalogProductCard
                                key={item.id}
                                item={item}
                                isAddedToCart={Boolean(addedCartIds[item.id])}
                                isWishlisted={isProductInWishlist(item.id)}
                                onAddToCart={handleAddToCart}
                                onToggleWishlist={handleToggleWishlist}
                                variant="mobile"
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
