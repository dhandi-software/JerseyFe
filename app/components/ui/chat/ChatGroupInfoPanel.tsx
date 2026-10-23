import { Trash2, UserPlus, X } from "lucide-react";
import Avatar, { AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { profileApi } from "~/api/profileApi";
import { cn } from "~/lib/utils";
import type { ChatContact } from "~/types/chat";

interface ChatGroupInfoPanelProps {
    isOpen: boolean;
    onClose: () => void;
    activeContact: ChatContact;
    avatarDetails: { initials: string; color: string; image: string };
    currentUser: { id: number; username: string; role?: string } | null;
    internalTeamMembers: any[];
    onAddMembers?: () => void;
    onSelectMemberToRemove: (member: { id: number; name: string }) => void;
    onOpenDeleteGroup: () => void;
}

export function ChatGroupInfoPanel({
    isOpen,
    onClose,
    activeContact,
    avatarDetails,
    currentUser,
    internalTeamMembers,
    onAddMembers,
    onSelectMemberToRemove,
    onOpenDeleteGroup
}: ChatGroupInfoPanelProps) {
    const displayedMembers = activeContact.id === 0 ? internalTeamMembers : (activeContact.members || []);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/40 z-30 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Side Drawer */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-[100%] sm:w-[400px] md:w-[450px] bg-[#f0f2f5] p-0 flex flex-col border-none shadow-2xl border-l border-[#d1d7db] z-40 transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="px-6 py-4 bg-[#f0f2f5] flex items-center border-b border-[#d1d7db] shrink-0 h-[60px]">
                    <button
                        onClick={onClose}
                        className="mr-5 text-[#54656f] hover:bg-[#dfe3e5] p-2 rounded-full transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-medium text-[#111b21] m-0 leading-none pb-1">Info grup</h2>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center pt-8">
                    {/* Group Display Area */}
                    <div className="flex flex-col items-center justify-center py-2 mb-6 w-full px-6">
                        <Avatar
                            className={cn("h-48 w-48 mb-6 shadow-sm", !avatarDetails.image && avatarDetails.color)}
                            src={avatarDetails.image || ""}
                        >
                            <AvatarImage src={avatarDetails.image} />
                            <AvatarFallback
                                className={cn("text-6xl font-light text-[#54656f]", !avatarDetails.image && avatarDetails.color)}
                            >
                                {avatarDetails.initials}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-medium text-[#111b21] text-center px-4 break-words max-w-full leading-tight">
                            {activeContact.username}
                        </h2>
                        <p className="text-[15px] text-[#667781] mt-1.5">
                            {activeContact.id === 0 ? "FCSV" : "Grup"} · {displayedMembers.length} anggota
                        </p>
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
                                    className="h-8 text-[#00a884] hover:bg-[#d9fdd3] hover:text-[#008f6f] px-3 font-medium rounded-full cursor-pointer"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Tambah Anggota
                                </Button>
                            )}
                        </div>

                        {displayedMembers.map((member) => (
                            <div
                                key={`member-${member.id}`}
                                className="flex items-center px-6 py-3 hover:bg-[#f5f6f6] transition-colors group cursor-pointer border-b border-[#f0f2f5] last:border-0"
                            >
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
                                        <span className={cn(
                                            "text-[16px] truncate leading-tight",
                                            member.id === currentUser?.id ? "text-[#111b21] font-medium" : "text-[#111b21]"
                                        )}>
                                            {member.id === currentUser?.id ? "Anda" : member.username}
                                        </span>
                                        {activeContact.id !== 0 && activeContact.adminId === member.id && (
                                            <div className="text-[11px] text-[#00a884] border border-[#00a884] rounded px-1.5 py-[2px] ml-3 font-medium opacity-80 border-opacity-30 leading-none">
                                                Admin grup
                                            </div>
                                        )}
                                        {activeContact.id !== 0 && activeContact.adminId === currentUser?.id && member.id !== currentUser?.id && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectMemberToRemove({ id: member.id, name: member.username || 'User' });
                                                }}
                                                className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10 p-0 rounded-full flex-shrink-0 cursor-pointer"
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
                                className="text-red-500 border-red-200 bg-white hover:bg-red-50 hover:text-red-700 w-[90%] font-medium flex items-center justify-center py-5 transition-colors cursor-pointer"
                                onClick={onOpenDeleteGroup}
                            >
                                <Trash2 className="w-5 h-5 mr-3" />
                                Hapus Grup
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
