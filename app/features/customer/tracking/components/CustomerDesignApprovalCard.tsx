import { FileText, Eye } from "lucide-react";
import { useCustomerDesignApprovalCard } from "~/hooks";
import type { CustomerDesignApprovalCardProps } from "~/types";

export function CustomerDesignApprovalCard({
    mode,
    variant = "desktop",
    fileUrl,
    status,
    feedback,
    interactive = true,
    canUnapprove = false,
    submittingAction = false,
    showRevisiForm = false,
    onToggleRevisiForm,
    feedbackInput = "",
    onFeedbackInputChange,
    onApprove,
    onUnapprove,
    onSubmitRevisi,
    className = "",
}: CustomerDesignApprovalCardProps) {
    const {
        isDesign,
        resolvedUrl,
        isPdf,
        title,
        description,
        statusPrefix,
        approveButtonLabel,
        revisiFormLabel,
        revisiPlaceholder,
        submitRevisiLabel,
        approvedMessage,
        handleStartRevisi,
        handleCancelRevisi,
        handleEditRevisiNote,
    } = useCustomerDesignApprovalCard({
        mode,
        variant,
        fileUrl,
        feedback,
        interactive,
        onToggleRevisiForm,
        onFeedbackInputChange,
    });

    if (!fileUrl) return null;

    if (variant === "mobile") {
        return (
            <div className={`bg-slate-900 text-white p-6 rounded-[2rem] border border-slate-800 shadow-xl space-y-6 ${className}`}>
                <h3 className="text-base font-black uppercase tracking-widest text-[#D25026] italic">
                    {title}
                </h3>
                <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
                    {description}
                </p>

                <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 italic">
                        {statusPrefix}
                    </span>
                    {status === "SENT" && (
                        <span className="bg-amber-500 text-slate-950 px-3 py-1 rounded-lg text-xs font-black italic">
                            Menunggu Persetujuan
                        </span>
                    )}
                    {status === "APPROVED" && (
                        <span className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-lg text-xs font-black italic">
                            Disetujui
                        </span>
                    )}
                    {status === "REVISI" && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-black italic">
                            Revisi Diajukan
                        </span>
                    )}
                </div>

                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-2">
                    {isPdf ? (
                        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 gap-3 rounded-xl">
                            <FileText size={32} className="text-red-500" />
                            <p className="text-xs font-black text-slate-900 uppercase italic">
                                {isDesign ? "Mockup PDF" : "Layout PDF"}
                            </p>
                            <a
                                href={resolvedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2.5 bg-red-500 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-1.5 italic"
                            >
                                <Eye size={14} /> Buka PDF
                            </a>
                        </div>
                    ) : (
                        <img
                            src={resolvedUrl}
                            alt={title}
                            className="w-full h-auto max-h-[220px] object-contain mx-auto rounded-xl"
                        />
                    )}
                </div>

                {interactive && status === "SENT" && !showRevisiForm && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <div className="flex gap-2.5">
                            <button
                                onClick={onApprove}
                                disabled={submittingAction}
                                className="flex-1 bg-emerald-500 text-slate-950 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest italic flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                            >
                                {approveButtonLabel}
                            </button>
                            <button
                                onClick={handleStartRevisi}
                                className="flex-1 bg-red-500 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest italic flex items-center justify-center gap-1.5 active:scale-95"
                            >
                                Ajukan Revisi
                            </button>
                        </div>
                    </div>
                )}

                {interactive && showRevisiForm && (status === "SENT" || status === "REVISI") && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <div className="space-y-2.5">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest italic">
                                {revisiFormLabel}
                            </label>
                            <textarea
                                value={feedbackInput}
                                onChange={(e) => onFeedbackInputChange?.(e.target.value)}
                                placeholder={revisiPlaceholder}
                                rows={3}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#D25026]"
                            />
                            <div className="flex gap-2.5">
                                <button
                                    onClick={onSubmitRevisi}
                                    disabled={submittingAction || !feedbackInput.trim()}
                                    className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-black text-xs uppercase tracking-widest italic disabled:opacity-50"
                                >
                                    {submitRevisiLabel}
                                </button>
                                <button
                                    onClick={handleCancelRevisi}
                                    className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest italic"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {interactive && status === "REVISI" && feedback && !showRevisiForm && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-3">
                        <div className="space-y-1">
                            <p className="text-xs font-black text-red-400 uppercase tracking-widest italic">
                                {isDesign ? "Catatan Revisi:" : "Catatan Revisi Layout:"}
                            </p>
                            <p className="text-sm text-red-200 font-bold leading-relaxed italic">
                                &ldquo;{feedback}&rdquo;
                            </p>
                        </div>
                        <div className="flex justify-between items-center gap-2 pt-1">
                            <p className="text-xs text-slate-400 italic">
                                Menunggu update dari desainer.
                            </p>
                            <button
                                onClick={handleEditRevisiNote}
                                className="bg-[#D25026]/10 text-[#D25026] px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest italic shrink-0"
                            >
                                Edit Catatan
                            </button>
                        </div>
                    </div>
                )}

                {interactive && status === "APPROVED" && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                        <p className="text-sm text-emerald-300 font-bold italic">
                            {approvedMessage}
                        </p>
                        {canUnapprove && (
                            <button
                                onClick={onUnapprove}
                                disabled={submittingAction}
                                className="mt-3 bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest italic w-fit active:scale-95 transition-all shadow-md disabled:opacity-50"
                            >
                                Batal Setuju
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`bg-slate-900 text-white rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden ${className}`}>
            <div className="relative z-10 flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black uppercase tracking-widest text-[#D25026] italic">
                            {title}
                        </h3>
                    </div>
                    <p className="text-base text-slate-300 font-medium italic leading-relaxed">
                        {description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 italic">
                            {statusPrefix}
                        </span>
                        {status === "SENT" && (
                            <span className="bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl text-sm font-black italic">
                                {interactive ? "Menunggu Persetujuan Anda" : "Menunggu Persetujuan"}
                            </span>
                        )}
                        {status === "APPROVED" && (
                            <span className="bg-emerald-500 text-slate-950 px-3.5 py-1.5 rounded-xl text-sm font-black italic">
                                Disetujui
                            </span>
                        )}
                        {status === "REVISI" && (
                            <span className="bg-red-500 text-white px-3.5 py-1.5 rounded-xl text-sm font-black italic">
                                Revisi Diajukan
                            </span>
                        )}
                    </div>

                    {interactive && status === "SENT" && !showRevisiForm && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div className="flex gap-4">
                                <button
                                    onClick={onApprove}
                                    disabled={submittingAction}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest italic flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    {approveButtonLabel}
                                </button>
                                <button
                                    onClick={handleStartRevisi}
                                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest italic flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                                >
                                    Ajukan Revisi
                                </button>
                            </div>
                        </div>
                    )}

                    {interactive && showRevisiForm && (status === "SENT" || status === "REVISI") && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-slate-300 uppercase tracking-widest italic">
                                    {revisiFormLabel}
                                </label>
                                <textarea
                                    value={feedbackInput}
                                    onChange={(e) => onFeedbackInputChange?.(e.target.value)}
                                    placeholder={revisiPlaceholder}
                                    rows={3}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder:text-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-[#D25026] focus:border-transparent"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={onSubmitRevisi}
                                        disabled={submittingAction || !feedbackInput.trim()}
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest italic disabled:opacity-50"
                                    >
                                        {submitRevisiLabel}
                                    </button>
                                    <button
                                        onClick={handleCancelRevisi}
                                        className="bg-slate-800 text-slate-300 hover:text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest italic"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {interactive && status === "REVISI" && feedback && !showRevisiForm && (
                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-red-400 uppercase tracking-widest italic">
                                    {isDesign ? "Catatan Revisi Anda:" : "Catatan Revisi Layout Anda:"}
                                </p>
                                <p className="text-base text-red-200 font-bold leading-relaxed italic">
                                    &ldquo;{feedback}&rdquo;
                                </p>
                            </div>
                            <div className="flex justify-between items-center gap-4 pt-2">
                                <p className="text-xs text-slate-300 italic">
                                    {isDesign
                                        ? "Menunggu desainer memperbarui mockup berdasarkan feedback Anda."
                                        : "Menunggu desainer memperbarui layout berdasarkan feedback Anda."}
                                </p>
                                <button
                                    onClick={handleEditRevisiNote}
                                    className="bg-[#D25026]/10 text-[#D25026] hover:bg-[#D25026]/20 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest italic transition-all shrink-0"
                                >
                                    Edit Catatan Revisi
                                </button>
                            </div>
                        </div>
                    )}

                    {interactive && status === "APPROVED" && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                            <p className="text-base text-emerald-300 font-bold italic">
                                {approvedMessage}
                            </p>
                            {canUnapprove && (
                                <button
                                    onClick={onUnapprove}
                                    disabled={submittingAction}
                                    className="mt-3 bg-red-500/90 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest italic w-fit active:scale-95 transition-all shadow-md disabled:opacity-50"
                                >
                                    Batal Setuju
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-96 space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-2">
                        {isDesign ? "Preview Mockup:" : "Preview Layout:"}
                    </p>
                    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center p-3">
                        {isPdf ? (
                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 gap-4 w-full rounded-2xl">
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                    <FileText size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-slate-900 uppercase italic">
                                        Dokumen PDF
                                    </p>
                                    <p className="text-xs font-bold text-slate-500 uppercase mt-1">
                                        {isDesign ? "Mockup Desain" : "Mockup Layout"}
                                    </p>
                                </div>
                                <a
                                    href={resolvedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2 italic shadow-md shadow-red-500/20"
                                >
                                    <Eye size={14} /> Buka PDF
                                </a>
                            </div>
                        ) : (
                            <img
                                src={resolvedUrl}
                                alt={title}
                                className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-2xl"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
