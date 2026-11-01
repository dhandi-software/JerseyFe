import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination";
import { cn } from "~/lib/utils";

interface CategoryPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    startItemIndex: number;
    endItemIndex: number;
    onPageChange: (page: number) => void;
}

const PAGES_PER_GROUP = 10;

export function CategoryPagination({
    currentPage,
    totalPages,
    totalItems,
    startItemIndex,
    endItemIndex,
    onPageChange,
}: CategoryPaginationProps) {
    if (totalItems === 0 || totalPages <= 1) return null;

    const currentGroup = Math.floor((currentPage - 1) / PAGES_PER_GROUP);
    const groupStart = currentGroup * PAGES_PER_GROUP + 1;
    const groupEnd = Math.min(groupStart + PAGES_PER_GROUP - 1, totalPages);

    const prevGroupStart = Math.max(1, groupStart - PAGES_PER_GROUP);
    const prevGroupEnd = groupStart - 1;

    const nextGroupStart = groupEnd + 1;
    const nextGroupEnd = Math.min(groupEnd + PAGES_PER_GROUP, totalPages);

    const pagesInGroup = Array.from(
        { length: groupEnd - groupStart + 1 },
        (_, idx) => groupStart + idx,
    );

    const baseButtonClass =
        "min-h-[44px] min-w-[44px] h-11 px-3 rounded-xl text-xs font-black transition-colors cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B83B14]";
    const inactiveClass =
        "bg-white text-slate-700 border border-slate-200 hover:border-[#B83B14] hover:text-[#B83B14] hover:bg-orange-50/40";
    const activeClass =
        "bg-[#0F172A] text-white border border-[#0F172A] hover:bg-[#B83B14] hover:border-[#B83B14] hover:text-white shadow-sm";

    return (
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-600">
                Menampilkan{" "}
                <span className="font-black text-slate-900">
                    {startItemIndex}-{endItemIndex}
                </span>{" "}
                dari{" "}
                <span className="font-black text-slate-900">{totalItems}</span>{" "}
                produk
            </div>

            <Pagination className="mx-0 w-auto">
                <PaginationContent className="flex-wrap justify-center gap-1.5">
                    <PaginationItem>
                        <PaginationPrevious
                            href={`#page-${Math.max(1, currentPage - 1)}`}
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) {
                                    onPageChange(currentPage - 1);
                                }
                            }}
                            className={cn(
                                baseButtonClass,
                                inactiveClass,
                                "w-auto px-3",
                                currentPage <= 1 &&
                                    "opacity-40 pointer-events-none",
                            )}
                        />
                    </PaginationItem>

                    {groupStart > 1 && (
                        <>
                            <PaginationItem>
                                <PaginationLink
                                    href={`#page-${prevGroupStart}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(prevGroupStart);
                                    }}
                                    title={`Halaman ${prevGroupStart}-${prevGroupEnd}`}
                                    className={cn(
                                        baseButtonClass,
                                        inactiveClass,
                                        "w-auto px-3",
                                    )}
                                >
                                    {prevGroupStart}-{prevGroupEnd}
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis className="min-h-[44px] min-w-[36px] h-11 bg-transparent text-slate-500" />
                            </PaginationItem>
                        </>
                    )}

                    {pagesInGroup.map((page) => {
                        const isActive = page === currentPage;
                        return (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href={`#page-${page}`}
                                    isActive={isActive}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(page);
                                    }}
                                    className={cn(
                                        baseButtonClass,
                                        isActive ? activeClass : inactiveClass,
                                    )}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}

                    {groupEnd < totalPages && (
                        <>
                            <PaginationItem>
                                <PaginationEllipsis className="min-h-[44px] min-w-[36px] h-11 bg-transparent text-slate-500" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink
                                    href={`#page-${nextGroupStart}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(nextGroupStart);
                                    }}
                                    title={`Halaman ${nextGroupStart}-${nextGroupEnd}`}
                                    className={cn(
                                        baseButtonClass,
                                        inactiveClass,
                                        "w-auto px-3",
                                    )}
                                >
                                    {nextGroupStart === nextGroupEnd
                                        ? nextGroupStart
                                        : `${nextGroupStart}-${nextGroupEnd}`}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href={`#page-${Math.min(totalPages, currentPage + 1)}`}
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) {
                                    onPageChange(currentPage + 1);
                                }
                            }}
                            className={cn(
                                baseButtonClass,
                                inactiveClass,
                                "w-auto px-3",
                                currentPage >= totalPages &&
                                    "opacity-40 pointer-events-none",
                            )}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
