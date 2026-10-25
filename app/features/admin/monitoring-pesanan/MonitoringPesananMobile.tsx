import { ShoppingBag, Loader2, Eye, ChevronRight, ChevronDown, Search, Users, Video, CheckCircle2, Clock } from "lucide-react";
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
import { OrderDetailViewMobile } from "./components/OrderDetailViewMobile";
import { getStatusStyle, parseSleeveAndSize } from "./utils";
import type { MonitoringFilterTab, MonitoringSortOption } from "~/types";

export function MonitoringPesananMobile() {
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
        setSubSearch,
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
        handleToggleMemberStatus,
        handleUpdateNotesAndVideo,
        handleAddMember,
        handleEditMember,
        handleDeleteMember,
        handleUpdatePaymentDetails
    } = useMonitoringPesanan();

    if (selectedOrder) {
        return (
            <OrderDetailViewMobile
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
        <div className="min-h-screen bg-slate-50 font-geist pb-24">
            {toast && (
                <div className="fixed top-4 left-4 right-4 z-[9999]">
                    <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />
                </div>
            )}
            
            {/* Mobile Header */}
            <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#D25026]/10 rounded-lg">
                        <ShoppingBag className="text-[#D25026]" size={20} />
                    </div>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Monitoring</h1>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Pantau Pesanan Pelanggan</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 p-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Menunggu</p>
                    <p className="text-xl font-black text-slate-900 leading-none">{stats.menunggu}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Proses Desain</p>
                    <p className="text-xl font-black text-purple-600 leading-none">{stats.desain}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Prod (Lay/Prnt/Fin)</p>
                    <p className="text-xl font-black text-blue-600 leading-none">{stats.produksi}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Selesai</p>
                    <p className="text-xl font-black text-emerald-600 leading-none">{stats.selesai}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 mb-4 overflow-x-auto flex gap-2 pb-2 custom-scrollbar">
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
                                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic whitespace-nowrap transition-all cursor-pointer",
                                filterTab === tab.id 
                                    ? "bg-[#D25026] text-white" 
                                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                            )}
                        >
                            <span>{tab.label}</span>
                            {count > 0 && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-md text-[8px] leading-none",
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

            {/* Search & Sort Controls Mobile */}
            <div className="px-4 space-y-3 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Cari nama di dalam pesanan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border-slate-200 rounded-xl w-full text-xs font-medium focus:ring-1 focus:ring-[#D25026]"
                    />
                </div>
                
                <div ref={sortDropdownRef} className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200/80 justify-between relative">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Urutkan:</span>
                    <div className="relative flex-1 text-right">
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="inline-flex items-center gap-2 text-slate-700 text-[10px] font-black uppercase tracking-widest italic cursor-pointer justify-end w-full"
                        >
                            <span>
                                {sortBy === "newest" && "Terbaru (Tanggal)"}
                                {sortBy === "oldest" && "Terlama (Tanggal)"}
                                {sortBy === "name-asc" && "Customer A-Z"}
                                {sortBy === "name-desc" && "Customer Z-A"}
                                {sortBy === "price-highest" && "Harga Tertinggi"}
                                {sortBy === "price-lowest" && "Harga Terendah"}
                                {sortBy === "qty-highest" && "Jumlah Terbanyak"}
                                {sortBy === "qty-lowest" && "Jumlah Tersedikit"}
                            </span>
                            <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform duration-200", showSortDropdown && "rotate-180")} />
                        </button>

                        {showSortDropdown && (
                            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-150 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
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
                                            "w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest italic transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026] cursor-pointer border-none",
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

            {/* Order Cards */}
            <div className="px-4 space-y-3 mt-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#D25026]" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Memuat Pesanan...</p>
                    </div>
                ) : paginatedOrders.length === 0 ? (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 text-center space-y-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <ShoppingBag className="text-slate-200" size={32} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Pesanan tidak ditemukan</p>
                    </div>
                ) : (
                    paginatedOrders.map((order) => {
                        const isExpanded = expandedOrderRowId === order.rawId;
                        const q = debouncedSearchQuery.toLowerCase().trim();
                        const matchedMembers = q ? (order.details || []).filter((d: any) => 
                            d.playerName?.toLowerCase().includes(q) || d.playerNumber?.toString().toLowerCase().includes(q)
                        ) : [];

                        return (
                            <div 
                                key={order.rawId}
                                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm transition-all flex flex-col gap-3 group"
                            >
                                <div 
                                    onClick={() => setSelectedOrder(order)}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex flex-col gap-1.5 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[9px] font-black text-slate-300 font-mono tracking-tighter">{order.id}</span>
                                            {order.queueNumber && (
                                                <span className="bg-[#D25026]/10 text-[#D25026] px-1.5 py-0.5 rounded text-[7px] font-black uppercase italic border border-[#D25026]/20">
                                                    Antrean: {order.queueNumber}
                                                </span>
                                            )}
                                            {order.videoUrl && (
                                                <a
                                                    href={order.videoUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Buka Link Video"
                                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[8px] font-black uppercase tracking-tight shadow-2xs"
                                                >
                                                    <Video size={9} className="text-purple-600" />
                                                    <span>Video</span>
                                                </a>
                                            )}
                                            <span className={cn("px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border", getStatusStyle(order.status))}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 uppercase italic truncate max-w-[220px] leading-tight">{order.customer}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-[9px] font-bold text-slate-400 italic uppercase tracking-tight">{order.product} ({order.qty} Unit)</p>
                                                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <p className="text-[9px] font-black text-[#D25026] italic">Rp {order.totalAmount?.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-[#D25026]/10 group-hover:text-[#D25026] transition-colors shrink-0 ml-2">
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-[#D25026]" />
                                    </div>
                                </div>

                                {/* Matched member indicator on mobile */}
                                {matchedMembers.length > 0 && (
                                    <div className="text-[10px] font-bold text-[#D25026] bg-[#FFF0EB] px-2.5 py-1 rounded-lg border border-[#D25026]/20">
                                        Cocok Anggota: {matchedMembers[0].playerName} {matchedMembers[0].playerNumber ? `(${matchedMembers[0].playerNumber})` : ""}
                                    </div>
                                )}

                                {/* Mobile dropdown/accordion toggle for members */}
                                {order.details && order.details.length > 0 && (
                                    <div className="border-t border-slate-100 pt-2.5 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedOrderRowId(isExpanded ? null : order.rawId);
                                                }}
                                                className={cn(
                                                    "flex-1 min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider italic transition-all border cursor-pointer",
                                                    isExpanded 
                                                        ? "bg-[#D25026] text-white border-[#D25026]" 
                                                        : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Users className={cn("w-3.5 h-3.5", isExpanded ? "text-white" : "text-[#D25026]")} />
                                                    <span>ANGGOTA ({order.details.length})</span>
                                                </div>
                                                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isExpanded && "rotate-180")} />
                                            </button>
                                            <Button 
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrder(order);
                                                }}
                                                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all px-4 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-xs cursor-pointer"
                                            >
                                                <Eye size={13} /> Detail
                                            </Button>
                                        </div>

                                        {isExpanded && (
                                            <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                                                {order.details.length > 3 && (
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                                                        <input
                                                            type="text"
                                                            value={subSearchQueries[order.rawId] || ""}
                                                            onChange={(e) => setSubSearch(order.rawId, e.target.value)}
                                                            placeholder="Cari nama atau nomor..."
                                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#D25026] text-slate-800"
                                                        />
                                                    </div>
                                                )}

                                                <div className="space-y-1.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                                                    {(() => {
                                                        const subQ = (subSearchQueries[order.rawId] || q || "").toLowerCase().trim();
                                                        const memberList = order.details.filter((m: any) => {
                                                            if (!subQ) return true;
                                                            return (m.playerName && m.playerName.toLowerCase().includes(subQ)) ||
                                                                   (m.playerNumber && m.playerNumber.toString().toLowerCase().includes(subQ)) ||
                                                                   (m.playerSize && m.playerSize.toLowerCase().includes(subQ));
                                                        });

                                                        if (memberList.length === 0) {
                                                            return (
                                                                <p className="text-center py-4 text-xs font-bold text-slate-400 italic uppercase">
                                                                    Tidak ada anggota yang cocok
                                                                </p>
                                                            );
                                                        }

                                                        return memberList.map((m: any, idx: number) => {
                                                            const { size, sleeve } = parseSleeveAndSize(m.playerSize);
                                                            const isMemberMatched = subQ && (
                                                                (m.playerName && m.playerName.toLowerCase().includes(subQ)) ||
                                                                (m.playerNumber && m.playerNumber.toString().toLowerCase().includes(subQ))
                                                            );
                                                            return (
                                                                <div 
                                                                    key={m.id || idx}
                                                                    className={cn(
                                                                        "p-2.5 rounded-xl text-xs border border-slate-150 space-y-2",
                                                                        isMemberMatched ? "bg-[#FFF0EB]/70 border-[#D25026]/30" : "bg-slate-50/70"
                                                                    )}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                            <span className="text-[11px] font-black text-slate-400 font-mono w-4 shrink-0">
                                                                                {idx + 1}.
                                                                            </span>
                                                                            <div className="truncate">
                                                                                <p className={cn(
                                                                                    "font-black uppercase italic truncate text-xs",
                                                                                    isMemberMatched ? "text-[#D25026]" : "text-slate-900"
                                                                                )}>
                                                                                    {m.playerName || "Tanpa Nama"}
                                                                                </p>
                                                                                <p className="text-[10px] text-slate-400 font-medium">
                                                                                    {m.productTitle || order.product}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                                                            <span className="font-mono font-black text-xs bg-slate-100 text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 min-w-[32px] text-center shadow-2xs">
                                                                                {m.playerNumber || "-"}
                                                                            </span>
                                                                            <span className="font-black text-xs bg-orange-50 text-[#D25026] px-2 py-1 rounded-lg uppercase border border-orange-100 min-w-[28px] text-center shadow-2xs">
                                                                                {size}
                                                                            </span>
                                                                            <span className="font-black text-[9px] bg-slate-900 text-white px-2 py-1 rounded-lg uppercase tracking-tight shadow-2xs">
                                                                                {sleeve}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 justify-end">
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if (m.id) handleToggleMemberStatus(order.rawId, m.id, "statusBaju");
                                                                            }}
                                                                            className={cn(
                                                                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border shadow-2xs active:scale-95",
                                                                                m.statusBaju
                                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                                                                    : "bg-white text-slate-500 border-slate-200"
                                                                            )}
                                                                            title="Ubah status baju"
                                                                        >
                                                                            <span className="text-slate-400 font-semibold lowercase">baju:</span>
                                                                            {m.statusBaju ? (
                                                                                <>
                                                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                                                    <span>READY</span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                                                    <span>BELUM</span>
                                                                                </>
                                                                            )}
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if (m.id) handleToggleMemberStatus(order.rawId, m.id, "statusCelana");
                                                                            }}
                                                                            className={cn(
                                                                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border shadow-2xs active:scale-95",
                                                                                m.statusCelana
                                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                                                                    : "bg-white text-slate-500 border-slate-200"
                                                                            )}
                                                                            title="Ubah status celana"
                                                                        >
                                                                            <span className="text-slate-400 font-semibold lowercase">celana:</span>
                                                                            {m.statusCelana ? (
                                                                                <>
                                                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                                                    <span>READY</span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                                                    <span>BELUM</span>
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination Controls Mobile */}
            {totalPages > 1 && (
                <div className="mt-6 px-4 flex justify-center pb-6">
                    <Pagination>
                        <PaginationContent className="gap-1">
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                                    }}
                                    className={cn(
                                        "h-8 w-8 p-0 cursor-pointer hover:bg-slate-100",
                                        currentPage === 1 && "pointer-events-none opacity-40"
                                    )}
                                />
                            </PaginationItem>

                            {getPageNumbers().map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === "ellipsis" ? (
                                        <PaginationEllipsis className="h-8 w-8" />
                                    ) : (
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page as number);
                                            }}
                                            isActive={currentPage === page}
                                            className="h-8 w-8 p-0 cursor-pointer font-bold font-mono text-xs"
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
                                        "h-8 w-8 p-0 cursor-pointer hover:bg-slate-100",
                                        currentPage === totalPages && "pointer-events-none opacity-40"
                                    )}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
