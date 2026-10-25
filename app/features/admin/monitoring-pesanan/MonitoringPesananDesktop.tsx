import { Fragment } from "react";
import { Loader2, Eye, ChevronDown, Search, Video } from "lucide-react";
import { cn } from "~/lib/utils";
import { Toast } from "~/components/ui/toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "~/components/ui/pagination";
import { useMonitoringPesanan } from "~/hooks";
import { OrderMembersSubTable } from "./components/OrderMembersSubTable";
import { OrderDetailViewDesktop } from "./components/OrderDetailViewDesktop";
import { getStatusStyle } from "./utils";
import type { MonitoringFilterTab, MonitoringSortOption } from "~/types";

export function MonitoringPesananDesktop() {
    const {
        orders,
        loading,
        selectedOrder,
        setSelectedOrder,
        designers,
        bahanList,
        toast,
        setToast,
        filterTab,
        setFilterTab,
        searchQuery,
        setSearchQuery,
        debouncedSearchQuery,
        sortBy,
        setSortBy,
        showSortDropdown,
        setShowSortDropdown,
        sortDropdownRef,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedOrders,
        getPageNumbers,
        stats,
        expandedOrderRowId,
        setExpandedOrderRowId,
        subSearchQueries,
        debouncedSubSearchQueries,
        setSubSearch,
        handleToggleMemberStatus,
        handleUpdateNotesAndVideo,
        handleAddMember,
        handleEditMember,
        handleDeleteMember,
        isPrinting,
        isUploadingProof,
        isUploadingPrint,
        isUploadingFinishing,
        isAssignModalOpen,
        setIsAssignModalOpen,
        selectedDesignerId,
        setSelectedDesignerId,
        orderToAssign,
        setOrderToAssign,
        isRecommendModalOpen,
        setIsRecommendModalOpen,
        tempRecommendedIds,
        setTempRecommendedIds,
        handlePrintInvoice,
        handleUploadProof,
        handleUploadPrint,
        handleUploadFinishing,
        handleUpdateStatus,
        handleApproveDesign,
        handleRevisiDesign,
        handleApproveLayout,
        handleRevisiLayout,
        handleSendRecommendations,
        handleUpdatePaymentDetails
    } = useMonitoringPesanan();

    if (selectedOrder) {
        return (
            <OrderDetailViewDesktop
                selectedOrder={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                toast={toast}
                onCloseToast={() => setToast(null)}
                bahanList={bahanList}
                designers={designers}
                isRecommendModalOpen={isRecommendModalOpen}
                setIsRecommendModalOpen={setIsRecommendModalOpen}
                tempRecommendedIds={tempRecommendedIds}
                setTempRecommendedIds={setTempRecommendedIds}
                handleSendRecommendations={handleSendRecommendations}
                isPrinting={isPrinting}
                handlePrintInvoice={handlePrintInvoice}
                isUploadingProof={isUploadingProof}
                handleUploadProof={handleUploadProof}
                isUploadingPrint={isUploadingPrint}
                handleUploadPrint={handleUploadPrint}
                isUploadingFinishing={isUploadingFinishing}
                handleUploadFinishing={handleUploadFinishing}
                handleUpdateStatus={handleUpdateStatus}
                handleApproveDesign={handleApproveDesign}
                handleRevisiDesign={handleRevisiDesign}
                handleApproveLayout={handleApproveLayout}
                handleRevisiLayout={handleRevisiLayout}
                handleUpdateNotesAndVideo={handleUpdateNotesAndVideo}
                handleToggleMemberStatus={handleToggleMemberStatus}
                handleAddMember={handleAddMember}
                handleEditMember={handleEditMember}
                handleDeleteMember={handleDeleteMember}
                handleUpdatePaymentDetails={handleUpdatePaymentDetails}
                isAssignModalOpen={isAssignModalOpen}
                setIsAssignModalOpen={setIsAssignModalOpen}
                selectedDesignerId={selectedDesignerId}
                setSelectedDesignerId={setSelectedDesignerId}
                orderToAssign={orderToAssign}
                setOrderToAssign={setOrderToAssign}
            />
        );
    }

    return (
        <div className="p-10 max-w-[1600px] mx-auto min-h-screen bg-slate-50 font-geist">
            {toast && (
                <div className="fixed top-6 right-6 z-[9999]">
                    <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />
                </div>
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Monitoring Pesanan</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Pantau dan kelola seluruh antrean pesanan pelanggan</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Total Pesanan</p>
                        <p className="text-3xl font-black text-slate-900">{stats.total}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Menunggu Verifikasi</p>
                        <p className="text-3xl font-black text-amber-500">{stats.menunggu}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Proses Desain</p>
                        <p className="text-3xl font-black text-purple-500">{stats.desain}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Produksi (Layout/Print/Finishing)</p>
                        <p className="text-3xl font-black text-blue-500">{stats.produksi}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto gap-2 mb-6 pb-2 custom-scrollbar">
                    {[
                        { id: "ALL", label: "Semua" },
                        { id: "MENUNGGU", label: "Menunggu" },
                        { id: "DESAIN", label: "Desain" },
                        { id: "LAYOUT", label: "Layout" },
                        { id: "PRINT", label: "Print" },
                        { id: "FINISHING", label: "Finishing" },
                        { id: "SELESAI", label: "Selesai" },
                        { id: "DITOLAK", label: "Ditolak" },
                    ].map(tab => {
                        const count = tab.id === "ALL" 
                            ? orders.length 
                            : orders.filter(o => {
                                const status = (o.status || "").toUpperCase();
                                if (tab.id === "MENUNGGU") return status === "MENUNGGU" || status === "MENUNGGU VERIFIKASI";
                                return status === tab.id;
                            }).length;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setFilterTab(tab.id as MonitoringFilterTab)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest italic whitespace-nowrap transition-all cursor-pointer",
                                    filterTab === tab.id 
                                        ? "bg-[#D25026] text-white" 
                                        : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                                )}
                            >
                                <span>{tab.label}</span>
                                {count > 0 && (
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-lg text-[10px]",
                                        filterTab === tab.id
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-100 text-slate-500"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Cari nama di dalam pesanan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 pr-4 py-3 bg-white border-slate-200 rounded-2xl w-full text-sm font-medium focus:ring-1 focus:ring-[#D25026]"
                        />
                    </div>
                    
                    <div ref={sortDropdownRef} className="flex items-center gap-3 w-full md:w-auto justify-end relative">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 italic whitespace-nowrap">Urutkan:</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex items-center justify-between gap-4 bg-white border border-slate-200 px-5 py-3 rounded-2xl transition-all duration-200 min-w-[200px] text-left cursor-pointer shadow-sm text-xs font-black uppercase tracking-widest italic"
                            >
                                <span className="text-slate-700">
                                    {sortBy === "newest" && "Terbaru (Tanggal)"}
                                    {sortBy === "oldest" && "Terlama (Tanggal)"}
                                    {sortBy === "name-asc" && "Customer A-Z"}
                                    {sortBy === "name-desc" && "Customer Z-A"}
                                    {sortBy === "price-highest" && "Harga Tertinggi"}
                                    {sortBy === "price-lowest" && "Harga Terendah"}
                                    {sortBy === "qty-highest" && "Jumlah Terbanyak"}
                                    {sortBy === "qty-lowest" && "Jumlah Tersedikit"}
                                </span>
                                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", showSortDropdown && "rotate-180")} />
                            </button>

                            {showSortDropdown && (
                                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-150 rounded-2xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                    {[
                                        { val: "newest", label: "Terbaru (Tanggal)" },
                                        { val: "oldest", label: "Terlama (Tanggal)" },
                                        { val: "name-asc", label: "Customer A-Z" },
                                        { val: "name-desc", label: "Customer Z-A" },
                                        { val: "price-highest", label: "Harga Tertinggi" },
                                        { val: "price-lowest", label: "Harga Terendah" },
                                        { val: "qty-highest", label: "Jumlah Terbanyak" },
                                        { val: "qty-lowest", label: "Jumlah Tersedikit" }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => {
                                                setSortBy(opt.val as MonitoringSortOption);
                                                setShowSortDropdown(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-widest italic transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026] cursor-pointer border-none",
                                                sortBy === opt.val ? "bg-[#FFF0EB]/30 text-[#D25026] font-bold" : "text-slate-600"
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAFAFA] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">ID Pesanan</th>
                                    <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">Customer</th>
                                    <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">Produk</th>
                                    <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">QTY</th>
                                    <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">Total Harga</th>
                                    <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">Status</th>
                                    <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-20 text-center text-slate-400 font-medium">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-8 h-8 animate-spin text-[#D25026]" />
                                                <p className="text-xs font-black uppercase tracking-widest italic">Memuat data pesanan...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-20 text-center text-slate-400 font-medium">
                                            <p className="text-xs font-black uppercase tracking-widest italic">Pesanan tidak ditemukan</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((order) => (
                                        <Fragment key={order.rawId}>
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-5 font-bold text-slate-600 font-mono text-sm">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span>{order.id}</span>
                                                        {order.queueNumber && (
                                                            <span className="bg-[#D25026]/10 text-[#D25026] px-2 py-0.5 rounded text-[9px] font-black uppercase italic border border-[#D25026]/20">
                                                                {order.queueNumber}
                                                            </span>
                                                        )}
                                                        {order.videoUrl && (
                                                            <a
                                                                href={order.videoUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                title="Buka Link Video"
                                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-[10px] font-black uppercase tracking-tight shadow-2xs transition-colors"
                                                            >
                                                                <Video size={11} className="text-purple-600" />
                                                                <span>Video</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 font-black text-slate-900 uppercase italic text-base">{order.customer}</td>
                                                <td className="px-6 py-5 text-slate-600 font-medium italic text-sm">{order.product}</td>
                                                <td className="px-6 py-5 font-black text-slate-800 italic text-sm">{order.qty} Unit</td>
                                                <td className="px-6 py-5 font-bold text-[#D25026] italic text-base">Rp {order.totalAmount?.toLocaleString('id-ID')}</td>
                                                <td className="px-6 py-5">
                                                    <span className={cn("px-3.5 py-1.5 rounded-xl text-xs font-black tracking-widest border uppercase", getStatusStyle(order.status))}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button 
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest italic shadow-xs cursor-pointer"
                                                        >
                                                            <Eye size={14} /> Detail
                                                        </Button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setExpandedOrderRowId(expandedOrderRowId === order.rawId ? null : order.rawId)}
                                                            className={cn(
                                                                "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest italic transition-all cursor-pointer border shadow-xs",
                                                                expandedOrderRowId === order.rawId
                                                                    ? "bg-[#D25026] text-white border-[#D25026]"
                                                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                                                            )}
                                                        >
                                                            <span>ANGGOTA ({order.details?.length || 0})</span>
                                                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", expandedOrderRowId === order.rawId && "rotate-180")} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedOrderRowId === order.rawId && (
                                                <OrderMembersSubTable
                                                    order={order}
                                                    searchQuery={subSearchQueries[order.rawId] || ""}
                                                    onSearchChange={(val) => setSubSearch(order.rawId, val)}
                                                    debouncedQuery={debouncedSubSearchQueries[order.rawId] || debouncedSearchQuery}
                                                    onClose={() => setExpandedOrderRowId(null)}
                                                    onToggleStatus={handleToggleMemberStatus}
                                                />
                                            )}
                                        </Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                                        }}
                                        className={cn(
                                            "cursor-pointer hover:bg-slate-100",
                                            currentPage === 1 && "pointer-events-none opacity-40 hover:bg-transparent"
                                        )}
                                    />
                                </PaginationItem>

                                {getPageNumbers().map((page, index) => (
                                    <PaginationItem key={index}>
                                        {page === "ellipsis" ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentPage(page as number);
                                                }}
                                                isActive={currentPage === page}
                                                className="cursor-pointer font-bold font-mono"
                                            >
                                                {page}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                        }}
                                        className={cn(
                                            "cursor-pointer hover:bg-slate-100",
                                            currentPage === totalPages && "pointer-events-none opacity-40 hover:bg-transparent"
                                        )}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}
