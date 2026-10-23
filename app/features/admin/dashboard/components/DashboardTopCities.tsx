export function DashboardTopCities() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-transparent flex flex-col justify-between">
            <div className="text-slate-900 text-xl font-semibold mb-6">Kota Teratas</div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center w-full relative">
                    <div className="w-full max-w-[90%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-2 px-3 rounded-lg flex items-center justify-between">
                        <span className="text-slate-900 text-sm font-semibold uppercase">JKT</span>
                    </div>
                    <span className="absolute right-0 text-slate-800 text-xs font-semibold">120k</span>
                </div>
                <div className="flex items-center w-full relative">
                    <div className="w-full max-w-[70%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-2 px-3 rounded-lg flex items-center justify-between">
                        <span className="text-slate-900 text-sm font-semibold uppercase">BDG</span>
                    </div>
                    <span className="absolute right-0 text-slate-800 text-xs font-semibold">80k</span>
                </div>
                <div className="flex items-center w-full relative">
                    <div className="w-full max-w-[60%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-2 px-3 rounded-lg flex items-center justify-between">
                        <span className="text-slate-900 text-sm font-semibold uppercase">SBY</span>
                    </div>
                    <span className="absolute right-0 text-slate-800 text-xs font-semibold">70k</span>
                </div>
                <div className="flex items-center w-full relative">
                    <div className="w-full max-w-[45%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-2 px-3 rounded-lg flex items-center justify-between">
                        <span className="text-slate-900 text-sm font-semibold uppercase">SMR</span>
                    </div>
                    <span className="absolute right-0 text-slate-800 text-xs font-semibold">50k</span>
                </div>
            </div>
        </div>
    );
}
