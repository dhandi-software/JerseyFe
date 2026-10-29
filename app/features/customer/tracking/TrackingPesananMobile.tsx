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

export function TrackingPesananMobile() {
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
        <div className="min-h-screen bg-slate-50 font-sans pb-20 w-full overflow-x-hidden">
            <TrackingHeroHeader
                orderId={orderId}
                onOrderIdChange={setOrderId}
                loading={loading}
                onSearch={handleSearch}
                variant="mobile"
            />

            <div className="px-4 pt-5 pb-16 relative z-20 space-y-4 w-full">
                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600">
                        <AlertCircle size={18} />
                        <p className="font-bold text-xs">{error}</p>
                    </div>
                )}

                {order && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <CustomerAlternativeFabricBanner
                            order={order}
                            bahanList={bahanList}
                            onSelectAlternative={handleSelectAlternative}
                            variant="mobile"
                        />

                        <CustomerOrderStepper
                            order={order}
                            stages={stages}
                            currentStageIndex={getCurrentStageIndex()}
                            displayStatus={getDisplayStatus(order.status, order.isWorking)}
                            variant="mobile"
                            mobileHeaderMode="orderId"
                        />

                        <CustomerDesignApprovalCard
                            mode="design"
                            variant="mobile"
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
                            variant="mobile"
                            fileUrl={order.layoutUrl}
                            status={order.layoutStatus}
                            feedback={order.layoutFeedback}
                            interactive={false}
                        />

                        <CustomerTrackingSummaryGrid
                            order={order}
                            isPrinting={isPrinting}
                            onPrintInvoice={handlePrintInvoice}
                            sectionMode="orderSummaryOnly"
                            variant="mobile"
                        />

                        <CustomerProductionNotesVideoSection
                            order={order}
                            variant="mobile"
                        />

                        <CustomerPlayerListSection
                            players={filteredPlayers}
                            totalPlayers={totalPlayers}
                            memberSearch={memberSearch}
                            onMemberSearchChange={setMemberSearch}
                            variant="mobile"
                        />

                        <CustomerTrackingSummaryGrid
                            order={order}
                            sectionMode="shippingOnly"
                            variant="mobile"
                        />

                        <CustomerSupportBanner orderId={order.orderId} variant="mobile" />
                    </div>
                )}

                {!order && !error && (
                    <TrackingGuideSection stages={stages} variant="mobile" />
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
