import type { DashboardRecentChat } from "~/types";

interface DashboardRecentChatsProps {
    recentChats: DashboardRecentChat[];
    totalUnreadChat: number;
}

export function DashboardRecentChats({ recentChats, totalUnreadChat }: DashboardRecentChatsProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-transparent flex flex-col">
            <div className="mb-4">
                <div className="text-slate-900 text-xl font-semibold">Chats</div>
                <div className="text-slate-500 text-sm">{totalUnreadChat} pesan belum dibaca</div>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-6">
                {recentChats.length > 0 ? (
                    recentChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => {
                                if (chat.partnerId) {
                                    window.location.href = `/admin/chat?userId=${chat.partnerId}`;
                                }
                            }}
                            className="flex gap-3 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 shadow-sm border border-orange-50">
                                {chat.senderName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="text-slate-900 text-sm font-semibold truncate">{chat.senderName}</div>
                                    <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider shrink-0">{chat.senderRole}</div>
                                </div>
                                <div className="text-slate-500 text-xs truncate pr-4">{chat.content}</div>
                            </div>
                            {!chat.isRead && (
                                <div className="w-2 h-2 rounded-full bg-[#E85C2F] mt-2 shrink-0 shadow-sm"></div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic py-10">
                        Belum ada chat masuk
                    </div>
                )}
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-50">
                <button
                    onClick={() => window.location.href = '/admin/chat'}
                    className="text-[#E85C2F] text-sm font-medium hover:underline"
                >
                    Semua pesan &rarr;
                </button>
            </div>
        </div>
    );
}
