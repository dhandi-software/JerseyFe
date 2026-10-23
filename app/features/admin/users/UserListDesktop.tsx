import { Plus, Pencil, Trash2, Download } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { DataTable, type Column } from "~/components/ui/table-user";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "~/components/ui/pagination";
import { DeleteConfirmationModal } from "~/components/ui/delete-confirmation-modal";
import { ForceDeleteModal } from "~/components/ui/force-delete-modal";
import { Checkbox } from "~/components/ui/checkbox";
import { Toast } from "~/components/ui/toast";
import { useUsers } from "~/hooks";

export function UserListDesktop() {
  const {
    navigate,
    activeTab,
    handleTabChange,
    users,
    paginatedUsers,
    loading,
    search,
    setSearch,
    currentPage,
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
    handleToggleSelect,
    handleSelectAll,
    isAllPageSelected,
    toastProps,
    handlePageChange,
    handleExportPDF
  } = useUsers();

  const columns: Column<any>[] = [
    {
      header: (
        <Checkbox 
          checked={isAllPageSelected}
          onCheckedChange={(checked) => handleSelectAll(!!checked)}
        />
      ),
      cell: (user) => {
        const id = user.user?.id || user.userId || user.id;
        return (
          <Checkbox 
            checked={selectedIds.includes(id)}
            onCheckedChange={() => handleToggleSelect(id)}
          />
        );
      },
      width: "40px",
      stopRowClick: true,
    },
    {
      header: "No",
      cell: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
      width: "60px",
    },
    {
      header: "Nama",
      accessorKey: "nama",
      cell: (user) => (
         <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                 <img src={`https://ui-avatars.com/api/?name=${user.nama}&background=random`} alt={user.nama} />
            </div>
            <span className="font-bold text-slate-900">{user.nama}</span>
         </div>
      )
    },
    {
      header: activeTab === "customer" ? "Customer ID" : "Staff ID",
      cell: (user) => (
        <span className="font-mono font-bold text-slate-500 text-xs">
          {activeTab === "customer" ? user.customerId : user.staffId}
        </span>
      ),
    },
    {
      header: "Email",
      cell: (user) => <span className="text-slate-600 font-medium">{user.email || user.user?.email || "-"}</span>,
    },
    {
      header: activeTab === "customer" ? "Kategori" : "Posisi",
      cell: (user) => (
        <span className={cn(
            "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
            activeTab === "customer" ? "bg-blue-50 text-blue-700 border-blue-100 rounded-full" : "bg-purple-50 text-purple-700 border-purple-100 rounded-full"
        )}>
          {activeTab === "customer" ? user.category : user.position}
        </span>
      ),
    },
    ...(activeTab === "internal" ? [{
        header: "Role",
        cell: (user: any) => (
            <span className="capitalize text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                {user.user?.role || "-"}
            </span>
        )
    }] : []),
    {
      header: "Actions",
      cell: (user) => (
        <div className="flex justify-end gap-2">
           <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/edit-account/${user.user?.id || user.userId || user.id}`) }} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#D25026] transition-all cursor-pointer">
                <Pencil size={18} />
           </button>
           <button onClick={(e) => { e.stopPropagation(); confirmDelete(user); }} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all cursor-pointer">
                <Trash2 size={18} />
           </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="p-8 w-full font-geist">
      <DeleteConfirmationModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} title="Hapus Akun" itemName={userToDelete?.name || ""} description="Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan." />
      <ForceDeleteModal isOpen={forceDeleteModalOpen} onClose={() => setForceDeleteModalOpen(false)} onConfirm={handleForceDelete} title="Hapus Paksa" description={blockingMessage} itemName={userToDelete?.name || ""} />
      
      {toastProps && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right-full">
            <Toast {...toastProps} />
        </div>
      )}

      <div className="flex flex-col gap-8 mb-10">
        <div className="flex justify-between items-end">
            <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manajemen Pengguna</h1>
                 <p className="text-slate-500 font-medium mt-1">Kelola akun {activeTab === "customer" ? "Kustomer" : "Tim Internal"} FCSV Jersey.</p>
            </div>
             <div className="flex gap-3">
                 <button onClick={handleExportPDF} className="px-5 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer">
                    <Download size={18} /> Ekspor PDF
                 </button>
                 <Link to={`/admin/create-account?role=${activeTab}`} className="px-5 py-2.5 bg-[#D25026] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#B9441F] transition-all shadow-lg shadow-[#D25026]/20 flex items-center gap-2">
                    <Plus size={18} /> Tambah {activeTab === "customer" ? "Kustomer" : "Staf"}
                 </Link>
             </div>
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex gap-2">
                {(["customer", "internal"] as const).map((tab) => (
                <button key={tab} onClick={() => handleTabChange(tab)} className={cn("px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer", activeTab === tab ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50")}>
                    {tab === 'internal' ? 'Team Internal' : tab}
                </button>
                ))}
            </div>
            <div className="relative w-80">
                <input type="text" placeholder="Cari pengguna..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-[#D25026]/5 focus:border-[#D25026] outline-none transition-all" />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <DataTable data={paginatedUsers} columns={columns} isLoading={loading} onRowClick={(user) => navigate(`/admin/edit-account/${user.user?.id || user.userId || user.id}`)} />
      </div>

      {!loading && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
            <Pagination>
                <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""} /></PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <PaginationItem key={p}><PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(p); }} isActive={currentPage === p}>{p}</PaginationLink></PaginationItem>
                    ))}
                    <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""} /></PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
      )}
    </div>
  );
}
