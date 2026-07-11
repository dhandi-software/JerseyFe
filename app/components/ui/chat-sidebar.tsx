import Avatar, { AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import type { ChatContact } from "~/types/chat";
import { cn } from "~/lib/utils";
import { Search, MessageSquarePlus, Users } from "lucide-react";
import { useState } from "react";
import { profileApi } from "~/api/profileApi";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "~/components/ui/dropdown-menu";

interface ChatSidebarProps {
    contacts: ChatContact[];
    activeContact: ChatContact | null;
    onSelectContact: (contact: ChatContact) => void;
    unreadCounts?: Record<string | number, number>;
    currentUserRole?: string;
    currentUser?: any;
    onCreateGroup?: () => void;
}

export function ChatSidebar({ contacts, activeContact, onSelectContact, unreadCounts, currentUserRole, currentUser, onCreateGroup }: ChatSidebarProps) {
    // Helper to get initials
    // Helper to get avatar details
    const getAvatarDetails = (contact: ChatContact) => {
        const role = contact.role?.toLowerCase() || "";
        const username = contact.username?.toLowerCase() || "";

        let initials = "";
        let color = "bg-[#dfe3e5]";
        let image = "";

        if (contact.id === 0) { // Internal Team
            return { initials: "IT", color: "bg-[#D25026] text-white", image: "" };
        }

        if (contact.isGroup) {
            return { initials: contact.username.substring(0, 2).toUpperCase(), color: "bg-[#D25026] text-white", image: "" };
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
            initials = (contact.username || "U")
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

    const [searchQuery, setSearchQuery] = useState("");

    const filteredContacts = contacts.filter(c => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return c.username?.toLowerCase().includes(query) || c.role?.toLowerCase().includes(query);
    });

    const getMyInitials = () => {
        if (!currentUser) return "B";
        const name = currentUser.dosen?.nama || currentUser.mahasiswa?.nama || currentUser.username || "Bayu";

        if (/^\d+$/.test(name)) return "B";

        return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const sortedFilteredContacts = [...filteredContacts].sort((a, b) => {
        // 1. Ruang Publik stays firmly at the top
        if (a.id === 0) return -1;
        if (b.id === 0) return 1;

        // 2. Groups have secondary priority over personal chats
        if (a.isGroup && !b.isGroup) return -1;
        if (!a.isGroup && b.isGroup) return 1;

        // 3. Fallback to newest message time
        const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return timeB - timeA;
    });

    return (
        <div className="w-80 border-r border-[#E5E5E5] bg-white flex flex-col h-full font-['Inter']">
            <div className="px-4 py-3 bg-white border-b border-[#F0F0F0] flex justify-between items-center h-[70px]">
                <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 ring-2 ring-offset-2 ring-transparent group-hover:ring-[#D25026] transition-all" src={currentUser?.photo ? profileApi.getProfilePhotoUrl(currentUser.photo) : ""}>
                        <AvatarImage src={currentUser?.photo ? profileApi.getProfilePhotoUrl(currentUser.photo) : ""} />
                        <AvatarFallback className="bg-[#D25026] text-white font-bold">
                            {getMyInitials()}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Messages</h2>
                </div>
                {currentUserRole?.toUpperCase() === 'DOSEN' && onCreateGroup && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="p-2 text-[#666] hover:bg-[#FFF3ED] hover:text-[#D25026] rounded-xl transition-all duration-200 focus:outline-none"
                                title="Chat Baru"
                            >
                                <MessageSquarePlus className="w-6 h-6" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 bg-white rounded-xl shadow-xl border border-[#F0F0F0] p-1 slide-in-from-top-1">
                            <DropdownMenuItem onClick={onCreateGroup} className="cursor-pointer py-3 px-4 focus:bg-[#FFF3ED] focus:text-[#D25026] rounded-lg transition-colors group">
                                <Users className="w-5 h-5 mr-3 text-[#666] group-hover:text-[#D25026]" />
                                <span className="font-semibold text-[15px]">Grup Baru</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <div className="px-4 py-4 border-b border-[#F0F0F0] bg-white">
                <div className="flex items-center bg-[#F8F9FA] rounded-xl px-4 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#D25026]/20 focus-within:border-[#D25026] border border-transparent transition-all">
                    <Search className="w-4 h-4 text-[#A1A1A1] mr-3" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-[#1A1A1A] w-full text-sm font-medium placeholder:text-[#A1A1A1] py-0.5"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {sortedFilteredContacts.length === 0 ? (
                    <div className="p-8 text-center text-[#8696a0] text-sm">
                        {searchQuery ? "Kontak tidak ditemukan" : "Tidak ada kontak"}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {sortedFilteredContacts.map((contact) => {
                            const unread = unreadCounts?.[contact.id] || 0;
                            const { initials, color, image } = getAvatarDetails(contact);

                            return (
                                <button
                                    key={contact.id}
                                    onClick={() => onSelectContact(contact)}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-4 hover:bg-[#FAFAFA] transition-all text-left border-b border-[#F8F9FA] relative group",
                                        activeContact?.id === contact.id ? "bg-[#FFF3ED]" : ""
                                    )}
                                >
                                    {activeContact?.id === contact.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D25026] rounded-r-lg" />
                                    )}

                                    <div className="relative">
                                        <Avatar className="h-12 w-12 shadow-sm" src={image || ""}>
                                            <AvatarImage src={image} />
                                            <AvatarFallback className={cn("text-sm font-bold", !image && color)}>
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        {contact.id === 0 && (
                                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                                                <Users className="w-3 h-3 text-[#D25026]" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className={cn(
                                                "font-bold truncate text-[15px]",
                                                unread > 0 ? "text-[#1A1A1A]" : "text-[#333]"
                                            )}>
                                                {contact.username}
                                            </span>
                                            {contact.lastMessage && (
                                                <span className={cn(
                                                    "text-[11px] font-medium whitespace-nowrap ml-2 uppercase tracking-tight",
                                                    unread > 0 ? "text-[#D25026]" : "text-[#A1A1A1]"
                                                )}>
                                                    {new Date(contact.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center gap-2">
                                            <p className={cn(
                                                "text-[13px] truncate flex-1",
                                                unread > 0 ? "text-[#444] font-semibold" : "text-[#777]"
                                            )}>
                                                {(() => {
                                                    const text = contact.lastMessage?.content || (contact.lastMessage?.attachmentName ? `📎 ${contact.lastMessage.attachmentName}` : (contact.lastMessage?.attachmentUrl ? "📎 Lampiran file" : "No messages yet"));
                                                    const limit = 40;
                                                    return text.length > limit ? text.substring(0, limit) + "..." : text;
                                                })()}
                                            </p>

                                            {unread > 0 && (
                                                <span className="bg-[#D25026] text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center animate-pulseShadow">
                                                    {unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
