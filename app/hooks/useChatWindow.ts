import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Message, ChatContact } from "~/types/chat";
import { profileApi } from "~/api/profileApi";
import { orderService } from "~/services/orderService";

export interface UseChatWindowProps {
    activeContact: ChatContact | null;
    messages: Message[];
    currentUser: { id: number; username: string; role?: string } | null;
    isLoadingHistory?: boolean;
    onSendMessage: (content: string, file?: File, replyToId?: number, attachment?: { url: string; name: string; type: "image" | "document" }) => void;
    onEditMessage?: (messageId: number, newContent: string) => void;
    onMarkAsRead?: (targetId: number | string, isGroup?: boolean) => void;
    onDeleteMessage?: (messageId: number) => void;
    onDeleteMessageForMe?: (messageId: number) => void;
    onAddMembers?: () => void;
    onRemoveMember?: (memberId: number) => Promise<void> | void;
    onDeleteGroup?: () => Promise<void> | void;
    internalTeamMembers?: any[];
    fetchInternalTeamMembers?: () => void;
}

export function useChatWindow({
    activeContact,
    messages,
    currentUser,
    onSendMessage,
    onEditMessage,
    onMarkAsRead,
    onDeleteMessage,
    onDeleteMessageForMe,
    onRemoveMember,
    onDeleteGroup,
    fetchInternalTeamMembers
}: UseChatWindowProps) {
    const [inputValue, setInputValue] = useState("");
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<{ id: number; name: string } | null>(null);
    const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);
    const [activeOrder, setActiveOrder] = useState<any | null>(null);
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [isOrderDismissed, setIsOrderDismissed] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get Avatar details helper
    const avatarDetails = useMemo(() => {
        if (!activeContact) return { initials: "", color: "bg-slate-800 text-white", image: "" };

        if (activeContact.id === 0) {
            return { initials: "IT", color: "bg-slate-950 text-white", image: "" };
        }

        const initials = (activeContact.username || "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

        return {
            initials,
            color: "bg-slate-800 text-white",
            image: activeContact.photo ? profileApi.getProfilePhotoUrl(activeContact.photo) : ""
        };
    }, [activeContact]);

    // Scroll to bottom when messages or compose states change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, replyingTo, editingMessageId]);

    // Mark as read when messages load or activeContact changes
    useEffect(() => {
        if (activeContact && onMarkAsRead) {
            const isGroup = activeContact.isGroup || activeContact.id === 0;
            onMarkAsRead(activeContact.id, isGroup);
        }
        setIsOrderDismissed(false);
    }, [messages.length, activeContact?.id, onMarkAsRead]);

    // Fetch internal team members when group info sheet opens
    useEffect(() => {
        if (isGroupInfoOpen && activeContact?.id === 0 && fetchInternalTeamMembers) {
            fetchInternalTeamMembers();
        }
    }, [isGroupInfoOpen, activeContact?.id, fetchInternalTeamMembers]);

    // Fetch active order linked to conversation
    useEffect(() => {
        const fetchActiveOrder = async () => {
            if (!activeContact) return;
            const role = currentUser?.role?.toLowerCase() || "";
            const isInternal = ["admin", "desain", "manager", "gudang"].includes(role);

            const contactRole = activeContact?.role?.toLowerCase() || "";
            const isContactCustomer = contactRole.includes("customer");
            const isContactInternal = ["admin", "desain", "manager", "gudang"].some(r => contactRole.includes(r));

            const queryOrderId = searchParams.get("orderId");
            if (queryOrderId) setIsOrderDismissed(false);

            let targetCustomerId = null;
            if (isInternal && isContactCustomer) {
                targetCustomerId = typeof activeContact.id === 'string' ? parseInt(activeContact.id) : activeContact.id;
            } else if (role.includes("customer") && isContactInternal) {
                targetCustomerId = currentUser?.id;
            }

            if (targetCustomerId && activeContact?.id && activeContact.id !== 0) {
                setIsLoadingOrder(true);
                try {
                    const orders = await orderService.getCustomerOrders(targetCustomerId);
                    let targetOrder = null;
                    if (queryOrderId) {
                        targetOrder = orders.find((o: any) => o.id === parseInt(queryOrderId) || o.orderId === queryOrderId);
                    }
                    setActiveOrder(targetOrder || null);
                } catch (error) {
                    console.error("Failed to fetch order for chat:", error);
                } finally {
                    setIsLoadingOrder(false);
                }
            } else {
                setActiveOrder(null);
            }
        };

        fetchActiveOrder();
    }, [activeContact, currentUser, searchParams]);

    const handleSendOrderReference = useCallback(() => {
        if (!activeOrder) return;
        const message = `Halo, saya sedang memproses pesanan ini:\n📌 No. Pesanan: ${activeOrder.orderId}\n👕 Produk: ${activeOrder.details?.[0]?.productTitle || "Custom Jersey"}\n💰 Total: Rp ${activeOrder.totalAmount?.toLocaleString('id-ID')}`;

        const attachment = activeOrder.designUrl ? {
            url: activeOrder.designUrl,
            name: `Design-${activeOrder.orderId}`,
            type: "image" as const
        } : undefined;

        onSendMessage(message, undefined, undefined, attachment);
        setIsOrderDismissed(true);

        if (searchParams.get("orderId")) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("orderId");
            setSearchParams(newParams, { replace: true });
        }
    }, [activeOrder, onSendMessage, searchParams, setSearchParams]);

    const handleSend = useCallback(() => {
        if (!inputValue.trim()) return;

        const queryOrderId = searchParams.get("orderId");
        if (queryOrderId && activeOrder) {
            handleSendOrderReference();
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("orderId");
            setSearchParams(newParams, { replace: true });
        }

        if (editingMessageId && onEditMessage) {
            onEditMessage(editingMessageId, inputValue);
            setEditingMessageId(null);
            setInputValue("");
        } else {
            onSendMessage(inputValue, undefined, replyingTo?.id);
            setInputValue("");
            setReplyingTo(null);
        }
    }, [inputValue, searchParams, activeOrder, handleSendOrderReference, setSearchParams, editingMessageId, onEditMessage, onSendMessage, replyingTo]);

    const handleEditClick = useCallback((msg: Message) => {
        setInputValue(msg.content || "");
        setEditingMessageId(msg.id);
        setReplyingTo(null);
    }, []);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onSendMessage("", file);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setReplyingTo(null);
        }
    }, [onSendMessage]);

    const handleDeleteClick = useCallback((messageId: number) => {
        setMessageToDelete(messageId);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteForEveryone = useCallback(() => {
        if (messageToDelete !== null && onDeleteMessage) {
            onDeleteMessage(messageToDelete);
            setIsDeleteDialogOpen(false);
            setMessageToDelete(null);
        }
    }, [messageToDelete, onDeleteMessage]);

    const handleDeleteForMe = useCallback(() => {
        if (messageToDelete !== null && onDeleteMessageForMe) {
            onDeleteMessageForMe(messageToDelete);
            setIsDeleteDialogOpen(false);
            setMessageToDelete(null);
        }
    }, [messageToDelete, onDeleteMessageForMe]);

    return {
        inputValue,
        setInputValue,
        replyingTo,
        setReplyingTo,
        editingMessageId,
        setEditingMessageId,
        messageToDelete,
        setMessageToDelete,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isGroupInfoOpen,
        setIsGroupInfoOpen,
        memberToRemove,
        setMemberToRemove,
        isDeleteGroupOpen,
        setIsDeleteGroupOpen,
        activeOrder,
        setActiveOrder,
        isLoadingOrder,
        isOrderDismissed,
        setIsOrderDismissed,
        fileInputRef,
        messagesEndRef,
        avatarDetails,
        handleSendOrderReference,
        handleSend,
        handleEditClick,
        handleFileUpload,
        handleDeleteClick,
        handleDeleteForEveryone,
        handleDeleteForMe
    };
}
