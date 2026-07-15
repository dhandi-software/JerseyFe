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
            return { initials: "IT", color: "bg-slate-950 text-white", image: "" };
        }

        if (contact.isGroup) {
            return { initials: contact.username.substring(0, 2).toUpperCase(), color: "bg-slate-950 text-white", image: "" };
        }


        initials = (contact.username || "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
        // Default color for users without photo
        color = "bg-slate-800 text-white";

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
        if (!currentUser) return "U";
        const name = currentUser.customer?.nama || currentUser.staff?.nama || currentUser.username || "User";
        
        if (/^\d+$/.test(name)) return "U";
        
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
        <div className="w-80 bg-white/70 backdrop-blur-xl border-r border-white/50 flex flex-col h-full font-['Inter'] shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
            <div className="px-6 py-5 flex justify-between items-center h-[80px]">
                 <div className="flex items-center gap-3">
                     <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-transparent group-hover:ring-slate-950 transition-all shadow-md" src={currentUser?.photo ? profileApi.getProfilePhotoUrl(currentUser.photo) : ""}>
                        <AvatarImage src={currentUser?.photo ? profileApi.getProfilePhotoUrl(currentUser.photo) : ""} />
                        <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-950 text-white font-bold">
                            {getMyInitials()}
                        </AvatarFallback>
                     </Avatar>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pesan</h2>
                 </div>
                 {currentUserRole?.toUpperCase() === 'ADMIN' && onCreateGroup && (
                     <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                             <button 
                                 className="p-2.5 text-slate-500 hover:bg-slate-900 hover:text-white rounded-2xl transition-all duration-300 focus:outline-none shadow-sm hover:shadow-md" 
                                 title="Chat Baru"
                             >
                                 <MessageSquarePlus className="w-5 h-5" />
                             </button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-2 slide-in-from-top-2">
                             <DropdownMenuItem onClick={onCreateGroup} className="cursor-pointer py-3.5 px-4 focus:bg-slate-50 focus:text-slate-900 rounded-xl transition-all group">
                                 <Users className="w-5 h-5 mr-3 text-slate-400 group-hover:text-slate-900" />
                                 <span className="font-bold text-[14px]">Grup Baru</span>
                             </DropdownMenuItem>
                         </DropdownMenuContent>
                     </DropdownMenu>
                 )}
            </div>

            <div className="px-6 py-2 mb-4">
                <div className="flex items-center bg-white rounded-2xl px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus-within:shadow-[0_4px_20px_rgba(15,23,42,0.08)] focus-within:ring-2 focus-within:ring-slate-950/20 border border-slate-100 transition-all duration-300">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input 
                        type="text"
                        placeholder="Cari obrolan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-900 w-full text-sm font-bold placeholder:text-slate-400 placeholder:font-medium py-0.5"
                    />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
                {sortedFilteredContacts.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center h-40">
                        <MessageSquarePlus className="w-10 h-10 text-slate-200 mb-3" />
                        <span className="text-slate-500 font-semibold text-sm">
                            {searchQuery ? "Tidak ada obrolan cocok" : "Belum ada obrolan"}
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        {sortedFilteredContacts.map((contact) => {
                            const unread = unreadCounts?.[contact.id] || 0;
                            const { initials, color, image } = getAvatarDetails(contact);

                            return (
                                <button
                                    key={contact.id}
                                    onClick={() => onSelectContact(contact)}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-left relative group border border-transparent",
                                        activeContact?.id === contact.id 
                                            ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10 translate-x-1" 
                                            : "hover:bg-white hover:shadow-md hover:border-slate-100 bg-transparent text-slate-900"
                                    )}
                                >
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 shadow-sm border-2 border-white/10" src={image || ""}>
                                            <AvatarImage src={image} />
                                            <AvatarFallback className={cn("text-sm font-black tracking-wider", !image && color)}>
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        {contact.id === 0 && (
                                             <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm">
                                                 <Users className="w-3 h-3 text-slate-950" />
                                             </div>
                                        )}
                                    </div>

                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <div className="flex items-center gap-2 truncate">
                                                <span className={cn(
                                                    "font-bold truncate text-[14px]",
                                                    activeContact?.id === contact.id ? "text-white" : "text-slate-900"
                                                )}>
                                                    {contact.username}
                                                </span>
                                                {contact.role && contact.id !== 0 && !contact.isGroup && (
                                                    <span className={cn(
                                                        "text-[9px] px-1.5 py-0.5 rounded-md uppercase font-black tracking-wider shrink-0",
                                                        activeContact?.id === contact.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                                                    )}>
                                                        {contact.role}
                                                    </span>
                                                )}
                                            </div>
                                            {contact.lastMessage && (
                                                <span className={cn(
                                                    "text-[10px] font-bold whitespace-nowrap ml-2 uppercase tracking-widest",
                                                    activeContact?.id === contact.id 
                                                        ? "text-slate-300" 
                                                        : (unread > 0 ? "text-slate-950" : "text-slate-400")
                                                )}>
                                                    {new Date(contact.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center gap-2">
                                            <p className={cn(
                                                "text-[12px] truncate flex-1 font-medium",
                                                activeContact?.id === contact.id 
                                                    ? "text-slate-300" 
                                                    : (unread > 0 ? "text-slate-700 font-bold" : "text-slate-500")
                                            )}>
                                                {(() => {
                                                    const text = contact.lastMessage?.content || (contact.lastMessage?.attachmentName ? `📎 ${contact.lastMessage.attachmentName}` : (contact.lastMessage?.attachmentUrl ? "📎 Lampiran file" : "Belum ada pesan"));
                                                    const limit = 40;
                                                    return text.length > limit ? text.substring(0, limit) + "..." : text;
                                                })()}
                                            </p>

                                            {unread > 0 && (
                                                <span className={cn(
                                                    "text-[10px] font-black min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-sm",
                                                    activeContact?.id === contact.id 
                                                        ? "bg-white text-slate-900" 
                                                        : "bg-slate-950 text-white animate-pulseShadow"
                                                )}>
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
