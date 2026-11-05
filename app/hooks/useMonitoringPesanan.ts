/**
 * useMonitoringPesanan Coordinator Facade
 * 100% backward-compatible coordinator composing:
 * - useMonitoringOrders: Queries, search, filter tabs, sorting, pagination
 * - useMonitoringActions: Modals, uploads, status transitions, member roster operations
 * FCSV Apparel — Batch 2 Milestone M3 (R1 Hooks Decomposition)
 */

import { useEffect } from "react";
import { useMonitoringOrders } from "./useMonitoringOrders";
import { useMonitoringActions } from "./useMonitoringActions";

export function useMonitoringPesanan() {
  const ordersModel = useMonitoringOrders();
  const actionsModel = useMonitoringActions({
    orders: ordersModel.orders,
    setOrders: ordersModel.setOrders,
    designers: ordersModel.designers,
    fetchOrders: ordersModel.fetchOrders,
  });

  // Re-fetch designers if assign modal opens and list is empty
  useEffect(() => {
    if (actionsModel.isAssignModalOpen && ordersModel.designers.length === 0) {
      ordersModel.fetchDesignersList();
    }
  }, [actionsModel.isAssignModalOpen, ordersModel.designers.length, ordersModel.fetchDesignersList]);

  // Sync temp recommendation IDs when selectedOrder changes
  useEffect(() => {
    if (actionsModel.selectedOrder) {
      actionsModel.setTempRecommendedIds(actionsModel.selectedOrder.recommendedBahanIds || []);
    }
  }, [actionsModel.selectedOrder]);

  return {
    orders: ordersModel.orders,
    loading: ordersModel.loading,
    selectedOrder: actionsModel.selectedOrder,
    setSelectedOrder: actionsModel.setSelectedOrder,
    designers: ordersModel.designers,
    bahanList: ordersModel.bahanList,
    toast: actionsModel.toast,
    setToast: actionsModel.setToast,

    // Filters and pagination
    filterTab: ordersModel.filterTab,
    setFilterTab: ordersModel.setFilterTab,
    locationFilter: ordersModel.locationFilter,
    setLocationFilter: ordersModel.setLocationFilter,
    searchQuery: ordersModel.searchQuery,
    setSearchQuery: ordersModel.setSearchQuery,
    debouncedSearchQuery: ordersModel.debouncedSearchQuery,
    sortBy: ordersModel.sortBy,
    setSortBy: ordersModel.setSortBy,
    showSortDropdown: ordersModel.showSortDropdown,
    setShowSortDropdown: ordersModel.setShowSortDropdown,
    sortDropdownRef: ordersModel.sortDropdownRef,
    currentPage: ordersModel.currentPage,
    setCurrentPage: ordersModel.setCurrentPage,
    totalPages: ordersModel.totalPages,
    totalItems: ordersModel.totalItems,
    paginatedOrders: ordersModel.paginatedOrders,
    getPageNumbers: ordersModel.getPageNumbers,
    stats: ordersModel.stats,

    // Member expandable sub-row
    expandedOrderRowId: ordersModel.expandedOrderRowId,
    setExpandedOrderRowId: ordersModel.setExpandedOrderRowId,
    subSearchQueries: ordersModel.subSearchQueries,
    debouncedSubSearchQueries: ordersModel.debouncedSubSearchQueries,
    setSubSearch: ordersModel.setSubSearch,
    handleToggleMemberStatus: actionsModel.handleToggleMemberStatus,
    handleUpdateNotesAndVideo: actionsModel.handleUpdateNotesAndVideo,
    handleAddMember: actionsModel.handleAddMember,
    handleEditMember: actionsModel.handleEditMember,
    handleDeleteMember: actionsModel.handleDeleteMember,

    // Upload refs
    proofInputRef: actionsModel.proofInputRef,
    printInputRef: actionsModel.printInputRef,
    finishingInputRef: actionsModel.finishingInputRef,
    isPrinting: actionsModel.isPrinting,
    isUploadingProof: actionsModel.isUploadingProof,
    isUploadingPrint: actionsModel.isUploadingPrint,
    isUploadingFinishing: actionsModel.isUploadingFinishing,

    // Modals
    isAssignModalOpen: actionsModel.isAssignModalOpen,
    setIsAssignModalOpen: actionsModel.setIsAssignModalOpen,
    selectedDesignerId: actionsModel.selectedDesignerId,
    setSelectedDesignerId: actionsModel.setSelectedDesignerId,
    orderToAssign: actionsModel.orderToAssign,
    setOrderToAssign: actionsModel.setOrderToAssign,
    isRecommendModalOpen: actionsModel.isRecommendModalOpen,
    setIsRecommendModalOpen: actionsModel.setIsRecommendModalOpen,
    tempRecommendedIds: actionsModel.tempRecommendedIds,
    setTempRecommendedIds: actionsModel.setTempRecommendedIds,

    // Handlers
    handlePrintInvoice: actionsModel.handlePrintInvoice,
    handleUploadProof: actionsModel.handleUploadProof,
    handleUploadPrint: actionsModel.handleUploadPrint,
    handleUploadFinishing: actionsModel.handleUploadFinishing,
    handleUpdateStatus: actionsModel.handleUpdateStatus,
    handleApproveDesign: actionsModel.handleApproveDesign,
    handleRevisiDesign: actionsModel.handleRevisiDesign,
    handleApproveLayout: actionsModel.handleApproveLayout,
    handleRevisiLayout: actionsModel.handleRevisiLayout,
    handleSendRecommendations: actionsModel.handleSendRecommendations,
    handlePaymentAdded: actionsModel.handlePaymentAdded,
    handleUpdatePaymentDetails: actionsModel.handleUpdatePaymentDetails,
    handleAssignStorageLocation: actionsModel.handleAssignStorageLocation,
    fetchOrders: ordersModel.fetchOrders,
  };
}

export type UseMonitoringPesananReturn = ReturnType<typeof useMonitoringPesanan>;
