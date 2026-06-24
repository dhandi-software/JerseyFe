import { ArrowLeft, Eye, EyeOff, Loader2, Save, ShieldCheck, User as UserIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { CustomSelect } from "~/components/ui/custom-select";
import { useEditAccount } from "./UseEditAccount";
import { useAuth } from "~/hooks/useAuth";

export function EditAccountMobile() {
  const {
      formData,
      initialLoading,
      isLoading,
      showPassword,
      toastProps,
      handleInputChange,
      togglePasswordVisibility,
      generatePassword,
      handleSubmit,
      navigate
  } = useEditAccount();

  const { user: currentUser } = useAuth();

  if (initialLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
           <Loader2 className="animate-spin text-[#D25026]" size={32} />
        </div>
      );
  }

  const isCustomer = formData.role === "customer";
  const isInternal = ["desain", "gudang", "manager", "admin"].includes(formData.role);

  const backToUsers = () => {
    const backTab = formData.role === 'customer' ? 'customer' : 'internal';
    navigate(`/admin/users?tab=${backTab}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-geist pb-24">
      {/* Toast Notification */}
      {toastProps && (
        <div className={cn(
          "fixed top-4 left-4 right-4 z-[100] px-4 py-4 rounded-full shadow-xl border flex items-center gap-3 animate-in slide-in-from-top-4 duration-500",
          toastProps.variant === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"
        )}>
          <div className={cn("w-2.5 h-2.5 rounded-full", toastProps.variant === "success" ? "bg-emerald-500" : "bg-red-500")} />
          <p className="text-sm font-bold tracking-tight">{toastProps.title}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
         <div className="flex items-center gap-3">
            <button onClick={backToUsers} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
                <h1 className="text-lg font-black text-slate-900 leading-none">Edit Profil</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{formData.role} account</p>
            </div>
         </div>
         <div className="p-2 bg-slate-50 rounded-full border border-slate-100">
            {isCustomer ? <UserIcon size={18} className="text-[#D25026]" /> : <ShieldCheck size={18} className="text-[#D25026]" />}
         </div>
      </div>

      <div className="p-4 flex flex-col gap-6">
         
         {/* Basic Info Section */}
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-5">
             <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 bg-[#D25026] rounded-full" />
                Informasi Dasar
             </h2>
             
             <div className="flex flex-col gap-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                 <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-full border border-slate-100 bg-slate-50 focus:bg-white focus:border-[#D25026] focus:ring-4 focus:ring-[#D25026]/5 outline-none transition-all font-bold text-slate-900 text-sm"
                    placeholder="Nama Lengkap"
                 />
             </div>
             
             <div className="flex flex-col gap-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Aktif</label>
                 <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-full border border-slate-100 bg-slate-50 focus:bg-white focus:border-[#D25026] focus:ring-4 focus:ring-[#D25026]/5 outline-none transition-all font-bold text-slate-900 text-sm"
                    placeholder="email@example.com"
                 />
             </div>
         </div>

         {/* Business Details Section */}
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-5">
             <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 bg-[#D25026] rounded-full" />
                Profil Bisnis
             </h2>
             
             {isCustomer && (
                 <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer ID (Auto)</label>
                        <input type="text" value={formData.customerId} readOnly className="w-full px-4 py-3.5 rounded-full bg-slate-50 border-transparent text-slate-400 font-bold text-sm cursor-not-allowed" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Jersey</label>
                        <input name="category" type="text" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-full border border-slate-100 bg-slate-50 focus:bg-white focus:border-[#D25026] outline-none font-bold text-slate-900 text-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                        <input name="phone" type="text" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-full border border-slate-100 bg-slate-50 focus:bg-white focus:border-[#D25026] outline-none font-bold text-slate-900 text-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat</label>
                        <textarea name="address" rows={3} value={formData.address} onChange={(e) => handleInputChange(e as any)} className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-[#D25026] outline-none font-bold text-slate-900 text-sm resize-none" />
                    </div>
                 </div>
             )}

             {isInternal && (
                 <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Staff ID (Auto)</label>
                        <input type="text" value={formData.staffId} readOnly className="w-full px-4 py-3.5 rounded-full bg-slate-50 border-transparent text-slate-400 font-bold text-sm cursor-not-allowed" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Posisi / Jabatan</label>
                        <CustomSelect
                            value={formData.position}
                            onChange={(value) => handleInputChange({ target: { name: "position", value } } as any)}
                            options={[
                                { label: "Designer", value: "Designer" },
                                { label: "Production Staff", value: "Production" },
                                { label: "Warehouse Staff", value: "Warehouse" },
                                ...(currentUser?.role !== 'admin' ? [{ label: "Manager", value: "Manager" }] : []),
                                { label: "Administrator", value: "Admin" },
                            ].sort((a, b) => a.label.localeCompare(b.label))}
                            placeholder="Pilih Posisi"
                            className="w-full px-4 py-3.5 h-[52px] rounded-full"
                        />
                    </div>
                 </div>
             )}
         </div>

         {/* Security Section */}
         <div className="bg-slate-900 rounded-[32px] p-6 shadow-xl flex flex-col gap-5 text-white">
             <h2 className="text-sm font-black flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 bg-[#D25026] rounded-full" />
                Ganti Kata Sandi
             </h2>
             
             <div className="flex flex-col gap-4">
                 <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Kosongkan jika tidak diubah"
                        className="w-full px-5 py-4 rounded-full bg-white/10 border border-white/10 focus:border-[#D25026] focus:ring-4 focus:ring-[#D25026]/20 outline-none transition-all font-bold text-white text-sm pr-12"
                    />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
                 <button type="button" onClick={generatePassword} className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                    Generate Acak
                 </button>
             </div>
             <p className="text-[10px] text-white/40 font-bold leading-relaxed px-1">
                Biarkan kolom sandi kosong jika Anda tidak ingin mengubahnya.
             </p>
         </div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex gap-3 z-10">
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-[#D25026] text-white font-black uppercase tracking-widest py-4 rounded-full shadow-lg shadow-[#D25026]/20 active:scale-[0.97] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Simpan
          </button>
          <button 
            onClick={backToUsers}
            className="px-6 py-4 bg-white border border-slate-100 text-slate-500 font-black uppercase tracking-widest rounded-full active:scale-[0.97] transition-all"
          >
              Batal
          </button>
      </div>
    </div>
  );
}
