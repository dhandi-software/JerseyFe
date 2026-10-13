import type { ProfileData, ProfileResponse, ProfileUpdateRequest } from "~/api/types";
import type { ToastProps } from "./common";

export type { ProfileData, ProfileResponse, ProfileUpdateRequest };

export interface ProfileFormData {
    name: string;
    email: string;
    username: string;
    bio: string;
    photo: string;
    photoFile: File | null;
}

export interface UseProfileReturn {
    profile: ProfileData | null;
    isLoading: boolean;
    formData: ProfileFormData;
    isEditing: boolean;
    isSaving: boolean;
    lastPasswordUpdate: string;
    toastProps: ToastProps | null;
    showToast: (title: string, variant?: ToastProps["variant"]) => void;
    handleInputChange: (
        field: keyof Omit<ProfileFormData, "photoFile">,
        value: string,
    ) => void;
    handlePhotoUpload: (file: File) => void;
    handleSaveProfile: () => Promise<void>;
    handleCancelEdit: () => void;
    updateLastPasswordTime: () => void;
    loadProfile: () => Promise<void>;
}

export interface ProfileLogicFormData {
    name: string;
    bio: string;
    photoFile: File | null;
    photoPreview: string;
}
