import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-white border border-zinc-200/80 rounded-xl p-4 flex flex-col justify-between shadow-2xs space-y-3",
        className
      )}
    >
      <div className="space-y-3">
        <Skeleton className="w-full aspect-square rounded-lg bg-zinc-100" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 bg-zinc-100 rounded" />
          <Skeleton className="h-3.5 w-4/5 bg-zinc-200/70 rounded" />
          <Skeleton className="h-3.5 w-1/2 bg-zinc-200/50 rounded" />
          <div className="pt-1 flex items-center gap-2">
            <Skeleton className="h-4 w-24 bg-zinc-200 rounded" />
          </div>
        </div>
      </div>
      <div className="pt-2">
        <Skeleton className="h-8 w-full bg-zinc-100 rounded-lg" />
      </div>
    </div>
  );
}

export function BestDealsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat penawaran terbaik..."
      aria-busy="true"
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch"
    >
      <span className="sr-only">Memuat penawaran terbaik...</span>
      {/* Featured Deal Card Skeleton */}
      <div className="lg:col-span-1 bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[440px] space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20 bg-zinc-100 rounded-sm" />
            <Skeleton className="h-4 w-16 bg-zinc-100 rounded-sm" />
          </div>
          <Skeleton className="w-full aspect-square rounded-xl bg-zinc-100" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-3.5 w-24 bg-zinc-100 rounded" />
            <Skeleton className="h-5 w-full bg-zinc-200/80 rounded" />
            <Skeleton className="h-5 w-2/3 bg-zinc-200/60 rounded" />
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-6 w-28 bg-zinc-200 rounded" />
              <Skeleton className="h-4 w-16 bg-zinc-100 rounded" />
            </div>
          </div>
        </div>
        <div className="pt-4 space-y-2">
          <Skeleton className="h-10 w-full bg-zinc-100 rounded-xl" />
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function BestDealsMobileSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat penawaran terbaik..."
      aria-busy="true"
      className="space-y-4"
    >
      <span className="sr-only">Memuat promo terbaik...</span>
      {/* Featured Deal Card */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 bg-zinc-100 rounded-sm" />
          <Skeleton className="h-3 w-12 bg-zinc-100 rounded-sm" />
        </div>
        <Skeleton className="w-full h-44 rounded-xl bg-zinc-100" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 bg-zinc-200/80 rounded" />
          <Skeleton className="h-4 w-1/3 bg-zinc-200 rounded" />
        </div>
        <Skeleton className="h-9 w-full bg-zinc-100 rounded-xl" />
      </div>

      {/* Grid Items */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} className="p-3" />
        ))}
      </div>
    </div>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat produk unggulan..."
      aria-busy="true"
      className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6"
    >
      <span className="sr-only">Memuat produk unggulan...</span>
      {/* Left Banner Skeleton */}
      <div className="w-full lg:w-80 h-full min-h-[580px] bg-zinc-100 border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-3 w-28 bg-zinc-200 rounded" />
          <Skeleton className="h-6 w-48 bg-zinc-200 rounded mt-1" />
          <Skeleton className="h-3 w-36 bg-zinc-200/70 rounded" />
        </div>
        <div className="my-auto py-6 flex items-center justify-center">
          <Skeleton className="w-48 h-48 rounded-2xl bg-zinc-200/60" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-32 mx-auto bg-zinc-200 rounded" />
          <Skeleton className="h-11 w-full bg-zinc-200 rounded-xl" />
        </div>
      </div>

      {/* Right Product Grid Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <Skeleton className="h-7 w-48 bg-zinc-200 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-20 bg-zinc-100 rounded-full" />
            <Skeleton className="h-7 w-20 bg-zinc-100 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeaturedProductsMobileSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat katalog unggulan..."
      aria-busy="true"
      className="space-y-4"
    >
      <span className="sr-only">Memuat produk unggulan...</span>
      {/* Top Banner Skeleton */}
      <div className="bg-zinc-100 rounded-2xl p-4 flex items-center justify-between">
        <div className="space-y-2 flex-1 pr-4">
          <Skeleton className="h-3 w-20 bg-zinc-200 rounded" />
          <Skeleton className="h-4 w-32 bg-zinc-200 rounded" />
          <Skeleton className="h-3 w-24 bg-zinc-200 rounded" />
          <Skeleton className="h-7 w-24 bg-zinc-200 rounded-lg mt-2" />
        </div>
        <Skeleton className="w-20 h-20 rounded-xl bg-zinc-200/70 shrink-0" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} className="p-3" />
        ))}
      </div>
    </div>
  );
}

