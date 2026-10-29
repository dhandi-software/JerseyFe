import { AlertCircle } from "lucide-react";
import { Toast } from "~/components/ui/toast";
import { useTrackingPesanan } from "~/hooks";
import {
    CustomerAlternativeFabricBanner,
    CustomerDesignApprovalCard,
    CustomerOrderStepper,
    CustomerPlayerListSection,
    CustomerProductionNotesVideoSection,
    CustomerSupportBanner,
    CustomerTrackingSummaryGrid,
    TrackingGuideSection,
    TrackingHeroHeader,
} from "./components";

export function TrackingPesananDesktop() {
    const {
        orderId,
        setOrderId,
        order,
        loading,
        error,
        memberSearch,
        setMemberSearch,
        filteredPlayers,
        totalPlayers,
        feedbackInput,
        setFeedbackInput,
        showRevisiForm,
        setShowRevisiForm,
        submittingAction,
        toast,
        setToast,
        bahanList,
        isPrinting,
        handlePrintInvoice,
        handleApprove,
        handleUnapproveDesign,
        handleRevisi,
        handleSelectAlternative,
        handleSearch,
        getCurrentStageIndex,
        stages,
        getDisplayStatus,
    } = useTrackingPesanan();

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-20">
            <TrackingHeroHeader
                orderId={orderId}
                onOrderIdChange={setOrderId}
                loading={loading}
                onSearch={handleSearch}
                variant="desktop"
            />

            <div className="w-full pt-10 pb-20 px-8 lg:px-16 xl:px-24 relative z-20">
                {error && (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-red-600 animate-in fade-in slide-in-from-top-4">
                        <AlertCircle size={24} />
                        <p className="font-bold text-sm italic uppercase tracking-tight">{error}</p>
                    </div>
                )}

                {order && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <CustomerAlternativeFabricBanner
                            order={order}
                            bahanList={bahanList}
                            onSelectAlternative={handleSelectAlternative}
                            variant="desktop"
                        />

                        <CustomerOrderStepper
                            order={order}
                            stages={stages}
                            currentStageIndex={getCurrentStageIndex()}
                            displayStatus={getDisplayStatus(order.status, order.isWorking)}
                            variant="desktop"
                        />

                        <CustomerDesignApprovalCard
                            mode="design"
                            variant="desktop"
                            fileUrl={order.mockupUrl}
                            status={order.designStatus}
                            feedback={order.designFeedback}
                            canUnapprove={
                                order.status === "DESAIN" || order.status === "LAYOUT"
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
                            fileUrl={order.layoutUrl}
                            status={order.layoutStatus}
                            feedback={order.layoutFeedback}
                            interactive={false}
                        />

                        <CustomerTrackingSummaryGrid
                            order={order}
                            isPrinting={isPrinting}
                            onPrintInvoice={handlePrintInvoice}
                            variant="desktop"
                        />

                        <CustomerProductionNotesVideoSection
                            order={order}
                            variant="desktop"
                        />

                        <CustomerPlayerListSection
                            players={filteredPlayers}
                            totalPlayers={totalPlayers}
                            memberSearch={memberSearch}
                            onMemberSearchChange={setMemberSearch}
                            variant="desktop"
                        />

                        <CustomerSupportBanner orderId={order.orderId} variant="desktop" />
                    </div>
                )}

                {!order && !error && (
                    <TrackingGuideSection stages={stages} variant="desktop" />
                )}
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
