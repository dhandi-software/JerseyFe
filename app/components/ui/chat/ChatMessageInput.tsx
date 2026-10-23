import React from "react";
import { Check, Paperclip, Send, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import type { Message } from "~/types/chat";

interface ChatMessageInputProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    editingMessageId: number | null;
    replyingTo: Message | null;
    onCancelReplyOrEdit: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: () => void;
}

export function ChatMessageInput({
    inputValue,
    setInputValue,
    editingMessageId,
    replyingTo,
    onCancelReplyOrEdit,
    fileInputRef,
    onFileUpload,
    onSend
}: ChatMessageInputProps) {
    return (
        <>
            {/* Editing / Replying Banner */}
            {(replyingTo || editingMessageId) && (
                <div className="px-6 py-3 bg-white border-t border-[#F0F0F0] flex justify-between items-center animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-1 h-10 rounded-full", editingMessageId ? "bg-blue-500" : "bg-slate-950")} />
                        <div className="flex flex-col">
                            <span className={cn("text-[13px] font-bold", editingMessageId ? "text-blue-500" : "text-slate-950")}>
                                {editingMessageId ? "Editing Message" : `Replying to ${replyingTo?.sender?.username || 'user'}`}
                            </span>
                            <span className="text-xs text-[#666] truncate max-w-[300px]">
                                {editingMessageId ? inputValue : (replyingTo?.content || "Attachment")}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCancelReplyOrEdit}
                        className="text-[#A1A1A1] hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <X size={20} />
                    </Button>
                </div>
            )}

            {/* Input Form Area */}
            <div className="px-6 py-5 bg-white/70 backdrop-blur-xl z-20 border-t border-white/50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                <div className="max-w-5xl mx-auto flex items-end gap-3">
                    <div className="flex flex-1 items-end bg-white rounded-2xl px-4 py-2 shadow-sm border border-slate-100 focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-900 focus-within:shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-all duration-300">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={onFileUpload}
                        />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="mb-1 text-[#A1A1A1] hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-all"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip size={20} />
                        </Button>

                        <Textarea
                            placeholder={editingMessageId ? "Type your edits..." : "Type a message..."}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    onSend();
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
                        onClick={onSend}
                        disabled={!inputValue.trim()}
                        className={cn(
                            "rounded-2xl p-0 h-[48px] w-[48px] shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer",
                            inputValue.trim()
                                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"
                                : "bg-slate-100 text-slate-400"
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
        </>
    );
}
