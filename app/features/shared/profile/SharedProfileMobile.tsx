import React from "react";
import { User, Mail, Shield, Camera, Save, Loader2 } from "lucide-react";
import { PasswordSection } from "~/components/profile/password-section";
import { Toast } from "~/components/ui/toast";
import { useProfileLogic } from "./useProfileLogic";

export function SharedProfileMobile() {
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
    <div className="min-h-screen bg-slate-50 pb-24">
      {toastProps && (
        <Toast 
          title={toastProps.title} 
          variant={toastProps.variant} 
          onClose={() => setToastProps(null)} 
        />
      )}

      {/* Header Profile - Dark Mode */}
      <div className="bg-slate-950 pt-20 pb-16 px-6 relative overflow-hidden rounded-b-[40px] shadow-xl border-b border-slate-800">
         {/* Subtle background glow */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl -z-10 mix-blend-screen pointer-events-none"></div>
         
         <div className="flex flex-col items-center z-10 relative">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center">
                {formData.photoPreview ? (
                  <img 
                    src={formData.photoPreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={56} className="text-slate-500" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-slate-800 rounded-full shadow-lg border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
              >
                <Camera size={16} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            
            <h1 className="text-2xl font-bold text-white mt-4">{displayName}</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Shield size={14} className="text-slate-500" />
              <p className="text-slate-400 text-sm font-medium">{roleLabel}</p>
            </div>
            
            <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-xs font-medium shadow-inner backdrop-blur-sm">
               <Mail size={14} className="text-slate-400" /> {profile?.email || (profile as any)?.user?.email || user?.email || "email@example.com"}
            </div>
         </div>
      </div>

      <div className="px-6 -mt-8 relative z-20 space-y-6">
        {/* Account Settings */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-slate-900">Informasi Dasar</h2>
          </div>
          <div className="p-5 space-y-5">
              <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                  <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none transition-all text-slate-900 bg-white"
                      placeholder="Masukkan nama lengkap"
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Utama</label>
                  <input 
                      type="email" 
                      value={profile?.email || (profile as any)?.user?.email || user?.email || ""}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-medium text-sm"
                      disabled
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Bio / Alamat</label>
                  <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none transition-all text-slate-900 bg-white"
                      placeholder="Contoh: Info tambahan..."
                  />
              </div>
              <div className="pt-2">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-70"
                  >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
                      {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
              </div>
          </div>
        </div>

        {/* Security Section */}
        <PasswordSection />
      </div>
      
      <div className="text-center mt-12 mb-8 opacity-30 grayscale saturate-0">
         <img src="/images/FCSV.png" alt="FCSV Logo" className="h-8 mx-auto mb-2" />
         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">FCSV Lifestyle & Apparel</p>
      </div>
    </div>
  );
}
