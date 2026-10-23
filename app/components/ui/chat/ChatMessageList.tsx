import React from "react";
import { Check, CheckCheck, FileText } from "lucide-react";
import { UPLOADS_URL } from "~/api/client";
import { MessageActionMenu } from "~/components/ui/message-action-menu";
import { cn } from "~/lib/utils";
import type { Message, ChatContact } from "~/types/chat";

interface ChatMessageListProps {
    messages: Message[];
    isLoadingHistory: boolean;
    currentUser: { id: number; username: string; role?: string } | null;
    activeContact: ChatContact;
    onReply: (msg: Message) => void;
    onEdit: (msg: Message) => void;
    onDelete: (messageId: number) => void;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessageList({
    messages,
    isLoadingHistory,
    currentUser,
    activeContact,
    onReply,
    onEdit,
    onDelete,
    messagesEndRef
}: ChatMessageListProps) {
    const isPublic = activeContact.id === 0;

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-6 pb-[4px] md:px-12 w-full z-10 relative">
            <div className="flex flex-col space-y-2 pb-0">
                {isLoadingHistory ? (
                    <div className="flex justify-center p-4">
                        <span className="text-[#8696a0]">Memuat pesan...</span>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.senderId === currentUser?.id;
                        const senderColor = isPublic
                            ? ['#FF5733', '#33FF57', '#3357FF', '#FF33F5'][msg.senderId % 4]
                            : undefined;

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
                            <div key={idx} className={cn("flex flex-col mb-2 group max-w-full", isMe ? "items-end" : "items-start")}>
                                <div
                                    className={cn(
                                        "max-w-[85%] sm:max-w-[70%] px-5 py-3.5 relative shadow-sm text-[15px] break-words flex flex-col min-w-[140px] transition-all",
                                        isMe
                                            ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm shadow-slate-900/10 border border-slate-800"
                                            : "bg-white text-slate-800 rounded-2xl rounded-tl-sm shadow-[0_4px_14px_rgba(0,0,0,0.03)] border border-slate-100"
                                    )}
                                >
                                    {/* Action Menu Trigger (Hover) */}
                                    <div className="absolute top-0 right-0 p-1 z-20">
                                        <MessageActionMenu
                                            isMe={isMe}
                                            onReply={() => onReply(msg)}
                                            onDelete={() => onDelete(msg.id)}
                                            onEdit={() => onEdit(msg)}
                                            onInfo={() => {}}
                                        />
                                    </div>

                                    {/* Reply Context */}
                                    {msg.parent && (
                                        <div
                                            className={cn(
                                                "rounded-xl p-2.5 mb-2.5 border-l-4 text-xs flex flex-col cursor-pointer transition-colors backdrop-blur-sm",
                                                isMe ? "bg-white/10 border-white/40 hover:bg-white/20" : "bg-slate-50 border-slate-950 hover:bg-slate-100"
                                            )}
                                            onClick={() => {
                                                const el = document.getElementById(`msg-${msg.parent!.id}`);
                                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }}
                                        >
                                            <span className={cn("font-bold mb-0.5", isMe ? "text-white" : "text-slate-950")}>
                                                {msg.parent.sender.username}
                                            </span>
                                            <span
                                                className={cn("block break-words overflow-hidden text-ellipsis font-medium", isMe ? "text-slate-200" : "text-slate-600")}
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
                                        {msg.isEdited && (
                                            <span className={cn("text-[10px] italic mr-1", isMe ? "text-[#8C6D62]" : "text-[#A1A1A1]")}>
                                                edited
                                            </span>
                                        )}
                                        <span className={cn("text-[11px] font-medium", isMe ? "text-[#8C6D62]" : "text-[#A1A1A1]")}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && !isPublic && (
                                            <span className={cn(msg.isRead ? "text-slate-950" : "text-[#A1A1A1]")}>
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
    );
}
