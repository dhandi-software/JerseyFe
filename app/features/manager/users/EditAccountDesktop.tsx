import { ArrowLeft, Eye, EyeOff, Save, ShieldCheck, User as UserIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { CustomSelect } from "~/components/ui/custom-select";
import { useEditAccount } from "./UseEditAccount";
import { useAuth } from "~/hooks/useAuth";

export function EditAccountDesktop() {
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

    if (initialLoading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-gray-500 font-geist">
                <div className="w-10 h-10 border-4 border-[#D25026] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-medium">Memuat data pengguna...</p>
            </div>
        );
    }

    const isCustomer = formData.role === "customer";
    const isInternal = ["desain", "gudang", "manager", "admin"].includes(formData.role);

    return (
        <div className="p-8 md:p-10 w-full font-geist bg-white min-h-screen">
            {/* Toast Notification */}
            {toastProps && (
                <div
                    className={cn(
                        "fixed top-6 right-6 z-[100] px-5 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 transition-all duration-500 animate-in slide-in-from-right-5",
                        toastProps.variant === "success"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                            : "bg-red-50 border-red-100 text-red-800",
                    )}
                >
                    <div className={cn("w-2.5 h-2.5 rounded-full", toastProps.variant === "success" ? "bg-emerald-500" : "bg-red-500")} />
                    <p className="text-sm font-bold tracking-tight">{toastProps.title}</p>
                </div>
            )}

            <div className="mb-10 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => {
                                const backTab = formData.role === 'customer' ? 'customer' : 'internal';
                                navigate(`/admin/users?tab=${backTab}`);
                            }}
                            className="p-2 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-100"
                        >
                            <ArrowLeft size={22} className="text-slate-600" />
                        </button>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Edit Profil <span className="text-[#D25026] capitalize">{formData.role}</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-12">
                        Perbarui informasi akun dan detail profil pengguna FCSV.
                    </p>
                </div>
                
                <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100 flex items-center gap-2">
                    {isCustomer ? <UserIcon size={18} className="text-[#D25026]" /> : <ShieldCheck size={18} className="text-[#D25026]" />}
                    <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{formData.role} Account</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl">
                {/* Main Content Area */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    
                    {/* Basic Information Section */}
                    <section className="flex flex-col gap-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-[#D25026] rounded-full" />
                            Informasi Dasar
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Full name"
                                    disabled={isLoading}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#D25026]/5 focus:border-[#D25026] transition-all text-slate-900 font-bold placeholder:text-slate-300 text-[15px] bg-white"
                                />
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Aktif</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email address"
                                    disabled={isLoading}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#D25026]/5 focus:border-[#D25026] transition-all text-slate-900 font-bold placeholder:text-slate-300 text-[15px] bg-white"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Commercial Profiles Section */}
                    <section className="flex flex-col gap-6 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-[#D25026] rounded-full" />
                            Detail Profil Bisnis
                        </h2>

                        {isCustomer && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Customer ID (Auto)</label>
                                    <input
                                        type="text"
                                        value={formData.customerId}
                                        readOnly
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 font-bold text-[15px] cursor-not-allowed"
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Kategori Jersey</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Futsal, Basket, Esport"
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#D25026]/5 focus:border-[#D25026] outline-none font-bold text-[15px]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">No. WhatsApp</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="0812xxxx"
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#D25026]/5 focus:border-[#D25026] outline-none font-bold text-[15px]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Member Sejak</label>
                                    <input
                                        type="text"
                                        name="memberSince"
                                        value={formData.memberSince}
                                        onChange={handleInputChange}
                                        placeholder="2026"
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#D25026]/5 focus:border-[#D25026] outline-none font-bold text-[15px]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5 md:col-span-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Alamat Pengiriman</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange(e as any)}
                                        rows={3}
                                        placeholder="Alamat lengkap kustomer"
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#D25026]/5 focus:border-[#D25026] outline-none font-bold text-[15px] resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {isInternal && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Staff ID (Auto)</label>
                                    <input
                                        type="text"
                                        value={formData.staffId}
                                        readOnly
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 font-bold text-[15px] cursor-not-allowed"
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Posisi / Jabatan</label>
                                    <CustomSelect
                                        value={formData.position}
                                        onChange={(value) => handleInputChange({ target: { name: "position", value } } as any)}
                                        options={[
                                            { label: "Designer", value: "Designer" },
                                            { label: "Production Staff", value: "Production" },
                                            { label: "Warehouse Staff", value: "Warehouse" },
                                            ...(useAuth().user?.role !== 'admin' ? [{ label: "Manager", value: "Manager" }] : []),
                                            { label: "Administrator", value: "Admin" },
                                        ].sort((a, b) => a.label.localeCompare(b.label))}
                                        placeholder="Pilih Posisi"
                                        className="w-full px-5 py-4 h-[60px] rounded-2xl"
                                    />
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar area: Password & Actions */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <section className="p-8 bg-slate-900 rounded-[32px] text-white shadow-xl flex flex-col gap-6">
                        <h2 className="text-lg font-black flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#D25026] rounded-full" />
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
                                    className="w-full px-5 py-4 pr-14 rounded-2xl bg-white/10 border border-white/10 focus:outline-none focus:ring-4 focus:ring-[#D25026]/20 focus:border-[#D25026] text-white font-bold transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={generatePassword}
                                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                            >
                                Generate Acak
                            </button>
                        </div>
                        <p className="text-xs text-white/40 font-medium leading-relaxed">
                            Biarkan kolom sandi berisi bintang atau kosong jika tidak ingin mengubahnya.
                        </p>
                    </section>

                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full py-5 rounded-[24px] bg-[#D25026] text-white font-black uppercase tracking-widest hover:bg-[#B9441F] transition-all shadow-lg shadow-[#D25026]/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                            Simpan Perubahan
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const backTab = formData.role === 'customer' ? 'customer' : 'internal';
                                navigate(`/admin/users?tab=${backTab}`);
                            }}
                            className="w-full py-5 rounded-[24px] bg-white border-2 border-slate-100 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Batalkan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
