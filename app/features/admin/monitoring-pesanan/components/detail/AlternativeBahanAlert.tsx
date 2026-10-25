import { AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import type { BahanItem, MonitoringOrder } from "~/types";

interface AlternativeBahanAlertProps {
    order: MonitoringOrder;
    currentBahan?: BahanItem;
    bahanList: BahanItem[];
    isRecommendModalOpen: boolean;
    setIsRecommendModalOpen: (open: boolean) => void;
    tempRecommendedIds: number[];
    setTempRecommendedIds: React.Dispatch<React.SetStateAction<number[]>>;
    handleSendRecommendations: () => Promise<void>;
}

export function AlternativeBahanAlert({
    order,
    currentBahan,
    bahanList,
    isRecommendModalOpen,
    setIsRecommendModalOpen,
    tempRecommendedIds,
    setTempRecommendedIds,
    handleSendRecommendations
}: AlternativeBahanAlertProps) {
    if (currentBahan?.status !== "Habis") return null;

    return (
        <div className="bg-red-50 border border-red-200 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                    <AlertCircle className="text-red-600 w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-red-900">
                        Bahan Terpilih Habis!
                    </h4>
                    <p className="text-xs text-red-600 font-medium leading-relaxed mt-1">
                        Bahan "{currentBahan?.nama}" saat ini tidak tersedia. Berikan rekomendasi bahan alternatif agar customer dapat memilih bahan pengganti.
                    </p>
                    {order.recommendedBahanIds && order.recommendedBahanIds.length > 0 && (
                        <p className="text-xs text-slate-500 font-bold mt-2">
                            Rekomendasi saat ini: {order.recommendedBahanIds.map(id => bahanList.find(b => b.id === id)?.nama).filter(Boolean).join(", ")}
                        </p>
                    )}
                </div>
            </div>

            <Dialog open={isRecommendModalOpen} onOpenChange={setIsRecommendModalOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-slate-900 text-white rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-xs hover:bg-[#D25026] active:scale-95 transition-all shadow-md shrink-0 cursor-pointer">
                        Rekomendasikan Alternatif
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] font-geist border-slate-100 shadow-xl rounded-3xl p-8 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                            Rekomendasi Bahan Alternatif
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-6 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                        <p className="text-xs font-bold text-slate-500 italic uppercase">
                            Pilih bahan pengganti yang berstatus "Tersedia":
                        </p>
                        {bahanList.filter(b => b.status === "Tersedia").map(b => {
                            const isChecked = tempRecommendedIds.includes(b.id);
                            return (
                                <label
                                    key={b.id}
                                    className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 cursor-pointer transition-all"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                            if (isChecked) {
                                                setTempRecommendedIds(prev => prev.filter(id => id !== b.id));
                                            } else {
                                                setTempRecommendedIds(prev => [...prev, b.id]);
                                            }
                                        }}
                                        className="w-5 h-5 rounded border-slate-300 text-[#D25026] focus:ring-[#D25026]"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-900 uppercase">{b.nama}</p>
                                        <p className="text-xs font-bold text-[#D25026]">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(b.harga || 150000)}
                                        </p>
                                    </div>
                                </label>
                            );
                        })}
                        {bahanList.filter(b => b.status === "Tersedia").length === 0 && (
                            <p className="text-xs font-medium text-slate-400 italic">Tidak ada bahan tersedia saat ini.</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsRecommendModalOpen(false)}
                            className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSendRecommendations}
                            className="px-6 py-2.5 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] transition-colors cursor-pointer"
                        >
                            Kirim Rekomendasi
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
