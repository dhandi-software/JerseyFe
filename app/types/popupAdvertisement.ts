import type { MediaItem } from "./media";

export interface PopupAdvertisementProps {
    onClose: () => void;
    onImageSelect: (mediaItem: MediaItem) => void;
}

export interface PopupAdvertisementErrors {
    image: boolean;
    title: boolean;
    link: boolean;
}

export interface PopupPosition {
    x: number;
    y: number;
}
