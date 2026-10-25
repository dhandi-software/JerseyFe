import { useState, useEffect } from "react";
import { Clock, Eye, CheckCircle, Package, ImageIcon, FileText, ChevronLeft } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/hooks/useAuth";
import { sortPlayersBySize, downloadPlayersPDF } from "~/lib/sizeUtils";
import { Toast } from "~/components/ui/toast";

import { usePacking } from "~/hooks/usePacking";
import type { PackingFilterTab, PackingOrderItem } from "~/types";

export function PackingDesktop() {
    const {
        user,
        orders,
        loading,
        selectedOrder,
        setSelectedOrder,
        filterTab,
        setFilterTab,
        searchQuery,
        setSearchQuery,
        searchInput,
        setSearchInput,
        toast,
        setToast,
        confirmModal,
        setConfirmModal,
        filteredOrders,
        sortedOrders,
        handleUpdateStatus,
        requestConfirmation,
        getStatusStyle,
    } = usePacking();

    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-slate-50 font-geist">
                <div className="w-full px-8 py-10">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Daftar Pesanan
                    </button>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl ring-1 ring-black/5">
                        <div className="relative p-10 border-b border-slate-100 bg-white rounded-t-[2.5rem]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase", getStatusStyle(selectedOrder.status))}>
                                        {selectedOrder.status}
                                    </span>
                                    {selectedOrder.queueNumber && (
                                        <span className="bg-[#D25026]/10 text-[#D25026] px-3 py-1.5 rounded-xl text-xs font-black italic border border-[#D25026]/20">
                                            No. Antrean: {selectedOrder.queueNumber}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-bold text-slate-900 font-mono tracking-tighter bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                                    {selectedOrder.id}
                                </p>
                            </div>
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Pesanan {selectedOrder.customer}</h1>
                            <p className="text-slate-500 font-medium text-lg mt-2">{selectedOrder.product} - {selectedOrder.qty} Pcs</p>
                            
                            <div className="mt-4 flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Clock size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{selectedOrder.dateTime}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50/50 space-y-12">
                            {/* Mockup & Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3 italic">
                                        <ImageIcon className="text-[#D25026]" size={16} />
                                        Mockup Desain
                                    </h3>
                                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                                        {selectedOrder.mockupUrl ? (
                                            <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                                {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                                    <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                                        <FileText className="w-12 h-12 text-red-500 mb-3" />
                                                        <a href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                            Buka Mockup (PDF)
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <img 
                                                        src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                                        alt="Mockup" 
                                                        className="w-full h-auto max-h-[350px] object-contain mx-auto rounded-xl" 
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full h-40 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                                <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Tidak ada mockup</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3 italic">
                                        <ImageIcon className="text-[#D25026]" size={16} />
                                        Layout Pola Cetak
                                    </h3>
                                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                                        {selectedOrder.layoutUrl ? (
                                            <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                                {selectedOrder.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                                    <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                                        <FileText className="w-12 h-12 text-red-500 mb-3" />
                                                        <a href={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                            Buka Layout (PDF)
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <img 
                                                        src={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                                        alt="Layout" 
                                                        className="w-full h-auto max-h-[350px] object-contain mx-auto rounded-xl" 
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full h-40 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                                <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Tidak ada layout</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Data Pemain */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                        <Package className="text-[#D25026]" size={16} />
                                        Data Pemain untuk Packing
                                    </h3>
                                    <button 
                                        onClick={() => downloadPlayersPDF(selectedOrder)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors border border-slate-200"
                                    >
                                        <FileText size={14} className="text-[#D25026]" />
                                        Cetak Laporan PDF
                                    </button>
                                </div>
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden ring-1 ring-black/5">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-16">No</th>
                                                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Nama Pemain</th>
                                                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-32">Nomor</th>
                                                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-32">Ukuran</th>
                                                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-40">Tipe Lengan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {selectedOrder.playerInfo.map((player: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-8 py-4 text-sm font-bold text-slate-400">{idx + 1}</td>
                                                        <td className="px-8 py-4 text-sm font-bold text-slate-800">{player.name}</td>
                                                        <td className="px-8 py-4 text-sm font-black text-slate-600">{player.number}</td>
                                                        <td className="px-8 py-4 text-sm font-black text-[#D25026]">{player.size}</td>
                                                        <td className="px-8 py-4 text-sm font-bold text-slate-500 capitalize">{player.sleeve}</td>
                                                    </tr>
                                                ))}
                                                {selectedOrder.playerInfo.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="px-8 py-12 text-center text-slate-400 text-sm font-bold italic">
                                                            Tidak ada data pemain spesifik
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                        {/* Update Status Bar */}
                        <div className="p-8 border-t border-slate-100 bg-white rounded-b-[2.5rem] flex items-center justify-between">
                            <div className="text-sm font-bold text-slate-500">
                                Status Saat Ini: <span className={cn("ml-2 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border", getStatusStyle(selectedOrder.status))}>{selectedOrder.status}</span>
                            </div>
                            <div className="flex gap-4">
                                {selectedOrder.status !== "FINISHING" && selectedOrder.status !== "SELESAI" && (
                                    <button 
                                        onClick={() => handleUpdateStatus(selectedOrder.rawId, "FINISHING")}
                                        className="px-6 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-black text-xs uppercase tracking-widest transition-colors border border-blue-200 shadow-sm"
                                    >
                                        Lanjut ke Finishing
                                    </button>
                                )}
                                {selectedOrder.status !== "SELESAI" && (
                                    <button 
                                        onClick={() => handleUpdateStatus(selectedOrder.rawId, "SELESAI")}
                                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                                    >
                                        <CheckCircle size={16} />
                                        Packing Selesai
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {toast && (
                    <Toast 
                        title={toast.title} 
                        variant={toast.variant} 
                        onClose={() => setToast(null)} 
                    />
                )}

                {/* Confirm Modal */}
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-[2rem] w-[90vw] max-w-[450px] p-8 border border-slate-100 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">{confirmModal.title}</h3>
                                <p className="text-sm font-normal text-slate-500 leading-relaxed">{confirmModal.message}</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmModal.onConfirm}
                                    className="px-6 py-3 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-xl text-xs font-semibold transition-all shadow-md shadow-[#D25026]/20"
                                >
                                    Ya, Lanjutkan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-geist">
            <div className="w-full space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Packing Pesanan</h1>
                        <p className="text-slate-500 font-medium mt-1">Daftar pesanan dari tahap produksi untuk dipacking</p>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
                        {(["ALL", "PRINT", "FINISHING", "SELESAI"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilterTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                    filterTab === tab ? "bg-white text-[#D25026] shadow-sm" : "text-slate-400 hover:text-slate-700"
                                )}
                            >
                                {tab === "ALL" ? "Semua" : tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-72">
                        <input 
                            type="text" 
                            placeholder="Cari ID, Nama..." 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D25026] transition-colors"
                        />
                    </div>
                </div>

                {/* List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-10 h-10 border-4 border-[#D25026] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic animate-pulse">Memuat data pesanan...</p>
                        </div>
                    ) : sortedOrders.length > 0 ? (
                        sortedOrders.map((order) => (
                            <div key={order.rawId} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest border uppercase", getStatusStyle(order.status))}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 font-mono mt-1">#{order.id}</p>
                                    </div>
                                    {order.queueNumber && (
                                        <div className="bg-[#D25026]/10 text-[#D25026] px-3 py-1 rounded-xl border border-[#D25026]/20 flex flex-col items-center justify-center">
                                            <span className="text-[9px] font-black uppercase tracking-widest">Antrean</span>
                                            <span className="text-lg font-black italic">{order.queueNumber}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 group-hover:text-[#D25026] transition-colors line-clamp-1">{order.customer}</h3>
                                    <p className="text-sm font-bold text-slate-500 mt-1">{order.product}</p>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                                        <Package size={14} />
                                        <span>Total: <strong className="text-slate-800">{order.qty} Pcs</strong></span>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-slate-200"
                                        >
                                            <Eye size={14} />
                                            Lihat Detail Packing
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Tidak ada pesanan ditemukan</p>
                        </div>
                    )}
                </div>
            </div>
            
            {toast && (
                <Toast 
                    title={toast.title} 
                    variant={toast.variant} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    );
}
