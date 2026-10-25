import { 
    ChevronLeft, 
    User, 
    Hash, 
    Ruler, 
    Upload, 
    FileText, 
    CheckCircle2, 
    ArrowRight, 
    CreditCard, 
    ShoppingCart,
    Info,
    FileUp,
    AlertCircle,
    Loader2,
    X,
    ClipboardPaste,
    Plus,
    Minus,
    Trash2
} from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useNavigate } from "react-router";
import { Toast } from "~/components/ui/toast";
import { UPLOADS_URL } from "~/api/client";
import { useCustomJerseyCheckout } from "~/hooks";


export function CustomJerseyCheckoutMobile({ title }: { title: string }) {
    const navigate = useNavigate();
    const {
        step,
        setStep,
        activeProduct,
        availableKg,
        customDetails,
        designNote,
        setDesignNote,
        designReferenceFile,
        setDesignReferenceFile,
        paymentProofFile,
        setPaymentProofFile,
        paymentType,
        setPaymentType,
        dpAmountInput,
        setDpAmountInput,
        pdfFile,
        setPdfFile,
        isUploading,
        uploadProgress,
        shippingMethod,
        setShippingMethod,
        shippingAddress,
        setShippingAddress,
        pasteText,
        setPasteText,
        isPasteDialogOpen,
        setIsPasteDialogOpen,
        textareaRef,
        isResetDialogOpen,
        setIsResetDialogOpen,
        playerCountInput,
        setPlayerCountInput,
        showValidation,
        totalRequiredKg,
        isOverLimit,
        toast,
        setToast,
        user,
        existingOrder,
        setExistingOrder,
        isEditing,
        steps,
        formatRupiah,
        getSizeSurcharge,
        generateTable,
        resetTable,
        parsePasteData,
        handleTextareaKeyDown,
        handleTextareaPaste,
        removeUnit,
        updateUnitQuantity,
        handleDetailChange,
        handlePdfImport,
        handleNextStep,
        handleSubmit,
        totalCalculated,
        effectivePaidAmount,
        effectiveRemainingAmount,
    } = useCustomJerseyCheckout();

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-['Inter']">
            {/* Mobile Header */}
            <div className="bg-white px-5 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 z-50 shrink-0">
                <div className="flex items-center gap-1">
                    <button onClick={() => navigate("/customer/custom-jersey")} className="p-2 -ml-2 text-neutral-400 hover:text-black">
                        <X className="w-5 h-5" />
                    </button>
                    {step > 1 && (
                        <button onClick={() => setStep(s => s - 1)} className="p-1 text-neutral-400 hover:text-black border-l border-neutral-200 pl-2">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#D25026] rounded-lg flex items-center justify-center">
                            <ShoppingCart className="text-white w-3.5 h-3.5" />
                        </div>
                        <span className="font-black italic uppercase text-xs tracking-tighter text-neutral-900">Checkout</span>
                    </div>
                    <p className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mt-1 italic leading-none">{user?.username || "Guest User"}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100">
                    <User className="w-4 h-4 text-neutral-300" />
                </div>
            </div>

            {/* Step Indicator Mobile */}
            <div className="px-5 py-6 bg-white border-b border-neutral-100 shrink-0">
                <div className="flex items-center justify-between">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2 flex-1 relative">
                            {s !== 1 && <div className={cn("absolute left-0 right-1/2 top-4 h-0.5 -translate-x-1/2 w-full", step >= s ? "bg-[#D25026]" : "bg-neutral-100")}></div>}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black z-10 transition-all",
                                step === s ? "bg-black text-white shadow-lg" : 
                                step > s ? "bg-[#D25026] text-white" : "bg-neutral-100 text-neutral-400"
                            )}>
                                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                            </div>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest italic", step === s ? "text-neutral-900" : "text-neutral-300")}>
                                {s === 1 ? "Players" : s === 2 ? "Design" : "Payment"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {activeProduct && (
                <div className="bg-[#FFF0EB] px-5 py-2.5 border-b border-[#FFD9CD] flex items-center justify-between text-[10px] font-black uppercase tracking-wider italic text-[#D25026] shrink-0 gap-3">
                    <div className="flex items-center gap-2">
                        {activeProduct.image && (
                            <img 
                                src={activeProduct.image} 
                                alt={activeProduct.title} 
                                className="w-6 h-6 rounded-md object-cover border border-[#FFD9CD]" 
                            />
                        )}
                        <span>Bahan Baku:</span>
                    </div>
                    <span>{activeProduct.title}</span>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-8 space-y-8">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeProduct?.status === "Habis" && (
                            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-2.5 mb-4">
                                <Info className="w-4.5 h-4.5 text-[#D25026] shrink-0 mt-0.5" />
                                <div className="text-[10px] font-bold uppercase tracking-tight text-[#B34320] leading-relaxed">
                                    Pemberitahuan: Bahan jersey "{activeProduct.title}" sedang tidak tersedia / habis. Anda tetap dapat melanjutkan pemesanan, dan Admin akan menghubungi Anda setelah checkout untuk merekomendasikan bahan alternatif yang tersedia.
                                </div>
                            </div>
                        )}
                        {isOverLimit && (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-2.5 mb-4">
                                <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                                <div className="text-[10px] font-bold uppercase tracking-tight text-red-800 leading-relaxed">
                                    Kebutuhan bahan baku melebihi ketersediaan di gudang! (Dibutuhkan: {totalRequiredKg.toFixed(2)} kg, Tersedia: {availableKg.toFixed(2)} kg).
                                    <span className="block mt-1 text-[#B34320] font-extrabold normal-case">
                                        Stok bahan "{activeProduct?.title}" saat ini hanya cukup untuk {Math.floor(availableKg / (totalRequiredKg / customDetails.length))} pcs jersey dengan kombinasi Anda.
                                        Silakan kurangi pesanan Anda sebanyak {Math.max(1, customDetails.length - Math.floor(availableKg / (totalRequiredKg / customDetails.length)))} pcs atau ubah ukuran/tipe lengan ke yang lebih kecil/pendek.
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black italic uppercase tracking-tighter">Player Info</h2>
                                {activeProduct && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFF0EB] text-[#D25026] border border-[#FFD9CD] rounded-full text-[9px] font-black uppercase tracking-wider italic">
                                        {activeProduct.image && (
                                            <img 
                                                src={activeProduct.image} 
                                                alt={activeProduct.title} 
                                                className="w-3.5 h-3.5 rounded-full object-cover border border-[#FFD9CD]" 
                                            />
                                        )}
                                        Bahan: {activeProduct.title}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2 flex-wrap justify-end">
                                <div className="flex items-center gap-1.5 bg-white rounded-xl border border-neutral-200 p-1">
                                    <Input 
                                        type="number" 
                                        placeholder="Jml" 
                                        value={playerCountInput} 
                                        onChange={(e) => setPlayerCountInput(e.target.value)}
                                        className="w-16 rounded-lg h-7 border-none focus-visible:ring-0 text-[10px] font-bold bg-transparent px-2"
                                    />
                                    <Button onClick={generateTable} variant="default" className="rounded-lg h-7 px-2 bg-black text-white hover:bg-neutral-800 text-[9px] font-black uppercase tracking-widest italic transition-all shadow-sm">
                                        Buat
                                    </Button>
                                </div>
                                
                                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="rounded-xl h-9 px-2 border-neutral-200 text-[9px] font-black uppercase italic flex gap-1 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-3xl p-6 w-[calc(100vw-2.5rem)] max-w-sm">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-black italic uppercase tracking-tighter">Reset Tabel?</DialogTitle>
                                            <DialogDescription className="text-[10px] font-medium text-neutral-500 italic mt-1">
                                                Seluruh data pemain yang sudah dimasukkan akan dihapus secara permanen.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex gap-2 mt-6">
                                            <Button onClick={() => setIsResetDialogOpen(false)} variant="ghost" className="flex-1 rounded-xl h-10 text-[9px] font-black uppercase italic">Batal</Button>
                                            <Button onClick={resetTable} variant="destructive" className="flex-1 rounded-xl h-10 text-[9px] font-black uppercase italic shadow-lg shadow-red-500/20">Reset</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={isPasteDialogOpen} onOpenChange={setIsPasteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 border-neutral-200 text-[9px] font-black uppercase italic flex gap-1.5">
                                            <ClipboardPaste className="w-3 h-3" />
                                            PASTE
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[calc(100vw-2rem)] max-w-lg rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                                        <div className="relative h-24 bg-black flex flex-col justify-center px-8 shrink-0">
                                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 0.0625rem 0.0625rem, white 0.0625rem, transparent 0)', backgroundSize: '1rem 1rem' }}></div>
                                            <DialogTitle className="text-lg font-black italic uppercase tracking-tighter text-white">Paste Player List</DialogTitle>
                                            <DialogDescription className="text-neutral-400 font-medium text-[10px]">Format: No. Nama Nomor_Punggung Ukuran Lengan (opsional)</DialogDescription>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                            <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-4 mb-4 flex items-start gap-2.5">
                                                <Info className="w-3.5 h-3.5 text-[#D25026] mt-0.5 shrink-0" />
                                                <div className="text-[10px] leading-relaxed text-neutral-600 font-medium">
                                                    <p className="font-bold text-slate-800 mb-0.5">Panduan Penginputan:</p>
                                                    <p>• Tulis list <span className="font-bold">No, Nama, No Punggung, Ukuran, Lengan</span>.</p>
                                                    <p>• Kosongkan lengan untuk otomatis <span className="font-bold">Lengan Pendek</span>.</p>
                                                    <p>• Contoh: <span className="italic">1. BAYU 10 L Pendek</span> atau <span className="italic">2. YUSUF 23 XL Panjang</span></p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-neutral-400 ml-1 italic">Paste Your List Here</Label>
                                                <Textarea 
                                                    ref={textareaRef}
                                                    value={pasteText}
                                                    onChange={(e) => setPasteText(e.target.value)}
                                                    onKeyDown={handleTextareaKeyDown}
                                                    onPaste={handleTextareaPaste}
                                                    placeholder={"1. BAYU, 10, L, Pendek\n2. YUSUF, 23, XL, Lengan Panjang"}
                                                    className="min-h-[14rem] rounded-2xl border-neutral-100 text-sm p-4 focus:ring-[#D25026]/10 bg-neutral-50 resize-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-6 pt-4 border-t border-neutral-50 bg-white shrink-0">
                                            <div className="flex gap-2">
                                                <Button onClick={() => setIsPasteDialogOpen(false)} variant="ghost" className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest italic">Cancel</Button>
                                                <Button onClick={parsePasteData} className="flex-[2] rounded-xl h-12 bg-[#D25026] text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-[#D25026]/20">Process</Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <div className="relative">
                                    <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 z-10" />
                                    <Button variant="outline" size="sm" className="rounded-xl h-9 border-neutral-200 text-[9px] font-black uppercase italic flex gap-1.5">
                                        <FileText className="w-3 h-3" />
                                        PDF
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {pdfFile && (
                            <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3 border border-emerald-100">
                                <FileText className="text-emerald-500 w-5 h-5" />
                                <span className="text-[11px] font-bold text-emerald-900 truncate flex-1">{pdfFile.name}</span>
                                <button onClick={() => setPdfFile(null)}><X className="w-4 h-4 text-emerald-400" /></button>
                            </div>
                        )}

                        {!pdfFile && (
                                <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-xl overflow-hidden relative ring-1 ring-black/5">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[5rem] pointer-events-none"></div>
                                    <div className="overflow-x-auto relative z-10 custom-scrollbar pb-2">
                                        <table className="w-full text-left border-collapse min-w-[48rem]">
                                            <thead>
                                                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                                    <th className="p-4 pl-5 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic w-12 text-center">No</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic w-full">Nama</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic text-center w-16 whitespace-nowrap">No. Punggung</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic text-center w-[150px] whitespace-nowrap">Ukuran Baju</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic text-center w-[110px] whitespace-nowrap">Lengan</th>
                                                    <th className="p-4 pr-5 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic text-right w-14"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {customDetails.map((detail, index) => (
                                                    <tr key={detail.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                                        <td className="p-3 pl-5 text-center">
                                                            <span className="text-[11px] font-black text-neutral-400">{index + 1}</span>
                                                        </td>
                                                        <td className="p-3">
                                                            <Input 
                                                                value={detail.name}
                                                                onChange={(e) => handleDetailChange(detail.id, "name", e.target.value)}
                                                                placeholder="NAMA" 
                                                                className={cn(
                                                                    "h-9 rounded-xl border-neutral-200 focus:ring-[#D25026]/10 focus:border-[#D25026]/30 bg-white text-xs font-black uppercase text-black placeholder:text-neutral-800 px-3 transition-all",
                                                                    showValidation && !detail.name.trim() && "border-red-500 bg-red-50/30"
                                                                )}
                                                            />
                                                        </td>
                                                        <td className="p-3">
                                                            <Input 
                                                                value={detail.number}
                                                                onChange={(e) => handleDetailChange(detail.id, "number", e.target.value)}
                                                                placeholder="00" 
                                                                className={cn(
                                                                    "h-9 rounded-xl border-neutral-200 focus:ring-[#D25026]/10 focus:border-[#D25026]/30 bg-white text-sm font-black text-center text-black placeholder:text-neutral-800 px-2 transition-all",
                                                                    showValidation && !detail.number.trim() && "border-red-500 bg-red-50/30"
                                                                )}
                                                            />
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl h-9 w-max mx-auto border border-neutral-200">
                                                                {["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map(size => (
                                                                    <button
                                                                        key={size}
                                                                        onClick={() => handleDetailChange(detail.id, "size", size)}
                                                                        className={cn(
                                                                            "w-7 rounded-lg text-[10px] font-black transition-all",
                                                                            detail.size === size 
                                                                                ? "bg-black text-white shadow-md shadow-black/10" 
                                                                                : "text-neutral-600 hover:text-black hover:bg-neutral-200"
                                                                        )}
                                                                    >
                                                                        {size}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl h-9 w-max mx-auto border border-neutral-200">
                                                                {[
                                                                    { value: "Lengan Pendek", label: "Pendek" },
                                                                    { value: "Lengan Panjang", label: "Panjang" }
                                                                ].map(sleeve => (
                                                                    <button
                                                                        key={sleeve.value}
                                                                        onClick={() => handleDetailChange(detail.id, "sleeve", sleeve.value)}
                                                                        className={cn(
                                                                            "px-2 rounded-lg text-[10px] font-black transition-all",
                                                                            (detail.sleeve || "Lengan Pendek") === sleeve.value 
                                                                                ? "bg-[#D25026] text-white shadow-md shadow-[#D25026]/10" 
                                                                                : "text-neutral-600 hover:text-black hover:bg-neutral-200"
                                                                        )}
                                                                    >
                                                                        {sleeve.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-3 pr-5 text-right">
                                                            <button 
                                                                onClick={() => removeUnit(detail.id)}
                                                                className="w-8 h-8 bg-red-50 text-red-500 rounded-xl inline-flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all ml-auto"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-black italic uppercase tracking-tighter">Design Reference</h2>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase italic text-neutral-400">Catatan Desain</Label>
                                <Textarea 
                                    value={designNote}
                                    onChange={(e) => setDesignNote(e.target.value)}
                                    placeholder="Warna logo, sponsor, dll..." 
                                    className="min-h-[180px] rounded-2xl border-neutral-100 p-4 text-sm"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase italic text-neutral-400">Referensi Gambar</Label>
                                <div className="h-48 border-2 border-dashed border-neutral-100 rounded-3xl bg-white flex flex-col items-center justify-center gap-3 relative overflow-hidden group transition-all active:scale-95">
                                    {designReferenceFile || existingOrder?.designUrl ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4">
                                            {designReferenceFile ? (
                                                (designReferenceFile.type.includes("pdf") || designReferenceFile.name.toLowerCase().endsWith(".pdf")) ? (
                                                    <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-2 border border-red-100">
                                                        <FileText className="w-8 h-8 text-red-500" />
                                                    </div>
                                                ) : (
                                                    <img src={URL.createObjectURL(designReferenceFile)} className="w-full h-full object-contain mb-1 rounded-xl" />
                                                )
                                            ) : (
                                                existingOrder.designUrl.toLowerCase().endsWith(".pdf") ? (
                                                    <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-2 border border-red-100">
                                                        <FileText className="w-8 h-8 text-red-500" />
                                                    </div>
                                                ) : (
                                                    <img src={existingOrder.designUrl.startsWith('http') ? existingOrder.designUrl : `${UPLOADS_URL}${existingOrder.designUrl.startsWith('/') ? '' : '/'}${existingOrder.designUrl}`} className="w-full h-full object-contain mb-1 rounded-xl" />
                                                )
                                            )}
                                            <p className="text-[9px] font-black uppercase text-neutral-400 truncate w-full text-center px-4 italic">
                                                {designReferenceFile ? designReferenceFile.name : "Existing Design"}
                                            </p>
                                            
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDesignReferenceFile(null);
                                                    if (existingOrder) {
                                                        setExistingOrder((prev: any) => ({ ...prev, designUrl: "" }));
                                                    }
                                                }}
                                                className="absolute top-2 right-2 z-20 w-7 h-7 bg-white text-red-500 rounded-full flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-md"
                                                title="Remove File"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center">
                                                <FileUp className="w-6 h-6 text-neutral-300" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase italic text-neutral-400">Click to Upload</span>
                                        </>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*,.pdf"
                                        className="absolute inset-0 opacity-0 z-10 cursor-pointer" 
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setDesignReferenceFile(file);
                                                setToast({ show: true, message: "Design reference uploaded!", variant: "success" });
                                            }
                                        }} 
                                    />
                                </div>

                                {/* Opsi Pengiriman Mobile */}
                                <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm space-y-4">
                                    <div>
                                        <h3 className="text-xs font-black uppercase italic tracking-tighter text-neutral-900">Opsi Pengiriman</h3>
                                        <p className="text-neutral-400 text-[9px] font-bold mt-1">Pilih metode pengiriman pesanan jersey Anda.</p>
                                    </div>

                                    <div className="flex gap-2">
                                        {[
                                            { value: "PICKUP", label: "Ambil di Toko" },
                                            { value: "COD", label: "COD" }
                                        ].map((method) => (
                                            <button
                                                key={method.value}
                                                type="button"
                                                onClick={() => setShippingMethod(method.value)}
                                                className={cn(
                                                    "flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider italic border transition-all duration-300",
                                                    shippingMethod === method.value
                                                        ? "bg-black text-white border-black shadow-md"
                                                        : "bg-white text-neutral-600 border-neutral-200"
                                                )}
                                            >
                                                {method.label}
                                            </button>
                                        ))}
                                    </div>

                                    {shippingMethod === "PICKUP" ? (
                                        <div className="bg-orange-50/50 border border-orange-100/50 rounded-xl p-4 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-300">
                                            <Info className="text-[#D25026] w-4 h-4 mt-0.5 shrink-0" />
                                            <div className="text-[10px] leading-relaxed text-neutral-600">
                                                <p className="font-bold text-[#D25026] mb-0.5">Ambil di Tempat:</p>
                                                <p>Kunjungi toko kami secara langsung setelah pesanan selesai diproduksi.</p>
                                                <p className="font-bold text-neutral-900 mt-1.5">Alamat:</p>
                                                <p className="font-mono text-neutral-800 bg-white/70 p-2 rounded border border-orange-100 mt-0.5">
                                                    Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                                            <Label className="text-[9px] font-black uppercase tracking-wider text-neutral-400 italic">Alamat Tujuan COD</Label>
                                            <Textarea
                                                value={shippingAddress}
                                                onChange={(e) => setShippingAddress(e.target.value)}
                                                placeholder="Tulis alamat pengiriman secara detail..."
                                                className={cn(
                                                    "min-h-[80px] rounded-xl border-neutral-150 p-4 bg-neutral-50/50 text-xs font-medium leading-normal",
                                                    showValidation && shippingAddress.trim() === "" && "border-red-500 bg-red-50/20"
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
                        <h2 className="text-xl font-black italic uppercase tracking-tighter">Payment Details</h2>

                        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="w-16 h-8 bg-[#00529C] rounded flex items-center justify-center font-black text-white italic tracking-tighter text-lg">BCA</div>
                                <span className="text-[9px] font-black uppercase italic text-emerald-500">Official</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase italic text-neutral-300">Account Number</span>
                                <p className="text-2xl font-black italic tracking-tighter">4921 8972 72</p>
                                <p className="text-[10px] font-black uppercase italic text-neutral-900 mt-1">AN. BAHRUDIN YUSUF</p>
                            </div>
                        </div>

                        {/* Metode Pembayaran Mobile (Full Cash vs DP) */}
                        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest italic text-neutral-400">Metode Pembayaran</h3>
                                    <p className="text-[11px] text-neutral-600 font-medium mt-0.5">Pilih pembayaran penuh atau DP</p>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-50 text-[#D25026]">
                                    {paymentType === "DP" ? "Opsi DP" : "Full 100%"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setPaymentType("FULL")}
                                    className={cn(
                                        "min-h-[52px] p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between active:scale-98",
                                        paymentType === "FULL"
                                            ? "border-[#D25026] bg-[#FFF0EB]/40 shadow-xs"
                                            : "border-neutral-100 bg-neutral-50/50"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-tight text-neutral-900">Full Cash</span>
                                        <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center", paymentType === "FULL" ? "border-[#D25026] bg-[#D25026]" : "border-neutral-300")}>
                                            {paymentType === "FULL" && <div className="w-1 h-1 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 font-medium mt-1">Lunas langsung</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setPaymentType("DP");
                                        if (!dpAmountInput || dpAmountInput <= 0) {
                                            setDpAmountInput(Math.round(totalCalculated * 0.5));
                                        }
                                    }}
                                    className={cn(
                                        "min-h-[52px] p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between active:scale-98",
                                        paymentType === "DP"
                                            ? "border-[#D25026] bg-[#FFF0EB]/40 shadow-xs"
                                            : "border-neutral-100 bg-neutral-50/50"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-tight text-neutral-900">DP (Uang Muka)</span>
                                        <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center", paymentType === "DP" ? "border-[#D25026] bg-[#D25026]" : "border-neutral-300")}>
                                            {paymentType === "DP" && <div className="w-1 h-1 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 font-medium mt-1">Bayar sebagian</p>
                                </button>
                            </div>

                            {paymentType === "DP" && (
                                <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-bold text-amber-900">Nominal DP (Rp)</label>
                                        <button
                                            type="button"
                                            onClick={() => setDpAmountInput(Math.round(totalCalculated * 0.5))}
                                            className="text-[9px] font-black uppercase tracking-wider text-[#D25026] bg-white px-2 py-1 rounded-lg border border-orange-200 shadow-2xs active:bg-orange-50"
                                        >
                                            Preset 50%
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-xs">Rp</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={totalCalculated}
                                            value={dpAmountInput || ""}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setDpAmountInput(val);
                                            }}
                                            placeholder={`Contoh: ${Math.round(totalCalculated * 0.5)}`}
                                            className="w-full pl-9 pr-3 py-2 bg-white border border-amber-300/80 rounded-xl text-xs font-bold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-amber-200/40">
                                        <span className="text-amber-800 font-medium">Sisa Tagihan:</span>
                                        <span className="font-black text-rose-600">
                                            {formatRupiah(effectiveRemainingAmount)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Card Mobile */}
                        <div className="bg-black rounded-[2rem] p-6 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600/20 blur-[2.5rem] rounded-full z-0"></div>
                            <div className="space-y-3 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase italic text-white/40">Item Total</span>
                                    <span className="text-xs font-black text-white italic">{customDetails.length} Units</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase italic text-white/40">Metode</span>
                                    <span className="text-xs font-black text-amber-400 italic">{paymentType === "DP" ? "DP (Uang Muka)" : "Full Cash"}</span>
                                </div>
                                <div className="h-px bg-white/10 my-1"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black uppercase italic text-white">Total Tagihan</span>
                                    <span className="text-base font-black text-white italic tracking-tighter">{formatRupiah(totalCalculated)}</span>
                                </div>
                                {paymentType === "DP" && (
                                    <>
                                        <div className="flex justify-between items-center pt-1 border-t border-white/5">
                                            <span className="text-[11px] font-medium text-neutral-400">Dibayar DP:</span>
                                            <span className="text-sm font-black text-[#D25026] italic">{formatRupiah(effectivePaidAmount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] font-medium text-neutral-400">Sisa Tagihan:</span>
                                            <span className="text-sm font-black text-rose-400 italic">{formatRupiah(effectiveRemainingAmount)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase italic text-neutral-400">Bukti Pembayaran (DP/Lunas)</Label>
                            <div className={cn(
                                "h-64 border-2 border-dashed border-neutral-100 rounded-[2rem] bg-white flex flex-col items-center justify-center gap-3 relative overflow-hidden active:scale-95 transition-transform",
                                showValidation && step === 3 && !paymentProofFile && !existingOrder?.paymentUrl && "border-red-500 bg-red-50/10"
                            )}>
                                {paymentProofFile || existingOrder?.paymentUrl ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4">
                                        {paymentProofFile ? (
                                            (paymentProofFile.type.includes("pdf") || paymentProofFile.name.toLowerCase().endsWith(".pdf")) ? (
                                                <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-2 border border-red-100">
                                                    <FileText className="w-8 h-8 text-red-500" />
                                                </div>
                                            ) : (
                                                <img src={URL.createObjectURL(paymentProofFile)} className="w-full h-full object-contain mb-1 rounded-xl" />
                                            )
                                        ) : (
                                            existingOrder.paymentUrl.toLowerCase().endsWith(".pdf") ? (
                                                <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-2 border border-red-100">
                                                    <FileText className="w-8 h-8 text-red-500" />
                                                </div>
                                            ) : (
                                                <img src={existingOrder.paymentUrl.startsWith('http') ? existingOrder.paymentUrl : `${UPLOADS_URL}${existingOrder.paymentUrl.startsWith('/') ? '' : '/'}${existingOrder.paymentUrl}`} className="w-full h-full object-contain mb-1 rounded-xl" />
                                            )
                                        )}
                                        <p className="text-[9px] font-black uppercase text-neutral-400 truncate w-full text-center px-4 italic">
                                            {paymentProofFile ? paymentProofFile.name : "Existing Payment Proof"}
                                        </p>
                                        
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPaymentProofFile(null);
                                                if (existingOrder) {
                                                    setExistingOrder((prev: any) => ({ ...prev, paymentUrl: "" }));
                                                }
                                            }}
                                            className="absolute top-2 right-2 z-20 w-7 h-7 bg-white text-red-500 rounded-full flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-md"
                                            title="Remove File"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center">
                                            <CreditCard className="w-8 h-8 text-neutral-300" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase italic text-neutral-400">Upload Receipt</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*,.pdf"
                                    className="absolute inset-0 opacity-0 z-10 cursor-pointer" 
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setPaymentProofFile(file);
                                            setToast({ show: true, message: "Payment proof uploaded!", variant: "success" });
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Footer Sticky */}
            <div className="bg-white border-t border-neutral-100 p-5 sticky bottom-0 z-50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase italic text-neutral-400">
                        {step === 3 ? "Grand Total" : "Subtotal"}
                    </span>
                    <span className="text-xl font-black italic tracking-tighter text-[#D25026]">
                        {formatRupiah(totalCalculated)}
                    </span>
                </div>
                
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => step === 1 ? navigate(-1) : setStep(s => s - 1)}
                        className="flex-1 h-12 rounded-xl border-neutral-100 text-xs font-black uppercase italic"
                    >
                        {step === 1 ? "Exit" : "Back"}
                    </Button>
                    <Button 
                        onClick={() => step === 3 ? handleSubmit() : handleNextStep()}
                        disabled={isUploading || (step === 3 && !paymentProofFile && !existingOrder?.paymentUrl)}
                        className="flex-[2] h-12 rounded-xl bg-[#D25026] text-white text-xs font-black uppercase italic shadow-lg shadow-[#D25026]/20"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : (step === 3 ? "Complete Order" : "Next Step")}
                    </Button>
                </div>

                {isUploading && (
                    <div className="mt-4 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#D25026] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}
            </div>

            {toast.show && (
                <Toast 
                    title={toast.message} 
                    variant={toast.variant} 
                    onClose={() => setToast((prev: any) => ({ ...prev, show: false }))} 
                />
            )}
        </div>
    );
}