export function CatalogProductsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat katalog jersey..."
      aria-busy="true"
      className="grid grid-cols-1 lg:grid-cols-5 gap-6"
    >
      <span className="sr-only">Memuat katalog jersey...</span>
      {/* Left Highlight Card Skeleton */}
      <div className="lg:col-span-1 bg-zinc-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md min-h-[460px] space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24 bg-zinc-700 rounded" />
          <Skeleton className="h-6 w-36 bg-zinc-700 rounded" />
          <Skeleton className="h-3.5 w-full bg-zinc-800 rounded" />
          <Skeleton className="h-3.5 w-4/5 bg-zinc-800 rounded" />
        </div>
        <Skeleton className="w-full aspect-square rounded-xl bg-zinc-800" />
        <Skeleton className="h-10 w-full bg-zinc-700 rounded-xl" />
      </div>

      {/* Right Grid Skeleton */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <Skeleton className="h-7 w-48 bg-zinc-200 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-20 bg-zinc-100 rounded-full" />
            <Skeleton className="h-7 w-20 bg-zinc-100 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CatalogProductsMobileSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat katalog jersey..."
      aria-busy="true"
      className="space-y-4"
    >
      <span className="sr-only">Memuat katalog jersey...</span>
      <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between">
        <div className="space-y-2 flex-1 pr-4">
          <Skeleton className="h-3 w-24 bg-zinc-700 rounded" />
          <Skeleton className="h-4 w-32 bg-zinc-700 rounded" />
          <Skeleton className="h-7 w-28 bg-zinc-700 rounded-lg mt-2" />
        </div>
        <Skeleton className="w-20 h-20 rounded-xl bg-zinc-800 shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} className="p-3" />
        ))}
      </div>
    </div>
  );
}

export function CategoryCarouselSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat kategori produk..."
      aria-busy="true"
      className="flex items-center gap-4 overflow-x-hidden py-2 px-1"
    >
      <span className="sr-only">Memuat kategori...</span>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex flex-col items-center justify-between shrink-0 w-44 md:w-48 h-56 space-y-3"
        >
          <Skeleton className="w-28 h-28 rounded-full bg-zinc-100" />
          <div className="w-full space-y-1.5 text-center">
            <Skeleton className="h-3.5 w-3/4 mx-auto bg-zinc-200 rounded" />
            <Skeleton className="h-3 w-1/2 mx-auto bg-zinc-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategorizedListsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat daftar kategori produk..."
      aria-busy="true"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <span className="sr-only">Memuat daftar kategori produk...</span>
      {Array.from({ length: 4 }).map((_, colIdx) => (
        <div key={colIdx} className="space-y-4">
          <div className="border-b border-zinc-200 pb-2">
            <Skeleton className="h-4 w-28 bg-zinc-200 rounded" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, itemIdx) => (
              <div
                key={itemIdx}
                className="bg-white border border-zinc-200/80 rounded-xl p-3 flex items-center gap-3 shadow-2xs"
              >
                <Skeleton className="w-16 h-16 rounded-lg bg-zinc-100 shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-3 w-4/5 bg-zinc-200 rounded" />
                  <Skeleton className="h-3.5 w-1/2 bg-zinc-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategorizedListsMobileSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat daftar kategori produk..."
      aria-busy="true"
      className="space-y-6"
    >
      <span className="sr-only">Memuat daftar kategori produk...</span>
      {Array.from({ length: 2 }).map((_, colIdx) => (
        <div key={colIdx} className="space-y-3">
          <div className="border-b border-zinc-200 pb-2">
            <Skeleton className="h-4 w-28 bg-zinc-200 rounded" />
          </div>
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, itemIdx) => (
              <div
                key={itemIdx}
                className="bg-white border border-zinc-200/80 rounded-xl p-2.5 flex items-center gap-3 shadow-2xs"
              >
                <Skeleton className="w-14 h-14 rounded-lg bg-zinc-100 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <Skeleton className="h-3 w-4/5 bg-zinc-200 rounded" />
                  <Skeleton className="h-3.5 w-1/2 bg-zinc-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
