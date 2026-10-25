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

export interface OrderDetailViewDesktopProps {
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

export function OrderDetailViewDesktop({
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
}: OrderDetailViewDesktopProps) {
    const currentBahan = bahanList.find(b => b.id === selectedOrder.productId);

    return (
        <div className="min-h-screen bg-slate-50 font-geist">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={onCloseToast} />}

            <div className="w-full px-8 py-10">
                <button 
                    onClick={onClose}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm mb-8 group cursor-pointer"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Monitoring
                </button>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden ring-1 ring-black/5">
                    {/* Header info, status badge, print button */}
                    <DetailHeader
                        order={selectedOrder}
                        isPrinting={isPrinting}
                        onPrint={handlePrintInvoice}
                        variant="desktop"
                    />

                    <div className="p-10 bg-slate-50 space-y-10">
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

                        {/* 2-Column Grid: Design Reference/Notes + Payment Verification */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                            <DesignReferenceSection
                                order={selectedOrder}
                                onUpdateNotesAndVideo={handleUpdateNotesAndVideo}
                                variant="desktop"
                            />

                            <PaymentVerificationSection
                                order={selectedOrder}
                                isUploadingProof={isUploadingProof}
                                handleUploadProof={handleUploadProof}
                                onUpdatePayment={handleUpdatePaymentDetails}
                                variant="desktop"
                            />
                        </div>

                        {/* Mockup Result Section */}
                        <DesignMockupSection
                            order={selectedOrder}
                            handleApproveDesign={handleApproveDesign}
                            handleRevisiDesign={handleRevisiDesign}
                            variant="desktop"
                        />

                        {/* Layout Print Pattern Section */}
                        <LayoutProgressSection
                            order={selectedOrder}
                            handleApproveLayout={handleApproveLayout}
                            handleRevisiLayout={handleRevisiLayout}
                            variant="desktop"
                        />

                        {/* Production Progress: Print & Finishing */}
                        <ProductionProofSection
                            order={selectedOrder}
                            isUploadingPrint={isUploadingPrint}
                            handleUploadPrint={handleUploadPrint}
                            isUploadingFinishing={isUploadingFinishing}
                            handleUploadFinishing={handleUploadFinishing}
                            variant="desktop"
                        />

                        {/* Shipping Details */}
                        <ShippingInfoSection
                            shippingMethod={selectedOrder.shippingMethod}
                            shippingAddress={selectedOrder.shippingAddress}
                            variant="desktop"
                        />

                        {/* Dynamic Member Management: View, Add, Edit, Delete, Toggle Status Bahan Baju & Celana */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xs ring-1 ring-black/5">
                            <OrderMembersSection
                                order={selectedOrder}
                                variant="desktop"
                                onToggleStatus={handleToggleMemberStatus}
                                onAddMember={handleAddMember}
                                onEditMember={handleEditMember}
                                onDeleteMember={handleDeleteMember}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-slate-100 bg-white flex justify-between items-center px-10">
                        <div className="flex gap-4">
                            {selectedOrder.status === "MENUNGGU" && (
                                <>
                                    <Button 
                                        variant="outline"
                                        onClick={() => handleUpdateStatus(selectedOrder.rawId, "DITOLAK")}
                                        className="px-8 py-5 h-auto bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-[1.25rem] text-xs font-black uppercase tracking-wider transition-all border border-red-100 italic cursor-pointer shadow-xs"
                                    >
                                        Tolak Pesanan
                                    </Button>
                                    <Button 
                                        onClick={() => {
                                            setOrderToAssign(selectedOrder.rawId);
                                            setIsAssignModalOpen(true);
                                        }}
                                        className="px-10 py-5 h-auto bg-[#D25026] text-white rounded-[1.25rem] text-xs font-black uppercase tracking-wider hover:bg-[#B34320] transition-all shadow-lg shadow-[#D25026]/20 italic cursor-pointer border-none"
                                    >
                                        Terima & Serahkan ke Tim Desain
                                    </Button>
                                </>
                            )}
                        </div>
                        <Button 
                            variant="ghost"
                            onClick={onClose} 
                            className="px-8 py-5 h-auto bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[1.25rem] text-xs font-bold uppercase tracking-wider transition-colors italic cursor-pointer"
                        >
                            Kembali ke Monitoring
                        </Button>
                    </div>
                </div>

                {/* Handover Modal to assign designer */}
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
        </div>
    );
}
