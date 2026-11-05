/**
 * useOrderMembers Hook
 * Encapsulates member roster state, search filtering, selection, and CRUD modal coordination.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 & R5 Order Members Decomposition)
 */

import { useState, useMemo, useCallback } from "react";
import type {
  OrderMember,
  MonitoringOrder,
  AddOrderMemberInput,
  EditOrderMemberInput,
  MemberBatchStatusInput,
  UseOrderMembersReturn,
} from "~/types";

export interface UseOrderMembersOptions {
  order: MonitoringOrder;
  onToggleStatus?: (orderId: number, detailId: number, field: "statusBaju" | "statusCelana") => void;
  onAddMember?: (orderId: number, data: AddOrderMemberInput) => Promise<any>;
  onEditMember?: (orderId: number, detailId: number, data: EditOrderMemberInput) => Promise<any>;
  onDeleteMember?: (orderId: number, detailId: number) => Promise<any>;
}

export function useOrderMembers({
  order,
  onToggleStatus,
  onAddMember,
  onEditMember,
  onDeleteMember,
}: UseOrderMembersOptions): UseOrderMembersReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<OrderMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const members: OrderMember[] = useMemo(() => {
    if (order.details && order.details.length > 0) return order.details;
    if (order.playerInfo && (order.playerInfo as any[]).length > 0) {
      return (order.playerInfo as any[]).map((p: any, idx: number) => ({
        id: p.id || idx + 1,
        playerName: p.name || "",
        playerNumber: p.number || "",
        playerSize: p.size || "",
        statusBaju: Boolean(p.statusBaju),
        statusCelana: Boolean(p.statusCelana),
      }));
    }
    return [];
  }, [order.details, order.playerInfo]);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return members;
    return members.filter(
      (m) =>
        (m.playerName && m.playerName.toLowerCase().includes(q)) ||
        (m.playerNumber !== undefined && String(m.playerNumber).toLowerCase().includes(q)) ||
        (m.playerSize && m.playerSize.toLowerCase().includes(q)),
    );
  }, [members, searchQuery]);

  const toggleSelectMember = useCallback((id: number) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedMemberIds((prev) =>
      prev.length === filteredMembers.length
        ? []
        : filteredMembers.map((m) => m.id).filter((id): id is number => id !== undefined),
    );
  }, [filteredMembers]);

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const openEditModal = useCallback((member: OrderMember) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  }, []);

  const handleToggleStatus = useCallback(
    (detailId: number, field: "statusBaju" | "statusCelana") => {
      if (onToggleStatus) {
        onToggleStatus(order.rawId, detailId, field);
      }
    },
    [onToggleStatus, order.rawId],
  );

  const handleAddMember = useCallback(
    async (data: AddOrderMemberInput): Promise<boolean> => {
      if (!onAddMember) return false;
      setIsSubmitting(true);
      try {
        await onAddMember(order.rawId, data);
        setIsAddModalOpen(false);
        return true;
      } catch (err) {
        console.error("Failed to add member:", err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onAddMember, order.rawId],
  );

  const handleEditMember = useCallback(
    async (detailId: number, data: EditOrderMemberInput): Promise<boolean> => {
      if (!onEditMember) return false;
      setIsSubmitting(true);
      try {
        await onEditMember(order.rawId, detailId, data);
        setIsEditModalOpen(false);
        setEditingMember(null);
        return true;
      } catch (err) {
        console.error("Failed to edit member:", err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onEditMember, order.rawId],
  );

  const handleDeleteMember = useCallback(
    async (detailId: number): Promise<boolean> => {
      if (!onDeleteMember) return false;
      setIsSubmitting(true);
      try {
        await onDeleteMember(order.rawId, detailId);
        setSelectedMemberIds((prev) => prev.filter((id) => id !== detailId));
        return true;
      } catch (err) {
        console.error("Failed to delete member:", err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onDeleteMember, order.rawId],
  );

  const handleBatchStatus = useCallback(
    async (input: MemberBatchStatusInput): Promise<boolean> => {
      if (!onToggleStatus) return false;
      setIsSubmitting(true);
      try {
        for (const detailId of input.detailIds) {
          if (input.statusBaju !== undefined) {
            onToggleStatus(order.rawId, detailId, "statusBaju");
          }
          if (input.statusCelana !== undefined) {
            onToggleStatus(order.rawId, detailId, "statusCelana");
          }
        }
        return true;
      } catch (err) {
        console.error("Failed batch status update:", err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onToggleStatus, order.rawId],
  );

  return {
    searchQuery,
    setSearchQuery,
    filteredMembers,
    selectedMemberIds,
    setSelectedMemberIds,
    toggleSelectAll,
    toggleSelectMember,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    editingMember,
    setEditingMember,
    openAddModal,
    openEditModal,
    handleToggleStatus,
    handleAddMember,
    handleEditMember,
    handleDeleteMember,
    handleBatchStatus,
    isSubmitting,
  };
}
