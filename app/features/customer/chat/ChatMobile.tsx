import { ChatSidebar } from "~/components/ui/chat-sidebar";
import { ChatWindow } from "~/components/ui/chat-window";
import { useChat } from "~/hooks/useChat";
import { Toast } from "~/components/ui/toast";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function ChatMobile({ title }: { title: string }) {
    const {
        contacts,
        activeContact,
        setActiveContact,
        messages,
        sendMessage,
        isLoadingHistory,
        user,
        unreadCounts,
        resetUnreadCount,
        markAsRead,
        deleteMessage,
        deleteMessageForMe,
        editMessage,
        toastProps,
        setToastProps
    } = useChat();

    const handleSelectContact = (contact: any) => {
        setActiveContact(contact);
        resetUnreadCount(contact.id);
    };

    const handleBackToSidebar = () => {
        setActiveContact(null);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            {!activeContact ? (
                <ChatSidebar
                    contacts={contacts}
                    activeContact={activeContact}
                    onSelectContact={handleSelectContact}
                    unreadCounts={unreadCounts}
                />
            ) : (
                <div className="flex flex-col h-full">
                    {/* Mobile Back Button Header */}
                    <div className="flex items-center p-2 bg-white border-b sticky top-0 z-10 md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBackToSidebar}
                            className="mr-2"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{activeContact.name}</span>
                            <span className="text-[10px] text-green-500 uppercase font-black">Online</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ChatWindow
                            activeContact={activeContact}
                            messages={messages}
                            currentUser={user}
                            onSendMessage={sendMessage}
                            onEditMessage={editMessage}
                            isLoadingHistory={isLoadingHistory}
                            onMarkAsRead={markAsRead}
                            onDeleteMessage={deleteMessage}
                            onDeleteMessageForMe={deleteMessageForMe}
                        />
                    </div>
                </div>
            )}
            {toastProps && (
                <div className="absolute bottom-20 left-4 right-4 z-50">
                    <Toast
                        title={toastProps.title}
                        variant={toastProps.variant}
                        onClose={() => setToastProps(null)}
                    />
                </div>
            )}
        </div>
    );
}
