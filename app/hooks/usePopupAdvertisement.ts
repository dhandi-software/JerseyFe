import { useState, useRef, useEffect } from "react";
import type { 
    MediaItem, 
    PopupAdvertisementProps, 
    PopupAdvertisementErrors, 
    PopupPosition 
} from "~/types";

export function usePopupAdvertisement({ onClose, onImageSelect }: PopupAdvertisementProps) {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [position, setPosition] = useState<PopupPosition>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState<PopupPosition>({ x: 0, y: 0 });
    const [errors, setErrors] = useState<PopupAdvertisementErrors>({
        image: false,
        title: false,
        link: false,
    });
    const popupRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Center popup on mount (for desktop)
    useEffect(() => {
        if (popupRef.current) {
            const popupWidth = popupRef.current.offsetWidth;
            const popupHeight = popupRef.current.offsetHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            setPosition({
                x: (windowWidth - popupWidth) / 2,
                y: (windowHeight - popupHeight) / 2,
            });
        }
    }, []);

    // Drag handlers
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y,
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (popupRef.current) {
            setIsDragging(true);
            const rect = popupRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleAddImage = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, image: false }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            image: !selectedFile,
            title: !title.trim(),
            link: !link.trim(),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleInsertImage = () => {
        if (!validateForm()) {
            return;
        }

        if (selectedFile) {
            const mediaItem: MediaItem = {
                id: Date.now().toString(),
                file: selectedFile,
                url: previewUrl || URL.createObjectURL(selectedFile),
                name: selectedFile.name,
                extension: selectedFile.name.split(".").pop() || "",
            };
            onImageSelect(mediaItem);
            onClose();
        }
    };

    return {
        title,
        setTitle,
        link,
        setLink,
        selectedFile,
        setSelectedFile,
        previewUrl,
        setPreviewUrl,
        position,
        errors,
        setErrors,
        popupRef,
        fileInputRef,
        handleAddImage,
        handleFileSelect,
        handleInsertImage,
        handleMouseDown,
    };
}
