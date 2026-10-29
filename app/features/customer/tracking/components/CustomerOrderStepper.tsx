import { cn } from "~/lib/utils";
import type { CustomerOrderStepperProps } from "~/types";

export function CustomerOrderStepper({
    order,
    stages,
    currentStageIndex,
    displayStatus,
    variant = "desktop",
    mobileHeaderMode = "orderId",
    children,
}: CustomerOrderStepperProps) {
    if (variant === "mobile") {
        return (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex justify-between items-start gap-3 mb-10">
                    {mobileHeaderMode === "productTitle" ? (
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-1">
                                Produk
                            </p>
                            <h2 className="text-base font-black text-slate-900 uppercase italic">
                                {order.details?.[0]?.productTitle || "Custom Jersey"}
                            </h2>
                        </div>
                    ) : (
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-1">
                                Order ID
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-black text-slate-900 font-mono tracking-tighter">
                                    {order.orderId}
                                </h2>
                                {order.queueNumber && (
                                    <span className="bg-[#D25026]/10 text-[#D25026] px-2.5 py-1 rounded-md text-xs font-black uppercase italic border border-[#D25026]/20">
                                        Antrean: {order.queueNumber}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="text-right shrink-0">
                        <div className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border bg-[#D25026] text-slate-900 border-[#D25026]/20">
                            {displayStatus}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {stages.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIndex;
                        const isActive = idx === currentStageIndex;
                        const Icon = stage.icon;

                        return (
                            <div key={stage.id} className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 border-2 relative z-10",
                                            isCompleted
                                                ? "bg-[#D25026] border-white text-slate-900 shadow-lg shadow-[#D25026]/20"
                                                : "bg-white border-slate-100 text-slate-300"
                                        )}
                                    >
                                        <Icon size={20} className={cn(isActive && "animate-pulse")} />
                                    </div>
                                    {idx !== stages.length - 1 && (
                                        <div
                                            className={cn(
                                                "w-0.5 h-10 -my-1",
                                                isCompleted ? "bg-[#D25026]" : "bg-slate-100"
                                            )}
                                        />
                                    )}
                                </div>
                                <div className="pt-1">
                                    <p
                                        className={cn(
                                            "text-sm font-black uppercase tracking-wider italic",
                                            isCompleted ? "text-slate-900" : "text-slate-400"
                                        )}
                                    >
                                        {stage.label}
                                    </p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5 leading-snug italic">
                                        {stage.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {children}
            </div>
        );
    }

    const progressWidth =
        stages.length > 1 ? `${(currentStageIndex / (stages.length - 1)) * 100}%` : "0%";

    return (
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="flex justify-between items-start mb-16">
                <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 italic">
                        Order Identity
                    </p>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black text-slate-900 font-mono tracking-tighter">
                            {order.orderId}
                        </h2>
                        {order.queueNumber && (
                            <span className="bg-[#D25026]/10 text-[#D25026] px-3.5 py-1.5 rounded-xl text-sm font-black italic border border-[#D25026]/20">
                                No. Antrean: {order.queueNumber}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 italic">
                        Current Status
                    </p>
                    <div className="flex items-center gap-2.5 justify-end">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                        <p className="text-2xl font-black text-[#D25026] uppercase italic">
                            {displayStatus}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="absolute top-8 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#D25026] transition-all duration-1000 ease-out"
                        style={{ width: progressWidth }}
                    />
                </div>

                <div className="relative flex justify-between">
                    {stages.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIndex;
                        const isActive = idx === currentStageIndex;
                        const Icon = stage.icon;

                        return (
                            <div key={stage.id} className="flex flex-col items-center group w-44 text-center">
                                <div
                                    className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 border-4",
                                        isCompleted
                                            ? "bg-[#D25026] border-white text-slate-900 shadow-xl shadow-[#D25026]/30"
                                            : "bg-white border-slate-100 text-slate-300"
                                    )}
                                >
                                    <Icon size={24} className={cn(isActive && "animate-bounce")} />
                                </div>
                                <div className="mt-4 space-y-1">
                                    <p
                                        className={cn(
                                            "text-sm font-black uppercase tracking-wider italic",
                                            isCompleted ? "text-slate-900" : "text-slate-400"
                                        )}
                                    >
                                        {stage.label}
                                    </p>
                                    <p className="text-xs font-medium text-slate-500 leading-snug">
                                        {stage.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {children}
        </div>
    );
}
