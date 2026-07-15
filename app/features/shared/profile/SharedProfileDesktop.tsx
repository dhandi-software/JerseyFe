import React from "react";
import { User, Mail, Shield, Camera, Save, Loader2 } from "lucide-react";
import { PasswordSection } from "~/components/profile/password-section";
import { Toast } from "~/components/ui/toast";
import { useProfileLogic } from "./useProfileLogic";
import { cn } from "~/lib/utils";

export function SharedProfileDesktop() {
  const {
    user,
    profile,
    loading,
    saving,
    toastProps,
    setToastProps,
    formData,
    setFormData,
    fileInputRef,
    handleFileChange,
    handleSave,
    roleLabel,
    displayName
  } = useProfileLogic();

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10 bg-slate-50 min-h-screen">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 pb-20">
      <div className="w-full max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        {toastProps && (
          <Toast 
            title={toastProps.title} 
            variant={toastProps.variant} 
            onClose={() => setToastProps(null)} 
          />
        )}

        {/* Profile Header - Dark Premium Style */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl -z-10 mix-blend-screen pointer-events-none"></div>
          
          <div className="relative group z-10">
            <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              {formData.photoPreview ? (
                <img 
                  src={formData.photoPreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={64} className="text-slate-500" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2.5 bg-slate-800 rounded-full shadow-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 hover:scale-110 transition-all"
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="text-center md:text-left flex-1 z-10">
            <h1 className="text-3xl font-bold text-white">{displayName}</h1>
            <p className="text-slate-400 font-medium mt-2 flex items-center justify-center md:justify-start gap-2">
              <Shield size={16} className="text-slate-500" /> {roleLabel}
            </p>
            <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm font-medium shadow-inner backdrop-blur-sm">
                  <Mail size={16} className="text-slate-400" /> {profile?.email || (profile as any)?.user?.email || user?.email || "email@example.com"}
               </div>
            </div>
          </div>
        </div>

        {/* Account Settings - Light Card on Light Bg */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-slate-900">Informasi Dasar</h2>
              <p className="text-sm text-slate-500">Ubah detail data diri profil Anda.</p>
          </div>
          <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                      <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none transition-all bg-white text-slate-900"
                          placeholder="Masukkan nama lengkap"
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Email Utama</label>
                      <input 
                          type="email" 
                          value={profile?.email || (profile as any)?.user?.email || user?.email || ""}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-medium"
                          disabled
                      />
                  </div>
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Bio / Alamat</label>
                  <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none transition-all bg-white text-slate-900"
                      placeholder="Contoh: Info tambahan..."
                  />
              </div>
              <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-slate-950 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-70"
                  >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
                      {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
              </div>
          </div>
        </div>

        {/* Security Section */}
        <PasswordSection />

        <div className="text-center py-10 opacity-30 grayscale saturate-0">
           <img src="/images/FSCV.png" alt="FSCV Logo" className="h-10 mx-auto mb-2" />
           <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">FSCV Lifestyle & Apparel</p>
        </div>
      </div>
    </div>
  );
}
