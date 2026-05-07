import { useRef, useState, useEffect } from "react";
import { UPLOADS_URL } from "~/api/client";
import Avatar, { AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import type { Message, ChatContact } from "~/types/chat";
import { cn } from "~/lib/utils";
import { Paperclip, Send, FileText, ArrowLeft, X, Check, CheckCheck, Trash2, UserPlus, ShoppingBag } from "lucide-react";
import { MessageActionMenu } from "./message-action-menu";
import { DeleteMessageDialog } from "./delete-message-dialog";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { DeleteGroupDialog } from "./delete-group-dialog";
import { profileApi } from "~/api/profileApi";
import { orderService } from "~/services/orderService";

interface ChatWindowProps {
    activeContact: ChatContact | null;
    messages: Message[];
    currentUser: { id: number; username: string; role?: string } | null;
    onSendMessage: (content: string, file?: File, replyToId?: number) => void;
    onEditMessage?: (messageId: number, newContent: string) => void;
    isLoadingHistory: boolean;
    onBack?: () => void;
    onMarkAsRead?: (targetId: number | string, isGroup?: boolean) => void;
    onDeleteMessage?: (messageId: number) => void;
    onDeleteMessageForMe?: (messageId: number) => void;
    onAddMembers?: () => void;
    onRemoveMember?: (memberId: number) => Promise<void> | void;
    onDeleteGroup?: () => Promise<void> | void;
    internalTeamMembers?: any[];
    fetchInternalTeamMembers?: () => void;
}

export function ChatWindow({
    activeContact,
    messages,
    currentUser,
    onSendMessage,
    onEditMessage,
    isLoadingHistory,
    onBack,
    onMarkAsRead,
    onDeleteMessage,
    onDeleteMessageForMe,
    onAddMembers,
    onRemoveMember,
    onDeleteGroup,
    internalTeamMembers = [],
    fetchInternalTeamMembers
}: ChatWindowProps) {
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
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Function to get Avatar Details (Consistent with Sidebar)
    const getAvatarDetails = (contact: ChatContact) => {
        const role = contact.role?.toLowerCase() || "";
        const username = contact.username?.toLowerCase() || "";
        
        let initials = "";
        let color = "bg-[#dfe3e5]";
        let image = "";

        if (contact.id === 0) { // Internal Team
            return { initials: "IT", color: "bg-[#D25026] text-white", image: "" }; 
        }

        if (role.includes("mahasiswa") || username.includes("mahasiswa") || role.includes("customer")) {
            image = "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740&q=80";
        } else if (role.includes("dosen") || username.includes("dosen") || role.includes("desain")) {
            image = "https://rmik.poltekkes-smg.ac.id/wp-content/uploads/2023/10/Doen.png";
        } else if (role.includes("kaprodi") || username.includes("kaprodi")) {
            initials = "Ka";
            color = "bg-[#fdffb6]"; 
        } else if (role.includes("staf") || username.includes("staf")) {
            initials = "Sf";
            color = "bg-[#caffbf]"; 
        } else {
            initials = contact.username
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }

        return { 
            initials, 
            color, 
            image: contact.photo ? profileApi.getProfilePhotoUrl(contact.photo) : image 
        };
    };

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, replyingTo, editingMessageId]);

    // Mark as read when messages load or activeContact changes
    useEffect(() => {
        if (activeContact && onMarkAsRead) {
            const isGroup = activeContact.isGroup || activeContact.id === 0;
            onMarkAsRead(activeContact.id, isGroup);
        }
    }, [messages.length, activeContact?.id, onMarkAsRead]);

    useEffect(() => {
        if (isGroupInfoOpen && activeContact?.id === 0 && fetchInternalTeamMembers) {
            fetchInternalTeamMembers();
        }
    }, [isGroupInfoOpen, activeContact?.id, fetchInternalTeamMembers]);

    // Fetch active order for customer
    useEffect(() => {
        const fetchActiveOrder = async () => {
            const isInternal = ["admin", "desain", "manager", "gudang"].includes(currentUser?.role?.toLowerCase() || "");
            const contactRole = activeContact?.role?.toLowerCase() || "";
            const isCustomer = contactRole.includes("customer") || contactRole.includes("mahasiswa");

            if (isInternal && isCustomer && activeContact?.id && activeContact.id !== 0) {
                setIsLoadingOrder(true);
                try {
                    const contactId = typeof activeContact.id === 'string' ? parseInt(activeContact.id) : activeContact.id;
                    const orders = await orderService.getCustomerOrders(contactId);
                    // Get latest active order (not SELESAI/DITOLAK)
                    const latest = orders.find((o: any) => !["SELESAI", "DITOLAK"].includes(o.status));
                    setActiveOrder(latest || null);
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
    }, [activeContact, currentUser]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        
        if (editingMessageId && onEditMessage) {
            onEditMessage(editingMessageId, inputValue);
            setEditingMessageId(null);
            setInputValue("");
        } else {
            onSendMessage(inputValue, undefined, replyingTo?.id);
            setInputValue("");
            setReplyingTo(null);
        }
    };

    const handleEditClick = (msg: Message) => {
        setInputValue(msg.content || "");
        setEditingMessageId(msg.id);
        setReplyingTo(null); // Clear reply if editing
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onSendMessage("", file);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setReplyingTo(null);
        }
    };

    const handleDeleteClick = (messageId: number) => {
        setMessageToDelete(messageId);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteForEveryone = () => {
        if (messageToDelete !== null && onDeleteMessage) {
            onDeleteMessage(messageToDelete);
            setIsDeleteDialogOpen(false);
            setMessageToDelete(null);
        }
    };

    const handleDeleteForMe = () => {
        if (messageToDelete !== null && onDeleteMessageForMe) {
             onDeleteMessageForMe(messageToDelete);
             setIsDeleteDialogOpen(false);
             setMessageToDelete(null);
        }
    };

    if (!activeContact) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] text-[#A1A1A1] font-['Inter']">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-[#E5E5E5] mb-4">
                  <Send className="w-8 h-8 text-[#E5E5E5]" />
                </div>
                <h3 className="text-xl font-bold text-[#333] mb-1">Your Messages</h3>
                <p className="text-sm">Select a contact to start a conversation</p>
            </div>
        );
    }

    const { initials: avatarInitials, color: avatarColor, image: avatarImage } = getAvatarDetails(activeContact);

    return (
        <div className="flex flex-col h-full bg-[#FCFCFC] relative w-full mb-0 font-['Inter'] overflow-hidden">
            {/* Modern Background Pattern (Subtle Dots) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
                backgroundImage: `radial-gradient(#D25026 1px, transparent 1px)`,
                backgroundSize: "32px 32px"
            }} />

            {/* Order Info Banner */}
            {activeOrder && (
                <div className="bg-[#FFF3ED] px-6 py-2 border-b border-[#FDE8DF] flex items-center justify-between z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#D25026] text-white p-1.5 rounded-lg">
                            <ShoppingBag size={14} />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Pesanan Aktif:</span>
                                <span className="text-[10px] font-black text-[#D25026] italic font-mono">{activeOrder.orderId}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-xs font-black text-slate-900 uppercase italic">{activeOrder.details?.[0]?.productTitle || "Custom Jersey"}</span>
                                <span className="text-[9px] px-2 py-0.5 bg-white border border-[#D25026]/20 rounded-full font-black text-[#D25026] uppercase italic">
                                    {activeOrder.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-0.5">Total Biaya:</p>
                        <p className="text-sm font-black text-[#D25026] italic">Rp {activeOrder.totalAmount?.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div 
                className={cn("flex items-center p-4 bg-white/80 backdrop-blur-md border-b border-[#F0F0F0] z-20 shrink-0 h-[70px]", (activeContact.isGroup || activeContact.id === 0) && "cursor-pointer hover:bg-gray-50/50 transition-colors")}
                onClick={() => (activeContact.isGroup || activeContact.id === 0) && setIsGroupInfoOpen(true)}
            >
                <div className="flex items-center flex-1">
                    <Button variant="ghost" size="icon" className="md:hidden mr-2 text-[#54656f]" onClick={(e) => { e.stopPropagation(); onBack?.(); }}>
                        <ArrowLeft size={24} />
                    </Button>
                    
                    <Avatar className={cn("h-10 w-10 mr-3", !avatarImage && avatarColor)} src={avatarImage || ""}>
                        <AvatarImage src={avatarImage} />
                        <AvatarFallback className={cn("text-sm font-bold text-[#54656f]", !avatarImage && avatarColor)}>
                            {avatarInitials}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col">
                        <span className="text-[#111b21] font-medium">{activeContact.username}</span>
                        <span className="text-xs text-[#667781]">{activeContact.isGroup ? `${activeContact.members?.length || 0} anggota` : 'online'}</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-[4px] md:px-12 w-full z-10 relative">
                <div className="flex flex-col space-y-2 pb-0">
                    {isLoadingHistory ? (
                        <div className="flex justify-center p-4">
                            <span className="text-[#8696a0]">Memuat pesan...</span>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.senderId === currentUser?.id;
                            const isPublic = activeContact.id === 0;
                            const senderColor = isPublic ? ['#FF5733', '#33FF57', '#3357FF', '#FF33F5'][msg.senderId % 4] : undefined;

                            if (msg.isDeleted) {
                                return (
                                    <div key={idx} className={cn("flex mb-1", isMe ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[70%] sm:max-w-[60%] rounded-lg px-3 py-2 text-sm italic flex items-center gap-2 shadow-sm",
                                            isMe ? "bg-[#d9fdd3] text-[#54656f]" : "bg-white text-[#54656f]"
                                        )}>
                                            <div className="h-4 w-4 rounded-full border border-current flex items-center justify-center">
                                                <div className="w-3 h-[1px] bg-current rotate-45" />
                                            </div>
                                            <span>Pesan ini telah dihapus</span>
                                             <span className="text-[10px] ml-2 self-end">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={idx} className={cn("flex flex-col mb-1 group max-w-full", isMe ? "items-end" : "items-start")}>
                                    <div
                                        className={cn(
                                            "max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 relative shadow-sm text-[15px] break-words flex flex-col min-w-[140px] transition-all",
                                            isMe
                                                ? "bg-gradient-to-br from-[#E85C2F] to-[#D25026] text-white rounded-tr-none"
                                                : "bg-white text-[#1A1A1A] rounded-tl-none border border-[#F0F0F0]"
                                        )}
                                    >
                                        {/* Action Menu Trigger (Hover) */}
                                        <div className="absolute top-0 right-0 p-1 z-20">
                                            <MessageActionMenu 
                                                isMe={isMe} 
                                                onReply={() => setReplyingTo(msg)}
                                                onDelete={() => handleDeleteClick(msg.id)}
                                                onEdit={() => handleEditClick(msg)}
                                                onInfo={() => {}}
                                            />
                                        </div>

                                        {/* Reply Context */}
                                        {msg.parent && (
                                            <div className={cn(
                                                "rounded-xl p-2 mb-2 border-l-4 text-xs flex flex-col cursor-pointer transition-colors",
                                                isMe ? "bg-white/10 border-white/40" : "bg-gray-50 border-[#D25026]"
                                            )} onClick={() => {
                                                const el = document.getElementById(`msg-${msg.parent!.id}`);
                                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }}>
                                                <span className={cn("font-bold mb-1", isMe ? "text-white" : "text-[#D25026]")}>{msg.parent.sender.username}</span>
                                                <span 
                                                    className={cn("block break-words overflow-hidden text-ellipsis", isMe ? "text-white/80" : "text-[#666]")}
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}
                                                >
                                                    {msg.parent.content || "Attachment"}
                                                </span>
                                            </div>
                                        )}

                                        {/* Sender Name in Public Chat */}
                                        {isPublic && !isMe && (
                                            <div 
                                                className="text-xs font-bold mb-1 cursor-pointer hover:underline"
                                                style={{ color: senderColor }}
                                            >
                                                {msg.sender?.username || 'Unknown'}
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div id={`msg-${msg.id}`}>
                                            {msg.attachmentUrl && (
                                                <div className="mb-1 mt-1">
                                                    {msg.attachmentType === 'image' ? (
                                                        <img 
                                                            src={`${UPLOADS_URL}${msg.attachmentUrl}`} 
                                                            alt="attachment" 
                                                            className="rounded-md max-h-64 object-cover w-full cursor-pointer hover:opacity-90 transition-opacity"
                                                            onClick={() => window.open(`${UPLOADS_URL}${msg.attachmentUrl}`, '_blank')}
                                                        />
                                                    ) : (
                                                        <a 
                                                            href={`${UPLOADS_URL}${msg.attachmentUrl}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center gap-3 p-3 rounded-md bg-[#f0f2f5] hover:bg-[#e9edef] transition-colors border border-[#d1d7db]"
                                                        >
                                                            <FileText size={20} className="text-[#54656f]" />
                                                            <span className="truncate flex-1 text-[#111b21] font-medium">
                                                                {msg.attachmentName || msg.attachmentUrl.split('/').pop()}
                                                            </span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}

                                            <p className="whitespace-pre-wrap leading-relaxed text-[14.2px] pr-6">
                                                {msg.content}
                                            </p>
                                        </div>
                                        
                                        {/* Meta (Time & Status) */}
                                        <div className="flex justify-end items-center gap-1.5 mt-2 select-none self-end">
                                            {msg.isEdited && <span className={cn("text-[10px] italic mr-1", isMe ? "text-white/60" : "text-[#A1A1A1]")}>edited</span>}
                                            <span className={cn("text-[11px] font-medium", isMe ? "text-white/80" : "text-[#A1A1A1]")}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMe && !isPublic && (
                                                <span className={cn(msg.isRead ? (isMe ? "text-white" : "text-[#53bdeb]") : (isMe ? "text-white/40" : "text-[#A1A1A1]"))}>
                                                    {msg.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Replying Banner */}
             {/* Editing/Replying Banner */}
             {(replyingTo || editingMessageId) && (
                <div className="px-6 py-3 bg-white border-t border-[#F0F0F0] flex justify-between items-center animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-1 h-10 rounded-full", editingMessageId ? "bg-blue-500" : "bg-[#D25026]")} />
                        <div className="flex flex-col">
                            <span className={cn("text-[13px] font-bold", editingMessageId ? "text-blue-500" : "text-[#D25026]")}>
                                {editingMessageId ? "Editing Message" : `Replying to ${replyingTo?.sender?.username || 'user'}`}
                            </span>
                            <span className="text-xs text-[#666] truncate max-w-[300px]">
                                {editingMessageId ? inputValue : (replyingTo?.content || "Attachment")}
                            </span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => {
                        setEditingMessageId(null);
                        setReplyingTo(null);
                        if (editingMessageId) setInputValue("");
                    }} className="text-[#A1A1A1] hover:text-red-500 hover:bg-red-50 transition-colors">
                        <X size={20} />
                    </Button>
                </div>
            )}

            {/* Input Area */}
            <div className="px-6 py-4 bg-[#FCFCFC] z-20 border-t border-[#F0F0F0]">
                <div className="max-w-5xl mx-auto flex items-end gap-3">
                    <div className="flex flex-1 items-end bg-white rounded-2xl px-4 py-2 shadow-sm border border-[#F0F0F0] focus-within:ring-2 focus-within:ring-[#D25026]/10 focus-within:border-[#D25026] transition-all">
                         <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        
                        <Button variant="ghost" size="icon" className="mb-1 text-[#A1A1A1] hover:text-[#D25026] hover:bg-[#FFF3ED] rounded-xl transition-all" onClick={() => fileInputRef.current?.click()}>
                            <Paperclip size={20} />
                        </Button>
                        
                        <Textarea
                            placeholder={editingMessageId ? "Type your edits..." : "Type a message..."}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[#1A1A1A] placeholder:text-[#A1A1A1] w-full resize-none py-2.5 min-h-[44px] max-h-[120px] leading-relaxed text-[15px] font-medium"
                            rows={1}
                            style={{ height: 'auto' }}
                            onInput={(e) => {
                                 const target = e.target as HTMLTextAreaElement;
                                 target.style.height = 'auto';
                                 target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                            }}
                        />
                    </div>
                    
                    <Button 
                        onClick={handleSend} 
                        disabled={!inputValue.trim()}
                        className={cn(
                            "rounded-2xl p-0 h-[44px] w-[44px] shadow-lg transition-all active:scale-95 shrink-0",
                             inputValue.trim() ? "bg-[#D25026] text-white hover:bg-[#B3411A]" : "bg-[#E5E5E5] text-white"
                        )}
                    >
                        {editingMessageId ? (
                             <Check size={22} />
                        ) : ( 
                             <Send size={22} className="ml-0.5" />
                        )}
                    </Button>
                </div>
            </div>

            <DeleteMessageDialog 
                open={isDeleteDialogOpen} 
                onOpenChange={setIsDeleteDialogOpen} 
                onDeleteForEveryone={handleDeleteForEveryone}
                onDeleteForMe={handleDeleteForMe}
            />

            {/* Group Info Side Panel (Custom overlay & side panel) */}
            <div 
                className={cn(
                    "fixed inset-0 bg-black/40 z-30 transition-opacity duration-300",
                    isGroupInfoOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsGroupInfoOpen(false)}
            />
            
            <div 
                className={cn(
                    "fixed top-0 right-0 h-full w-[100%] sm:w-[400px] md:w-[450px] bg-[#f0f2f5] p-0 flex flex-col border-none shadow-2xl border-l border-[#d1d7db] z-40 transition-transform duration-300 ease-in-out",
                    isGroupInfoOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="px-6 py-4 bg-[#f0f2f5] flex items-center border-b border-[#d1d7db] shrink-0 h-[60px]">
                    <button onClick={() => setIsGroupInfoOpen(false)} className="mr-5 text-[#54656f] hover:bg-[#dfe3e5] p-2 rounded-full transition-colors flex items-center justify-center focus:outline-none">
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-medium text-[#111b21] m-0 leading-none pb-1">Info grup</h2>
                </div>
                
                {(() => {
                    const displayedMembers = activeContact.id === 0 ? internalTeamMembers : (activeContact.members || []);
                    
                    return (
                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center pt-8">
                            {/* Group Display Area */}
                            <div className="flex flex-col items-center justify-center py-2 mb-6 w-full px-6">
                                <Avatar className={cn("h-48 w-48 mb-6 shadow-sm", !avatarImage && avatarColor)} src={avatarImage || ""}>
                                    <AvatarImage src={avatarImage} />
                                    <AvatarFallback className={cn("text-6xl font-light text-[#54656f]", !avatarImage && avatarColor)}>
                                        {avatarInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-medium text-[#111b21] text-center px-4 break-words max-w-full leading-tight">{activeContact.username}</h2>
                                <p className="text-[15px] text-[#667781] mt-1.5">{activeContact.id === 0 ? "FSCV" : "Grup"} · {displayedMembers.length} anggota</p>
                            </div>
                            
                            {/* Members List Area */}
                            <div className="bg-white w-full py-2 shadow-sm border-t border-b border-[#d1d7db] flex flex-col mb-10">
                                <div className="px-6 py-4 text-[#8696a0] text-sm font-medium flex justify-between items-center bg-white border-b border-[#f0f2f5]">
                                    <span>{displayedMembers.length} anggota</span>
                                    {activeContact.id !== 0 && activeContact.adminId === currentUser?.id && onAddMembers && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={onAddMembers} 
                                            className="h-8 text-[#00a884] hover:bg-[#d9fdd3] hover:text-[#008f6f] px-3 font-medium rounded-full"
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Tambah Anggota
                                        </Button>
                                    )}
                                </div>
                                
                                {displayedMembers.map((member) => (
                                    <div key={`member-${member.id}`} className="flex items-center px-6 py-3 hover:bg-[#f5f6f6] transition-colors group cursor-pointer border-b border-[#f0f2f5] last:border-0">
                                        <Avatar 
                                            className="h-12 w-12 mr-3 bg-[#dfe3e5]" 
                                            src={member.photo ? profileApi.getProfilePhotoUrl(member.photo) : ""}
                                        >
                                            <AvatarImage src={member.photo ? profileApi.getProfilePhotoUrl(member.photo) : ""} />
                                            <AvatarFallback className="text-[15px] font-medium text-[#54656f]">
                                                {(member.username || "U").substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col flex-1 truncate justify-center">
                                            <div className="flex items-center justify-between">
                                                <span className={cn("text-[16px] truncate leading-tight", member.id === currentUser?.id ? "text-[#111b21] font-medium" : "text-[#111b21]")}>
                                                    {member.id === currentUser?.id ? "Anda" : member.username}
                                                </span>
                                                {activeContact.id !== 0 && activeContact.adminId === member.id && (
                                                    <div className="text-[11px] text-[#00a884] border border-[#00a884] rounded px-1.5 py-[2px] ml-3 font-medium opacity-80 border-opacity-30 leading-none">
                                                        Admin grup
                                                    </div>
                                                )}
                                                {activeContact.id !== 0 && activeContact.adminId === currentUser?.id && member.id !== currentUser?.id && onRemoveMember && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMemberToRemove({ id: member.id, name: member.username || 'User' });
                                                        }} 
                                                        className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10 p-0 rounded-full flex-shrink-0"
                                                        title="Keluarkan dari grup"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                )}
                                            </div>
                                            <span className="text-[13px] text-[#667781] truncate capitalize leading-tight mt-0.5">
                                                {member.role?.toLowerCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Danger Zone */}
                            {activeContact?.isGroup && activeContact.adminId === currentUser?.id && (
                                <div className="w-full flex justify-center py-6">
                                    <Button 
                                        variant="outline" 
                                        className="text-red-500 border-red-200 bg-white hover:bg-red-50 hover:text-red-700 w-[90%] font-medium flex items-center justify-center py-5 transition-colors"
                                        onClick={() => setIsDeleteGroupOpen(true)}
                                    >
                                        <Trash2 className="w-5 h-5 mr-3" />
                                        Hapus Grup
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>

            <RemoveMemberDialog 
                open={memberToRemove !== null}
                onOpenChange={(open) => !open && setMemberToRemove(null)}
                memberName={memberToRemove?.name || ""}
                onConfirm={async () => {
                    if (memberToRemove && onRemoveMember) {
                        try {
                             await onRemoveMember(memberToRemove.id);
                        } catch (e) {
                             console.error("Failed handling remove member", e);
                        }
                    }
                }}
            />

            <DeleteGroupDialog
                open={isDeleteGroupOpen}
                onOpenChange={setIsDeleteGroupOpen}
                groupName={activeContact?.username || ""}
                onConfirm={async () => {
                    if (onDeleteGroup) {
                        try {
                            await onDeleteGroup();
                            setIsGroupInfoOpen(false); // Tutup panel
                        } catch (e) {
                            console.error("Failed to delete group", e);
                        }
                    }
                }}
            />
        </div>
    );
}
