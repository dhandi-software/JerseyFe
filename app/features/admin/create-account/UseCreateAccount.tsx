import { useState, useEffect } from "react";
import { userApi } from "~/api/userApi";
import { useNavigate, useSearchParams } from "react-router";

interface ToastProps {
  title: string;
  variant: "success" | "destructive" | "default";
}

export const useCreateAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "customer", 
  });

  // Sync role with URL param on mount
  useEffect(() => {
    if (roleParam && ["customer", "desain", "gudang", "manager", "admin"].includes(roleParam)) {
        setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [roleParam]);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastProps, setToastProps] = useState<ToastProps | null>(null);

  const showToast = (
    title: string,
    variant: "success" | "destructive" | "default" = "success"
  ) => {
    setToastProps({ title, variant });
    setTimeout(() => {
      setToastProps(null);
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let retVal = "";
    for (let i = 0; i < 12; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData((prev) => ({ ...prev, password: retVal }));
    setShowPassword(true);
  };

  const validate = () => {
    if (!formData.email) {
      showToast("Email dibutuhkan", "destructive");
      return false;
    }
    if (!formData.name) {
      showToast("Nama dibutuhkan", "destructive");
      return false;
    }
    if (!formData.password) {
      showToast("Password dibutuhkan", "destructive");
      return false;
    }
    return true;
  };

  const handleCancel = () => {
      const backTab = formData.role === 'customer' ? 'customer' : 'internal';
      navigate(`/admin/users?tab=${backTab}`);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
        if (formData.role.toLowerCase() === 'customer') {
            await userApi.createCustomer({
                email: formData.email,
                password: formData.password,
                nama: formData.name,
            });
        } else {
            await userApi.createStaff({
                email: formData.email,
                password: formData.password,
                nama: formData.name,
                role: formData.role
            });
        }

      showToast("Akun berhasil dibuat", "success");

      const backTab = formData.role === 'customer' ? 'customer' : 'internal';
      setTimeout(() => {
          navigate(`/admin/users?tab=${backTab}`);
      }, 1500);

    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Gagal membuat akun";
      showToast(message, "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
