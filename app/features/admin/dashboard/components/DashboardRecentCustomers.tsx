import { ChevronDown, MessageCircle, Star, MoreVertical, ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/utils";
import type { DashboardRecentCustomer } from "~/types";

interface DashboardRecentCustomersProps {
    recentCustomers: DashboardRecentCustomer[];
    isMobile?: boolean;
}

export function DashboardRecentCustomers({ recentCustomers, isMobile }: DashboardRecentCustomersProps) {
    return (
        <div className={cn(
            "bg-white rounded-2xl py-6 flex flex-col shadow-sm border border-transparent",
            isMobile ? "p-5" : "h-full min-h-[25rem]"
        )}>
            <div className={cn("flex justify-between items-center mb-6", !isMobile && "px-6")}>
                <div className="text-slate-900 text-xl font-semibold">Customers</div>
                <div className="flex items-center gap-1 cursor-pointer">
                    <span className="text-slate-500 text-sm">Sort by </span>
                    <span className="text-slate-700 text-sm font-medium">Newest</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
            </div>
            
            <div className={cn("flex-1 flex flex-col overflow-y-auto gap-1", !isMobile && "px-4")}>
                {recentCustomers.length > 0 ? (
                    recentCustomers.map((customer, index) => (
                        <div
                            key={customer.id}
                            className={cn(
                                "p-4 rounded-2xl flex items-center gap-3 transition-all group cursor-pointer",
                                index === 0 ? "bg-[#FFF0E5]" : "hover:bg-orange-50/50"
                            )}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-100 shadow-sm shrink-0">
                                {customer.nama.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <div className="text-slate-900 text-sm font-semibold truncate">{customer.nama}</div>
                                    {customer.lastMessageAt && (
                                        <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                                            {new Date(customer.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    )}
                                </div>
                                <div className="text-slate-500 text-[11px] truncate flex items-center gap-1 mt-0.5">
                                    {customer.lastMessageContent ? (
                                        <>
                                            <span className="shrink-0 text-orange-500">💬</span>
                                            <span className="truncate italic font-medium">
                                                {(() => {
                                                    const text = customer.lastMessageContent;
                                                    const limit = isMobile ? 25 : 40;
                                                    return text.length > limit ? text.substring(0, limit) + "..." : text;
                                                })()}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="truncate opacity-70">{customer.category || "General Customer"}</span>
                                    )}
                                </div>
                            </div>
                            {index !== 0 && (
                                <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.location.href = `/admin/chat?userId=${customer.id}`;
                                        }}
                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85C2F] text-[#E85C2F] hover:bg-[#E85C2F] hover:text-white transition-all shadow-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-[#E85C2F] hover:text-[#E85C2F] transition-all">
                                        <Star className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {index === 0 && (
                                <div className="flex items-center gap-2 pr-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.location.href = `/admin/chat?userId=${customer.id}`;
                                        }}
                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85C2F] text-[#E85C2F] hover:bg-[#E85C2F] hover:text-white transition-all shadow-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85C2F] text-[#E85C2F] hover:bg-[#E85C2F] hover:text-white transition-all">
                                        <Star className="w-4 h-4" />
                                    </button>
                                    <div className="w-[1px] h-4 bg-[#E85C2F] opacity-30 mx-1"></div>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-800">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic py-10">
                        Belum ada data customer
                    </div>
                )}
            </div>

            <div className={cn("mt-4", !isMobile && "px-6")}>
                <button 
                    onClick={() => window.location.href = '/admin/users'}
                    className="text-[#E85C2F] text-sm font-medium flex items-center gap-1 hover:underline"
                >
                    All customers <ArrowUpRight className="w-4 h-4 rotate-45" />
                </button>
            </div>
        </div>
    );
}
