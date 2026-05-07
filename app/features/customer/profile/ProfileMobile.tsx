import { useState, useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { User, Mail, Shield, Camera, Save, Loader2 } from "lucide-react";
import { profileApi } from "~/api/profileApi";
import { PasswordSection } from "~/components/profile/password-section";

export function ProfileMobile() {
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
    <div className="p-4 space-y-6 font-geist pb-24 animate-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header Mobile */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-[#FFF0EB] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
            {profile?.photo ? (
              <img 
                src={`/uploads/profiles/${profile.photo}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={48} className="text-[#D25026]" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-[#D25026]">
            <Camera size={14} />
          </button>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{user?.name || "Customer"}</h1>
        <p className="text-[#D25026] text-xs font-medium mt-1 flex items-center gap-1">
            <Shield size={14} /> Customer Akun
        </p>
      </div>

      {/* Account Settings Mobile */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-6">
        <div className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nama Lengkap</label>
                <input 
                    type="text" 
                    defaultValue={user?.name || ""}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D25026]/20 outline-none transition-all text-sm"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-sm font-medium">
                    <Mail size={16} /> {profile?.email || profile?.user?.email || user?.email}
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Bio / Alamat</label>
                <textarea 
                    defaultValue={profile?.bio || ""}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D25026]/20 outline-none transition-all text-sm"
                    placeholder="Alamat pengiriman..."
                />
            </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg">
            <Save size={18} /> Simpan Perubahan
        </button>
      </div>

      {/* Security Section Mobile */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
         <PasswordSection />
      </div>

      <div className="text-center py-6 opacity-20 grayscale saturate-0">
         <img src="/images/FSCV.png" alt="FSCV Logo" className="h-8 mx-auto mb-2" />
      </div>
    </div>
  );
}
