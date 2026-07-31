import { useState, useEffect } from "react";
import { adminApi } from "~/api/admin";
import {
    TrendingUp, TrendingDown, Coins, FileText, ZoomIn, X, Printer, Image as ImageIcon,
    Box, Receipt, CheckCircle2, Factory, BarChart3, Calculator
} from "lucide-react";
import { cn } from "~/lib/utils";

interface FinancialReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FinancialReportModal({ isOpen, onClose }: FinancialReportModalProps) {
    const [loading, setLoading] = useState(false);
    
    // Filters
    const [filterPreset, setFilterPreset] = useState<'hari_ini' | 'minggu_ini' | 'bulan_ini' | 'kustom'>('bulan_ini');
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [reportData, setReportData] = useState({
        totalPemasukan: 0,
        totalPengeluaran: 0,
        netProfit: 0,
        bahanPerformance: [] as any[],
        revenueBreakdown: [] as any[]
    });

    const [zoomImage, setZoomImage] = useState<string | null>(null);

    // Apply preset
    useEffect(() => {
        if (!isOpen) return;
        const today = new Date();
        if (filterPreset === 'hari_ini') {
            const dStr = today.toISOString().split('T')[0];
            setStartDate(dStr);
            setEndDate(dStr);
        } else if (filterPreset === 'minggu_ini') {
            const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1));
            const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 7));
            setStartDate(firstDay.toISOString().split('T')[0]);
            setEndDate(lastDay.toISOString().split('T')[0]);
        } else if (filterPreset === 'bulan_ini') {
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            setStartDate(firstDay.toISOString().split('T')[0]);
            setEndDate(lastDay.toISOString().split('T')[0]);
        }
    }, [filterPreset, isOpen]);

    const fetchReport = async () => {
        if (!isOpen) return;
        setLoading(true);
        try {
            const params = (startDate && endDate) ? { startDate, endDate } : undefined;
            const res = await adminApi.getOmsetReport(params);
            if (res.status === "success" && res.data) {
                setReportData({
                    totalPemasukan: res.data.totalPemasukan || 0,
                    totalPengeluaran: res.data.totalPengeluaran || 0,
                    netProfit: res.data.netProfit || 0,
                    bahanPerformance: res.data.bahanPerformance || [],
                    revenueBreakdown: res.data.revenueBreakdown || []
                });
            }
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && (filterPreset !== 'kustom' || (startDate && endDate))) {
            fetchReport();
        }
    }, [startDate, endDate, isOpen]);

    const isProfit = reportData.netProfit >= 0;

    const handlePrint = () => {
        window.print();
    };

    if (!isOpen) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const today = new Date();
    const periodText = (filterPreset === 'hari_ini') ? `Hari Ini (${formatDate(startDate || today.toISOString())})` : 
                       (filterPreset === 'minggu_ini') ? `Minggu Ini (${formatDate(startDate)} - ${formatDate(endDate)})` : 
                       (filterPreset === 'bulan_ini') ? `Bulan ${today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}` : 
                       `${formatDate(startDate)} - ${formatDate(endDate)}`;

    const printDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-center overflow-y-auto p-4 sm:p-8 print:p-0 print:bg-white print:overflow-visible">
            
            <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative flex flex-col print:shadow-none print:w-full print:max-w-none print:h-auto print:min-h-0 mx-auto rounded-xl print:rounded-none overflow-hidden print:overflow-visible">
                
                {/* Control Panel (Hidden in Print) */}
                <div className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-xl print:hidden">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold text-slate-800">Cetak Laporan Grid</h2>
                        <p className="text-xs text-slate-500">Gunakan (Ctrl+P) / Tombol Cetak. Format: A4 Portrait.</p>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                        <select 
                            value={filterPreset}
                            onChange={(e) => setFilterPreset(e.target.value as any)}
                            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white outline-none"
                        >
                            <option value="hari_ini">Hari Ini</option>
                            <option value="minggu_ini">Minggu Ini</option>
                            <option value="bulan_ini">Bulan Ini</option>
                            <option value="kustom">Kustom</option>
                        </select>

                        {filterPreset === 'kustom' && (
                            <div className="flex items-center gap-2">
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-2 py-1 border rounded text-xs" />
                                <span>-</span>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-2 py-1 border rounded text-xs" />
                                <button onClick={fetchReport} className="px-3 py-1 bg-slate-800 text-white rounded text-xs hover:bg-slate-700">Cari</button>
                            </div>
                        )}

                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-[#D25026] text-white rounded-lg font-bold text-xs hover:bg-[#b94420] transition-colors">
                            <Printer className="w-4 h-4" /> Cetak PDF
                        </button>
                        
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* --- PRINTABLE A4 CONTENT --- */}
                <div className="p-8 md:p-10 flex flex-col flex-1 bg-white print:p-0">
                    
                    {/* Header */}
                    <div className="flex justify-between items-end mb-4 border-b-2 border-slate-800 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden">
                                <img src="/images/FCSV.jpeg" alt="FCSV Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-slate-900">FCSV APPAREL INDONESIA</h1>
                                <p className="text-xs text-slate-500 font-medium">Divisi Produksi & Keuangan</p>
                                <p className="text-[10px] text-slate-400 mt-1 max-w-[250px] leading-relaxed">Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <h2 className="text-xl font-black text-[#2B3A4A] tracking-wider">LAPORAN FINANSIAL & ASET</h2>
                            <p className="text-xs font-bold text-slate-600 mt-1">Periode: <span className="font-normal">{periodText}</span></p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Dibuat: {printDate} WIB</p>
                            <div className="mt-2 bg-slate-800 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Dokumen Resmi
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center py-20 text-slate-400 text-sm print:hidden">Memuat data...</div>
                    ) : (
                        <div className="flex flex-col gap-6 print:gap-4 flex-1">
                            
                            {/* TOP GRID: 2 COLUMNS (Inventaris & HPP) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 flex-1 items-start">
                                
                                {/* Box 1: INVENTARIS */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full print:rounded-lg print:border-slate-300">
                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2 print:bg-slate-50/50 print:border-slate-300">
                                        <Box className="w-4 h-4 text-slate-500" />
                                        <h3 className="text-[10px] font-black text-slate-800 tracking-widest uppercase">1. Inventaris Bahan Baku</h3>
                                    </div>
                                    <div className="p-4 flex-1 overflow-x-auto print:overflow-visible">
                                        <table className="w-full text-xs print:text-[10px] min-w-[300px]">
                                            <thead>
                                                <tr className="border-b border-slate-200 text-slate-500 print:border-slate-300">
                                                    <th className="pb-2 pr-1 font-black text-left w-[35%]">BAHAN</th>
                                                    <th className="pb-2 px-1 font-black text-center w-[15%]">SAT</th>
                                                    <th className="pb-2 px-1 font-black text-right w-[15%]">DIBELI</th>
                                                    <th className="pb-2 px-1 font-black text-right w-[15%]">PAKAI</th>
                                                    <th className="pb-2 pl-1 font-black text-right w-[20%]">STOK</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.bahanPerformance.length === 0 ? (
                                                    <tr><td colSpan={5} className="py-4 text-center text-slate-400">Tidak ada data bahan</td></tr>
                                                ) : reportData.bahanPerformance.map((item, idx) => (
                                                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 print:hover:bg-transparent print:border-slate-200">
                                                        <td className="py-2.5 pr-2">
                                                            <div>
                                                                <p className="font-bold text-slate-800 line-clamp-2 leading-tight">{item.nama}</p>
                                                                <p className="text-[9px] text-[#119DA4] font-bold mt-0.5 uppercase">Bahan Pokok</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-2.5 px-1 text-center text-slate-400 font-medium">Kg</td>
                                                        <td className="py-2.5 px-1 text-right font-bold text-slate-600">{item.totalDibeli}</td>
                                                        <td className="py-2.5 px-1 text-right font-bold text-[#E85C2F]">{item.pemanfaatan}</td>
                                                        <td className="py-2.5 pl-2 text-right font-black text-slate-900">{item.sisaStok}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Box 2: HARGA BELI & HPP */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full print:rounded-lg print:border-slate-300">
                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2 print:bg-slate-50/50 print:border-slate-300">
                                        <Receipt className="w-4 h-4 text-slate-500" />
                                        <h3 className="text-[10px] font-black text-slate-800 tracking-widest uppercase">2. Harga Beli & HPP Bahan Baku</h3>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 overflow-x-auto print:overflow-visible">
                                        <table className="w-full text-xs print:text-[10px] flex-1 min-w-[300px]">
                                            <thead>
                                                <tr className="border-b border-slate-200 text-slate-500 print:border-slate-300">
                                                    <th className="pb-2 pr-1 font-black text-left w-[35%]">BAHAN</th>
                                                    <th className="pb-2 px-1 font-black text-right w-[20%]">QTY</th>
                                                    <th className="pb-2 px-1 font-black text-right w-[20%]">HARGA</th>
                                                    <th className="pb-2 pl-1 font-black text-right w-[25%]">TOTAL</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.bahanPerformance.length === 0 ? (
                                                    <tr><td colSpan={4} className="py-4 text-center text-slate-400">Tidak ada data beli</td></tr>
                                                ) : reportData.bahanPerformance.map((item, idx) => (
                                                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 print:hover:bg-transparent print:border-slate-200">
                                                        <td className="py-2.5 pr-2">
                                                            <div>
                                                                <p className="font-bold text-slate-800 line-clamp-2 leading-tight">{item.nama}</p>
                                                                <p className="text-[9px] text-slate-400 mt-0.5">BHN-{String(item.id).padStart(3, '0')}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-2.5 px-1 text-right font-medium text-slate-500 whitespace-nowrap">{item.totalDibeli} <span className="text-[9px]">Kg</span></td>
                                                        <td className="py-2.5 px-1 text-right font-medium text-slate-600 whitespace-nowrap">{formatCurrency(item.hargaBeli || 0)}</td>
                                                        <td className="py-2.5 pl-2 text-right font-black text-slate-800 whitespace-nowrap">{formatCurrency(item.totalModal || 0)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="mt-4 bg-orange-50 border-t-2 border-orange-100 p-3 rounded-lg flex justify-between items-center print:bg-orange-50/30 print:border-t-2 print:border-orange-200">
                                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">TOTAL HPP BAHAN BAKU</span>
                                            <span className="text-xs font-black text-[#D25026]">{formatCurrency(reportData.totalPengeluaran)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM GRID: 3 COLUMNS */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4 mt-2">
                                
                                {/* Box 3: TOTAL PENGELUARAN */}
                                <div className="border border-orange-100 bg-white rounded-xl overflow-hidden flex flex-col shadow-sm print:rounded-lg print:border-slate-300">
                                    <div className="px-5 py-3 border-b border-orange-100 flex items-center gap-2 print:border-slate-300 print:bg-slate-50/50">
                                        <TrendingDown className="w-4 h-4 text-[#D25026]" />
                                        <h3 className="text-[10px] font-black text-[#D25026] tracking-widest uppercase">3. Total Pengeluaran</h3>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div className="space-y-4 text-xs font-medium text-slate-600 print:text-[11px]">
                                            <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                                                <span className="text-[#D25026] font-bold">HPP Bahan Baku (Global)</span>
                                                <span className="font-bold text-[#D25026]">{formatCurrency(reportData.totalPengeluaran)}</span>
                                            </div>
                                            {reportData.bahanPerformance.filter((b: any) => b.totalModal > 0).map((b: any) => (
                                                <div key={b.id} className="flex justify-between items-center text-slate-500">
                                                    <span className="truncate pr-2">- {b.nama}</span>
                                                    <span>{formatCurrency(b.totalModal || 0)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 bg-[#2B3A4A] p-4 rounded-lg flex justify-between items-center text-white print:bg-slate-800 print:text-white">
                                            <span className="text-xs font-black uppercase tracking-wider">TOTAL</span>
                                            <span className="text-base font-black">{formatCurrency(reportData.totalPengeluaran)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Box 4: RINCIAN PENDAPATAN */}
                                <div className="border border-emerald-100 bg-white rounded-xl overflow-hidden flex flex-col shadow-sm print:rounded-lg print:border-slate-300">
                                    <div className="px-5 py-3 border-b border-emerald-100 flex items-center gap-2 print:border-slate-300 print:bg-slate-50/50">
                                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                                        <h3 className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">4. Rincian Pendapatan</h3>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div className="space-y-4 text-xs font-medium text-slate-600 print:text-[11px]">
                                            <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                                                <span className="text-emerald-700 font-bold">Total Penjualan (Pesanan Selesai)</span>
                                                <span className="font-bold text-slate-800">{formatCurrency(reportData.totalPemasukan)}</span>
                                            </div>
                                            {reportData.revenueBreakdown && reportData.revenueBreakdown.map((r: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-slate-500">
                                                    <span className="truncate pr-2">- {r.nama}</span>
                                                    <span>{formatCurrency(r.total)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 bg-emerald-600 p-4 rounded-lg flex justify-between items-center text-white print:bg-emerald-600 print:text-white">
                                            <span className="text-xs font-black uppercase tracking-wider">TOTAL</span>
                                            <span className="text-base font-black">{formatCurrency(reportData.totalPemasukan)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Box 5: PENDAPATAN BERSIH */}
                                <div className={cn(
                                    "border-2 rounded-xl flex flex-col p-4 print:rounded-lg",
                                    isProfit ? "border-emerald-500 bg-emerald-50/30 print:border-emerald-600 print:bg-emerald-50/20" : "border-red-500 bg-red-50/30 print:border-red-600 print:bg-red-50/20"
                                )}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calculator className={cn("w-4 h-4", isProfit ? "text-emerald-600" : "text-red-600")} />
                                        <h3 className={cn("text-[10px] font-black tracking-widest uppercase", isProfit ? "text-emerald-600" : "text-red-600")}>
                                            5. Pendapatan Bersih
                                        </h3>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center justify-center text-center mt-1">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Keuntungan Bersih</span>
                                        <h2 className={cn("text-xl font-black mt-1 tracking-tight print:text-lg", isProfit ? "text-emerald-600" : "text-red-600")}>
                                            {isProfit ? '+' : '-'} {formatCurrency(Math.abs(reportData.netProfit))}
                                        </h2>
                                        
                                        <div className="mt-2 text-[8px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500">
                                            Margin: {reportData.totalPemasukan > 0 ? ((reportData.netProfit / reportData.totalPemasukan) * 100).toFixed(1) : 0}%
                                        </div>
                                    </div>

                                    <div className="mt-4 text-[8px] text-slate-500 space-y-1.5 border-t border-slate-200 pt-3">
                                        <div className="flex justify-between">
                                            <span>Pendapatan</span>
                                            <span className="font-medium text-slate-700">{formatCurrency(reportData.totalPemasukan)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
                                            <span>Pengeluaran</span>
                                            <span className="font-medium text-slate-700">- {formatCurrency(reportData.totalPengeluaran)}</span>
                                        </div>
                                        <div className="flex justify-between pt-0.5">
                                            <span className={cn("font-bold", isProfit ? "text-emerald-600" : "text-red-600")}>Bersih</span>
                                            <span className={cn("font-bold", isProfit ? "text-emerald-600" : "text-red-600")}>
                                                {isProfit ? '' : '-'} {formatCurrency(Math.abs(reportData.netProfit))}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-1.5 text-[7px] text-slate-500 font-medium">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        <div>
                                            <p className="font-bold text-slate-700">DATA TERVALIDASI</p>
                                            <p>Laporan telah diverifikasi sistem ERP</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Footer / Signatures */}
                    <div className="mt-10 pt-6 border-t-2 border-slate-200 flex justify-between items-end text-[8px] text-slate-400">
                        <div className="leading-tight">
                            <p>Digenerate otomatis oleh sistem ERP FCSV Apparel Indonesia.</p>
                            <p>Dokumen internal. Dilarang memperbanyak tanpa izin tertulis.</p>
                        </div>
                        <div className="flex gap-10 text-center text-[9px] font-bold text-slate-600">
                            <div className="flex flex-col items-center">
                                <span className="mb-6 font-medium text-slate-400">Disiapkan Oleh</span>
                                <div className="w-20 border-b border-slate-300"></div>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="mb-6 font-medium text-slate-400">Diperiksa Oleh</span>
                                <div className="w-20 border-b border-slate-300"></div>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="mb-6 font-medium text-slate-400">Disetujui Oleh</span>
                                <div className="w-20 border-b border-slate-300"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Zoom Modal - Hidden in Print */}
            {zoomImage && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-12 print:hidden" onClick={() => setZoomImage(null)}>
                    <div className="relative max-w-4xl w-full max-h-full flex items-center justify-center">
                        <button className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2"><X className="w-8 h-8" /></button>
                        <img src={zoomImage} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
                    </div>
                </div>
            )}
            
        </div>
    );
}
