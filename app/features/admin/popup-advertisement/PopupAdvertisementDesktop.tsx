import { Image as ImageIcon, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { TextField } from "~/components/ui/TextField";
import { cn } from "~/lib/utils";
import { usePopupAdvertisement } from "~/hooks/usePopupAdvertisement";
import type { PopupAdvertisementProps } from "~/types";

export default function PopupAdvertisementDesktop({
    onClose,
    onImageSelect,
}: PopupAdvertisementProps) {
    const {
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
    } = usePopupAdvertisement({ onClose, onImageSelect });


    return (
        <div
            ref={popupRef}
            className="fixed w-fit h-fit px-[1.5rem] py-[1.5rem] gap-[1.5rem] rounded-lg bg-background border border-border-subtle shadow-lg cursor-move"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: "none",
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Header */}
            <div className="w-full h-fit flex items-center justify-between mb-4">
                <h3 className="w-full h-fit text-label-lg font-semibold text-center">
                    Advertisement
                </h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="w-[1.125rem] h-[1.125rem] hover:bg-transparent absolute right-4 top-4"
                >
                    <X className="w-[1.125rem] h-[1.125rem] text-foreground" />
                </Button>
            </div>

            {/* Image Upload Area */}
            <div className="flex flex-col gap-1 mb-4">
                <div className={cn(
                    "w-[59rem] h-[18.625rem] gap-6 px-sm py-sm rounded-md border border-dashed flex flex-col items-center justify-center overflow-hidden",
                    errors.image
                        ? "border-[#E11D48] ring-[0.1875rem] ring-[#FFC9C999]"
                        : "border-border-subtle"
                )}>
                    {previewUrl ? (
                        <div className="relative w-full h-full">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}
                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <ImageIcon className="w-[2.5rem] h-[2.5rem] text-muted-foreground" />
                            <p className="w-full h-fit text-paragraph-sm text-muted-foreground text-center">
                                Make sure to upload image in vertical (portrait)
                                orientation. Supported formats: JPG & JPEG.
                            </p>
                            <p className="text-[0.75rem] leading-xs text-muted-foreground text-center">
                                Recommended image ratio: 59rem (width) × 18.625rem (height).
                            </p>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/jpg,image/jpeg,image/png"
                                className="hidden"
                            />

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAddImage}
                                className="w-fit h-[2rem] gap-sm px-md py-sm rounded-md bg-background border-border-subtle shadow-xs mt-2"
                            >
                                Add Image
                            </Button>
                        </>
                    )}
                </div>
                {errors.image && (
                    <p className="text-[0.75rem] text-[#E11D48] mt-1">Please upload an image</p>
                )}
            </div>

            {/* Form Fields */}
            <div className="w-full h-fit flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <TextField
                        variant="vertical"
                        label="Title"
                        placeholder="Insert title"
                        size="sm"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (e.target.value.trim()) {
                                setErrors(prev => ({ ...prev, title: false }));
                            }
                        }}
                        className={cn(
                            "w-full",
                            errors.title && "[&_input]:border-[#E11D48] [&_input]:ring-[0.1875rem] [&_input]:ring-[#FFC9C999]"
                        )}
                    />
                    {errors.title && (
                        <p className="text-[0.75rem] text-[#E11D48]">Please add a title</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <TextField
                        variant="vertical"
                        label="Link"
                        placeholder="Insert link"
                        size="sm"
                        value={link}
                        onChange={(e) => {
                            setLink(e.target.value);
                            if (e.target.value.trim()) {
                                setErrors(prev => ({ ...prev, link: false }));
                            }
                        }}
                        className={cn(
                            "w-full",
                            errors.link && "[&_input]:border-[#E11D48] [&_input]:ring-[0.1875rem] [&_input]:ring-[#FFC9C999]"
                        )}
                    />
                    {errors.link && (
                        <p className="text-[0.75rem] text-[#E11D48]">Please add a link</p>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="w-full h-fit flex justify-center gap-sm mt-4">
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleInsertImage}
                    className="w-fit h-[2rem] gap-sm px-md py-sm rounded-md bg-brand-primary-muted-foreground border-border-subtle shadow-xs"
                >
                    Insert Image
                </Button>
            </div>
        </div>
    );
}

