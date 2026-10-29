import { Search, User, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { parsePlayerSizeAndSleeve } from "~/lib/sizeUtils";
import type { CustomerPlayerListSectionProps } from "~/types";

export function CustomerPlayerListSection({
    players,
    totalPlayers,
    memberSearch,
    onMemberSearchChange,
    variant = "desktop",
}: CustomerPlayerListSectionProps) {
    const isMobile = variant === "mobile";

    if (isMobile) {
        return (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic flex items-center gap-2">
                        <User className="text-[#D25026]" size={16} /> Daftar Pemain
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider">
                        {memberSearch.trim()
                            ? `${players.length} / ${totalPlayers} Anggota`
                            : `${totalPlayers} Anggota`}
                    </span>
                </div>

                <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={memberSearch}
                        onChange={(e) => onMemberSearchChange(e.target.value)}
                        placeholder="Cari nama pemain, nomor, atau ukuran..."
                        aria-label="Cari anggota tim"
                        className="w-full min-h-11 pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D25026] focus-visible:border-[#D25026] focus-visible:bg-white transition-all"
                    />
                    {memberSearch && (
                        <button
                            type="button"
                            onClick={() => onMemberSearchChange("")}
                            aria-label="Hapus pencarian anggota"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200/80">
                    <div className="max-h-[360px] overflow-x-auto overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[480px]">
                            <thead className="bg-slate-100/80 sticky top-0 z-10 border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-3 text-xs font-black text-slate-500 uppercase tracking-wider w-12 text-center">
                                        No
                                    </th>
                                    <th className="py-3 px-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                                        Nama Pemain
                                    </th>
                                    <th className="py-3 px-3 text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                                        Nomor
                                    </th>
                                    <th className="py-3 px-3 text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                                        Size
                                    </th>
                                    <th className="py-3 px-3 text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                                        Lengan
                                    </th>
                                    <th className="py-3 px-3 text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                                        Baju
                                    </th>
                                    <th className="py-3 px-3 text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                                        Celana
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/60 bg-white">
                                {players.length > 0 ? (
                                    players.map((p, idx) => {
                                        const { sizeOnly, sleeve } = parsePlayerSizeAndSleeve(
                                            p.playerSize
                                        );
                                        return (
                                            <tr key={p.id || idx} className="hover:bg-slate-50/80">
                                                <td className="py-3 px-3 text-xs font-bold text-slate-500 text-center font-mono">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-3 px-3 text-sm font-black text-slate-900 uppercase italic">
                                                    {p.playerName || "-"}
                                                </td>
                                                <td className="py-3 px-3 text-sm font-black text-[#D25026] text-center font-mono">
                                                    {p.playerNumber || "-"}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    <span className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-xs font-black text-slate-700 uppercase">
                                                        {sizeOnly}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3 text-xs font-semibold text-slate-600 text-center">
                                                    {sleeve}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    <span
                                                        className={cn(
                                                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase",
                                                            p.statusBaju
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                : "bg-slate-100 text-slate-500 border border-slate-200"
                                                        )}
                                                    >
                                                        {p.statusBaju ? "Ready" : "Belum"}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    <span
                                                        className={cn(
                                                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase",
                                                            p.statusCelana
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                : "bg-slate-100 text-slate-500 border border-slate-200"
                                                        )}
                                                    >
                                                        {p.statusCelana ? "Ready" : "Belum"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-8 px-4 text-center text-sm font-semibold text-slate-400 italic"
                                        >
                                            Tidak ada anggota dengan kata kunci &ldquo;{memberSearch}&rdquo;.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#D25026]">
                        <User size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-base font-black uppercase tracking-widest text-slate-900 italic">
                                Daftar Pemain
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider">
                                {memberSearch.trim()
                                    ? `${players.length} dari ${totalPlayers} Anggota`
                                    : `${totalPlayers} Anggota`}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                            Daftar lengkap ukuran, nomor punggung, dan status kesiapan jersey anggota tim
                        </p>
                    </div>
                </div>

                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={memberSearch}
                        onChange={(e) => onMemberSearchChange(e.target.value)}
                        placeholder="Cari nama pemain, nomor, atau ukuran..."
                        aria-label="Cari anggota tim"
                        className="w-full min-h-11 pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D25026] focus-visible:border-[#D25026] focus-visible:bg-white transition-all"
                    />
                    {memberSearch && (
                        <button
                            type="button"
                            onClick={() => onMemberSearchChange("")}
                            aria-label="Hapus pencarian anggota"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80">
                <div className="max-h-[420px] overflow-x-auto overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100/90 sticky top-0 z-10 border-b border-slate-200">
                            <tr>
                                <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-widest italic w-16 text-center">
                                    No
                                </th>
                                <th className="py-4 px-5 text-xs font-black text-slate-500 uppercase tracking-widest italic">
                                    Nama Pemain
                                </th>
                                <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-widest italic text-center">
                                    Nomor Punggung
                                </th>
                                <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-widest italic text-center">
                                    Ukuran (Size)
                                </th>
                                <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-widest italic text-center">
                                    Tipe Lengan
                                </th>
                                <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-widest italic text-center">
                                    Status Baju
                                </th>
                                <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-widest italic text-center">
                                    Status Celana
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/60 bg-white">
                            {players.length > 0 ? (
                                players.map((p, idx) => {
                                    const { sizeOnly, sleeve } = parsePlayerSizeAndSleeve(p.playerSize);
                                    return (
                                        <tr
                                            key={p.id || idx}
                                            className="hover:bg-slate-50/80 transition-colors"
                                        >
                                            <td className="py-4 px-4 text-sm font-bold text-slate-500 text-center font-mono">
                                                {idx + 1}
                                            </td>
                                            <td className="py-4 px-5 text-sm font-black text-slate-900 uppercase italic">
                                                {p.playerName || "-"}
                                            </td>
                                            <td className="py-4 px-4 text-sm font-black text-[#D25026] text-center font-mono">
                                                {p.playerNumber || "-"}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 text-xs font-black text-slate-800 uppercase">
                                                    {sizeOnly}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-sm font-semibold text-slate-600 text-center">
                                                {sleeve}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider",
                                                        p.statusBaju
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : "bg-slate-100 text-slate-500 border border-slate-200"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            p.statusBaju
                                                                ? "bg-emerald-500"
                                                                : "bg-slate-400"
                                                        )}
                                                    />
                                                    {p.statusBaju ? "Ready" : "Belum"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider",
                                                        p.statusCelana
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : "bg-slate-100 text-slate-500 border border-slate-200"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            p.statusCelana
                                                                ? "bg-emerald-500"
                                                                : "bg-slate-400"
                                                        )}
                                                    />
                                                    {p.statusCelana ? "Ready" : "Belum"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-10 px-4 text-center text-sm font-semibold text-slate-400 italic"
                                    >
                                        Tidak ada anggota dengan kata kunci &ldquo;{memberSearch}&rdquo;.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
