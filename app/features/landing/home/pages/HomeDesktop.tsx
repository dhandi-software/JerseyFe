import { Search, RotateCcw, AlertCircle, PackageSearch } from "lucide-react";
import { useHomeCatalog } from "~/hooks";
import {
    HomeHeroBannerSection,
    HomeCompanyProfileBanner,
    HomeCategoryStripSection,
    HomeCatalogFilterSidebar,
    HomeCatalogProductCard,
} from "~/features/landing/home/components/Home/CatalogHome";

export function HomeDesktop() {
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
        addedCartIds,
        setSearchQuery,
        setMinPriceInput,
        setMaxPriceInput,
        setOnlyAvailable,
        setOnlyFeatured,
        setBulkOrderReady,
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
        <div className="w-full bg-[#F8F9FB] min-h-[calc(100vh-120px)] py-8 font-sans">
            <div className="container mx-auto px-4 md:px-6 max-w-[1440px] space-y-8">
                <HomeHeroBannerSection
                    companyProfile={companyProfile}
                    totalProducts={allCatalogItems.length}
                    variant="desktop"
                    onScrollToCatalog={scrollToCatalog}
                />

                <HomeCompanyProfileBanner
                    companyProfile={companyProfile}
                    variant="desktop"
                />

                <HomeCategoryStripSection
                    categories={categoriesStrip}
                    activeCategoryId={activeCategoryStrip}
                    onSelectCategory={handleSelectCategoryStrip}
                    variant="desktop"
                />

                <section
                    id="katalog-produk"
                    aria-label="Katalog Produk FCSV"
                    className="space-y-5 pt-2"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-baseline gap-2.5">
                            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                                Total Katalog Produk
                            </h2>
                            <span className="text-2xl font-bold text-slate-400">
                                {allCatalogItems.length}
                            </span>
                        </div>

                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari bahan atau model jersey..."
                                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#5B1D99]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start gap-6">
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
                            variant="desktop"
                        />

                        <div className="flex-1 w-full min-w-0">
                            {loading ? (
                                <div className="space-y-3">
                                    <p className="text-xs font-medium text-slate-500">
                                        Memuat daftar produk katalog yang diunggah admin...
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {[1, 2, 3, 4, 5, 6].map((n) => (
                                            <div
                                                key={n}
                                                className="h-[340px] rounded-3xl bg-white border border-slate-200/70 p-6 flex flex-col justify-between animate-pulse"
                                            >
                                                <div className="flex justify-between gap-4">
                                                    <div className="space-y-3 flex-1">
                                                        <div className="h-4 w-28 bg-slate-200 rounded" />
                                                        <div className="h-6 w-44 bg-slate-200 rounded" />
                                                        <div className="h-3 w-32 bg-slate-100 rounded" />
                                                    </div>
                                                    <div className="w-20 h-20 rounded-2xl bg-slate-200 shrink-0" />
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="h-6 w-40 bg-slate-100 rounded-full" />
                                                    <div className="h-10 w-full bg-slate-100 rounded-xl" />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="h-12 bg-slate-200 rounded-xl" />
                                                        <div className="h-12 bg-slate-200 rounded-xl" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold text-slate-900">
                                            Gagal Memuat Katalog Produk
                                        </h3>
                                        <p className="text-xs text-slate-600 max-w-[448px] mx-auto">
                                            {error}. Silakan muat ulang untuk mengambil data katalog terbaru dari server.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchProducts}
                                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#240B36] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span>Muat Ulang Katalog</span>
                                    </button>
                                </div>
                            ) : filteredCatalogItems.length === 0 ? (
                                <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5B1D99] flex items-center justify-center mx-auto">
                                        <PackageSearch className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold text-slate-900">
                                            Tidak Ada Produk yang Sesuai Filter
                                        </h3>
                                        <p className="text-xs text-slate-600 max-w-[448px] mx-auto">
                                            Belum ada produk katalog yang cocok dengan kombinasi pencarian atau filter harga yang dipilih.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#240B36] hover:bg-[#3B1258] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span>Reset Semua Filter</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {filteredCatalogItems.map((item) => (
                                        <HomeCatalogProductCard
                                            key={item.id}
                                            item={item}
                                            isAddedToCart={Boolean(
                                                addedCartIds[item.id],
                                            )}
                                            isWishlisted={isProductInWishlist(
                                                item.id,
                                            )}
                                            onAddToCart={handleAddToCart}
                                            onToggleWishlist={
                                                handleToggleWishlist
                                            }
                                            variant="desktop"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
