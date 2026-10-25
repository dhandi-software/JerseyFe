import { useNavigate } from "react-router";
import { 
    ChevronLeft, 
    User, 
    ShoppingCart, 
    CheckCircle2, 
    FileUp 
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Toast } from "~/components/ui/toast";
import { useAuth } from "~/context/AuthContext";
import { cn } from "~/lib/utils";
import { useBuatPesanan } from "~/hooks/useBuatPesanan";
import { formatRupiah } from "../utils";
import { 
    CustomerDataSection, 
    MaterialStockAlert, 
    PlayerTableDesktop, 
    PasteListDialog, 
    ResetTableDialog, 
    DesignAndShippingSectionDesktop, 
    NavigationFooterDesktop 
} from "../components";

export function BuatPesananDesktop({ title }: { title: string }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const buatPesanan = useBuatPesanan();

    const {
        step,
        setStep,
        handleNextStep,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        customDetails,
        handleDetailChange,
        handleAddMember,
        handleRemoveMember,
        activeProduct,
        availableKg,
        allBahan,
        totalRequiredKg,
        isOverLimit,
        totalCalculated,
        paymentType,
        setPaymentType,
        dpAmountInput,
        setDpAmountInput,
        effectivePaidAmount,
        effectiveRemainingAmount,
        designNote,
        setDesignNote,
        designReferenceFile,
        setDesignReferenceFile,
        pdfFile,
        setPdfFile,
        handlePdfImport,
        shippingMethod,
        setShippingMethod,
        shippingAddress,
        setShippingAddress,
        isUploading,
        uploadProgress,
        toast,
        setToast,
        showValidation,
        isPasteDialogOpen,
        setIsPasteDialogOpen,
        pasteText,
        setPasteText,
        handlePasteSubmit,
        handleTextareaKeyDown,
        handleTextareaPaste,
        textareaRef,
        isResetDialogOpen,
        setIsResetDialogOpen,
        playerCountInput,
        setPlayerCountInput,
        generateTable,
        resetTable,
        handleSubmit,
        editOrderId
    } = buatPesanan;

    const steps = [
        { id: 1, name: "Data Pemain & Pelanggan", icon: User },
        { id: 2, name: "Design & Pengiriman", icon: FileUp }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-['Inter']">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
                <div className="w-full px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button 
                            type="button"
                            onClick={() => navigate("/admin/monitoring-pesanan")}
                            className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors font-bold text-sm group cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            BACK TO MONITORING
                        </button>
                        {step > 1 && (
                            <button 
                                type="button"
                                onClick={() => setStep(prev => prev - 1)}
                                className="flex items-center gap-2 text-neutral-400 hover:text-[#D25026] transition-colors font-bold text-sm group border-l border-neutral-200 pl-6 cursor-pointer"
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
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-neutral-900">
                            {title || "Buat Pesanan Admin"}
                        </h1>
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
                                <p className="text-xs font-black italic uppercase tracking-tight text-neutral-900">{user?.username || "Admin"}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Est. Total</p>
                            <p className="text-lg font-black text-[#D25026] tracking-tighter">{formatRupiah(totalCalculated)}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stepper Progress */}
            <div className="bg-white border-b border-neutral-100">
                <div className="w-full px-8 py-6">
                    <div className="flex items-center justify-center gap-12">
                        {steps.map((s) => {
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
                                        <p className={cn("text-xs font-black uppercase tracking-tighter italic", isActive ? "text-neutral-900" : "text-neutral-400")}>
                                            {s.name}
                                        </p>
                                        <p className="text-[10px] font-bold text-neutral-300">Step 0{s.id}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Step Content */}
            <main className="w-full px-8 py-12">
                <div className="space-y-12">
                    <div className="w-full">
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-500">
                                <CustomerDataSection 
                                    customerName={customerName}
                                    onCustomerNameChange={setCustomerName}
                                    customerPhone={customerPhone}
                                    onCustomerPhoneChange={setCustomerPhone}
                                    allBahan={allBahan}
                                    selectedBahanId={activeProduct?.id?.toString() || ""}
                                    onSelectBahan={(val) => {
                                        const found = allBahan.find(b => b.id.toString() === val);
                                        if (found) {
                                            setToast({ show: true, message: `Bahan ${found.nama} dipilih`, variant: "success" });
                                        }
                                    }}
                                    variant="desktop"
                                />

                                <div className="space-y-6 mt-8">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-black text-neutral-900 italic uppercase tracking-tighter">
                                                Order Detail
                                            </h2>
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
                                                <Button 
                                                    onClick={generateTable} 
                                                    variant="default" 
                                                    className="rounded-lg h-8 px-4 bg-black text-white hover:bg-neutral-800 text-[10px] font-black uppercase tracking-widest italic transition-all shadow-sm cursor-pointer"
                                                >
                                                    Buat Tabel
                                                </Button>
                                            </div>

                                            <ResetTableDialog 
                                                isOpen={isResetDialogOpen}
                                                onOpenChange={setIsResetDialogOpen}
                                                onConfirm={resetTable}
                                                variant="desktop"
                                            />

                                            <PasteListDialog 
                                                isOpen={isPasteDialogOpen}
                                                onOpenChange={setIsPasteDialogOpen}
                                                pasteText={pasteText}
                                                onTextChange={setPasteText}
                                                onKeyDown={handleTextareaKeyDown}
                                                onPaste={handleTextareaPaste}
                                                onSubmit={handlePasteSubmit}
                                                textareaRef={textareaRef}
                                                variant="desktop"
                                            />
                                        </div>
                                    </div>

                                    <MaterialStockAlert 
                                        activeProduct={activeProduct}
                                        isOverLimit={isOverLimit}
                                        totalRequiredKg={totalRequiredKg}
                                        availableKg={availableKg}
                                        playerCount={customDetails.length}
                                        variant="desktop"
                                    />

                                    {pdfFile && (
                                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                                            <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                                            <div>
                                                <p className="text-sm font-black text-emerald-900 italic tracking-tighter">PDF IMPORTED: {pdfFile.name}</p>
                                                <p className="text-[11px] text-emerald-600 font-medium">Data pemain siap diproses manual dari dokumen PDF ini.</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setPdfFile(null)} 
                                                className="ml-auto text-emerald-400 hover:text-emerald-600 font-bold text-[10px] uppercase cursor-pointer"
                                            >
                                                REMOVE
                                            </button>
                                        </div>
                                    )}

                                    <PlayerTableDesktop 
                                        customDetails={customDetails}
                                        onDetailChange={handleDetailChange}
                                        onRemoveMember={handleRemoveMember}
                                        onAddMember={() => handleAddMember(activeProduct?.id || 101)}
                                        showValidation={showValidation}
                                        hasPdfFile={!!pdfFile}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <DesignAndShippingSectionDesktop 
                                designNote={designNote}
                                onDesignNoteChange={setDesignNote}
                                designReferenceFile={designReferenceFile}
                                onDesignReferenceFileChange={setDesignReferenceFile}
                                shippingMethod={shippingMethod}
                                onShippingMethodChange={setShippingMethod}
                                shippingAddress={shippingAddress}
                                onShippingAddressChange={setShippingAddress}
                                showValidation={showValidation}
                                paymentType={paymentType}
                                onPaymentTypeChange={setPaymentType}
                                dpAmountInput={dpAmountInput}
                                onDpAmountInputChange={setDpAmountInput}
                                totalCalculated={totalCalculated}
                                effectivePaidAmount={effectivePaidAmount}
                                effectiveRemainingAmount={effectiveRemainingAmount}
                                playerCount={customDetails.length}
                                onToast={(msg, variant) => setToast({ show: true, message: msg, variant })}
                            />
                        )}

                        <NavigationFooterDesktop 
                            step={step}
                            onBack={() => step === 1 ? navigate(-1) : setStep(prev => prev - 1)}
                            onNext={() => step === 2 ? handleSubmit() : handleNextStep()}
                            isUploading={isUploading}
                            uploadProgress={uploadProgress}
                            totalCalculated={totalCalculated}
                            hasPlayers={customDetails.length > 0}
                        />
                    </div>
                </div>
            </main>

            {toast.show && (
                <Toast 
                    title={toast.message} 
                    variant={toast.variant} 
                    onClose={() => setToast(prev => ({ ...prev, show: false }))} 
                />
            )}
        </div>
    );
}
