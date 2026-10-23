import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { userApi } from "~/api/userApi";
import { useAuth } from "~/hooks/useAuth";
import type { ToastProps } from "~/components/ui/toast";

export function useUsers() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") as "customer" | "internal") || "customer";

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filterYear, setFilterYear] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);
    const [forceDeleteModalOpen, setForceDeleteModalOpen] = useState(false);
    const [blockingMessage, setBlockingMessage] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [toastProps, setToastProps] = useState<ToastProps | null>(null);

    const showToast = useCallback((title: string, variant: "success" | "destructive" = "success") => {
        setToastProps({ title, variant });
        setTimeout(() => setToastProps(null), 5000);
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === "internal") {
                const roles = ["desain", "gudang", "manager", "admin"];
                const results = await Promise.all(roles.map(r => userApi.getUsersByRole(r)));
                const allStaff = results.flatMap(r => r.data || []);
                setUsers(allStaff);
            } else {
                const res = await userApi.getUsersByRole("customer");
                setUsers(Array.isArray(res.data) ? res.data : []);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchUsers();
        setCurrentPage(1);
        setSearch("");
        setFilterYear("");
        setIsFilterOpen(false);
        setSelectedIds([]);
    }, [activeTab, fetchUsers]);

    const handleTabChange = useCallback((tab: "customer" | "internal") => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set("tab", tab);
            return newParams;
        });
    }, [setSearchParams]);

    const confirmDelete = useCallback((user: any) => {
        const id = user.user?.id || user.userId || user.id;
        setUserToDelete({ id, name: user.nama });
        setDeleteModalOpen(true);
    }, []);

    const handleDelete = useCallback(async () => {
        if (selectedIds.length > 0 && !userToDelete) {
            try {
                await Promise.all(selectedIds.map(id => userApi.deleteUser(id.toString())));
                fetchUsers();
                setDeleteModalOpen(false);
                setSelectedIds([]);
                showToast("Selected users deleted successfully");
            } catch (error: any) {
                showToast("Failed to delete selected users", "destructive");
            }
            return;
        }

        if (!userToDelete) return;

        try {
            await userApi.deleteUser(userToDelete.id.toString());
            fetchUsers();
            setDeleteModalOpen(false);
            setUserToDelete(null);
            showToast("User deleted successfully");
        } catch (error: any) {
            const message = error.response?.data?.message || "";
            if (error.response?.status === 400) {
                setBlockingMessage(message);
                setDeleteModalOpen(false);
                setTimeout(() => setForceDeleteModalOpen(true), 300);
            } else {
                showToast(message || "Failed to delete user", "destructive");
                setDeleteModalOpen(false);
            }
        }
    }, [selectedIds, userToDelete, fetchUsers, showToast]);

    const handleForceDelete = useCallback(async () => {
        if (!userToDelete) return;
        try {
            await userApi.deleteUser(userToDelete.id.toString(), true);
            fetchUsers();
            setForceDeleteModalOpen(false);
            setUserToDelete(null);
            showToast("User deleted successfully (Force)");
        } catch (error: any) {
            showToast("Failed to force delete user", "destructive");
        }
    }, [userToDelete, fetchUsers, showToast]);

    const handleToggleSelect = useCallback((id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }, []);

    const filteredUsers = useMemo(() => {
        return users
            .filter((user) => {
                if (currentUser?.role === 'admin' && (user.user?.role === 'manager' || user.role === 'manager')) {
                    return false;
                }

                const searchLower = search.toLowerCase();
                return (
                    user.nama?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.customerId?.toLowerCase().includes(searchLower) ||
                    user.staffId?.toLowerCase().includes(searchLower) ||
                    user.category?.toLowerCase().includes(searchLower) ||
                    user.position?.toLowerCase().includes(searchLower)
                );
            })
            .sort((a, b) => {
                const nameA = a.nama?.toLowerCase() || "";
                const nameB = b.nama?.toLowerCase() || "";
                return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });
    }, [users, search, sortOrder, currentUser?.role]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, currentPage]);

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedIds(paginatedUsers.map(u => u.user?.id || u.userId || u.id));
        } else {
            setSelectedIds([]);
        }
    }, [paginatedUsers]);

    const isAllPageSelected = paginatedUsers.length > 0 && paginatedUsers.every(u =>
        selectedIds.includes(u.user?.id || u.userId || u.id)
    );

    const handlePageChange = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    }, [totalPages]);

    const handleExportPDF = useCallback(() => {
        try {
            const doc = new jsPDF();
            doc.text(`Data Pengguna (${activeTab === 'customer' ? 'Customer' : 'Internal Staff'})`, 14, 15);
            const headers = activeTab === 'customer'
                ? [["No", "Nama", "Customer ID", "Email", "Kategori"]]
                : [["No", "Nama", "Staff ID", "Email", "Posisi", "Role"]];

            const rows = filteredUsers.map((u, i) => {
                if (activeTab === 'customer') {
                    return [i + 1, u.nama, u.customerId || "-", u.email || u.user?.email || "-", u.category || "-"];
                }
                return [i + 1, u.nama, u.staffId || "-", u.email || u.user?.email || "-", u.position || "-", u.user?.role || "-"];
            });

            autoTable(doc, {
                head: headers,
                body: rows,
                startY: 20
            });

            doc.save(`users-${activeTab}-${new Date().toISOString().split('T')[0]}.pdf`);
            showToast("Data berhasil diekspor ke PDF");
        } catch (e) {
            console.error(e);
            showToast("Gagal mengekspor PDF", "destructive");
        }
    }, [activeTab, filteredUsers, showToast]);

    return {
        navigate,
        activeTab,
        handleTabChange,
        users,
        filteredUsers,
        paginatedUsers,
        loading,
        search,
        setSearch,
        sortOrder,
        setSortOrder,
        filterYear,
        setFilterYear,
        currentPage,
        setCurrentPage,
        totalPages,
        itemsPerPage,
        deleteModalOpen,
        setDeleteModalOpen,
        userToDelete,
        confirmDelete,
        handleDelete,
        forceDeleteModalOpen,
        setForceDeleteModalOpen,
        handleForceDelete,
        blockingMessage,
        selectedIds,
        setSelectedIds,
        handleToggleSelect,
        handleSelectAll,
        isAllPageSelected,
        isFilterOpen,
        setIsFilterOpen,
        toastProps,
        showToast,
        handlePageChange,
        handleExportPDF,
        fetchUsers
    };
}
