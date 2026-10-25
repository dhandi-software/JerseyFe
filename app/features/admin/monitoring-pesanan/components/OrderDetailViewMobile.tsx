import { ChevronLeft } from "lucide-react";
import { Toast } from "~/components/ui/toast";
import { Button } from "~/components/ui/button";
import {
    DetailHeader,
    DesignReferenceSection,
    PaymentVerificationSection,
    DesignMockupSection,
    LayoutProgressSection,
    ProductionProofSection,
    ShippingInfoSection,
    OrderMembersSection,
    AlternativeBahanAlert,
    HandoverDesignerModal
} from "./detail";
import type { MonitoringOrder, BahanItem, DesignerItem, ToastState } from "~/types";

export interface OrderDetailViewMobileProps {
    selectedOrder: MonitoringOrder;
    onClose: () => void;
    toast: ToastState | null;
    onCloseToast: () => void;
    bahanList: BahanItem[];
    designers: DesignerItem[];
    isRecommendModalOpen: boolean;
    setIsRecommendModalOpen: (open: boolean) => void;
    tempRecommendedIds: number[];
    setTempRecommendedIds: React.Dispatch<React.SetStateAction<number[]>>;
    handleSendRecommendations: () => Promise<void>;
    isPrinting: boolean;
    handlePrintInvoice: () => Promise<void>;
    isUploadingProof: boolean;
    handleUploadProof: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isUploadingPrint: boolean;
    handleUploadPrint: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isUploadingFinishing: boolean;
    handleUploadFinishing: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleUpdateStatus: (id: number, newStatus: string, designerId?: number) => Promise<void>;
    handleApproveDesign: (id: number) => Promise<void>;
    handleRevisiDesign: (id: number, feedback: string) => Promise<void>;
    handleApproveLayout: (id: number) => Promise<void>;
    handleRevisiLayout: (id: number, feedback: string) => Promise<void>;
    isAssignModalOpen: boolean;
    setIsAssignModalOpen: (open: boolean) => void;
    selectedDesignerId: number | "";
    setSelectedDesignerId: (id: number | "") => void;
    orderToAssign: number | null;
    setOrderToAssign: (id: number | null) => void;
    handleUpdateNotesAndVideo?: (orderId: number, data: { videoUrl?: string; adminNote?: string; designNote?: string }) => Promise<any>;
    handleToggleMemberStatus?: (orderId: number, detailId: number, field: "statusBaju" | "statusCelana") => void;
    handleAddMember?: (orderId: number, data: { playerName: string; playerNumber?: string; playerSize: string; statusBaju?: boolean; statusCelana?: boolean }) => Promise<any>;
    handleEditMember?: (orderId: number, detailId: number, data: { playerName?: string; playerNumber?: string; playerSize?: string; statusBaju?: boolean; statusCelana?: boolean }) => Promise<any>;
    handleDeleteMember?: (orderId: number, detailId: number) => Promise<any>;
    handleUpdatePaymentDetails?: (orderId: number, data: { paymentType?: string; paidAmount?: number; remainingAmount?: number }) => Promise<any>;
}

