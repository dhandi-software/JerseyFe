import { useCreateAccount } from "./UseCreateAccount";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { Toast } from "~/components/ui/toast";
import { Check, ChevronDown, Eye, EyeOff, Loader2, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { CustomSelect } from "~/components/ui/custom-select";

export const CreateAccountDesktop = () => {
  const {
    formData,
    showPassword,
    isLoading,
    toastProps,
    setToastProps,
    handleInputChange,
    handleRoleChange,
    togglePasswordVisibility,
    generatePassword,
    handleSubmit,
    handleCancel,
  } = useCreateAccount();

  return (
    <div className="p-6 md:p-8 w-full font-geist bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2 mb-2">
            <button
                onClick={handleCancel}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <h1 className="text-2xl font-bold text-[#18181B] leading-tight">
              Buat Akun Pengguna Baru
            </h1>
        </div>
        <p className="text-[#71717A] text-sm ml-8">
          Pilih peran dan isi detail untuk membuat akun pengguna.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full mt-4">

        {/* Name Field */}
        <div className="flex flex-col gap-3">
          <label className="text-base font-semibold text-[#18181B]">Nama Lengkap</label>
          <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
              disabled={isLoading}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D25026]/10 focus:border-[#D25026] transition-all text-[#18181B] placeholder:text-[#A1A1AA] text-base disabled:opacity-50 disabled:bg-gray-50 bg-white"
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-3">
          <label className="text-base font-semibold text-[#18181B]">Email</label>
          <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={formData.role === 'customer' ? "kustomer@jerseybaju.com" : "staf@jerseybaju.com"}
              disabled={isLoading}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D25026]/10 focus:border-[#D25026] transition-all text-[#18181B] placeholder:text-[#A1A1AA] text-base disabled:opacity-50 disabled:bg-gray-50 bg-white"
          />
        </div>

        {/* Single Unified Role Selection */}
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="text-base font-semibold text-[#18181B]">Peran Pengguna</label>
          <CustomSelect
              value={formData.role}
              onChange={(value) => handleRoleChange(value)}
              options={[
                  { label: "Kustomer", value: "customer" },
                  { label: "Desainer (Internal)", value: "desain" },
                  { label: "Staf Gudang (Internal)", value: "gudang" },
                  ...(useAuth().user?.role === 'manager' ? [{ label: "Administrator", value: "admin" }] : []),
                  ...(useAuth().user?.role !== 'admin' ? [{ label: "Manager", value: "manager" }] : []),
              ].sort((a, b) => a.label.localeCompare(b.label))}
              placeholder="Pilih Peran Pengguna"
              className="w-full px-5 py-3 h-auto"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-[#18181B]">Kata Sandi</label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan kata sandi"
                disabled={isLoading}
                className="w-full px-5 py-3 pr-14 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D25026]/10 focus:border-[#D25026] transition-all text-[#18181B] placeholder:text-[#A1A1AA] text-base disabled:opacity-50 disabled:bg-gray-50 bg-white"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#71717A] transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="h-[50px] flex items-center">
              <button
                type="button"
                onClick={generatePassword}
                disabled={isLoading}
                className="h-full px-6 rounded-xl border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center whitespace-nowrap"
              >
                <span className="font-semibold text-gray-700 text-sm">Generate Password</span>
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-[#71717A]">
                Kata sandi minimal 8 karakter acak.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
           <button
             type="button"
             onClick={handleCancel}
             disabled={isLoading}
             className="px-6 py-3 rounded-xl border border-gray-300 text-[#18181B] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
           >
             Batal
           </button>
           <button
             type="button"
             onClick={handleSubmit}
             disabled={isLoading}
             className="px-8 py-3 rounded-xl bg-[#D25026] text-white font-medium hover:bg-[#B3411A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
           >
             {isLoading ? (
               <>
                 <Loader2 className="w-5 h-5 animate-spin" />
                 Menyimpan...
               </>
             ) : (
               "Buat Akun"
             )}
           </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastProps && (
        <Toast
          title={toastProps.title}
          variant={toastProps.variant}
          onClose={() => setToastProps(null)}
        />
      )}
    </div>
  );
};
