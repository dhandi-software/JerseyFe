import React from 'react';
import { sortPlayersBySize } from '~/lib/sizeUtils';

interface InvoiceTemplateProps {
    order: any;
    invoiceRef: React.RefObject<HTMLDivElement | null>;
}

export function InvoiceTemplate({ order, invoiceRef }: InvoiceTemplateProps) {
    if (!order) return null;

    const totalUnit = order.details?.length || 0;
    const basePrice = 150000; // Asumsi harga satuan
    const subtotal = totalUnit * basePrice;
    
    return (
        <div 
            ref={invoiceRef}
            className="w-[794px] min-h-[1123px] px-14 pt-14 pb-12 relative bg-white rounded-xl shadow-[0px_4px_40px_0px_rgba(0,0,0,0.10)] inline-flex flex-col justify-start items-start overflow-hidden"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Header */}
            <div className="self-stretch inline-flex justify-between items-start mb-10">
                <div className="inline-flex flex-col justify-start items-start">
                    <div className="self-stretch inline-flex justify-start items-center gap-2.5">
                        <div className="w-10 h-10 bg-[#D25026] rounded-lg flex justify-center items-center">
                            <span className="text-white text-lg font-extrabold">J</span>
                        </div>
                        <div className="text-slate-900 text-2xl font-black italic uppercase tracking-tighter">
                            JerseyCraft
                        </div>
                    </div>
                    <div className="mt-4 text-slate-500 text-sm font-medium leading-tight">
                        Jl. Pahlawan No. 123, Bandung<br/>
                        Jawa Barat, Indonesia 40123<br/>
                        hello@jerseycraft.com
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[#D25026] text-4xl font-black italic uppercase tracking-widest mb-2">
                        INVOICE
                    </div>
                    <div className="text-slate-900 text-sm font-bold">
                        #{order.orderId}
                    </div>
                    <div className="text-slate-500 text-sm mt-1">
                        Tanggal: {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div className="self-stretch flex justify-between items-start mb-10 border-t border-b border-slate-100 py-6">
                <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Tagihan Kepada:</div>
                    <div className="text-slate-900 text-lg font-bold">{order.customerName}</div>
                    <div className="text-slate-500 text-sm mt-1 max-w-[250px]">
                        {order.shippingAddress || "Alamat belum diatur"}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Status Pembayaran:</div>
                    <div className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold uppercase tracking-wider">
                        LUNAS
                    </div>
                </div>
            </div>

            {/* Order Items & Players Table */}
            <div className="self-stretch flex-col justify-start items-start flex mb-10">
                <div className="text-slate-900 text-lg font-bold mb-4">Daftar Item & Pemain</div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-900">
                            <th className="py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Item/Pemain</th>
                            <th className="py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-center">No</th>
                            <th className="py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-center">Size</th>
                            <th className="py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-right">Harga Satuan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortPlayersBySize(order.details || []).map((item: any, idx: number) => (
                            <tr key={idx}>
                                <td className="py-4">
                                    <div className="text-sm font-bold text-slate-900 uppercase">{item.playerName || "Custom Jersey"}</div>
                                    <div className="text-xs text-slate-500">{item.productTitle || "Custom Jersey Design"}</div>
                                </td>
                                <td className="py-4 text-sm font-bold text-[#D25026] text-center">{item.playerNumber || "-"}</td>
                                <td className="py-4 text-center">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700">{item.playerSize || "-"}</span>
                                </td>
                                <td className="py-4 text-sm font-bold text-slate-900 text-right">Rp {basePrice.toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Total Calculation */}
            <div className="self-stretch flex justify-end items-start mb-auto">
                <div className="w-[300px] flex-col justify-start items-start flex gap-4">
                    <div className="self-stretch flex justify-between items-center">
                        <div className="text-slate-500 text-sm font-medium">Subtotal ({totalUnit} item)</div>
                        <div className="text-slate-900 text-sm font-bold">Rp {subtotal.toLocaleString('id-ID')}</div>
                    </div>
                    {/* Diskon atau biaya lain bisa ditaruh sini jika ada, kita asumsikan totalAmount yang sudah pas */}
                    <div className="self-stretch flex justify-between items-center pt-4 border-t-2 border-slate-900">
                        <div className="text-slate-900 text-lg font-black uppercase tracking-widest italic">Total</div>
                        <div className="text-[#D25026] text-xl font-black">Rp {(order.totalAmount || subtotal).toLocaleString('id-ID')}</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="self-stretch pt-8 border-t border-slate-100 mt-10">
                <div className="text-center text-slate-400 text-xs font-medium">
                    Terima kasih atas pesanan Anda. Jika ada pertanyaan, hubungi tim support kami.
                </div>
            </div>
        </div>
    );
}