export function OrderDetailViewMobile({
    selectedOrder,
    onClose,
    toast,
    onCloseToast,
    bahanList,
    designers,
    isRecommendModalOpen,
    setIsRecommendModalOpen,
    tempRecommendedIds,
    setTempRecommendedIds,
    handleSendRecommendations,
    isPrinting,
    handlePrintInvoice,
    isUploadingProof,
    handleUploadProof,
    isUploadingPrint,
    handleUploadPrint,
    isUploadingFinishing,
    handleUploadFinishing,
    handleUpdateStatus,
    handleApproveDesign,
    handleRevisiDesign,
    handleApproveLayout,
    handleRevisiLayout,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedDesignerId,
    setSelectedDesignerId,
    orderToAssign,
    setOrderToAssign,
    handleUpdateNotesAndVideo,
    handleToggleMemberStatus,
    handleAddMember,
    handleEditMember,
    handleDeleteMember,
    handleUpdatePaymentDetails
}: OrderDetailViewMobileProps) {
    const currentBahan = bahanList.find(b => b.id === selectedOrder.productId);

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-32">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={onCloseToast} />}

            <div className="p-4 space-y-4">
                <button 
                    onClick={onClose}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs group cursor-pointer py-1"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Kembali
                </button>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <DetailHeader
                        order={selectedOrder}
                        isPrinting={isPrinting}
                        onPrint={handlePrintInvoice}
                        variant="mobile"
                    />
                </div>

                {/* Fabric Out of Stock Alert & Recommender */}
                <AlternativeBahanAlert
                    order={selectedOrder}
                    currentBahan={currentBahan}
                    bahanList={bahanList}
                    isRecommendModalOpen={isRecommendModalOpen}
                    setIsRecommendModalOpen={setIsRecommendModalOpen}
                    tempRecommendedIds={tempRecommendedIds}
                    setTempRecommendedIds={setTempRecommendedIds}
                    handleSendRecommendations={handleSendRecommendations}
                />

                {/* Customer Design Reference & Video / Internal Notes */}
                <DesignReferenceSection
                    order={selectedOrder}
                    onUpdateNotesAndVideo={handleUpdateNotesAndVideo}
                    variant="mobile"
                />

                {/* Payment Verification Proof */}
                <PaymentVerificationSection
                    order={selectedOrder}
                    isUploadingProof={isUploadingProof}
                    handleUploadProof={handleUploadProof}
                    onUpdatePayment={handleUpdatePaymentDetails}
                    variant="mobile"
                />

                {/* Mockup Result Section */}
                <DesignMockupSection
                    order={selectedOrder}
                    handleApproveDesign={handleApproveDesign}
                    handleRevisiDesign={handleRevisiDesign}
                    variant="mobile"
                />

                {/* Layout Print Pattern Section */}
                <LayoutProgressSection
                    order={selectedOrder}
                    handleApproveLayout={handleApproveLayout}
                    handleRevisiLayout={handleRevisiLayout}
                    variant="mobile"
                />

                {/* Production Progress: Print & Finishing */}
                <ProductionProofSection
                    order={selectedOrder}
                    isUploadingPrint={isUploadingPrint}
                    handleUploadPrint={handleUploadPrint}
                    isUploadingFinishing={isUploadingFinishing}
                    handleUploadFinishing={handleUploadFinishing}
                    variant="mobile"
                />

                {/* Shipping Details */}
                <ShippingInfoSection
                    shippingMethod={selectedOrder.shippingMethod}
                    shippingAddress={selectedOrder.shippingAddress}
                    variant="mobile"
                />

                {/* Dynamic Member Management: View, Add, Edit, Delete, Toggle Status Bahan Baju & Celana */}
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
                    <OrderMembersSection
                        order={selectedOrder}
                        variant="mobile"
                        onToggleStatus={handleToggleMemberStatus}
                        onAddMember={handleAddMember}
                        onEditMember={handleEditMember}
                        onDeleteMember={handleDeleteMember}
                    />
                </div>
            </div>

            {/* Mobile Bottom Floating Action Bar if MENUNGGU */}
            {selectedOrder.status === "MENUNGGU" && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 flex gap-2 shadow-lg">
                    <Button 
                        variant="outline"
                        onClick={() => handleUpdateStatus(selectedOrder.rawId, "DITOLAK")}
                        className="flex-1 h-12 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider italic border border-red-200 cursor-pointer"
                    >
                        Tolak
                    </Button>
                    <Button 
                        onClick={() => {
                            setOrderToAssign(selectedOrder.rawId);
                            setIsAssignModalOpen(true);
                        }}
                        className="flex-[2] h-12 bg-[#D25026] text-white rounded-xl text-xs font-black uppercase tracking-wider italic shadow-md shadow-[#D25026]/20 cursor-pointer border-none"
                    >
                        Terima & Desain
                    </Button>
                </div>
            )}

            {/* Handover Modal */}
            <HandoverDesignerModal
                isOpen={isAssignModalOpen}
                onOpenChange={setIsAssignModalOpen}
                designers={designers}
                selectedDesignerId={selectedDesignerId}
                setSelectedDesignerId={setSelectedDesignerId}
                orderToAssign={orderToAssign}
                handleUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
}
