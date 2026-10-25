import { useNavigate } from "react-router";
import { 
    ChevronLeft, 
    User, 
    ShoppingCart, 
    CheckCircle2 
} from "lucide-react";
import { Toast } from "~/components/ui/toast";
import { useAuth } from "~/context/AuthContext";
import { cn } from "~/lib/utils";
import { useBuatPesanan } from "~/hooks/useBuatPesanan";
import { 
    CustomerDataSection, 
    MaterialStockAlert, 
    PlayerTableMobile, 
    DesignAndShippingSectionMobile, 
    NavigationFooterMobile 
} from "../components";

export function BuatPesananMobile({ title }: { title: string }) {
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
        handleSubmit
    } = buatPesanan;

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-['Inter']">
            {/* Header Mobile */}
            <div className="bg-white border-b border-neutral-100 p-4 sticky top-0 z-50 flex items-center justify-between">
                <button 
                    type="button"
                    onClick={() => step === 1 ? navigate("/admin/monitoring-pesanan") : setStep(s => s - 1)} 
                    className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 active:scale-95 transition-transform cursor-pointer"
                >
                    <ChevronLeft className="w-5 h-5 text-neutral-900" />
                </button>
                <div className="text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                        <div className="w-7 h-7 bg-[#D25026] rounded-lg flex items-center justify-center">
                            <ShoppingCart className="text-white w-3.5 h-3.5" />
                        </div>
                        <span className="font-black italic uppercase text-xs tracking-tighter text-neutral-900">
                            {title || "Buat Pesanan"}
                        </span>
                    </div>
                    <p className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mt-1 italic leading-none">
                        {user?.username || "Admin"}
                    </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100">
                    <User className="w-4 h-4 text-neutral-300" />
                </div>
            </div>

            {/* Stepper Progress Mobile */}
            <div className="px-5 py-6 bg-white border-b border-neutral-100 shrink-0">
                <div className="flex items-center justify-between">
                    {[
                        { id: 1, label: "Players" },
                        { id: 2, label: "Design & Pay" }
                    ].map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 flex-1 relative">
                            {s.id !== 1 && (
                                <div className={cn("absolute left-0 right-1/2 top-4 h-0.5 -translate-x-1/2 w-full", step >= s.id ? "bg-[#D25026]" : "bg-neutral-100")} />
                            )}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black z-10 transition-all",
                                step === s.id ? "bg-black text-white shadow-lg" : 
                                step > s.id ? "bg-[#D25026] text-white" : "bg-neutral-100 text-neutral-400"
                            )}>
                                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                            </div>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest italic", step === s.id ? "text-neutral-900" : "text-neutral-300")}>
                                {s.label}
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

            {/* Main Content Area Mobile */}
            <div className="flex-1 overflow-y-auto px-5 py-8 space-y-8">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                            variant="mobile"
                        />

                        <MaterialStockAlert 
                            activeProduct={activeProduct}
                            isOverLimit={isOverLimit}
                            totalRequiredKg={totalRequiredKg}
                            availableKg={availableKg}
                            playerCount={customDetails.length}
                            variant="mobile"
                        />

                        <PlayerTableMobile 
                            customDetails={customDetails}
                            onDetailChange={handleDetailChange}
                            onRemoveMember={handleRemoveMember}
                            onAddMember={() => handleAddMember(activeProduct?.id || 101)}
                            showValidation={showValidation}
                            activeProduct={activeProduct}
                            playerCountInput={playerCountInput}
                            onPlayerCountChange={setPlayerCountInput}
                            onGenerateTable={generateTable}
                            isResetDialogOpen={isResetDialogOpen}
                            onResetDialogOpenChange={setIsResetDialogOpen}
                            onResetConfirm={resetTable}
                            isPasteDialogOpen={isPasteDialogOpen}
                            onPasteDialogOpenChange={setIsPasteDialogOpen}
                            pasteText={pasteText}
                            onPasteTextChange={setPasteText}
                            onPasteKeyDown={handleTextareaKeyDown}
                            onPasteRaw={handleTextareaPaste}
                            onPasteSubmit={handlePasteSubmit}
                            textareaRef={textareaRef}
                            pdfFile={pdfFile}
                            onPdfFileChange={handlePdfImport}
                            onRemovePdf={() => setPdfFile(null)}
                        />
                    </div>
                )}

                {step === 2 && (
                    <DesignAndShippingSectionMobile 
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
                        onToast={(msg, variant) => setToast({ show: true, message: msg, variant })}
                    />
                )}
            </div>

            {/* Bottom Sticky Action Footer */}
            <NavigationFooterMobile 
                step={step}
                paymentType={paymentType}
                effectiveRemainingAmount={effectiveRemainingAmount}
                effectivePaidAmount={effectivePaidAmount}
                totalCalculated={totalCalculated}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                onBack={() => step === 1 ? navigate(-1) : setStep(s => s - 1)}
                onNext={() => step === 2 ? handleSubmit() : handleNextStep()}
            />

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
