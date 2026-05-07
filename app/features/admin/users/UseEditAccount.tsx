import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { userApi } from "~/api/userApi";

interface ToastProps {
    title: string;
    variant: "success" | "destructive" | "default";
}

export const useEditAccount = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "", 
        role: "customer",
        // Commercial fields
        customerId: "",
        category: "",
        memberSince: "",
        phone: "",
        address: "",
        staffId: "",
        position: "",
    });

    const [initialLoading, setInitialLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toastProps, setToastProps] = useState<ToastProps | null>(null);

    const showToast = (
        title: string,
        variant: "success" | "destructive" | "default" = "success",
    ) => {
        setToastProps({ title, variant });
        setTimeout(() => setToastProps(null), 3000);
    };

    useEffect(() => {
        if (id) {
            fetchUser(id);
        }
    }, [id]);

    const fetchUser = async (userId: string) => {
        setInitialLoading(true);
        try {
            const res = await userApi.getUserById(userId);
            const user = res.data;

            setFormData({
                email: user.email,
                name: user.nama || user.name || "",
                password: "",
                role: user.role,
                customerId: user.customerId || "",
                category: user.category || "",
                memberSince: user.memberSince || "",
                phone: user.phone || "",
                address: user.address || "",
                staffId: user.staffId || "",
                position: user.position || "",
            });
        } catch (error) {
            console.error("Failed to fetch user", error);
            showToast("Failed to fetch user details", "destructive");
            navigate("/admin/users");
        } finally {
            setInitialLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        setFormData((prev) => ({ ...prev, password: retVal }));
        setShowPassword(true);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.password) {
                delete (payload as any).password;
            }

            await userApi.updateUser(id!, payload);
            showToast("User updated successfully", "success");

            const backTab = formData.role === 'customer' ? 'customer' : 'internal';
            setTimeout(() => {
                navigate(`/admin/users?tab=${backTab}`);
            }, 1000);
        } catch (error: any) {
            console.error("Update failed", error);
            showToast(
                error.response?.data?.message || "Failed to update user",
                "destructive",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return {
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
    };
};
