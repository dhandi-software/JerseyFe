import { useState, useEffect, useRef } from "react";
import { useAuth } from "~/hooks/useAuth";
import { profileApi } from "~/api/profileApi";

export function useProfileLogic() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastProps, setToastProps] = useState<{title: string, variant?: "success" | "destructive"} | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    photoFile: null as File | null,
    photoPreview: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    profileApi.getProfile(user.id.toString())
      .then((res) => {
        setProfile(res.data);
        
        let initialName = res.data?.name || (res.data as any)?.user?.username || (user as any)?.username || "";
        if ((user as any)?.customer?.nama) initialName = (user as any).customer.nama;
        else if ((user as any)?.staff?.nama) initialName = (user as any).staff.nama;
        else if ((user as any)?.nama) initialName = (user as any).nama;
        
        setFormData({
          name: initialName,
          bio: res.data?.bio || "",
          photoFile: null,
          photoPreview: res.data?.photo ? `/uploads/profiles/${res.data.photo}` : "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setToastProps({ title: "Ukuran gambar maksimal 2MB", variant: "destructive" });
        return;
      }
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const updateData: any = {
        name: formData.name,
        bio: formData.bio,
        username: (user as any)?.username || "",
      };
      if (formData.photoFile) {
        updateData.photo = formData.photoFile;
      }

      await profileApi.updateProfile(user.id.toString(), updateData);
      setToastProps({ title: "Profil berhasil diperbarui", variant: "success" });
      
      const res = await profileApi.getProfile(user.id.toString());
      setProfile(res.data);
      if (res.data?.photo) {
        setFormData(prev => ({ ...prev, photoPreview: `/uploads/profiles/${res.data.photo}` }));
      }
    } catch (error: any) {
      setToastProps({ title: error.message || "Gagal memperbarui profil", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = user?.role === "admin" ? "Akun Admin" 
    : user?.role === "desain" ? "Akun Desainer"
    : user?.role === "gudang" ? "Akun Gudang"
    : user?.role === "manager" ? "Akun Manager"
    : "Akun Customer";

  const displayName = formData.name || (user as any)?.username || "User";

  return {
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
  };
}
