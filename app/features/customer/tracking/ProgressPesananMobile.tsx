import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { Toast } from "~/components/ui/toast";
import { useProgressPesanan } from "~/hooks";
import {
    CustomerDesignApprovalCard,
    CustomerOrderStepper,
    CustomerPlayerListSection,
    CustomerProductionNotesVideoSection,
    CustomerProgressMediaAndInfoSection,
    CustomerSupportBanner,
    ProgressOrderListSection,
} from "./components";

export function ProgressPesananMobile() {
    const {
        orders,
        selectedOrder,
        setSelectedOrder,
        loading,
        memberSearch,
        setMemberSearch,
        filteredPlayers,
        totalPlayers,
        feedbackInput,
        setFeedbackInput,
        showRevisiForm,
        setShowRevisiForm,
        showLayoutRevisiForm,
        setShowLayoutRevisiForm,
        layoutFeedbackInput,
        setLayoutFeedbackInput,
        submittingAction,
        toast,
        setToast,
        isPrinting,
        handlePrintInvoice,
        handleApprove,
        handleUnapproveDesign,
        handleRevisi,
        handleApproveLayout,
        handleUnapproveLayout,
        handleRevisiLayout,
        getCurrentStageIndex,
        stages,
        getDisplayStatus,
    } = useProgressPesanan();

    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-slate-50 font-geist pb-24">
                <div className="bg-white p-6 border-b border-slate-100 sticky top-0 z-50 flex justify-between items-center">
                    <div>
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest italic mb-2"
                        >
                            <ChevronLeft size={16} /> Kembali
                        </button>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                            Progress Pesanan
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <p className="text-xs font-bold text-[#D25026] uppercase italic font-mono">
                                {selectedOrder.orderId}
                            </p>
                            {selectedOrder.queueNumber && (
                                <span className="bg-[#D25026]/10 text-[#D25026] px-2.5 py-0.5 rounded-md text-xs font-black uppercase italic border border-[#D25026]/20">
                                    Antrean: {selectedOrder.queueNumber}
                                </span>
                            )}
                        </div>
                    </div>
                    {selectedOrder.status === "MENUNGGU" && (
                        <Link
                            to={`/customer/custom-jersey/checkout?editOrderId=${selectedOrder.orderId}`}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-900 hover:text-black px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest italic shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-300"
                        >
                            Edit
                        </Link>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    <CustomerOrderStepper
                        order={selectedOrder}
                        stages={stages}
                        currentStageIndex={getCurrentStageIndex(selectedOrder.status)}
                        displayStatus={getDisplayStatus(
                            selectedOrder.status,
                            selectedOrder.isWorking
                        )}
                        variant="mobile"
                        mobileHeaderMode="productTitle"
                    />

                    <CustomerDesignApprovalCard
                        mode="design"
                        variant="mobile"
                        fileUrl={selectedOrder.mockupUrl}
                        status={selectedOrder.designStatus}
                        feedback={selectedOrder.designFeedback}
                        canUnapprove={
                            selectedOrder.status === "DESAIN" || selectedOrder.status === "LAYOUT"
                        }
                        submittingAction={submittingAction}
                        showRevisiForm={showRevisiForm}
                        onToggleRevisiForm={setShowRevisiForm}
                        feedbackInput={feedbackInput}
                        onFeedbackInputChange={setFeedbackInput}
                        onApprove={handleApprove}
                        onUnapprove={handleUnapproveDesign}
                        onSubmitRevisi={handleRevisi}
                    />

                    <CustomerDesignApprovalCard
                        mode="layout"
                        variant="mobile"
                        fileUrl={selectedOrder.layoutUrl}
                        status={selectedOrder.layoutStatus}
                        feedback={selectedOrder.layoutFeedback}
                        canUnapprove={selectedOrder.status === "LAYOUT"}
                        submittingAction={submittingAction}
                        showRevisiForm={showLayoutRevisiForm}
                        onToggleRevisiForm={setShowLayoutRevisiForm}
                        feedbackInput={layoutFeedbackInput}
                        onFeedbackInputChange={setLayoutFeedbackInput}
                        onApprove={handleApproveLayout}
                        onUnapprove={handleUnapproveLayout}
                        onSubmitRevisi={handleRevisiLayout}
                    />

                    <CustomerProgressMediaAndInfoSection
                        order={selectedOrder}
                        isPrinting={isPrinting}
                        onPrintInvoice={handlePrintInvoice}
                        variant="mobile"
                    />

                    <CustomerProductionNotesVideoSection
                        order={selectedOrder}
                        variant="mobile"
                    />

                    <CustomerPlayerListSection
                        players={filteredPlayers}
                        totalPlayers={totalPlayers}
                        memberSearch={memberSearch}
                        onMemberSearchChange={setMemberSearch}
                        variant="mobile"
                    />

                    <CustomerSupportBanner orderId={selectedOrder.orderId} variant="mobile" />
                </div>

                {toast && (
                    <Toast
                        title={toast.title}
                        variant={toast.variant}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-24">
            <ProgressOrderListSection
                orders={orders}
                loading={loading}
                onSelectOrder={setSelectedOrder}
                getDisplayStatus={getDisplayStatus}
                variant="mobile"
            />

            {toast && (
                <Toast
                    title={toast.title}
                    variant={toast.variant}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
