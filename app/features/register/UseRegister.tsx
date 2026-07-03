import { useState } from "react";
import { userApi } from "~/api/userApi";
import { useNavigate } from "react-router";

interface ToastProps {
  title: string;
  variant: "success" | "destructive" | "default";
}

export const useRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      navigate(`/login`);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await userApi.createCustomer({
        email: formData.email,
        password: formData.password,
        nama: formData.name,
      });

      showToast("Akun berhasil dibuat", "success");

      setTimeout(() => {
        navigate(`/login`);
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
    togglePasswordVisibility,
    generatePassword,
    handleSubmit,
    handleCancel,
  };
};
