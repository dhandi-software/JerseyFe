import { useState } from "react";
import { X, Plus, Store, Trash2, Edit2, AlertCircle, Loader2, Check } from "lucide-react";
import { cn } from "~/lib/utils";
import type { StorageLocation, CreateStorageLocationInput, UpdateStorageLocationInput } from "~/types/storageLocation";

interface StorageLocationManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: StorageLocation[];
  onCreate: (input: CreateStorageLocationInput) => Promise<any>;
  onUpdate: (id: number, input: UpdateStorageLocationInput) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
  loading?: boolean;
}

export function StorageLocationManagerModal({
  isOpen,
  onClose,
  locations,
  onCreate,
  onUpdate,
  onDelete,
  loading = false,
}: StorageLocationManagerModalProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateStorageLocationInput>({
    name: "",
    code: "",
    address: "",
    notes: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({ name: "", code: "", address: "", notes: "" });
    setEditingId(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleStartEdit = (loc: StorageLocation) => {
    setEditingId(loc.id);
    setFormData({
      name: loc.name,
      code: loc.code,
      address: loc.address || "",
      notes: loc.notes || "",
    });
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setErrorMessage("Nama lokasi dan kode lokasi wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        address: formData.address?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
      };

      if (editingId) {
        await onUpdate(editingId, payload);
        setSuccessMessage("Lokasi toko berhasil diperbarui.");
      } else {
        await onCreate(payload);
        setSuccessMessage("Lokasi toko baru berhasil ditambahkan.");
      }
      resetForm();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || "Gagal menyimpan lokasi toko.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (loc: StorageLocation) => {
    if ((loc.orderCount || 0) > 0) {
      setErrorMessage(`Lokasi '${loc.name}' tidak dapat dihapus karena menampung ${loc.orderCount} pesanan aktif.`);
      return;
    }
    if (!confirm(`Hapus lokasi '${loc.name}' (${loc.code})?`)) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onDelete(loc.id);
      setSuccessMessage(`Lokasi '${loc.name}' berhasil dihapus.`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || "Gagal menghapus lokasi toko.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-geist">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D25026]/10 text-[#D25026] flex items-center justify-center">
              <Store size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-900">
                Kelola Lokasi Toko & Gudang
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Tambah, ubah, dan pantau lokasi penyimpanan pesanan selesai
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <Check size={15} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 italic flex items-center gap-2">
              <Plus size={14} className="text-[#D25026]" />
              {editingId ? "Edit Lokasi Toko" : "Tambah Lokasi Toko Baru"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Nama Toko / Lokasi *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Toko Utama Pusat"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#D25026]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Kode Singkat Toko *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: TK-PST"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#D25026]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Alamat Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Jl. Gatot Subroto No. 10"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#D25026]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Catatan / Rak
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Lantai 1, Rak A-02"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#D25026]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Batal Edit
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#D25026] hover:bg-[#B34320] text-white rounded-xl text-xs font-black uppercase tracking-wider italic transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                <span>{editingId ? "Simpan Perubahan" : "Tambah Lokasi"}</span>
              </button>
            </div>
          </form>

          {/* Locations Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 italic">
              Daftar Lokasi Toko ({locations.length})
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {locations.map((loc) => {
                const count = loc.orderCount || 0;
                return (
                  <div key={loc.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-lg border border-indigo-200">
                          {loc.code}
                        </span>
                        <h4 className="text-sm font-black italic uppercase text-slate-900">{loc.name}</h4>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                            count > 0 ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                          )}
                        >
                          {count} Pesanan
                        </span>
                      </div>
                      {(loc.address || loc.notes) && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          {loc.address && <span className="truncate">{loc.address}</span>}
                          {loc.address && loc.notes && <span>•</span>}
                          {loc.notes && <span className="text-slate-400 italic">{loc.notes}</span>}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(loc)}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Lokasi"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(loc)}
                        disabled={count > 0}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          count > 0
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        )}
                        title={count > 0 ? "Tidak dapat dihapus karena memiliki pesanan aktif" : "Hapus Lokasi"}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {locations.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider italic">
                  Belum ada lokasi toko yang didaftarkan
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
