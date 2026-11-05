/**
 * useMonitoringActions Hook
 * Manages order transitions, approvals, file uploads, member status toggles, and payment ledgers.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 Hooks Decomposition)
 */

import { useState, useRef, useCallback } from "react";
import { orderService } from "~/services/orderService";
import { uploadService } from "~/services/uploadService";
import { generateInvoicePDF } from "~/lib/pdfHelper";
import { sortPlayersBySize } from "~/lib/sizeUtils";
import { convertImageToWebP } from "~/lib/utils";
import { serializePaymentProofUrls } from "~/features/admin/monitoring-pesanan/utils";
import type {
  MonitoringOrder,
  DesignerItem,
  ToastState,
} from "~/types";

export interface UseMonitoringActionsOptions {
  orders: MonitoringOrder[];
  setOrders: React.Dispatch<React.SetStateAction<MonitoringOrder[]>>;
  designers: DesignerItem[];
  fetchOrders?: (query?: string) => Promise<void>;
}

export function useMonitoringActions({
  orders,
  setOrders,
  designers,
}: UseMonitoringActionsOptions) {
  const [selectedOrder, setSelectedOrder] = useState<MonitoringOrder | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Modal and action states
  const [isPrinting, setIsPrinting] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [isUploadingPrint, setIsUploadingPrint] = useState(false);
  const [isUploadingFinishing, setIsUploadingFinishing] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDesignerId, setSelectedDesignerId] = useState<number | "">("");
  const [orderToAssign, setOrderToAssign] = useState<number | null>(null);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [tempRecommendedIds, setTempRecommendedIds] = useState<number[]>([]);

  const proofInputRef = useRef<HTMLInputElement>(null);
  const printInputRef = useRef<HTMLInputElement>(null);
  const finishingInputRef = useRef<HTMLInputElement>(null);

  // Action: Print Invoice
  const handlePrintInvoice = async () => {
    if (!selectedOrder) return;
    setIsPrinting(true);
    try {
      await generateInvoicePDF(selectedOrder);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      setToast({ title: "Gagal mencetak invoice", variant: "destructive" });
    } finally {
      setIsPrinting(false);
    }
  };

  // Action: Upload payment proof (DP or FULL slot, converted to WebP)
  const handleUploadProof = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slot?: "DP" | "FULL",
  ) => {
    const inputEl = e.target;
    const file = inputEl.files?.[0];
    if (!file || !selectedOrder) return;

    const targetSlot: "DP" | "FULL" =
      slot || (selectedOrder.paymentType === "DP" ? "DP" : "FULL");
    setIsUploadingProof(true);
    try {
      const optimizedFile = await convertImageToWebP(file);
      const res = await uploadService.uploadFile(optimizedFile);
      const newPaymentUrl = serializePaymentProofUrls(
        selectedOrder.paymentProofUrl,
        selectedOrder.paymentType,
        targetSlot,
        res.url,
      );

      const total = selectedOrder.totalAmount || 0;
      const paymentUpdatePayload: {
        paymentUrl: string;
        paymentType?: string;
        paidAmount?: number;
        remainingAmount?: number;
      } = {
        paymentUrl: newPaymentUrl,
      };

      if (targetSlot === "FULL") {
        paymentUpdatePayload.paidAmount = total;
        paymentUpdatePayload.remainingAmount = 0;
      } else if (targetSlot === "DP") {
        paymentUpdatePayload.paymentType = "DP";
      }

      await orderService.updatePaymentDetails(
        selectedOrder.rawId,
        paymentUpdatePayload,
      );

      setToast({
        title:
          targetSlot === "DP"
            ? "Bukti pembayaran DP berhasil diunggah!"
            : "Bukti pembayaran Full berhasil diunggah!",
        variant: "success",
      });

      const nextPaymentType =
        (paymentUpdatePayload.paymentType as "DP" | "FULL") ||
        selectedOrder.paymentType;
      const nextPaidAmount =
        paymentUpdatePayload.paidAmount !== undefined
          ? paymentUpdatePayload.paidAmount
          : selectedOrder.paidAmount;
      const nextRemainingAmount =
        paymentUpdatePayload.remainingAmount !== undefined
          ? paymentUpdatePayload.remainingAmount
          : selectedOrder.remainingAmount;

      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              paymentProofUrl: newPaymentUrl,
              paymentType: nextPaymentType,
              paidAmount: nextPaidAmount,
              remainingAmount: nextRemainingAmount,
            }
          : null,
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                paymentProofUrl: newPaymentUrl,
                paymentType: nextPaymentType,
                paidAmount: nextPaidAmount,
                remainingAmount: nextRemainingAmount,
              }
            : o,
        ),
      );
    } catch (error) {
      console.error("Gagal mengunggah bukti pembayaran", error);
      setToast({
        title: "Gagal mengunggah bukti pembayaran",
        variant: "destructive",
      });
    } finally {
      setIsUploadingProof(false);
      inputEl.value = "";
      if (proofInputRef.current) proofInputRef.current.value = "";
    }
  };

  // Action: Upload print progress photo (converted to WebP)
  const handleUploadPrint = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.target;
    const file = inputEl.files?.[0];
    if (!file || !selectedOrder) return;

    setIsUploadingPrint(true);
    try {
      const optimizedFile = await convertImageToWebP(file);
      const res = await orderService.uploadPrint(
        selectedOrder.rawId,
        optimizedFile,
      );
      setToast({
        title: "Foto progres Print berhasil diunggah!",
        variant: "success",
      });
      setSelectedOrder((prev) =>
        prev ? { ...prev, printUrl: res.printUrl } : null,
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, printUrl: res.printUrl } : o,
        ),
      );
    } catch (error) {
      console.error("Gagal mengunggah foto Print", error);
      setToast({ title: "Gagal mengunggah foto Print", variant: "destructive" });
    } finally {
      setIsUploadingPrint(false);
      inputEl.value = "";
      if (printInputRef.current) printInputRef.current.value = "";
    }
  };

  // Action: Upload finishing progress photo (converted to WebP)
  const handleUploadFinishing = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputEl = e.target;
    const file = inputEl.files?.[0];
    if (!file || !selectedOrder) return;

    setIsUploadingFinishing(true);
    try {
      const optimizedFile = await convertImageToWebP(file);
      const res = await orderService.uploadFinishing(
        selectedOrder.rawId,
        optimizedFile,
      );
      setToast({
        title: "Foto progres Finishing berhasil diunggah!",
        variant: "success",
      });
      setSelectedOrder((prev) =>
        prev ? { ...prev, finishingUrl: res.finishingUrl } : null,
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, finishingUrl: res.finishingUrl }
            : o,
        ),
      );
    } catch (error) {
      console.error("Gagal mengunggah foto Finishing", error);
      setToast({
        title: "Gagal mengunggah foto Finishing",
        variant: "destructive",
      });
    } finally {
      setIsUploadingFinishing(false);
      inputEl.value = "";
      if (finishingInputRef.current) finishingInputRef.current.value = "";
    }
  };

  const handleUpdateStatus = async (
    id: number,
    newStatus: string,
    designerId?: number,
    paymentConfirmation?: {
      paymentType?: string;
      paidAmount?: number;
      remainingAmount?: number;
    },
  ) => {
    try {
      const updatedRes = await orderService.updateOrderStatus(
        id,
        newStatus,
        designerId,
        undefined,
        paymentConfirmation,
      );
      const assignedDesigner = designerId
        ? designers.find((d) => d.id === designerId)
        : undefined;

      const applyUpdates = (o: MonitoringOrder): MonitoringOrder => {
        const total = o.totalAmount || 0;
        const nextType = (paymentConfirmation?.paymentType ||
          updatedRes?.paymentType ||
          o.paymentType) as "DP" | "FULL";
        const nextPaid =
          newStatus === "SELESAI"
            ? total
            : paymentConfirmation?.paidAmount !== undefined
              ? paymentConfirmation.paidAmount
              : updatedRes?.paidAmount !== undefined
                ? updatedRes.paidAmount
                : o.paidAmount;
        const nextRemaining =
          newStatus === "SELESAI"
            ? 0
            : paymentConfirmation?.remainingAmount !== undefined
              ? paymentConfirmation.remainingAmount
              : updatedRes?.remainingAmount !== undefined
                ? updatedRes.remainingAmount
                : Math.max(0, total - (nextPaid || 0));

        return {
          ...o,
          status: newStatus,
          paymentType: nextType,
          paidAmount: nextPaid,
          remainingAmount: nextRemaining,
          ...(assignedDesigner ? { designer: assignedDesigner.nama } : {}),
        };
      };

      setOrders((prev) =>
        prev.map((o) => (o.rawId === id ? applyUpdates(o) : o)),
      );
      if (selectedOrder?.rawId === id) {
        setSelectedOrder((prev) => (prev ? applyUpdates(prev) : null));
      }

      if (newStatus === "DESAIN") {
        setToast({
          title: "Pesanan berhasil diserahkan ke tim desain",
          variant: "success",
        });
      } else {
        setToast({
          title: `Status pesanan diperbarui ke ${newStatus}`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setToast({ title: "Gagal memperbarui status", variant: "destructive" });
    }
  };

  // Action: Design approval / revision
  const handleApproveDesign = async (id: number) => {
    try {
      await orderService.approveDesign(id);
      setOrders((prev) =>
        prev.map((o) =>
          o.rawId === id ? { ...o, designStatus: "APPROVED" } : o,
        ),
      );
      if (selectedOrder?.rawId === id) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, designStatus: "APPROVED" } : null,
        );
      }
      setToast({ title: "Desain berhasil disetujui", variant: "success" });
    } catch (error) {
      console.error("Error approving design:", error);
      setToast({ title: "Gagal menyetujui desain", variant: "destructive" });
    }
  };

  const handleRevisiDesign = async (id: number, feedback: string) => {
    try {
      await orderService.revisiDesign(id, feedback);
      setOrders((prev) =>
        prev.map((o) =>
          o.rawId === id
            ? { ...o, designStatus: "REVISI", designFeedback: feedback }
            : o,
        ),
      );
      if (selectedOrder?.rawId === id) {
        setSelectedOrder((prev) =>
          prev
            ? { ...prev, designStatus: "REVISI", designFeedback: feedback }
            : null,
        );
      }
      setToast({ title: "Revisi desain berhasil dikirim", variant: "success" });
    } catch (error) {
      console.error("Error requesting revision:", error);
      setToast({ title: "Gagal mengirim revisi", variant: "destructive" });
    }
  };

  // Action: Layout approval / revision
  const handleApproveLayout = async (id: number) => {
    try {
      await orderService.approveLayout(id);
      setOrders((prev) =>
        prev.map((o) =>
          o.rawId === id ? { ...o, layoutStatus: "APPROVED" } : o,
        ),
      );
      if (selectedOrder?.rawId === id) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, layoutStatus: "APPROVED" } : null,
        );
      }
      setToast({ title: "Layout berhasil disetujui", variant: "success" });
    } catch (error) {
      console.error("Error approving layout:", error);
      setToast({ title: "Gagal menyetujui layout", variant: "destructive" });
    }
  };

  const handleRevisiLayout = async (id: number, feedback: string) => {
    try {
      await orderService.revisiLayout(id, feedback);
      setOrders((prev) =>
        prev.map((o) =>
          o.rawId === id
            ? { ...o, layoutStatus: "REVISI", layoutFeedback: feedback }
            : o,
        ),
      );
      if (selectedOrder?.rawId === id) {
        setSelectedOrder((prev) =>
          prev
            ? { ...prev, layoutStatus: "REVISI", layoutFeedback: feedback }
            : null,
        );
      }
      setToast({ title: "Revisi layout berhasil dikirim", variant: "success" });
    } catch (error) {
      console.error("Error requesting revision:", error);
      setToast({ title: "Gagal mengirim revisi", variant: "destructive" });
    }
  };

  // Action: Send fabric recommendations
  const handleSendRecommendations = async () => {
    if (!selectedOrder) return;
    try {
      await orderService.recommendAlternatives(
        selectedOrder.rawId,
        tempRecommendedIds,
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.rawId === selectedOrder.rawId
            ? { ...o, recommendedBahanIds: tempRecommendedIds }
            : o,
        ),
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, recommendedBahanIds: tempRecommendedIds } : null,
      );
      setIsRecommendModalOpen(false);
      setToast({
        title: "Rekomendasi bahan alternatif berhasil dikirim",
        variant: "success",
      });
    } catch (error) {
      console.error("Error sending recommendations:", error);
      setToast({ title: "Gagal mengirim rekomendasi", variant: "destructive" });
    }
  };

  const handleToggleMemberStatus = async (
    orderId: number,
    detailId: number,
    field: "statusBaju" | "statusCelana",
  ) => {
    let currentValue = false;
    const targetOrder = orders.find((o) => o.rawId === orderId);
    if (targetOrder) {
      const member = (targetOrder.details || []).find((m: any) => m.id === detailId);
      if (member) {
        currentValue = Boolean(member[field]);
      }
    }
    const nextValue = !currentValue;

    // Optimistic update
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.rawId !== orderId) return order;
        return {
          ...order,
          details: (order.details || []).map((m: any) => {
            if (m.id === detailId) {
              return { ...m, [field]: nextValue };
            }
            return m;
          }),
        };
      }),
    );

    if (selectedOrder && selectedOrder.rawId === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              details: (prev.details || []).map((m: any) => {
                if (m.id === detailId) {
                  return { ...m, [field]: nextValue };
                }
                return m;
              }),
            }
          : null,
      );
    }

    try {
      await orderService.updateMemberItemStatus(detailId, { [field]: nextValue });
      setToast({
        title: `Status ${field === "statusBaju" ? "Baju" : "Celana"} ${nextValue ? "READY" : "BELUM READY"}`,
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to toggle member status:", error);
      // Revert on error
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.rawId !== orderId) return order;
          return {
            ...order,
            details: (order.details || []).map((m: any) => {
              if (m.id === detailId) {
                return { ...m, [field]: currentValue };
              }
              return m;
            }),
          };
        }),
      );
      if (selectedOrder && selectedOrder.rawId === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                details: (prev.details || []).map((m: any) => {
                  if (m.id === detailId) {
                    return { ...m, [field]: currentValue };
                  }
                  return m;
                }),
              }
            : null,
        );
      }
      setToast({
        title: "Gagal memperbarui status anggota",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNotesAndVideo = async (
    orderId: number,
    payload: { videoUrl?: string; adminNote?: string; designNote?: string },
  ) => {
    try {
      const updated = await orderService.updateOrderNotesAndVideo(orderId, payload);
      setOrders((prev) =>
        prev.map((o) =>
          o.rawId === orderId
            ? {
                ...o,
                videoUrl: updated.videoUrl,
                adminNote: updated.adminNote,
                designNote: updated.designNote ?? o.designNote,
              }
            : o,
        ),
      );

      if (selectedOrder && selectedOrder.rawId === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                videoUrl: updated.videoUrl,
                adminNote: updated.adminNote,
                designNote: updated.designNote ?? prev.designNote,
              }
            : null,
        );
      }

      setToast({
        title: "Catatan & tautan video berhasil disimpan",
        variant: "success",
      });
      return true;
    } catch (error) {
      console.error("Failed to update notes & video:", error);
      setToast({
        title: "Gagal menyimpan catatan atau link video",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleAddMember = async (
    orderId: number,
    memberData: {
      playerName: string;
      playerNumber?: string;
      playerSize: string;
      statusBaju?: boolean;
      statusCelana?: boolean;
    },
  ) => {
    try {
      const newDetail = await orderService.addOrderMember(orderId, memberData);
      const targetOrder =
        orders.find((o) => o.rawId === orderId) ||
        (selectedOrder?.rawId === orderId ? selectedOrder : null);
      const unitPrice =
        (newDetail as any).unitPrice ||
        (targetOrder && targetOrder.qty > 0
          ? Math.round(targetOrder.totalAmount / targetOrder.qty)
          : 150000);
      const calculatedTotal =
        (newDetail as any).newTotalAmount ||
        (targetOrder?.totalAmount || 0) + unitPrice;

      setOrders((prev) =>
        prev.map((o) => {
          if (o.rawId !== orderId) return o;
          const nextDetails = [
            ...(o.details || []),
            {
              id: newDetail.id,
              productId: newDetail.productId,
              productTitle: newDetail.productTitle,
              playerName: newDetail.playerName,
              playerNumber: newDetail.playerNumber,
              playerSize: newDetail.playerSize,
              statusBaju: Boolean(newDetail.statusBaju),
              statusCelana: Boolean(newDetail.statusCelana),
            },
          ];
          const nextRemaining =
            (newDetail as any)?.remainingAmount !== undefined
              ? (newDetail as any).remainingAmount
              : o.paymentType === "DP"
                ? Math.max(0, calculatedTotal - (o.paidAmount || 0))
                : o.remainingAmount;
          return {
            ...o,
            qty: nextDetails.length,
            totalAmount: calculatedTotal,
            remainingAmount: nextRemaining,
            details: nextDetails,
            playerInfo: sortPlayersBySize(
              nextDetails.map((d: any) => ({
                name: d.playerName || "-",
                number: d.playerNumber || "-",
                size: d.playerSize || "-",
              })),
            ),
          };
        }),
      );

      if (selectedOrder && selectedOrder.rawId === orderId) {
        setSelectedOrder((prev) => {
          if (!prev) return null;
          const nextDetails = [
            ...(prev.details || []),
            {
              id: newDetail.id,
              productId: newDetail.productId,
              productTitle: newDetail.productTitle,
              playerName: newDetail.playerName,
              playerNumber: newDetail.playerNumber,
              playerSize: newDetail.playerSize,
              statusBaju: Boolean(newDetail.statusBaju),
              statusCelana: Boolean(newDetail.statusCelana),
            },
          ];
          const nextRemaining =
            (newDetail as any)?.remainingAmount !== undefined
              ? (newDetail as any).remainingAmount
              : prev.paymentType === "DP"
                ? Math.max(0, calculatedTotal - (prev.paidAmount || 0))
                : prev.remainingAmount;
          return {
            ...prev,
            qty: nextDetails.length,
            totalAmount: calculatedTotal,
            remainingAmount: nextRemaining,
            details: nextDetails,
            playerInfo: sortPlayersBySize(
              nextDetails.map((d: any) => ({
                name: d.playerName || "-",
                number: d.playerNumber || "-",
                size: d.playerSize || "-",
              })),
            ),
          };
        });
      }

      setToast({ title: "Anggota baru berhasil ditambahkan!", variant: "success" });
      return true;
    } catch (error) {
      console.error("Gagal menambahkan anggota:", error);
      setToast({ title: "Gagal menambahkan anggota", variant: "destructive" });
      return false;
    }
  };

  const handleEditMember = async (
    orderId: number,
    detailId: number,
    memberData: {
      playerName?: string;
      playerNumber?: string;
      playerSize?: string;
      statusBaju?: boolean;
      statusCelana?: boolean;
    },
  ) => {
    try {
      const updated = await orderService.updateOrderMember(detailId, memberData);
      setOrders((prev) =>
        prev.map((o) => {
          if (o.rawId !== orderId) return o;
          const nextDetails = (o.details || []).map((m: any) =>
            m.id === detailId
              ? {
                  ...m,
                  ...updated,
                  statusBaju: Boolean(
                    updated.statusBaju !== undefined
                      ? updated.statusBaju
                      : m.statusBaju,
                  ),
                  statusCelana: Boolean(
                    updated.statusCelana !== undefined
                      ? updated.statusCelana
                      : m.statusCelana,
                  ),
                }
              : m,
          );
          return {
            ...o,
            details: nextDetails,
            playerInfo: sortPlayersBySize(
              nextDetails.map((d: any) => ({
                name: d.playerName || "-",
                number: d.playerNumber || "-",
                size: d.playerSize || "-",
              })),
            ),
          };
        }),
      );

      if (selectedOrder && selectedOrder.rawId === orderId) {
        setSelectedOrder((prev) => {
          if (!prev) return null;
          const nextDetails = (prev.details || []).map((m: any) =>
            m.id === detailId
              ? {
                  ...m,
                  ...updated,
                  statusBaju: Boolean(
                    updated.statusBaju !== undefined
                      ? updated.statusBaju
                      : m.statusBaju,
                  ),
                  statusCelana: Boolean(
                    updated.statusCelana !== undefined
                      ? updated.statusCelana
                      : m.statusCelana,
                  ),
                }
              : m,
          );
          return {
            ...prev,
            details: nextDetails,
            playerInfo: sortPlayersBySize(
              nextDetails.map((d: any) => ({
                name: d.playerName || "-",
                number: d.playerNumber || "-",
                size: d.playerSize || "-",
              })),
            ),
          };
        });
      }

      setToast({ title: "Data anggota berhasil diperbarui!", variant: "success" });
      return true;
    } catch (error) {
      console.error("Gagal mengubah data anggota:", error);
      setToast({ title: "Gagal mengubah data anggota", variant: "destructive" });
      return false;
    }
  };

  const handleDeleteMember = async (orderId: number, detailId: number) => {
    try {
      const deletedRes = await orderService.deleteOrderMember(detailId);
      const targetOrder =
        orders.find((o) => o.rawId === orderId) ||
        (selectedOrder?.rawId === orderId ? selectedOrder : null);
      const unitPrice =
        targetOrder && targetOrder.qty > 0
          ? Math.round(targetOrder.totalAmount / targetOrder.qty)
          : 0;
      const calculatedTotal = Math.max(
        0,
        (targetOrder?.totalAmount || 0) - unitPrice,
      );

      setOrders((prev) =>
        prev.map((o) => {
          if (o.rawId !== orderId) return o;
          const nextDetails = (o.details || []).filter(
            (m: any) => m.id !== detailId,
          );
          const nextRemaining =
            (deletedRes as any)?.remainingAmount !== undefined
              ? (deletedRes as any).remainingAmount
              : o.paymentType === "DP"
                ? Math.max(0, calculatedTotal - (o.paidAmount || 0))
                : o.remainingAmount;
          return {
            ...o,
            qty: nextDetails.length,
            totalAmount: calculatedTotal,
            remainingAmount: nextRemaining,
            details: nextDetails,
            playerInfo: sortPlayersBySize(
              nextDetails.map((d: any) => ({
                name: d.playerName || "-",
                number: d.playerNumber || "-",
                size: d.playerSize || "-",
              })),
            ),
          };
        }),
      );

      if (selectedOrder && selectedOrder.rawId === orderId) {
        setSelectedOrder((prev) => {
          if (!prev) return null;
          const nextDetails = (prev.details || []).filter(
            (m: any) => m.id !== detailId,
          );
          const nextRemaining =
            (deletedRes as any)?.remainingAmount !== undefined
              ? (deletedRes as any).remainingAmount
              : prev.paymentType === "DP"
                ? Math.max(0, calculatedTotal - (prev.paidAmount || 0))
                : prev.remainingAmount;
          return {
            ...prev,
            qty: nextDetails.length,
            totalAmount: calculatedTotal,
            remainingAmount: nextRemaining,
            details: nextDetails,
            playerInfo: sortPlayersBySize(
              nextDetails.map((d: any) => ({
                name: d.playerName || "-",
                number: d.playerNumber || "-",
                size: d.playerSize || "-",
              })),
            ),
          };
        });
      }

      setToast({
        title: "Anggota berhasil dihapus dari pesanan",
        variant: "success",
      });
      return true;
    } catch (error) {
      console.error("Gagal menghapus anggota:", error);
      setToast({ title: "Gagal menghapus anggota", variant: "destructive" });
      return false;
    }
  };

  const handlePaymentAdded = useCallback(
    (updatedOrder: {
      id?: number;
      rawId?: number;
      paidAmount: number;
      remainingAmount: number;
      paymentType: string;
      paymentUrl?: string;
    }) => {
      const targetId = updatedOrder.rawId || updatedOrder.id;
      if (!targetId) return;

      setOrders((prev) =>
        prev.map((o) => {
          if (o.rawId !== targetId) return o;
          return {
            ...o,
            paidAmount: updatedOrder.paidAmount,
            remainingAmount: updatedOrder.remainingAmount,
            paymentType: updatedOrder.paymentType as "DP" | "FULL",
            paymentProofUrl: updatedOrder.paymentUrl || o.paymentProofUrl,
          };
        }),
      );

      setSelectedOrder((prev) => {
        if (!prev || prev.rawId !== targetId) return prev;
        return {
          ...prev,
          paidAmount: updatedOrder.paidAmount,
          remainingAmount: updatedOrder.remainingAmount,
          paymentType: updatedOrder.paymentType as "DP" | "FULL",
          paymentProofUrl: updatedOrder.paymentUrl || prev.paymentProofUrl,
        };
      });

      setToast({
        title: "Angsuran pembayaran berhasil dicatat",
        variant: "success",
      });
    },
    [],
  );

  const handleUpdatePaymentDetails = async (
    orderId: number,
    data: {
      paymentType?: string;
      paidAmount?: number;
      remainingAmount?: number;
      paymentUrl?: string;
    },
    skipApi = false,
  ) => {
    try {
      if (!skipApi) {
        await orderService.updatePaymentDetails(orderId, data);
      }
      setOrders((prev) =>
        prev.map((o) => {
          if (o.rawId !== orderId) return o;
          const pType =
            data.paymentType !== undefined ? data.paymentType : o.paymentType;
          const paid =
            data.paidAmount !== undefined ? data.paidAmount : o.paidAmount;
          const rem =
            data.remainingAmount !== undefined
              ? data.remainingAmount
              : pType === "DP"
                ? Math.max(0, (o.totalAmount || 0) - (paid || 0))
                : 0;
          return {
            ...o,
            paymentType: pType as "DP" | "FULL",
            paidAmount: paid,
            remainingAmount: rem,
            paymentProofUrl: data.paymentUrl || o.paymentProofUrl,
          };
        }),
      );

      if (selectedOrder && selectedOrder.rawId === orderId) {
        setSelectedOrder((prev) => {
          if (!prev) return null;
          const pType =
            data.paymentType !== undefined
              ? data.paymentType
              : prev.paymentType;
          const paid =
            data.paidAmount !== undefined ? data.paidAmount : prev.paidAmount;
          const rem =
            data.remainingAmount !== undefined
              ? data.remainingAmount
              : pType === "DP"
                ? Math.max(0, (prev.totalAmount || 0) - (paid || 0))
                : 0;
          return {
            ...prev,
            paymentType: pType as "DP" | "FULL",
            paidAmount: paid,
            remainingAmount: rem,
            paymentProofUrl: data.paymentUrl || prev.paymentProofUrl,
          };
        });
      }

      setToast({
        title: skipApi
          ? "Angsuran pembayaran berhasil dicatat"
          : "Status pembayaran berhasil diperbarui",
        variant: "success",
      });
      return true;
    } catch (error) {
      console.error("Gagal memperbarui status pembayaran:", error);
      setToast({
        title: "Gagal memperbarui status pembayaran",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleAssignStorageLocation = async (
    orderId: number,
    storageLocationId: number | null,
    storageLocationObj?: any,
  ) => {
    try {
      await orderService.assignStorageLocation(orderId, storageLocationId);
      setOrders((prev) =>
        prev.map((o) =>
          o.rawId === orderId
            ? {
                ...o,
                storageLocationId,
                storageLocation: storageLocationObj ?? (storageLocationId ? o.storageLocation : null),
              }
            : o,
        ),
      );
      if (selectedOrder && selectedOrder.rawId === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                storageLocationId,
                storageLocation: storageLocationObj ?? (storageLocationId ? prev.storageLocation : null),
              }
            : null,
        );
      }
      setToast({
        title: storageLocationId
          ? "Lokasi toko pesanan berhasil ditetapkan"
          : "Lokasi toko pesanan berhasil dilepas",
        variant: "success",
      });
      return true;
    } catch (error: any) {
      console.error("Gagal menetapkan lokasi toko:", error);
      const msg = error.response?.data?.message || "Gagal menetapkan lokasi penyimpanan";
      setToast({
        title: msg,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    selectedOrder,
    setSelectedOrder,
    toast,
    setToast,
    isPrinting,
    isUploadingProof,
    isUploadingPrint,
    isUploadingFinishing,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedDesignerId,
    setSelectedDesignerId,
    orderToAssign,
    setOrderToAssign,
    isRecommendModalOpen,
    setIsRecommendModalOpen,
    tempRecommendedIds,
    setTempRecommendedIds,
    proofInputRef,
    printInputRef,
    finishingInputRef,
    handlePrintInvoice,
    handleUploadProof,
    handleUploadPrint,
    handleUploadFinishing,
    handleUpdateStatus,
    handleApproveDesign,
    handleRevisiDesign,
    handleApproveLayout,
    handleRevisiLayout,
    handleSendRecommendations,
    handleToggleMemberStatus,
    handleUpdateNotesAndVideo,
    handleAddMember,
    handleEditMember,
    handleDeleteMember,
    handlePaymentAdded,
    handleUpdatePaymentDetails,
    handleAssignStorageLocation,
  };
}
