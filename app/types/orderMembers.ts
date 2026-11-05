/**
 * Order Members & Player Roster Types
 * FCSV Apparel — Batch 2 Milestone M3 (R1 & R5 Order Members Decomposition)
 */

import type { OrderMember } from "./monitoringPesanan";

export interface OrderMemberItem {
  id?: number;
  productId?: number | null;
  productTitle?: string;
  playerName: string;
  playerNumber?: string | number;
  playerSize: string;
  unitPrice?: number;
  statusBaju?: boolean;
  statusCelana?: boolean;
}

export interface AddOrderMemberInput {
  playerName: string;
  playerNumber?: string;
  playerSize: string;
  statusBaju?: boolean;
  statusCelana?: boolean;
}

export interface EditOrderMemberInput {
  playerName?: string;
  playerNumber?: string;
  playerSize?: string;
  statusBaju?: boolean;
  statusCelana?: boolean;
}

export interface MemberBatchStatusInput {
  detailIds: number[];
  statusBaju?: boolean;
  statusCelana?: boolean;
}

export interface UseOrderMembersReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMembers: OrderMember[];
  selectedMemberIds: number[];
  setSelectedMemberIds: (ids: number[]) => void;
  toggleSelectAll: () => void;
  toggleSelectMember: (id: number) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  editingMember: OrderMember | null;
  setEditingMember: (member: OrderMember | null) => void;
  openAddModal: () => void;
  openEditModal: (member: OrderMember) => void;
  handleToggleStatus: (detailId: number, field: "statusBaju" | "statusCelana") => void;
  handleAddMember: (data: AddOrderMemberInput) => Promise<boolean>;
  handleEditMember: (detailId: number, data: EditOrderMemberInput) => Promise<boolean>;
  handleDeleteMember: (detailId: number) => Promise<boolean>;
  handleBatchStatus: (input: MemberBatchStatusInput) => Promise<boolean>;
  isSubmitting: boolean;
}
