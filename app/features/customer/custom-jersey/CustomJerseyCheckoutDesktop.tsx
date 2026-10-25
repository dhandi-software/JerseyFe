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
    Plus,
    Minus,
    Trash2,
    ClipboardPaste,
    X,
    Mail,
    ShieldCheck
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
import { Card, CardHeader, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useNavigate } from "react-router";
import { Toast } from "~/components/ui/toast";
import { UPLOADS_URL } from "~/api/client";
import { useCustomJerseyCheckout } from "~/hooks";

export function CustomJerseyCheckoutDesktop({ title }: { title: string }) {
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
        <div className="min-h-screen bg-[#FAFAFA] font-['Inter']">
            {/* Top Navigation */}
            <div className="bg-white border-b border-neutral-100 sticky top-0 z-50">
                <div className="w-full px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate("/customer/custom-jersey")}
                            className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors font-bold text-sm group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            BACK TO SHOP
                        </button>
                        {step > 1 && (
                            <button 
                                onClick={() => setStep(prev => prev - 1)}
                                className="flex items-center gap-2 text-neutral-400 hover:text-[#D25026] transition-colors font-bold text-sm group border-l border-neutral-200 pl-6"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                PREVIOUS STEP
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D25026] rounded-xl flex items-center justify-center shadow-lg shadow-[#D25026]/20">
                            <ShoppingCart className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-neutral-900">Checkout Process</h1>
                    </div>
                    <div className="flex items-center gap-8">
                        {activeProduct && (
                            <div className="hidden lg:flex items-center gap-3 pr-8 border-r border-neutral-100">
                                 {activeProduct.image && (
                                     <img 
                                         src={activeProduct.image} 
                                         alt={activeProduct.title} 
                                         className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shadow-sm" 
                                     />
                                 )}
                                 <div className="text-right">
                                     <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic leading-none mb-1">Bahan Baku</p>
                                     <p className="text-xs font-black italic uppercase tracking-tight text-[#D25026]">{activeProduct.title}</p>
                                 </div>
                            </div>
                        )}
                        <div className="hidden xl:flex items-center gap-3 pr-8 border-r border-neutral-100">
                             <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100">
                                 <User className="w-5 h-5 text-neutral-400" />
                             </div>
                             <div>
                                 <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic leading-none mb-1">Ordering as</p>
                                 <p className="text-xs font-black italic uppercase tracking-tight text-neutral-900">{user?.username || "Guest User"}</p>
                             </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Est. Total</p>
                            <p className="text-lg font-black text-[#D25026] tracking-tighter">{formatRupiah(totalCalculated)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="bg-white border-b border-neutral-100">
                <div className="w-full px-8 py-6">
                    <div className="flex items-center justify-center gap-12">
                        {steps.map((s, idx) => {
                            const isActive = step === s.id;
                            const isCompleted = step > s.id;
                            const Icon = s.icon;

                            return (
                                <div key={s.id} className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                        isActive ? "bg-black text-white" : 
                                        isCompleted ? "bg-[#D25026] text-white" : "bg-neutral-50 text-neutral-300"
                                    )}>
                                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className={cn("text-xs font-black uppercase tracking-tighter italic", isActive ? "text-neutral-900" : "text-neutral-400")}>{s.name}</p>
                                        <p className="text-[10px] font-bold text-neutral-300">Step 0{s.id}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <main className="w-full px-8 py-12">
                <div className="space-y-12">
                    {/* Main Content Area */}
                    <div className="w-full">
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="grid grid-cols-1 gap-8">
                                    {/* Order Detail */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-xl font-black text-neutral-900 italic uppercase tracking-tighter">Order Detail</h2>
                                                {activeProduct && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0EB] text-[#D25026] border border-[#FFD9CD] rounded-full text-[10px] font-black uppercase tracking-wider italic">
                                                        {activeProduct.image && (
                                                            <img 
                                                                src={activeProduct.image} 
                                                                alt={activeProduct.title} 
                                                                className="w-4 h-4 rounded-full object-cover border border-[#FFD9CD]" 
                                                            />
                                                        )}
                                                        Bahan: {activeProduct.title}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-3 items-center flex-wrap">
                                                <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 p-1">
                                                    <Input 
                                                        type="number" 
                                                        placeholder="Jml Pemain" 
                                                        value={playerCountInput} 
                                                        onChange={(e) => setPlayerCountInput(e.target.value)}
                                                        className="w-32 rounded-lg h-8 border-none focus-visible:ring-0 text-xs font-bold bg-transparent"
                                                    />
                                                    <Button onClick={generateTable} variant="default" className="rounded-lg h-8 px-4 bg-black text-white hover:bg-neutral-800 text-[10px] font-black uppercase tracking-widest italic transition-all shadow-sm">
                                                        Buat Tabel
                                                    </Button>
                                                </div>

                                                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="rounded-xl h-10 px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Reset
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="rounded-[2rem] p-10 w-full max-w-[25rem] border-none shadow-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-neutral-900">Reset Tabel?</DialogTitle>
                                                            <DialogDescription className="text-sm font-medium text-neutral-500 italic mt-3 leading-relaxed">
                                                                Seluruh data pemain yang sudah Anda masukkan akan dihapus secara permanen dari daftar ini.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="flex gap-4 mt-8">
                                                            <Button onClick={() => setIsResetDialogOpen(false)} variant="ghost" className="flex-1 rounded-2xl h-14 text-xs font-black uppercase tracking-widest italic hover:bg-neutral-50">Batal</Button>
                                                            <Button onClick={resetTable} variant="destructive" className="flex-[1.5] rounded-2xl h-14 bg-red-600 text-white text-xs font-black uppercase tracking-widest italic shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all">Ya, Reset</Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog open={isPasteDialogOpen} onOpenChange={setIsPasteDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="rounded-xl h-10 px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-2 hover:bg-black hover:text-white transition-all">
                                                            <ClipboardPaste className="w-3.5 h-3.5" />
                                                            Paste List
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="!w-[600px] !max-w-[95vw] rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white flex flex-col max-h-[90vh]">
                                                        <div className="relative h-32 w-full bg-black flex flex-col justify-center px-10 shrink-0">
                                                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 0.0625rem 0.0625rem, white 0.0625rem, transparent 0)', backgroundSize: '1.5rem 1.5rem' }}></div>
                                                            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white relative z-10">Paste Player List</DialogTitle>
                                                            <DialogDescription className="text-neutral-400 font-medium text-xs mt-1 relative z-10 italic">Format: No. Nama Nomor_Punggung Ukuran Lengan (opsional)</DialogDescription>
                                                        </div>
                                                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                                            <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-4 mb-6 flex items-start gap-3">
                                                                <Info className="w-4 h-4 text-[#D25026] mt-0.5 shrink-0" />
                                                                <div className="text-[11px] leading-relaxed text-neutral-600 font-medium">
                                                                    <p className="font-bold text-slate-800 mb-1">Panduan Penginputan Otomatis:</p>
                                                                    <p>• Masukkan list berisi <span className="font-bold">No, Nama, No Punggung, Ukuran Baju</span>, dan <span className="font-bold">Lengan</span>.</p>
                                                                    <p>• Jika kolom lengan dikosongkan, sistem akan otomatis memilih <span className="font-bold">Lengan Pendek</span>.</p>
                                                                    <p>• Contoh: <span className="italic">1. BAYU 10 L Pendek</span> atau <span className="italic">2. YUSUF 23 XL Panjang</span></p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Paste Your List Here</Label>
                                                                <Textarea 
                                                                    ref={textareaRef}
                                                                    value={pasteText}
                                                                    onChange={(e) => setPasteText(e.target.value)}
                                                                    onKeyDown={handleTextareaKeyDown}
                                                                    onPaste={handleTextareaPaste}
                                                                    placeholder={"1. BAYU, 10, L, Pendek\n2. YUSUF, 23, XL, Lengan Panjang"}
                                                                    className="min-h-[18rem] rounded-[1.5rem] border-neutral-100 text-sm p-6 focus:ring-[#D25026]/10 focus:border-[#D25026]/20 bg-neutral-50/50 resize-none transition-all"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="p-8 pt-4 border-t border-neutral-50 bg-white shrink-0">
                                                            <div className="flex gap-4">
                                                                <Button onClick={() => setIsPasteDialogOpen(false)} variant="ghost" className="flex-1 rounded-2xl h-14 text-xs font-black uppercase tracking-widest italic hover:bg-neutral-50">Cancel</Button>
                                                                <Button onClick={parsePasteData} className="flex-[2] rounded-2xl h-14 bg-[#D25026] text-white text-xs font-black uppercase tracking-widest italic shadow-xl shadow-[#D25026]/20 hover:bg-[#B34320] transition-all">Process List</Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <div className="relative group">
                                                    <input 
                                                        type="file" 
                                                        accept=".pdf"
                                                        onChange={handlePdfImport}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                    <Button variant="outline" className="rounded-xl h-10 px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-2 hover:bg-[#D25026] hover:text-white transition-all">
                                                        <FileText className="w-3.5 h-3.5" />
                                                        PDF
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {activeProduct?.status === "Habis" && (
                                            <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl flex items-start gap-3 mb-6">
                                                <Info className="w-5 h-5 text-[#D25026] shrink-0 mt-0.5" />
                                                <div className="text-xs font-bold uppercase tracking-tight text-[#B34320]">
                                                    Pemberitahuan: Bahan jersey "{activeProduct.title}" sedang tidak tersedia / habis. Anda tetap dapat melanjutkan pemesanan. Admin akan menghubungi Anda setelah checkout untuk merekomendasikan bahan alternatif yang tersedia.
                                                </div>
                                            </div>
                                        )}

                                        {isOverLimit && (
                                            <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-start gap-3 mb-6">
                                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                                <div className="text-xs font-bold uppercase tracking-tight text-red-800">
                                                    Kebutuhan bahan baku melebihi ketersediaan di gudang! (Dibutuhkan: {totalRequiredKg.toFixed(2)} kg, Tersedia: {availableKg.toFixed(2)} kg).
                                                    <span className="block mt-1 text-[#B34320] font-extrabold normal-case">
                                                        Stok bahan "{activeProduct?.title}" saat ini hanya cukup untuk {Math.floor(availableKg / (totalRequiredKg / customDetails.length))} pcs jersey dengan kombinasi lengan & ukuran Anda saat ini.
                                                        Silakan kurangi pesanan Anda sebanyak {Math.max(1, customDetails.length - Math.floor(availableKg / (totalRequiredKg / customDetails.length)))} pcs atau ubah ukuran/tipe lengan ke yang lebih kecil/pendek.
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {pdfFile && (
                                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                                                <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                                                <div>
                                                    <p className="text-sm font-black text-emerald-900 italic tracking-tighter">PDF IMPORTED: {pdfFile.name}</p>
                                                    <p className="text-[11px] text-emerald-600 font-medium">Data pemain akan diproses manual oleh admin.</p>
                                                </div>
                                                <button onClick={() => setPdfFile(null)} className="ml-auto text-emerald-400 hover:text-emerald-600 font-bold text-[10px] uppercase">REMOVE</button>
                                            </div>
                                        )}

                                        <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-2xl overflow-hidden relative ring-1 ring-black/5">
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[6.25rem] pointer-events-none"></div>
                                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D25026]/5 blur-[6.25rem] pointer-events-none"></div>
                                            
                                            <div className="overflow-x-auto relative z-10 custom-scrollbar pb-4">
                                                <table className="w-full text-left border-collapse min-w-[62.5rem]">
                                                    <thead>
                                                        <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                                            <th className="p-6 pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic w-20 text-center">No</th>
                                                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic w-full">Nama</th>
                                                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-24 whitespace-nowrap">Nomor Punggung</th>
                                                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-[230px] whitespace-nowrap">Ukuran Baju</th>
                                                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-[150px] whitespace-nowrap">Lengan</th>
                                                            <th className="p-6 pr-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-right w-28">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-neutral-100">
                                                        {customDetails.map((detail, index) => (
                                                            <tr key={detail.id} className="hover:bg-neutral-50/50 transition-all duration-300 group">
                                                                <td className="p-5 pl-10 text-center">
                                                                    <span className="text-sm font-black text-neutral-400">{index + 1}</span>
                                                                </td>
                                                                <td className="p-5">
                                                                    <div className="relative group/input">
                                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-800 group-focus-within/input:text-[#D25026] transition-colors" />
                                                                        <Input 
                                                                            value={detail.name}
                                                                            onChange={(e) => handleDetailChange(detail.id, "name", e.target.value)}
                                                                            placeholder="NAMA" 
                                                                            className={cn(
                                                                                "h-12 rounded-2xl border-neutral-200 focus:border-[#D25026]/50 focus:ring-[#D25026]/20 bg-white text-sm font-black uppercase tracking-wider text-black placeholder:text-neutral-800 pl-11 transition-all duration-300",
                                                                                showValidation && !detail.name.trim() && "border-red-500 bg-red-50/30"
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="p-5">
                                                                    <Input 
                                                                        value={detail.number}
                                                                        onChange={(e) => handleDetailChange(detail.id, "number", e.target.value)}
                                                                        placeholder="00" 
                                                                        maxLength={3}
                                                                        className={cn(
                                                                            "w-20 mx-auto h-12 rounded-2xl border-neutral-200 focus:border-[#D25026]/50 focus:ring-[#D25026]/20 bg-white text-base font-black text-center text-black placeholder:text-neutral-800 transition-all duration-300",
                                                                            showValidation && !detail.number.trim() && "border-red-500 bg-red-50/30"
                                                                        )}
                                                                    />
                                                                </td>
                                                                <td className="p-5">
                                                                    <div className="flex gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-100 w-max mx-auto">
                                                                        {["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map(size => (
                                                                            <button
                                                                                key={size}
                                                                                onClick={() => handleDetailChange(detail.id, "size", size)}
                                                                                className={cn(
                                                                                    "w-7 h-7 rounded-lg text-[10px] font-black transition-all duration-300",
                                                                                    detail.size === size 
                                                                                        ? "bg-black text-white shadow-md" 
                                                                                        : "text-neutral-600 hover:text-black hover:bg-neutral-200"
                                                                                )}
                                                                            >
                                                                                {size}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="p-5">
                                                                    <div className="flex gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-100 w-max mx-auto">
                                                                        {[
                                                                            { value: "Lengan Pendek", label: "Pendek" },
                                                                            { value: "Lengan Panjang", label: "Panjang" }
                                                                        ].map(sleeve => (
                                                                            <button
                                                                                key={sleeve.value}
                                                                                onClick={() => handleDetailChange(detail.id, "sleeve", sleeve.value)}
                                                                                className={cn(
                                                                                    "px-3 h-7 rounded-lg text-[10px] font-black transition-all duration-300",
                                                                                    (detail.sleeve || "Lengan Pendek") === sleeve.value 
                                                                                        ? "bg-[#D25026] text-white shadow-md shadow-[#D25026]/20" 
                                                                                        : "text-neutral-600 hover:text-[#D25026] hover:bg-neutral-200"
                                                                                )}
                                                                            >
                                                                                {sleeve.label}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="p-5 pr-10 text-right">
                                                                    <button 
                                                                        onClick={() => removeUnit(detail.id)}
                                                                        className="w-11 h-11 bg-red-50 text-red-500 rounded-2xl inline-flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all duration-300"
                                                                    >
                                                                        <Trash2 className="w-4.5 h-4.5" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {customDetails.length === 0 && !pdfFile && (
                                            <div className="bg-white border-2 border-dashed border-neutral-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4">
                                                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center">
                                                    <ShoppingCart className="w-8 h-8 text-neutral-200" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-black italic uppercase text-neutral-900 tracking-tighter">Your list is empty</p>
                                                    <p className="text-[10px] font-medium text-neutral-400 mt-1 max-w-[200px]">Add items from the shop or paste your player list to get started.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div>
                                    <h2 className="text-3xl font-black text-neutral-900 italic uppercase tracking-tighter">Design Reference</h2>
                                    <p className="text-neutral-400 font-medium mt-1">Unggah referensi desain dan tambahkan catatan tambahan.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-3">
                                        <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">Catatan Tambahan Desain</Label>
                                        <Textarea 
                                            value={designNote}
                                            onChange={(e) => setDesignNote(e.target.value)}
                                            placeholder="Jelaskan detail desain tambahan (warna logo, sponsor, posisi nomor, dll)..." 
                                            className="min-h-[22rem] rounded-[2.5rem] border-neutral-100 p-8 focus:ring-[#D25026]/10 focus:border-[#D25026] bg-white shadow-sm ring-1 ring-black/5 text-sm font-medium leading-relaxed"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">Upload Referensi</Label>
                                        <div className="h-[15.625rem] border-2 border-dashed border-neutral-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 bg-white hover:bg-neutral-50 hover:border-[#D25026]/30 transition-all cursor-pointer group relative overflow-hidden shadow-sm ring-1 ring-black/5">
                                            {designReferenceFile || existingOrder?.designUrl ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4">
                                                    {designReferenceFile ? (
                                                        (designReferenceFile.type.includes("pdf") || designReferenceFile.name.toLowerCase().endsWith(".pdf")) ? (
                                                            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-3 border border-red-100">
                                                                <FileText className="w-10 h-10 text-red-500" />
                                                            </div>
                                                        ) : (
                                                            <img src={URL.createObjectURL(designReferenceFile)} className="w-full h-full object-contain mb-2 rounded-xl" />
                                                        )
                                                    ) : (
                                                        existingOrder.designUrl.toLowerCase().endsWith(".pdf") ? (
                                                            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-3 border border-red-100">
                                                                <FileText className="w-10 h-10 text-red-500" />
                                                            </div>
                                                        ) : (
                                                            <img src={existingOrder.designUrl.startsWith('http') ? existingOrder.designUrl : `${UPLOADS_URL}${existingOrder.designUrl.startsWith('/') ? '' : '/'}${existingOrder.designUrl}`} className="w-full h-full object-contain mb-2 rounded-xl" />
                                                        )
                                                    )}
                                                    <p className="text-[10px] font-black uppercase text-neutral-400 truncate w-full text-center px-4 italic">
                                                        {designReferenceFile ? designReferenceFile.name : "Existing Design Reference"}
                                                    </p>
                                                    
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDesignReferenceFile(null);
                                                            if (existingOrder) {
                                                                setExistingOrder((prev: any) => ({ ...prev, designUrl: "" }));
                                                            }
                                                        }}
                                                        className="absolute top-4 right-4 z-20 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                                        title="Remove File"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center group-hover:bg-[#FFF0EB] transition-colors">
                                                        <Upload className="w-8 h-8 text-neutral-300 group-hover:text-[#D25026]" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-black italic uppercase text-neutral-900 tracking-tighter">Drop file here</p>
                                                        <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">Image or PDF allowed</p>
                                                    </div>
                                                </>
                                            )}
                                            <input 
                                                type="file" 
                                                accept="image/*,.pdf"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setDesignReferenceFile(file);
                                                        setToast({ show: true, message: "Design reference uploaded!", variant: "success" });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Opsi Pengiriman */}
                                <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 shadow-sm ring-1 ring-black/5 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-black italic uppercase tracking-tighter text-neutral-900">Opsi Pengiriman</h3>
                                        <p className="text-neutral-400 text-xs font-medium mt-1">Pilih metode pengiriman pesanan jersey Anda.</p>
                                    </div>

                                    <div className="flex gap-4">
                                        {[
                                            { value: "PICKUP", label: "Ambil di Tempat (Self-Pickup)" },
                                            { value: "COD", label: "COD (Penerima Yang Bayar)" }
                                        ].map((method) => (
                                            <button
                                                key={method.value}
                                                type="button"
                                                onClick={() => setShippingMethod(method.value)}
                                                className={cn(
                                                    "flex-1 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest italic border transition-all duration-300",
                                                    shippingMethod === method.value
                                                        ? "bg-black text-white border-black shadow-lg"
                                                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-450 hover:text-black"
                                                )}
                                            >
                                                {method.label}
                                            </button>
                                        ))}
                                    </div>

                                    {shippingMethod === "PICKUP" ? (
                                        <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="w-10 h-10 bg-[#D25026]/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Info className="text-[#D25026] w-5 h-5" />
                                            </div>
                                            <div className="text-xs leading-relaxed text-neutral-700">
                                                <p className="font-black uppercase tracking-wider text-[#D25026] mb-1">Catatan Pengambilan:</p>
                                                <p className="font-medium">Anda harus mengunjungi toko kami secara langsung untuk mengambil pesanan jersey Anda setelah selesai diproduksi.</p>
                                                <p className="font-black uppercase tracking-wider text-neutral-900 mt-2 mb-0.5">Alamat Toko:</p>
                                                <p className="font-bold font-mono text-neutral-900 bg-white/60 p-3 rounded-lg border border-orange-200/50">
                                                    Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">Alamat yang Dituju (Penerima)</Label>
                                            <Textarea
                                                value={shippingAddress}
                                                onChange={(e) => setShippingAddress(e.target.value)}
                                                placeholder="Tulis alamat pengiriman secara detail (Nama penerima, No HP, Nama Jalan, RT/RW, Kecamatan, Kabupaten, Kode Pos)..."
                                                className={cn(
                                                    "min-h-[8rem] rounded-2xl border-neutral-100 p-6 focus:ring-[#D25026]/10 focus:border-[#D25026] bg-neutral-50/50 text-sm font-medium leading-relaxed",
                                                    showValidation && shippingAddress.trim() === "" && "border-red-500 bg-red-50/20"
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div>
                                    <h2 className="text-3xl font-black text-neutral-900 italic uppercase tracking-tighter">Payment Details</h2>
                                    <p className="text-neutral-400 font-medium mt-1">Silakan lakukan pembayaran DP minimal 50% atau Pelunasan.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 shadow-sm ring-1 ring-black/5 space-y-6 relative overflow-hidden group">
                                            <div className="flex justify-between items-start">
                                                <div className="w-20 h-10 bg-[#00529C] rounded-lg flex items-center justify-center font-black text-white italic tracking-tighter text-2xl pr-1">
                                                    BCA
                                                </div>
                                                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">Official Account</div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Account Number</p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-3xl font-black text-neutral-900 tracking-tighter italic">4921 8972 72</p>
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText("4921897272");
                                                            setToast({ show: true, message: "Nomor rekening berhasil disalin ke clipboard", variant: "success" });
                                                        }}
                                                        className="p-2 hover:bg-neutral-50 rounded-lg transition-colors"
                                                    >
                                                        <FileText className="w-4 h-4 text-neutral-300" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Account Holder</p>
                                                <p className="text-xl font-black text-neutral-900 tracking-tighter italic uppercase">BAHRUDIN YUSUF</p>
                                            </div>

                                            <div className="pt-6 border-t border-neutral-50 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#FFF0EB] rounded-2xl flex items-center justify-center">
                                                    <AlertCircle className="text-[#D25026] w-6 h-6" />
                                                </div>
                                                <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
                                                    Harap lampirkan bukti transfer di samping. Pesanan akan diproses maksimal 1x24 jam setelah konfirmasi.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Pilihan Metode Pembayaran (Full Cash vs DP) */}
                                        <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-sm space-y-5">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-widest italic text-neutral-400">Metode Pembayaran</p>
                                                    <p className="text-sm font-bold text-neutral-800 mt-0.5">Pilih Bayar Penuh atau DP (Uang Muka)</p>
                                                </div>
                                                <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-[#D25026]">
                                                    {paymentType === "DP" ? "Opsi DP" : "Full 100%"}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentType("FULL")}
                                                    className={cn(
                                                        "p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[90px] cursor-pointer",
                                                        paymentType === "FULL"
                                                            ? "border-[#D25026] bg-[#FFF0EB]/40 shadow-sm"
                                                            : "border-neutral-100 bg-neutral-50/50 hover:border-neutral-200"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black uppercase tracking-tight text-neutral-900">Bayar Full Cash</span>
                                                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", paymentType === "FULL" ? "border-[#D25026] bg-[#D25026]" : "border-neutral-300")}>
                                                            {paymentType === "FULL" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-neutral-500 font-medium">Lunas 100% langsung di awal</p>
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
                                                        "p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[90px] cursor-pointer",
                                                        paymentType === "DP"
                                                            ? "border-[#D25026] bg-[#FFF0EB]/40 shadow-sm"
                                                            : "border-neutral-100 bg-neutral-50/50 hover:border-neutral-200"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black uppercase tracking-tight text-neutral-900">DP (Uang Muka)</span>
                                                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", paymentType === "DP" ? "border-[#D25026] bg-[#D25026]" : "border-neutral-300")}>
                                                            {paymentType === "DP" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-neutral-500 font-medium">Bayar sebagian, sisa pelunasan</p>
                                                </button>
                                            </div>

                                            {paymentType === "DP" && (
                                                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-bold text-amber-900">Nominal DP yang Ditransfer</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDpAmountInput(Math.round(totalCalculated * 0.5))}
                                                            className="text-[10px] font-black uppercase tracking-wider text-[#D25026] bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-2xs hover:bg-orange-50 transition-colors cursor-pointer"
                                                        >
                                                            Preset 50% ({formatRupiah(Math.round(totalCalculated * 0.5))})
                                                        </button>
                                                    </div>
                                                    <div className="relative">
                                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-sm">Rp</span>
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
                                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-amber-300/80 rounded-xl text-sm font-bold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200/40">
                                                        <span className="text-amber-800 font-medium">Sisa Tagihan Nanti:</span>
                                                        <span className="font-black text-rose-600 text-sm">
                                                            {formatRupiah(effectiveRemainingAmount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-black text-white rounded-[2.5rem] p-8 shadow-xl shadow-black/10">
                                            <div className="flex justify-between items-center mb-6">
                                                <p className="text-[11px] font-black uppercase tracking-widest italic text-neutral-400">Checkout Summary</p>
                                                <ShoppingCart className="w-5 h-5 opacity-20" />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-neutral-500 font-medium">Order Items</span>
                                                    <span className="font-bold tracking-tighter">{customDetails.length} Units</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-neutral-500 font-medium">Metode Pembayaran</span>
                                                    <span className="font-bold tracking-tighter text-amber-400">{paymentType === "DP" ? "DP (Uang Muka)" : "Full Cash (100%)"}</span>
                                                </div>
                                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                                    <span className="text-base font-black uppercase tracking-tighter italic">Total Pesanan</span>
                                                    <span className="text-2xl font-black tracking-tighter text-white">{formatRupiah(totalCalculated)}</span>
                                                </div>
                                                {paymentType === "DP" && (
                                                    <>
                                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5">
                                                            <span className="text-neutral-400 font-medium">Dibayar Sekarang (DP)</span>
                                                            <span className="text-lg font-black tracking-tighter text-[#D25026]">{formatRupiah(effectivePaidAmount)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-neutral-400 font-medium">Sisa Kekurangan Tagihan</span>
                                                            <span className="text-lg font-black tracking-tighter text-rose-400">{formatRupiah(effectiveRemainingAmount)}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">Upload Bukti Transfer</Label>
                                        <div className={cn(
                                            "h-[25rem] border-2 border-dashed border-neutral-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 bg-white hover:bg-neutral-50 hover:border-[#D25026]/30 transition-all cursor-pointer group relative overflow-hidden shadow-sm ring-1 ring-black/5",
                                            showValidation && step === 3 && !paymentProofFile && !existingOrder?.paymentUrl && "border-red-500 bg-red-50/10"
                                        )}>
                                            {paymentProofFile || existingOrder?.paymentUrl ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4">
                                                    {paymentProofFile ? (
                                                        (paymentProofFile.type.includes("pdf") || paymentProofFile.name.toLowerCase().endsWith(".pdf")) ? (
                                                            <div className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
                                                                <FileText className="w-12 h-12 text-red-500" />
                                                            </div>
                                                        ) : (
                                                            <img src={URL.createObjectURL(paymentProofFile)} className="w-full h-full object-contain mb-2 rounded-xl" />
                                                        )
                                                    ) : (
                                                        existingOrder.paymentUrl.toLowerCase().endsWith(".pdf") ? (
                                                            <div className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
                                                                <FileText className="w-12 h-12 text-red-500" />
                                                            </div>
                                                        ) : (
                                                            <img src={existingOrder.paymentUrl.startsWith('http') ? existingOrder.paymentUrl : `${UPLOADS_URL}${existingOrder.paymentUrl.startsWith('/') ? '' : '/'}${existingOrder.paymentUrl}`} className="w-full h-full object-contain mb-2 rounded-xl" />
                                                        )
                                                    )}
                                                    <p className="text-[10px] font-black uppercase text-neutral-400 truncate w-full text-center px-4 italic">
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
                                                        className="absolute top-6 right-6 z-20 w-10 h-10 bg-white text-red-500 rounded-full flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                                        title="Remove File"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-20 h-20 bg-neutral-50 rounded-3xl flex items-center justify-center group-hover:bg-[#FFF0EB] transition-colors">
                                                        <CreditCard className="w-10 h-10 text-neutral-300 group-hover:text-[#D25026]" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-lg font-black italic uppercase text-neutral-900 tracking-tighter">Upload Transfer Receipt</p>
                                                        <p className="text-[11px] font-bold text-neutral-400 mt-2 uppercase tracking-widest max-w-[200px]">PNG, JPG or PDF up to 5MB</p>
                                                    </div>
                                                </>
                                            )}
                                            <input 
                                                type="file" 
                                                accept="image/*,.pdf"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
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
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-12 flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm ring-1 ring-black/5">
                            <Button 
                                variant="outline"
                                onClick={() => step === 1 ? navigate(-1) : setStep(prev => prev - 1)}
                                className="h-14 px-10 rounded-2xl border-neutral-200 text-[13px] font-black uppercase tracking-widest italic hover:bg-neutral-50 transition-all flex gap-3"
                                disabled={isUploading}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                {step === 1 ? "Exit Checkout" : "Previous Step"}
                            </Button>

                            <div className="flex items-center gap-4">
                                {isUploading && (
                                    <div className="flex flex-col justify-center px-4 w-48">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic text-neutral-400 mb-1.5">
                                            <span>Syncing...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#D25026] transition-all duration-500" style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className={cn("flex items-center p-2 rounded-[1.5rem] shadow-2xl ring-1 ring-black/5 gap-2", step === 1 && customDetails.length > 0 ? "bg-black" : "bg-transparent")}>
                                    {step === 1 && customDetails.length > 0 && !isUploading && (
                                        <div className="flex items-center gap-4 pl-4 pr-2">
                                            <div className="w-10 h-10 bg-[#D25026]/20 rounded-xl flex items-center justify-center">
                                                <ShoppingCart className="w-4 h-4 text-[#D25026]" />
                                            </div>
                                            <div className="min-w-[120px]">
                                                <span className="text-[9px] font-black uppercase tracking-widest italic text-neutral-400 block leading-none mb-1">Total Payment</span>
                                                <p className="text-lg font-black tracking-tighter text-white">{formatRupiah(totalCalculated)}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <Button 
                                        onClick={() => step === 3 ? handleSubmit() : handleNextStep()}
                                        className="h-[52px] px-8 rounded-xl bg-[#D25026] hover:bg-[#B34320] text-white text-[12px] font-black uppercase tracking-widest italic shadow-lg active:scale-95 transition-all flex gap-3 shrink-0"
                                        disabled={isUploading || (step === 3 && !paymentProofFile && !existingOrder?.paymentUrl)}
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {step === 3 ? "Complete & Send Order" : "Continue to Next Step"}
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-8 flex justify-center">
                            <div className="bg-[#FFF0EB] rounded-2xl px-6 py-3 border border-[#FFE0D5] flex items-center gap-3">
                                <div className="w-6 h-6 bg-[#D25026] rounded-lg flex items-center justify-center shrink-0">
                                    <Info className="text-white w-3 h-3" />
                                </div>
                                <p className="text-[10px] text-[#B34320] font-bold italic uppercase tracking-tight">
                                    Butuh bantuan? Hubungi admin jika Anda kesulitan dalam mengisi detail pesanan.
                                </p>
                            </div>
                    </div>
                </div>
            </main>

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
