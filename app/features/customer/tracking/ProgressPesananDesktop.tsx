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

export function ProgressPesananDesktop() {
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
            <div className="p-10 space-y-8 animate-in fade-in duration-500 font-geist">
                <div className="flex justify-between items-center w-full mb-4">
                    <button
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest italic"
                    >
                        <ChevronLeft size={16} /> Kembali ke Daftar
                    </button>

                    {selectedOrder.status === "MENUNGGU" && (
                        <Link
                            to={`/customer/custom-jersey/checkout?editOrderId=${selectedOrder.orderId}`}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-900 hover:text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest italic flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-300"
                        >
                            Edit Pesanan
                        </Link>
                    )}
                </div>

                <CustomerOrderStepper
                    order={selectedOrder}
                    stages={stages}
                    currentStageIndex={getCurrentStageIndex(selectedOrder.status)}
                    displayStatus={getDisplayStatus(selectedOrder.status, selectedOrder.isWorking)}
                    variant="desktop"
                >
                    <CustomerDesignApprovalCard
                        mode="design"
                        variant="desktop"
                        className="mt-16"
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
                        variant="desktop"
                        className="mt-16"
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
                        variant="desktop"
                    />

                    <div className="mt-10 space-y-8">
                        <CustomerProductionNotesVideoSection
                            order={selectedOrder}
                            variant="desktop"
                        />

                        <CustomerPlayerListSection
                            players={filteredPlayers}
                            totalPlayers={totalPlayers}
                            memberSearch={memberSearch}
                            onMemberSearchChange={setMemberSearch}
                            variant="desktop"
                        />
                    </div>
                </CustomerOrderStepper>

                <CustomerSupportBanner orderId={selectedOrder.orderId} variant="desktop" />

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
        <div className="p-10 space-y-10 animate-in fade-in duration-500 font-geist">
            <ProgressOrderListSection
                orders={orders}
                loading={loading}
                onSelectOrder={setSelectedOrder}
                getDisplayStatus={getDisplayStatus}
                variant="desktop"
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
