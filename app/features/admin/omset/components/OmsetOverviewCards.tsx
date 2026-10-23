import { Coins, TrendingUp, Award, BarChart3 } from "lucide-react";
import type { OmsetStatsData, TimeView } from "~/types";

interface OmsetOverviewCardsProps {
    statsData: OmsetStatsData;
    currentTotal: number;
    timeView: TimeView;
}

export function OmsetOverviewCards({ statsData, currentTotal, timeView }: OmsetOverviewCardsProps) {
    const timeViewLabel = timeView === 'daily' 
        ? 'Harian' 
        : timeView === 'monthly' 
        ? 'Bulanan' 
        : timeView === 'yearly' 
        ? 'Tahunan' 
        : 'Lifetime';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-[#D25026]/5 rounded-bl-[5rem] flex items-center justify-center transition-all duration-300 group-hover:bg-[#D25026]/10">
                    <Coins className="w-8 h-8 text-[#D25026] opacity-60" />
                </div>
                <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
                        Total Akumulasi Omset
                    </span>
                    <h3 className="text-slate-900 text-2xl font-black mt-2">
                        Rp {statsData.totalRevenue.toLocaleString('id-ID')}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                        Seluruh pendapatan bersih di sistem
                    </p>
                </div>
            </div>

            {/* Selected Period Total Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-[#119DA4]/5 rounded-bl-[5rem] flex items-center justify-center transition-all duration-300 group-hover:bg-[#119DA4]/10">
                    <TrendingUp className="w-8 h-8 text-[#119DA4] opacity-60" />
                </div>
                <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
                        Omset ({timeViewLabel})
                    </span>
                    <h3 className="text-slate-900 text-2xl font-black mt-2 text-[#119DA4]">
                        Rp {currentTotal.toLocaleString('id-ID')}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                        Berdasarkan tab data yang aktif
                    </p>
                </div>
            </div>

            {/* Best Month Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-[#E85C2F]/5 rounded-bl-[5rem] flex items-center justify-center transition-all duration-300 group-hover:bg-[#E85C2F]/10">
                    <Award className="w-8 h-8 text-[#E85C2F] opacity-60" />
                </div>
                <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
                        Bulan Terlaris
                    </span>
                    {statsData.bestMonth.pv > 0 ? (
                        <>
                            <h3 className="text-slate-900 text-xl font-black mt-2 text-[#E85C2F]">
                                {statsData.bestMonth.month} {statsData.bestMonth.year !== '-' && `'${statsData.bestMonth.year.substring(2)}`}
                            </h3>
                            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                                Rp {statsData.bestMonth.pv.toLocaleString('id-ID')} omset bulanan
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-slate-700 text-lg font-bold mt-2">Belum ada data</h3>
                            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Belum ada data transaksi</p>
                        </>
                    )}
                </div>
            </div>

            {/* Best Year Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-neutral-900/5 rounded-bl-[5rem] flex items-center justify-center transition-all duration-300 group-hover:bg-neutral-900/10">
                    <BarChart3 className="w-8 h-8 text-neutral-800 opacity-60" />
                </div>
                <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
                        Tahun Terbaik
                    </span>
                    {statsData.bestYear.totalRevenue > 0 ? (
                        <>
                            <h3 className="text-slate-900 text-2xl font-black mt-2 text-slate-800">
                                {statsData.bestYear.year}
                            </h3>
                            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                                Rp {statsData.bestYear.totalRevenue.toLocaleString('id-ID')} ({statsData.bestYear.totalQuantity} jersey)
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-slate-700 text-lg font-bold mt-2">Belum ada data</h3>
                            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Belum ada data transaksi</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
