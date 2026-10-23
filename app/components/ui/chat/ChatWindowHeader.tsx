import { ArrowLeft } from "lucide-react";
import Avatar, { AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { ChatContact } from "~/types/chat";

interface ChatWindowHeaderProps {
    activeContact: ChatContact;
    avatarDetails: { initials: string; color: string; image: string };
    onBack?: () => void;
    onOpenGroupInfo: () => void;
}

export function ChatWindowHeader({
    activeContact,
    avatarDetails,
    onBack,
    onOpenGroupInfo
}: ChatWindowHeaderProps) {
    const isGroupOrInternal = activeContact.isGroup || activeContact.id === 0;

    return (
        <div
            className={cn(
                "flex items-center px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-white/50 z-20 shrink-0 h-[80px] shadow-sm",
                isGroupOrInternal && "cursor-pointer hover:bg-slate-50/50 transition-colors"
            )}
            onClick={() => isGroupOrInternal && onOpenGroupInfo()}
        >
            <div className="flex items-center flex-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden mr-3 text-slate-500 hover:bg-slate-100 rounded-xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        onBack?.();
                    }}
                >
                    <ArrowLeft size={24} />
                </Button>

                <Avatar
                    className={cn(
                        "h-12 w-12 mr-4 shadow-sm border-2 border-white",
                        !avatarDetails.image && avatarDetails.color
                    )}
                    src={avatarDetails.image || ""}
                >
                    <AvatarImage src={avatarDetails.image} />
                    <AvatarFallback
                        className={cn(
                            "text-sm font-black tracking-wider",
                            !avatarDetails.image && avatarDetails.color
                        )}
                    >
                        {avatarDetails.initials}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-900 font-black text-[17px] tracking-tight">
                            {activeContact.username}
                        </span>
                        {activeContact.role && activeContact.id !== 0 && !activeContact.isGroup && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">
                                {activeContact.role}
                            </span>
                        )}
                    </div>
                    <span className="text-[13px] font-bold text-slate-400 mt-0.5">
                        {activeContact.isGroup
                            ? `${activeContact.members?.length || 0} anggota`
                            : 'Online'}
                    </span>
                </div>
            </div>
        </div>
    );
}
