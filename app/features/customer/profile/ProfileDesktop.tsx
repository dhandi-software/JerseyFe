import { useState, useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { User, Mail, Shield, Camera, Save, Loader2 } from "lucide-react";
import { profileApi } from "~/api/profileApi";
import { PasswordSection } from "~/components/profile/password-section";

export function ProfileDesktop() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    profileApi.getProfile(user.id.toString())
      .then((res) => {
        setProfile(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D25026] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 w-full mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-[#FFF0EB] border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
            {profile?.photo ? (
              <img 
                src={`/uploads/profiles/${profile.photo}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={64} className="text-[#D25026]" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-[#D25026] hover:bg-gray-50 transition-colors">
            <Camera size={18} />
          </button>
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{user?.name || "Customer Name"}</h1>
          <p className="text-[#D25026] font-medium mt-1 flex items-center justify-center md:justify-start gap-2">
            <Shield size={16} /> Akun Customer
          </p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-gray-600 text-sm">
                <Mail size={16} /> {profile?.email || profile?.user?.email || user?.email || "email@example.com"}
             </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">Informasi Dasar</h2>
            <p className="text-sm text-gray-500">Data ini digunakan untuk keperluan pesanan Anda.</p>
        </div>
        <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                    <input 
                        type="text" 
                        defaultValue={user?.name || ""}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] outline-none transition-all"
                        placeholder="Masukkan nama lengkap"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Utama</label>
                    <input 
                        type="email" 
                        defaultValue={profile?.email || profile?.user?.email || user?.email || ""}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed font-medium"
                        disabled
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Bio / Alamat</label>
                <textarea 
                    defaultValue={profile?.bio || ""}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] outline-none transition-all"
                    placeholder="Contoh: Alamat pengiriman atau info tambahan..."
                />
            </div>
            <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                    <Save size={18} />
                    Simpan Perubahan
                </button>
            </div>
        </div>
      </div>

      {/* Security Section */}
      <PasswordSection />

      <div className="text-center py-10 opacity-30 grayscale saturate-0 px-24">
         <img src="/images/FSCV.png" alt="FSCV Logo" className="h-10 mx-auto mb-2" />
         <p className="text-xs font-medium uppercase tracking-[0.2em]">FSCV Lifestyle & Apparel</p>
      </div>
    </div>
  );
}
