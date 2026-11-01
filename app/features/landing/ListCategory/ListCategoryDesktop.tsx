import { Search, Layers } from "lucide-react";
import { CardProduct } from "~/components/template/CardProduct";
import { cn } from "~/lib/utils";
import { CategoryProductGridSkeleton } from "./CategoryProductSkeleton";
import { CategoryEmptyState } from "./CategoryEmptyState";
import { CategoryPagination } from "./CategoryPagination";
import { useListCategory, DESKTOP_ITEMS_PER_PAGE } from "~/hooks";

export function ListCategoryDesktop() {
    const {
        materials,
        filteredProducts,
        paginatedProducts,
        currentPage,
        totalPages,
        startItemIndex,
        endItemIndex,
        handlePageChange,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        categories,
        handleViewDetail,
        refetch,
    } = useListCategory(DESKTOP_ITEMS_PER_PAGE);

    return (
        <div className="min-h-[calc(100vh-100px)] bg-[#FAFAFA] py-8 px-6 md:px-10 font-sans w-full">
            <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                            List Category
                        </h1>
                        <p className="text-slate-600 text-sm font-medium mt-1">
                            Katalog Bahan & Koleksi Jersey Resmi dari Admin FCSV Apparel
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2.5 rounded-xl shadow-2xs border border-slate-200 flex items-center gap-2.5">
                            <Layers className="w-4 h-4 text-[#B83B14]" />
                            <span className="text-xs font-bold text-slate-700">
                                {loading
                                    ? "Memuat Katalog..."
                                    : `${materials.length} Produk Admin`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-8 w-full min-w-0">
                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                        <div className="flex-1 relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
                            <input
                                type="text"
                                aria-label="Cari bahan atau produk jersey"
                                placeholder="Cari nama atau spesifikasi bahan jersey..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full min-h-[48px] pl-11 pr-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-slate-900 transition-all placeholder:text-slate-500 text-slate-900"
                            />
                        </div>

                        <div
                            role="tablist"
                            aria-label="Filter kategori bahan"
                            className="bg-white p-1.5 rounded-2xl shadow-2xs border border-slate-200 flex gap-2 w-full md:w-auto"
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    role="tab"
                                    aria-selected={selectedCategory === cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all uppercase tracking-wider cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
                                        selectedCategory === cat
                                            ? "bg-slate-900 text-white shadow-xs"
                                            : "text-slate-700 hover:text-slate-950 hover:bg-slate-100",
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid / Skeleton / Error / Empty States */}
                    {loading ? (
                        <CategoryProductGridSkeleton
                            count={10}
                            className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
                        />
                    ) : error ? (
                        <CategoryEmptyState
                            type="error"
                            errorMessage={error}
                            onRetry={refetch}
                        />
                    ) : materials.length === 0 ? (
                        <CategoryEmptyState type="no-data" />
                    ) : filteredProducts.length === 0 ? (
                        <CategoryEmptyState
                            type="not-found"
                            searchQuery={searchQuery}
                            onReset={() => {
                                setSearchQuery("");
                                setSelectedCategory("Semua");
                            }}
                        />
                    ) : (
                        <div className="flex flex-col">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                                {paginatedProducts.map((product) => (
                                    <CardProduct
                                        key={product.id}
                                        product={product}
                                        onPreview={handleViewDetail}
                                    />
                                ))}
                            </div>

                            <CategoryPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={filteredProducts.length}
                                startItemIndex={startItemIndex}
                                endItemIndex={endItemIndex}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
