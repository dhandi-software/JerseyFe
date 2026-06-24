import { Eye, EyeOff, Check, X, ChevronDown, Menu, Loader2, UploadCloud, FileSpreadsheet, Download, ArrowLeft } from "lucide-react";
import { useCreateAccount } from "./UseCreateAccount";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { useSidebar } from "~/components/ui/sidebar";
import { Toast } from "~/components/ui/toast";
import { CustomSelect } from "~/components/ui/custom-select";
import { useNavigate } from "react-router";

export const CreateAccountMobile = () => {
  const { setOpenMobile } = useSidebar();
  const navigate = useNavigate();
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
    <div className="w-full min-h-screen pt-4 pb-12 bg-white flex flex-col font-geist">
      {/* Header Section */}
      <div className="px-6 mb-8 flex flex-col gap-1 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleCancel}
            className="p-1 -ml-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#0D0D12]" />
          </button>
          <h1 className="text-[1.25rem] font-bold text-[#0D0D12]">
            Buat Akun Baru
          </h1>
        </div>
        <p className="text-[0.875rem] text-[#71717A] pl-9 leading-relaxed">
          Pilih peran dan isi detail untuk mendaftarkan pengguna baru.
        </p>
      </div>

      <div className="px-6 flex flex-col gap-6">

        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[#18181B]">Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Masukkan nama lengkap"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D25026]/10 focus:border-[#D25026] transition-all text-[#18181B] placeholder:text-[#A1A1AA] text-[0.875rem] disabled:opacity-50 disabled:bg-gray-50"
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[#18181B]">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={formData.role === 'customer' ? "kustomer@jerseybaju.com" : "staf@jerseybaju.com"}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D25026]/10 focus:border-[#D25026] transition-all text-[#18181B] placeholder:text-[#A1A1AA] text-[0.875rem] disabled:opacity-50 disabled:bg-gray-50"
          />
        </div>

        {/* Single Unified Role Selection */}
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
           <label className="text-[0.875rem] font-medium text-[#18181B]">Peran Pengguna</label>
           <CustomSelect
               value={formData.role}
               onChange={(value) => handleRoleChange(value)}
               options={[
                  { label: "Kustomer", value: "customer" },
                  { label: "Desainer (Internal)", value: "desain" },
                  { label: "Staf Gudang (Internal)", value: "gudang" },
               ]}
               placeholder="Pilih Peran Pengguna"
               className="w-full px-4 py-3 h-auto"
           />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[#18181B]">Kata Sandi</label>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan kata sandi"
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D25026]/10 focus:border-[#D25026] transition-all text-[#18181B] placeholder:text-[#A1A1AA] text-[0.875rem] disabled:opacity-50 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#71717A] transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="button"
              onClick={generatePassword}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl border border-gray-300 text-[0.875rem] font-semibold text-[#18181B] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Generate Password
            </button>
            <span className="text-xs text-[#71717A] text-center mt-1">
                Kata sandi minimal 8 karakter acak.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-gray-100 pb-12 w-full">
            <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3.5 bg-[#D25026] text-white rounded-xl text-[0.9375rem] font-semibold hover:bg-[#B3411A] transition-all active:scale-95 shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
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
            <button
               type="button"
               onClick={handleCancel}
               disabled={isLoading}
               className="w-full py-3.5 rounded-xl border border-gray-300 text-[#18181B] text-[0.9375rem] font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
             >
               Batal
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
