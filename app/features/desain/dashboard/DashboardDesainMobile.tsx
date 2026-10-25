import { useState, useEffect, useRef } from "react";
import { Clock, Eye, Package, ChevronLeft, Image as ImageIcon, MessageCircle, FileText, User, UploadCloud } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/hooks/useAuth";
import { sortPlayersBySize, downloadPlayersPDF } from "~/lib/sizeUtils";
import { Button } from "~/components/ui/button";
import { Toast } from "~/components/ui/toast";

import { useDashboardDesain } from "~/hooks/useDashboardDesain";
import type { DesainFilterTab, DesainOrderItem } from "~/types";

export function DashboardDesainMobile() {
    const {
        user,
        fileInputRef,
        orders,
        loading,
        selectedOrder,
        setSelectedOrder,
        filterTab,
        setFilterTab,
        searchInput,
        setSearchInput,
        searchQuery,
        setSearchQuery,
        uploading,
        toast,
        setToast,
        isDragging,
        setIsDragging,
        windowDragging,
        confirmModal,
        setConfirmModal,
        filteredOrders,
        sortedOrders,
        canUpload,
        canUploadLayout,
        handleUpdateStatus,
        handleCancelMockup,
        handleUploadMockup,
        handleCancelLayout,
        handleUploadLayout,
        requestConfirmation,
        getStatusStyle,
    } = useDashboardDesain();

    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-slate-50 font-geist pb-24">
                <div className="bg-white px-6 pt-6 pb-6 border-b border-slate-100 sticky top-0 z-40">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs mb-4"
                    >
                        <ChevronLeft size={16} /> Kembali
                    </button>
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={cn("px-3 py-1 rounded-lg text-[8px] font-black tracking-widest border uppercase w-fit", getStatusStyle(selectedOrder.status))}>
                                    {selectedOrder.status}
                                </span>
                                {selectedOrder.queueNumber && (
                                    <span className="bg-[#D25026]/10 text-[#D25026] px-2 py-0.5 rounded text-[8px] font-black uppercase italic border border-[#D25026]/20">
                                        Antrean: {selectedOrder.queueNumber}
                                    </span>
                                )}
                                {selectedOrder.status === "DESAIN" && (
                                    selectedOrder.isWorking ? (
                                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider animate-pulse border border-purple-200 w-fit">
                                            Sedang Dikerjakan
                                        </span>
                                    ) : (
                                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border border-slate-200 w-fit">
                                            Belum Mulai Kerja
                                        </span>
                                    )
                                )}
                            </div>
                            <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Pesanan {selectedOrder.customer}</h1>
                            <p className="text-[10px] font-bold text-slate-500 italic mt-1">{selectedOrder.product} - {selectedOrder.qty} Pcs</p>
                            <div className="flex items-center gap-1.5 mt-2 text-slate-400">
                                <Clock size={10} />
                                <span className="text-[8px] font-black uppercase tracking-widest italic">{selectedOrder.dateTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <ImageIcon className="text-[#D25026]" size={14} /> Referensi Desain
                        </h3>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            {selectedOrder.designUrl ? (
                                <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                    {selectedOrder.designUrl.toLowerCase().endsWith('.pdf') ? (
                                        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 gap-4 group">
                                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                                <FileText size={32} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-slate-900 uppercase italic">Dokumen PDF</p>
                                            </div>
                                            <a 
                                                href={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 italic"
                                            >
                                                <Eye size={12} /> Buka PDF
                                            </a>
                                        </div>
                                    ) : (
                                        <img 
                                            src={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                            alt="Design Reference" 
                                            className="w-full h-auto max-h-[300px] object-contain mx-auto" 
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-24 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 italic uppercase">Tidak ada referensi</p>
                                </div>
                            )}
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Catatan:</p>
                                <p className="text-[10px] text-slate-700 font-medium italic leading-relaxed">{selectedOrder.designNote || "Tidak ada catatan"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mockup Hasil Desain Card Mobile */}
                    {selectedOrder.isWorking && (
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                                <ImageIcon className="text-[#D25026]" size={14} /> Mockup Hasil Desain
                            </h3>
                                {selectedOrder.mockupUrl ? (
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                        <div className="space-y-3">
                                            {selectedOrder.status === "DESAIN" && selectedOrder.designStatus === "REVISI" ? (
                                                <div className="space-y-4">
                                                    {/* Panel 1: Mockup Sebelumnya */}
                                                    <div className="space-y-2">
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Mockup Sebelumnya</p>
                                                        <div className="relative w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                                            {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                                                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 gap-4">
                                                                    <FileText size={32} className="text-red-500" />
                                                                    <a 
                                                                        href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="px-6 py-3 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 italic"
                                                                    >
                                                                        Buka Mockup (PDF)
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                <img 
                                                                    src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                                                    alt="Mockup Design" 
                                                                    className="w-full h-auto max-h-[250px] object-contain mx-auto" 
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Panel 2: Dropzone Upload Mockup Baru */}
                                                    <div className="space-y-2">
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Upload Mockup Baru</p>
                                                        <label 
                                                            onDragOver={(e) => {
                                                                e.preventDefault();
                                                                setIsDragging(true);
                                                            }}
                                                            onDragLeave={() => setIsDragging(false)}
                                                            onDrop={(e) => {
                                                                e.preventDefault();
                                                                setIsDragging(false);
                                                                const file = e.dataTransfer.files?.[0];
                                                                if (file) handleUploadMockup(file);
                                                            }}
                                                            className={cn(
                                                                "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center",
                                                                isDragging 
                                                                    ? "border-[#D25026] bg-[#D25026]/5" 
                                                                    : "border-slate-200 bg-slate-50 hover:border-[#D25026] hover:bg-slate-100/50 shadow-sm"
                                                            )}
                                                        >
                                                            <input 
                                                                type="file" 
                                                                accept="image/*,application/pdf"
                                                                onChange={handleUploadMockup}
                                                                disabled={uploading}
                                                                className="hidden"
                                                                style={{ display: "none" }}
                                                            />
                                                            <div className="pointer-events-none w-8 h-8 rounded-lg bg-[#D25026]/10 flex items-center justify-center text-[#D25026] mb-2">
                                                                <UploadCloud size={16} className="animate-pulse" />
                                                            </div>
                                                            <p className="pointer-events-none text-[10px] font-black uppercase tracking-widest text-slate-800">
                                                                {uploading ? "Mengunggah..." : "Klik / Tarik Mockup Baru ke Sini"}
                                                            </p>
                                                            <p className="pointer-events-none text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                                PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                                                            </p>
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                                    {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                                        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 gap-4">
                                                            <FileText size={32} className="text-red-500" />
                                                            <a 
                                                                href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="px-6 py-3 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 italic"
                                                            >
                                                                Buka Mockup (PDF)
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <img 
                                                            src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                                            alt="Mockup Design" 
                                                            className="w-full h-auto max-h-[250px] object-contain mx-auto" 
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {/* Action Buttons directly below the file mockup */}
                                            {selectedOrder.status === "DESAIN" && selectedOrder.isWorking && (
                                                <div className="flex flex-col gap-2">
                                                    {selectedOrder.designStatus === "SENT" && (
                                                        <button 
                                                            onClick={handleCancelMockup}
                                                            className="w-full py-2.5 bg-red-50 active:bg-red-100 text-red-700 rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-red-200 transition-colors"
                                                        >
                                                            Batalkan Kirim Mockup
                                                        </button>
                                                    )}
                                                    {uploading && <p className="text-[9px] font-bold text-[#D25026] italic animate-pulse text-center">Sedang mengupload...</p>}
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-3 pt-1 border-t border-slate-50">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic pr-1">Persetujuan:</span>
                                                    {selectedOrder.designStatus === "SENT" && (
                                                        <span className="bg-amber-50 text-amber-700 border-amber-200 border px-2 py-0.5 rounded text-[8px] font-black italic pr-1">
                                                            Menunggu Persetujuan Customer
                                                        </span>
                                                    )}
                                                    {selectedOrder.designStatus === "APPROVED" && (
                                                        <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-2 py-0.5 rounded text-[8px] font-black italic pr-1">
                                                            Disetujui
                                                        </span>
                                                    )}
                                                    {selectedOrder.designStatus === "REVISI" && (
                                                        <span className="bg-red-50 text-red-700 border-red-200 border px-2 py-0.5 rounded text-[8px] font-black italic pr-1">
                                                            Revisi Diminta
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {selectedOrder.designStatus === "REVISI" && selectedOrder.designFeedback && (
                                                <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                                                    <p className="text-[7px] font-black text-red-600 uppercase tracking-widest italic mb-0.5">Catatan Revisi:</p>
                                                    <p className="text-[10px] text-red-700 font-bold leading-relaxed italic pr-1">{selectedOrder.designFeedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    selectedOrder.status === "DESAIN" && (selectedOrder.designStatus === "PENDING" || selectedOrder.designStatus === "REVISI") ? (
                                        <div className="space-y-2">
                                            <label 
                                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                                onDragLeave={() => setIsDragging(false)}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(false);
                                                    const file = e.dataTransfer.files?.[0];
                                                    if (file) handleUploadMockup(file);
                                                }}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center",
                                                    isDragging 
                                                        ? "border-[#D25026] bg-[#D25026]/5" 
                                                        : "border-slate-200 bg-slate-50 active:border-[#D25026] active:bg-slate-100/50 shadow-sm"
                                                )}
                                            >
                                                <input 
                                                    type="file" 
                                                    accept="image/*,application/pdf"
                                                    onChange={handleUploadMockup}
                                                    disabled={uploading}
                                                    className="hidden" style={{ display: "none" }}
                                                />
                                                <div className="pointer-events-none w-10 h-10 rounded-xl bg-[#D25026]/10 flex items-center justify-center text-[#D25026] mb-2">
                                                    <UploadCloud size={20} className="animate-pulse" />
                                                </div>
                                                <p className="pointer-events-none text-[10px] font-black uppercase tracking-widest text-slate-800">
                                                    {uploading ? "Mengunggah..." : "Klik / Tarik Mockup ke Sini untuk Upload"}
                                                </p>
                                                <p className="pointer-events-none text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                    PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                                                </p>
                                            </label>
                                            {uploading && <p className="text-[9px] font-bold text-[#D25026] italic mt-1 animate-pulse text-center">Sedang mengupload...</p>}
                                        </div>
                                    ) : (
                                        <div className="w-full h-20 bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-100">
                                            <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada mockup diupload</p>
                                        </div>
                                    )
                                )}
                        </div>
                    )}

                    {/* Mockup Layout Pola Cetak Card Mobile */}
                    {(selectedOrder.status === "LAYOUT" || selectedOrder.layoutUrl) && (
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                                <ImageIcon className="text-[#D25026]" size={14} /> Mockup Layout Pola Cetak
                            </h3>
                            {selectedOrder.layoutUrl ? (
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    <div className="space-y-3">
                                        {selectedOrder.status === "LAYOUT" && selectedOrder.layoutStatus === "REVISI" ? (
                                            <div className="space-y-4">
                                                {/* Panel 1: Layout Sebelumnya */}
                                                <div className="space-y-2">
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Layout Sebelumnya</p>
                                                    <div className="relative w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                                        {selectedOrder.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 gap-4">
                                                                <FileText size={32} className="text-red-500" />
                                                                <a 
                                                                    href={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="px-6 py-3 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 italic"
                                                                >
                                                                    Buka Layout (PDF)
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <img 
                                                                src={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                                                alt="Mockup Layout" 
                                                                className="w-full h-auto max-h-[250px] object-contain mx-auto" 
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Panel 2: Dropzone Upload Layout Baru */}
                                                <div className="space-y-2">
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Upload Layout Baru</p>
                                                    <label 
                                                        onDragOver={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(true);
                                                        }}
                                                        onDragLeave={() => setIsDragging(false)}
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(false);
                                                            const file = e.dataTransfer.files?.[0];
                                                            if (file) handleUploadLayout(file);
                                                        }}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center",
                                                            isDragging 
                                                                ? "border-[#D25026] bg-[#D25026]/5" 
                                                                : "border-slate-200 bg-slate-50 hover:border-[#D25026] hover:bg-slate-100/50 shadow-sm"
                                                        )}
                                                    >
                                                        <input 
                                                            type="file" 
                                                            accept="image/*,application/pdf"
                                                            onChange={handleUploadLayout}
                                                            disabled={uploading}
                                                            className="hidden"
                                                            style={{ display: "none" }}
                                                        />
                                                        <div className="pointer-events-none w-8 h-8 rounded-lg bg-[#D25026]/10 flex items-center justify-center text-[#D25026] mb-2">
                                                            <UploadCloud size={16} className="animate-pulse" />
                                                        </div>
                                                        <p className="pointer-events-none text-[10px] font-black uppercase tracking-widest text-slate-800">
                                                            {uploading ? "Mengunggah..." : "Klik / Tarik Layout Baru ke Sini"}
                                                        </p>
                                                        <p className="pointer-events-none text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                            PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                                                        </p>
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                                {selectedOrder.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 gap-4">
                                                        <FileText size={32} className="text-red-500" />
                                                        <a 
                                                            href={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="px-6 py-3 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 italic"
                                                        >
                                                            Buka Layout (PDF)
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <img 
                                                        src={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                                        alt="Mockup Layout" 
                                                        className="w-full h-auto max-h-[250px] object-contain mx-auto" 
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons directly below the file layout */}
                                        {selectedOrder.status === "LAYOUT" && (
                                            <div className="flex flex-col gap-2">
                                                {selectedOrder.layoutStatus === "SENT" && (
                                                    <button 
                                                        onClick={handleCancelLayout}
                                                        className="w-full py-2.5 bg-red-50 active:bg-red-100 text-red-700 rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-red-200 transition-colors"
                                                    >
                                                        Batalkan Kirim Layout
                                                    </button>
                                                )}
                                                {uploading && <p className="text-[9px] font-bold text-[#D25026] italic animate-pulse text-center">Sedang mengupload...</p>}
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-3 pt-1 border-t border-slate-50">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic pr-1">Persetujuan Layout:</span>
                                                {selectedOrder.layoutStatus === "SENT" && (
                                                    <span className="bg-amber-50 text-amber-700 border-amber-200 border px-2 py-0.5 rounded text-[8px] font-black italic pr-1">
                                                        Menunggu Persetujuan Customer
                                                    </span>
                                                )}
                                                {selectedOrder.layoutStatus === "APPROVED" && (
                                                    <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-2 py-0.5 rounded text-[8px] font-black italic pr-1">
                                                        Disetujui
                                                    </span>
                                                )}
                                                {selectedOrder.layoutStatus === "REVISI" && (
                                                    <span className="bg-red-50 text-red-700 border-red-200 border px-2 py-0.5 rounded text-[8px] font-black italic pr-1">
                                                        Revisi Diminta
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {selectedOrder.layoutStatus === "REVISI" && selectedOrder.layoutFeedback && (
                                            <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                                                <p className="text-[7px] font-black text-red-600 uppercase tracking-widest italic mb-0.5">Catatan Revisi Layout:</p>
                                                <p className="text-[10px] text-red-700 font-bold leading-relaxed italic pr-1">{selectedOrder.layoutFeedback}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                selectedOrder.status === "LAYOUT" && (selectedOrder.layoutStatus === "PENDING" || selectedOrder.layoutStatus === "REVISI") ? (
                                    <div className="space-y-2">
                                        <label 
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setIsDragging(false);
                                                const file = e.dataTransfer.files?.[0];
                                                if (file) handleUploadLayout(file);
                                            }}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center",
                                                isDragging 
                                                    ? "border-[#D25026] bg-[#D25026]/5" 
                                                    : "border-slate-200 bg-slate-50 active:border-[#D25026] active:bg-slate-100/50 shadow-sm"
                                            )}
                                        >
                                            <input 
                                                type="file" 
                                                accept="image/*,application/pdf"
                                                onChange={handleUploadLayout}
                                                disabled={uploading}
                                                className="hidden" style={{ display: "none" }}
                                            />
                                            <div className="pointer-events-none w-10 h-10 rounded-xl bg-[#D25026]/10 flex items-center justify-center text-[#D25026] mb-2">
                                                <UploadCloud size={20} className="animate-pulse" />
                                            </div>
                                            <p className="pointer-events-none text-[10px] font-black uppercase tracking-widest text-slate-800">
                                                {uploading ? "Mengunggah..." : "Klik / Tarik Layout ke Sini untuk Upload"}
                                            </p>
                                            <p className="pointer-events-none text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                                            </p>
                                        </label>
                                        {uploading && <p className="text-[9px] font-bold text-[#D25026] italic mt-1 animate-pulse text-center">Sedang mengupload...</p>}
                                    </div>
                                ) : (
                                    <div className="w-full h-20 bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-100">
                                        <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada layout diupload</p>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                                <User className="text-[#D25026]" size={14} /> Daftar Nama & Nomor
                            </h3>
                            <button 
                                onClick={() => downloadPlayersPDF(selectedOrder)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[7px] font-black uppercase tracking-widest italic shadow-sm"
                            >
                                <FileText size={10} className="text-[#D25026]" />
                                PDF
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                {selectedOrder.playerInfo.map((player: any, idx: number) => {
                                    let sizeOnly = player.size || "-";
                                    let sleeve = "-";
                                    if (sizeOnly.includes("(")) {
                                        const parts = sizeOnly.split("(");
                                        sizeOnly = parts[0].trim();
                                        sleeve = parts[1].replace(")", "").trim();
                                    } else if (sizeOnly.includes("-")) {
                                        const parts = sizeOnly.split("-");
                                        sizeOnly = parts[0].trim();
                                        sleeve = parts.slice(1).join("-").trim();
                                    }
                                    return (
                                        <div key={idx} className="p-4 border-b border-slate-50 last:border-0 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-black text-slate-800 uppercase italic">{player.name}</p>
                                                {sleeve !== "-" && (
                                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{sleeve}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-black italic">{sizeOnly}</span>
                                                <span className="text-[#D25026] font-black text-lg w-6 text-center">{player.number}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-100 flex flex-col gap-3 fixed bottom-0 left-0 right-0 z-50">
                    <button 
                        onClick={() => window.location.href = `/desain/chat?userId=${selectedOrder.customerId}`}
                        className="w-full h-12 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 shadow-lg"
                    >
                        <MessageCircle size={14} /> Chat Customer
                    </button>
                    {selectedOrder.status === "DESAIN" && selectedOrder.isWorking && selectedOrder.designStatus === "SENT" && (
                        <button 
                            onClick={handleCancelMockup}
                            className="w-full h-12 bg-red-100 text-red-800 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-red-200"
                        >
                            Batalkan Kirim Mockup
                        </button>
                    )}
                    {selectedOrder.status === "LAYOUT" && selectedOrder.layoutStatus === "SENT" && (
                        <button 
                            onClick={handleCancelLayout}
                            className="w-full h-12 bg-red-100 text-red-800 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-red-200"
                        >
                            Batalkan Kirim Layout
                        </button>
                    )}
                    <div className="flex gap-2">
                        {selectedOrder.status === "DESAIN" && (
                            selectedOrder.isWorking ? (
                                <button 
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "LAYOUT")}
                                    disabled={selectedOrder.designStatus !== "APPROVED"}
                                    className="flex-1 h-12 bg-amber-400 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-amber-500/20 disabled:opacity-50"
                                >
                                    Lanjut Layout
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "DESAIN", true)}
                                    className="flex-1 h-12 bg-[#D25026] text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-[#D25026]/20"
                                >
                                    Mulai Kerja
                                </button>
                            )
                        )}
                        {selectedOrder.status === "LAYOUT" && (
                            <button 
                                onClick={() => handleUpdateStatus(selectedOrder.rawId, "PRINT")}
                                disabled={selectedOrder.layoutStatus !== "APPROVED"}
                                className="flex-1 h-12 bg-cyan-400 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                            >
                                Lanjut Print
                            </button>
                        )}
                        {selectedOrder.status === "PRINT" && (
                            <button 
                                onClick={() => handleUpdateStatus(selectedOrder.rawId, "FINISHING")}
                                className="flex-1 h-12 bg-blue-400 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-blue-500/20"
                            >
                                Lanjut Finishing
                            </button>
                        )}
                        {selectedOrder.status === "FINISHING" && (
                            <div className="w-full py-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[9px] font-black uppercase tracking-widest italic text-center">
                                Pesanan diserahkan ke tim gudang untuk packing & finishing
                            </div>
                        )}
                    </div>
                </div>
                {/* Modals & Toasts */}
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-[2rem] w-[90vw] max-w-[380px] p-6 border border-slate-100 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200">
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-slate-900">{confirmModal.title}</h3>
                                <p className="text-xs font-normal text-slate-500 leading-relaxed">{confirmModal.message}</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmModal.onConfirm}
                                    className="px-4 py-2 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-lg text-xs font-semibold transition-all shadow-md shadow-[#D25026]/20"
                                >
                                    Ya
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {toast && (
                    <Toast 
                        title={toast.title} 
                        variant={toast.variant} 
                        onClose={() => setToast(null)} 
                    />
                )}
                {windowDragging && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
                        <div className="max-w-xs w-full border-4 border-dashed border-[#D25026]/65 rounded-[2rem] p-8 bg-slate-900/50 flex flex-col items-center justify-center text-center space-y-6 transform scale-100 transition-transform animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 rounded-full bg-[#D25026]/10 flex items-center justify-center text-[#D25026] animate-bounce">
                                <UploadCloud size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-black italic uppercase tracking-wider text-white">
                                    Lepaskan File {selectedOrder?.status === "LAYOUT" ? "Layout" : "Mockup"}
                                </h3>
                                <p className="text-xs font-medium text-slate-300">
                                    Tarik file Anda ke sini untuk langsung mengunggah {selectedOrder?.status === "LAYOUT" ? "layout" : "mockup"} jersey.
                                </p>
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                                PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-20">
            <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-40">
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Management Pesanan</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kelola tugas desain Anda</p>
            </div>

            {/* Mobile Filter & Search Section */}
            <div className="p-6 space-y-4 bg-white border-b border-slate-100 shadow-sm">
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none gap-1">
                    {(["ALL", "WAITING", "PROCESSING", "COMPLETED"] as const).map((tab) => {
                        const labelMap = {
                            ALL: "Semua",
                            WAITING: "Menunggu",
                            PROCESSING: "Diproses",
                            COMPLETED: "Selesai"
                        };
                        const countMap = {
                            ALL: orders.length,
                            WAITING: orders.filter(o => o.status === "DESAIN" && !o.isWorking).length,
                            PROCESSING: orders.filter(o => (o.status === "DESAIN" && o.isWorking) || ["LAYOUT", "PRINT", "FINISHING"].includes(o.status)).length,
                            COMPLETED: orders.filter(o => o.status === "SELESAI").length
                        };
                        const isActive = filterTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setFilterTab(tab)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider italic transition-all shrink-0",
                                    isActive ? "bg-white text-[#D25026] shadow-sm" : "text-slate-400 hover:text-slate-700"
                                )}
                            >
                                {labelMap[tab]} ({countMap[tab]})
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-2 w-full">
                    <input 
                        type="text"
                        placeholder="Cari ID, pelanggan..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#D25026] transition-colors flex-1"
                    />
                    <Button 
                        onClick={() => setSearchQuery(searchInput)}
                        className="bg-[#D25026] text-slate-900 font-bold italic uppercase tracking-widest text-[10px] h-[2.25rem] px-4 rounded-xl hover:bg-[#B34320] transition-colors"
                    >
                        Search
                    </Button>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-slate-200 border-t-[#D25026] rounded-full animate-spin" />
                        <p className="text-xs font-bold text-slate-400">Memuat pesanan...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-sm font-bold text-slate-400">Belum ada pesanan.</p>
                    </div>
                ) : sortedOrders.length === 0 ? (
                    <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-sm font-bold text-slate-400">Tidak ada pesanan yang sesuai filter.</p>
                    </div>
                ) : (
                    sortedOrders.map(order => (
                        <div key={order.rawId} 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 text-sm font-mono">{order.id}</p>
                                        {order.queueNumber && (
                                            <span className="bg-[#D25026]/10 text-[#D25026] px-1.5 py-0.5 rounded text-[8px] font-black uppercase italic border border-[#D25026]/20">
                                                Antrean: {order.queueNumber}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{order.dateTime}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={cn("px-2 py-1 rounded-md text-[8px] font-black tracking-widest border uppercase", getStatusStyle(order.status))}>
                                        {order.status}
                                    </span>
                                    {order.status === "DESAIN" && (
                                        order.isWorking ? (
                                            <span className="bg-purple-100 text-purple-800 text-[6px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse border border-purple-200">
                                                Sedang Dikerjakan
                                            </span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-500 text-[6px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-slate-200">
                                                Belum Mulai Kerja
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-xl p-3 mb-3">
                                <p className="text-xs font-bold text-slate-700">{order.customer}</p>
                                <p className="text-[10px] text-slate-500 font-medium">{order.product} - {order.qty} Items</p>
                            </div>

                            <button className="w-full py-2.5 bg-[#D25026]/5 text-[#D25026] text-[10px] font-black uppercase tracking-widest rounded-xl italic flex items-center justify-center gap-2">
                                <Eye size={12} /> Lihat Detail
                            </button>
                        </div>
                    ))
                )}
            </div>
            {/* Modals & Toasts */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-[90vw] max-w-[380px] p-6 border border-slate-100 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-slate-900">{confirmModal.title}</h3>
                            <p className="text-xs font-normal text-slate-500 leading-relaxed">{confirmModal.message}</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-all"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmModal.onConfirm}
                                className="px-4 py-2 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-lg text-xs font-semibold transition-all shadow-md shadow-[#D25026]/20"
                            >
                                Ya
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
