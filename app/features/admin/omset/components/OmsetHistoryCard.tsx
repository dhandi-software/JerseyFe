import { cn } from "~/lib/utils";
import type { SalesDataItem } from "~/types";

interface OmsetHistoryCardProps {
    loading: boolean;
    isMounted: boolean;
    activeData: SalesDataItem[];
}

export function OmsetHistoryCard({ loading, isMounted, activeData }: OmsetHistoryCardProps) {
    return (
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-[380px] lg:h-[420px]">
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Rincian Riwayat Omset
                    </span>
                    <h3 className="text-slate-900 text-lg font-black mt-1">Laporan Angka</h3>
                </div>
                <span className="text-[10px] bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full text-slate-500 font-bold uppercase tracking-wider">
                    Terbaru di atas
                </span>
            </div>

            <div className="flex-1 w-full overflow-y-auto custom-scrollbar pr-2">
                {loading || !isMounted ? (
                    <div className="w-full h-full flex flex-col items-center justify-center py-20 text-slate-400 text-sm italic">
                        <div className="w-6 h-6 rounded-full border-2 border-[#D25026] border-t-transparent animate-spin mb-2" />
                        Memuat rincian...
                    </div>
                ) : activeData.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center py-20 text-slate-400 text-sm italic">
                        Belum ada data rincian
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {activeData.slice().reverse().map((item, idx) => {
                            const prevVal = activeData[activeData.length - idx - 2]?.pv || 0;
                            const currentVal = item.pv || 0;
                            const isDecrease = currentVal < prevVal;

                            return (
                                <div
                                    key={idx}
                                    className="p-4 bg-slate-50 hover:bg-[#FFF0EB]/20 hover:border-[#FFF0EB] border border-slate-100 rounded-2xl flex items-center justify-between transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-600 font-bold text-xs border border-slate-100">
                                            {activeData.length - idx}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-800 text-sm font-bold group-hover:text-[#D25026] transition-colors">
                                                {item.name}
                                            </span>
                                            <span className="text-slate-400 text-[10px] font-bold uppercase mt-0.5">
                                                FCSV Jersey
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-slate-900 text-sm font-black italic uppercase tracking-tighter">
                                            Rp {currentVal.toLocaleString('id-ID')}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-bold mt-1 flex items-center gap-0.5",
                                            currentVal === 0 ? "text-slate-400" : isDecrease ? "text-red-500" : "text-emerald-500"
                                        )}>
                                            {currentVal === 0 ? "Neutral" : isDecrease ? "↓ Turun" : "↑ Naik"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
